#!/usr/bin/env python3
"""Immutable GitHub commit snapshot -> private Drive folder.

Run locally with --dry-run to create a ZIP and manifest without credentials.
Production requires opt-in GitHub Actions variables and OAuth secrets.
No source files are modified and no deployment is performed.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from datetime import datetime, timezone

def run(*args):
    return subprocess.check_output(args, text=True).strip()

def digest(path, algo):
    h = hashlib.new(algo)
    with open(path, "rb") as stream:
        for part in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(part)
    return h.hexdigest()

def build_snapshot(output_dir):
    repo = os.environ.get("GITHUB_REPOSITORY", "Nguyennth19/new-lop-2")
    branch = os.environ.get("GITHUB_REF_NAME", "be-hoc")
    expected = os.environ.get("GITHUB_SHA") or run("git", "rev-parse", "HEAD")
    current = run("git", "rev-parse", "HEAD")
    if not re.fullmatch(r"[0-9a-f]{40}", expected) or current != expected:
        raise RuntimeError("CHECKOUT_COMMIT_MISMATCH")
    if not re.fullmatch(r"[\w.-]+/[\w.-]+", repo):
        raise RuntimeError("INVALID_REPO_ID")
    if not re.fullmatch(r"[\w./-]+", branch):
        raise RuntimeError("INVALID_BRANCH")
    output_dir.mkdir(parents=True, exist_ok=True)
    slug = repo.replace("/", "__") + "__" + branch.replace("/", "_") + "__" + current
    archive = output_dir / (slug + ".zip")
    manifest_file = output_dir / (slug + ".manifest.json")
    with archive.open("wb") as out:
        subprocess.run(["git", "archive", "--format=zip", current], stdout=out, check=True)
    objects = []
    for row in run("git", "ls-tree", "-r", "-l", current).splitlines():
        match = re.match(r"^\d+\s+blob\s+([0-9a-f]{40})\s+(\d+)\t(.*)$", row)
        if not match:
            raise RuntimeError("UNEXPECTED_GIT_TREE_ROW")
        blob, size, path = match.groups()
        objects.append({"path": path, "blob_sha": blob, "bytes": int(size)})
    manifest = {
        "schema": "master-be-hoc-backup.v1",
        "repository": repo,
        "branch": branch,
        "commit_sha": current,
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "archive_name": archive.name,
        "archive_bytes": archive.stat().st_size,
        "archive_sha256": digest(archive, "sha256"),
        "archive_md5": digest(archive, "md5"),
        "file_count": len(objects),
        "files": objects,
        "state": "COMMIT_SNAPSHOT_NOT_DEPLOYMENT",
    }
    manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return archive, manifest_file, manifest

def upload_once(drive, folder_id, path, repo, branch, commit, kind):
    name = path.name
    safe = name.replace("\\", "\\\\").replace("'", "\\'")
    query = f"'{folder_id}' in parents and name = '{safe}' and trashed = false"
    existing = drive.files().list(q=query, fields="files(id,name,size,md5Checksum,appProperties),nextPageToken",
                                  page_size=100, supportsAllDrives=True,
                                  includeItemsFromAllDrives=True).execute().get("files", [])
    if len(existing) > 1:
        raise RuntimeError("DUPLICATE_BACKUP_NAME:" + name)
    size, md5 = path.stat().st_size, digest(path, "md5")
    props = {"repository": repo, "branch": branch, "commit": commit, "kind": kind}
    if existing:
        item = existing[0]
        if int(item.get("size", -1)) != size or item.get("md5Checksum") != md5 or item.get("appProperties") != props:
            raise RuntimeError("EXISTING_BACKUP_CONFLICT:" + name)
        return item["id"], "SKIPPED_IDENTICAL"
    from googleapiclient.http import MediaFileUpload
    body = {"name": name, "parents": [folder_id], "appProperties": props,
            "description": "Immutable master-be-hoc GitHub commit backup; do not edit"}
    result = drive.files().create(body=body, media_body=MediaFileUpload(str(path), resumable=True),
                                  fields="id", supportsAllDrives=True).execute()
    item = drive.files().get(fileId=result["id"], fields="id,name,parents,size,md5Checksum,appProperties",
                             supportsAllDrives=True).execute()
    if folder_id not in item.get("parents", []) or int(item.get("size", -1)) != size or item.get("md5Checksum") != md5 or item.get("appProperties") != props:
        raise RuntimeError("BACKUP_READBACK_FAILED:" + name)
    return item["id"], "UPLOADED_VERIFIED"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Create local snapshot and manifest only")
    parser.add_argument("--out", default="dist/master-be-hoc-backup")
    args = parser.parse_args()
    archive, manifest_file, manifest = build_snapshot(Path(args.out))
    if args.dry_run:
        print(json.dumps({"status": "DRY_RUN_ONLY", "commit": manifest["commit_sha"],
                          "files": manifest["file_count"], "sha256": manifest["archive_sha256"],
                          "archive": str(archive), "manifest": str(manifest_file)}))
        return
    required = ["MASTER_BE_HOC_DRIVE_FOLDER_ID", "GDRIVE_OAUTH_CLIENT_ID",
                "GDRIVE_OAUTH_CLIENT_SECRET", "GDRIVE_OAUTH_REFRESH_TOKEN"]
    missing = [n for n in required if not os.environ.get(n)]
    if missing:
        raise RuntimeError("BACKUP_NOT_CONFIGURED:" + ",".join(missing))
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    creds = Credentials(token=None,
                        refresh_token=os.environ["GDRIVE_OAUTH_REFRESH_TOKEN"],
                        token_uri="https://oauth2.googleapis.com/token",
                        client_id=os.environ["GDRIVE_OAUTH_CLIENT_ID"],
                        client_secret=os.environ["GDRIVE_OAUTH_CLIENT_SECRET"],
                        scopes=["https://www.googleapis.com/auth/drive"])
    drive = build("drive", "v3", credentials=creds, cache_discovery=False)
    folder = os.environ["MASTER_BE_HOC_DRIVE_FOLDER_ID"]
    meta = drive.files().get(fileId=folder, fields="id,name,mimeType,trashed", supportsAllDrives=True).execute()
    if meta.get("mimeType") != "application/vnd.google-apps.folder" or meta.get("trashed"):
        raise RuntimeError("INVALID_DRIVE_DESTINATION")
    for kind, path in [("snapshot_zip", archive), ("snapshot_manifest", manifest_file)]:
        fid, state = upload_once(drive, folder, path, manifest["repository"], manifest["branch"],
                                 manifest["commit_sha"], kind)
        print(json.dumps({"kind": kind, "state": state, "file_id": fid,
                          "commit": manifest["commit_sha"]}))
    print(json.dumps({"state": "BACKUP_COMPLETE", "commit": manifest["commit_sha"],
                      "sha256": manifest["archive_sha256"], "files": manifest["file_count"]}))

if __name__ == "__main__":
    main()
