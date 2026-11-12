#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {parseResult,runSuite,SUITES,TESTS}=require('./qa-runner.cjs');
let ok=0,fail=0;
function check(label,fn){
  try{fn();ok++;console.log('PASS '+label);}
  catch(e){fail++;console.error('FAIL '+label+' '+e.message);}
}
check('FAST inherits P0.2/P0.3',()=>assert.deepEqual(SUITES.FAST,['validator','no_write']));
check('FULL_SAFE inherits all existing suites',()=>assert.equal(SUITES.FULL_SAFE.length,4));
check('UI_REGRESSION reuses G7',()=>assert.deepEqual(SUITES.UI_REGRESSION,['ui_layout','ui_image']));
check('invalid suite fails closed',()=>assert.equal(runSuite('WRONG').errors[0].code,'QA_INVALID_MODE'));
check('node summary PASS',()=>assert.equal(parseResult('node_tests','{"suite":"x","passed":23,"failed":0}',23).passed,23));
check('node summary rejects missing cases',()=>assert.throws(()=>parseResult('node_tests','{"passed":22,"failed":0}',23)));
check('node summary rejects FAIL',()=>assert.throws(()=>parseResult('node_tests','{"passed":23,"failed":1}',23)));
check('node summary rejects absent JSON',()=>assert.throws(()=>parseResult('node_tests','no json',23)));
check('G7 summary PASS',()=>assert.equal(parseResult('g7_summary','{\n  "pass": 8,\n  "fail": 0\n}',8).passed,8));
check('G7 summary rejects FAIL',()=>assert.throws(()=>parseResult('g7_summary','{"pass":8,"fail":1}',8)));
check('G7 summary rejects too few cases',()=>assert.throws(()=>parseResult('g7_summary','{"pass":7,"fail":0}',8)));
check('all registered cases have minimum counts',()=>assert.ok(Object.values(TESTS).every(v=>v.minimum>=4)));
console.log(JSON.stringify({suite:'P0.4-runner-contract',passed:ok,failed:fail}));
if(fail)process.exitCode=1;
