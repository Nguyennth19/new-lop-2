#!/usr/bin/env python3
"""Read-only structural QA of every GitHub branch. Never runs branch code or deploys."""
import concurrent.futures, datetime, json, os, pathlib, urllib.request, urllib.parse, urllib.error, sys

REPO = 'Nguyennth19/new-lop-2'
API = 'https://api.github.com/repos/' + REPO
TOKEN = os.environ.get('GITHUB_TOKEN', '')
if not TOKEN:
    raise SystemExit('GITHUB_TOKEN required: read-only repo Actions token')


def get(url):
    req=urllib.request.Request(url, headers={
        'Authorization': 'Bearer ' + TOKEN,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'lop2-qa-global-state-readonly',
        'X-GitHub-Api-Version': '2022-11-28'
    })
    with urllib.request.urlopen(req, timeout=35) as resp:
        return json.load(resp)


def inspect(b):
    name,sha=b['name'],b['commit']['sha']
    try:
        tree=get(API+'/git/trees/'+urllib.parse.quote(sha, safe='')+'?recursive=1')
        paths=[x['path'] for x in tree.get('tree',[]) if x.get('type')=='blob']
        def count(f): return sum(1 for p in paths if f(p))
        return {'branch': name, 'sha':sha,'treeInspected':True,'truncated':bool(tree.get('truncated')),
                'files':len(paths),
                'webp':count(lambda p:p.lower().endswith('.webp')),
                'png':count(lambda p:p.lower().endswith('.png')),
                'svg':count(lambda p:p.lower().endswith('.svg')),
                'qaJs':count(lambda p:p.startswith('qa/') and p.endswith(('.cjs','.js','.py'))),
                'workflows':count(lambda p:p.startswith('.github/workflows/')),
                'checkpoints':count(lambda p:'checkpoint' in p.lower() and p.endswith(('.json','.md'))),
                'pngMasters':count(lambda p:'png-master/' in p and p.lower().endswith('.png')),
                'hasLegacyAnswerClient':'26_ChamCauHoiToan.html' in paths,
                'hasTrustedG3ATest':'G3ATrustedTest.gs' in paths,
                'reportScope':'TREE_PATH_ONLY_NOT_FUNCTIONAL_CI_OR_RELEASE'}
    except Exception as ex:
        return {'branch':name,'sha':sha,'treeInspected':False,'error':str(ex)[:350]}


def main():
    bs=[]
    for page in range(1,20):
        page_values=get(API+f'/branches?per_page=100&page={page}')
        bs.extend(page_values)
        if len(page_values)<100: break
    if len(bs)<123 or len({b['name'] for b in bs})!=len(bs):
        raise SystemExit('Branch page coverage unexpected; no PASS claim')
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        rows=list(pool.map(inspect,bs))
    passed=sum(1 for r in rows if r['treeInspected'] and not r.get('truncated'))
    error=[r['branch'] for r in rows if not r['treeInspected'] or r.get('truncated')]
    o={'schemaVersion':'LOP2_GITHUB_124_BRANCH_STRUCTURAL_SCAN_V1',
       'capturedUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
       'repo':REPO,'branchCount':len(bs),'treesComplete':passed,'treesIncomplete':len(error),
       'errors':error,'status':'PASS_ALL_TREES' if not error else 'PARTIAL_TREE_SCAN',
       'limitations':['Tree paths do not prove content correctness','Workflow files are not CI success','GitHub HEAD is not GAS deployed version','No owner approval or student release inferred'],
       'branches':rows}
    out=pathlib.Path('qa/global-audit/BRANCH_TREE_RUNTIME_REPORT.json');out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print('TREE_STRUCTURAL_SCAN',o['status'],'branches',len(bs),'complete',passed,'incomplete',len(error), 'file',out)
    if error: print('TREE_SCAN_INCOMPLETE_NAMES',','.join(error))
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        pathlib.Path(os.environ['GITHUB_STEP_SUMMARY']).open('a').write(f"### LOP2 GitHub structural inventory\n\n{passed}/{len(bs)} branch trees read; {len(error)} missing/truncated. This is **not** code QA, owner approval, GAS or release.\n")
    return 0 if not error else 2


if __name__=='__main__': sys.exit(main())
