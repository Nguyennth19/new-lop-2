/* G7.6-B.4 offline manual device QA receipt. No persistent storage, no network,
 * no student identifiers, no auto owner signature, no scoring or grades.
 */
(function(){
 'use strict';
 function start(){
  const button=document.getElementById('b4-export');
  if(!button)return;
  button.addEventListener('click',()=>{
   const device=(document.getElementById('b4-device').value||'').trim().slice(0,120);
   const notes=(document.getElementById('b4-note').value||'').trim().slice(0,1200);
   const checks=[...document.querySelectorAll('[data-qa]')].map(el=>({
    key:el.dataset.qa,
    performedAndObservedPass:Boolean(el.checked)
   }));
   const receipt={
    schemaVersion:'g76b4.physical-device-manual-checklist.v1',
    source:'ACTUAL_USER_TEST_ONLY_NOT_CI',
    project:'lop2',component:'G7.6-B.4',
    evidenceStatus:'MANUAL_OBSERVATION_ONLY_NOT_OWNER_SIGNATURE',
    createdAt:new Date().toISOString(),
    deviceDescription:device||'NOT_PROVIDED',
    viewport:{cssWidth:window.innerWidth,cssHeight:window.innerHeight},
    browserSummary:String(navigator.userAgent||'').slice(0,220),
    checkedCount:checks.filter(x=>x.performedAndObservedPass).length,
    totalChecks:checks.length,
    checks,notes,
    reviewerApproved:false,
    reviewerSignature:null,
    pedagogicalApproval:false,
    trustedGradingOpened:false,
    gasDeployed:false,
    studentDataCollected:false
   };
   const text=JSON.stringify(receipt,null,2);
   const url=URL.createObjectURL(new Blob([text],{type:'application/json;charset=utf-8'}));
   const link=document.createElement('a');
   link.href=url;link.download='G76B4_Manual_Device_Review_NOT_APPROVED.json';
   document.body.append(link);link.click();link.remove();
   document.getElementById('b4-export-status').textContent=
    'Đã tạo phiếu QA tại thiết bị này: '+receipt.checkedCount+'/'+receipt.totalChecks+
    ' mục. Đây không phải chữ ký phê duyệt. Vui lòng gửi phiếu cùng ảnh chụp cho người duyệt.';
   setTimeout(()=>URL.revokeObjectURL(url),2000);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
