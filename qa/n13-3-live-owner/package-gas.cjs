'use strict';
// Reproduce the scoped, three-file GAS wrapper from the 34-check preview.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {compile}=require('../n13-3-full-app-preview/build-preview.cjs');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const raw=compile(true);
assert.equal(sha(raw),'641dfb21fa497b63b999e8810354e18465ac46138156f007db571b99622fbbb5','base preview byte mismatch');
assert.equal(raw.split('sessionStorage.').length-1,6);
const marker='<script>window.LOP2_REVIEW_VARIANTS=';
assert.equal(raw.split(marker).length-1,1);
const html=raw.replaceAll('sessionStorage.','window.LOP2_PREVIEW_SESSION.').replace(marker,'<script>window.LOP2_PREVIEW_SESSION=(()=>{const m=new Map();return Object.freeze({getItem:k=>m.has(String(k))?m.get(String(k)):null,setItem:(k,v)=>{m.set(String(k),String(v));},removeItem:k=>{m.delete(String(k));}});})();\nwindow.LOP2_REVIEW_VARIANTS=');
assert(!html.includes('<?'));
assert(!/\b(?:window|root|globalThis)\.google\b|(?<![.\w$])google\s*(?:\?\.|\.)\s*script\b|(?<![.\w$])(?:localStorage|sessionStorage)\s*\.\s*(?:getItem|setItem|removeItem|clear|key|length)\b/.test(html));
assert(!/\b(?:SpreadsheetApp|DriveApp|UrlFetchApp|ScriptApp|PropertiesService)\b/.test(html));
const server="/** N13.3-PREVIEW: synthetic display only. No backend, no data provider. */\nfunction doGet() {\n  return HtmlService.createHtmlOutputFromFile('Preview')\n    .setTitle('Lớp 2 | FULL APP TEST')\n    .addMetaTag('viewport', 'width=device-width, initial-scale=1');\n}\n";
const manifest=JSON.stringify({timeZone:'Asia/Ho_Chi_Minh',exceptionLogging:'STACKDRIVER',runtimeVersion:'V8'},null,2)+'\n';
const files={'Code.gs':server,'Preview.html':html,'appsscript.json':manifest};
const pins={'Code.gs':'e36377827c60325fd397b1d19abbaafa3ad059894d98967181dbca22ce4dfed6','Preview.html':'b5b85e57c0a4482c46e1e60be7b77bfe86baa3c50c3e4b8594e2f5566a3a6925','appsscript.json':'4ca9cf0bc3aa6f5289606c8982e7d0ee91d824b744af5c69894444d5f9df95c2'};
const output=path.resolve(process.argv[2]||'./n13-3-live-owner-output');fs.mkdirSync(output,{recursive:true});
for(const [name,content] of Object.entries(files)){assert.equal(sha(content),pins[name],name);fs.writeFileSync(path.join(output,name),content);}
console.log('THREE_FILE_OWNER_TEST_PACKAGE_READY',pins);
