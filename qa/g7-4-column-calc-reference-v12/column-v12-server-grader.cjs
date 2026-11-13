'use strict';
/* SERVER / CI ONLY. Do not include this module in HTML/GAS client.
 * Reuses V1 reference's arithmetic, but makes the V1.1 carry omission an explicit policy choice.
 */
const v1=require('../g7-4-column-calc-reference-v1/column-calc-contract.cjs');
const core=require('./column-v12-core.js');
const fail=reason=>({ok:false,reason});
function grade(q,submitted){
  const check=core.validateSpec(q);if(!check.ok)return check;
  if(!submitted||typeof submitted!=='object')return fail('MISSING_SUBMISSION');
  const spec={variantId:q.variantId,profile:q.profile,operation:q.operation,level:q.level,a:q.a,b:q.b,assetId:null};
  const reference=v1.computeServerOnly(spec);if(!reference.ok)return fail('REFERENCE_ARITHMETIC_REJECTED');
  const places=core.PLACES.slice(0,check.columns);
  const actualResult=String(reference.result);
  const detail={};
  for(let i=0;i<places.length;i++){
    const id='result_'+places[i];
    const v=submitted[id];
    const required=i<actualResult.length;
    detail[id]= required ? (typeof v==='string'&&/^[0-9]$/.test(v)&&Number(v)===reference.digits[i])
      : (v===undefined||v==='');
  }
  let carryCorrect=true,transitionChecks={};
  if(q.carryPolicy==='REQUIRED_ASSESSED'){
    const transitions=q.operation==='ADD'?reference.carry:reference.borrow;
    const prefix=q.operation==='ADD'?'carry_':'borrow_';
    for(let i=1;i<check.columns;i++){
      const id=prefix+places[i];
      const submittedValue=submitted[id];
      // UI toggles can only be true/false; require each place, even when carry is unnecessary.
      transitionChecks[id]=typeof submittedValue==='boolean'&&submittedValue===Boolean(transitions[i].incoming);
    }
    carryCorrect=Object.values(transitionChecks).every(Boolean);
  }
  const resultCorrect=Object.values(detail).every(Boolean);
  return {ok:true,variantId:q.variantId,pass:resultCorrect&&carryCorrect,
    digitsCorrect:resultCorrect,transitionsCorrect:carryCorrect,carryAssessed:q.carryPolicy==='REQUIRED_ASSESSED',
    digitFields:detail,transitionFields:transitionChecks};
}
module.exports={grade};
