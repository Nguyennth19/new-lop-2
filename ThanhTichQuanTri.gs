/** G6: Ghi sổ sao quản trị bằng hàm chỉ dùng nội bộ Editor. */
function dieuChinhSaoPhuHuynh_(delta,lyDo){
 const value=Number(delta);if(!Number.isSafeInteger(value)||value===0||Math.abs(value)>100000)throw Error('Số sao điều chỉnh không hợp lệ');
 if(String(lyDo||'').trim().length<6)throw Error('Cần lý do điều chỉnh tối thiểu 6 ký tự');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const as=achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS),ps=achS_(ACH_LEDGER,ACH_HEADERS_LEDGER);
  const current=achSummary_(as,ps);if(current.balance+value<0)throw Error('Ví sao không đủ để trừ');
  const id=Utilities.getUuid(),entry={event_key:'ADMIN:'+id,at_utc:new Date().toISOString(),
    profile_id:achProfile_(),event_type:value<0?'parent_redeem':'parent_bonus',delta:value,
    lesson_id:'',level:'',attempt_id:'',note:achCut_(lyDo,220)};
  ps.appendRow(ACH_HEADERS_LEDGER.map(k=>entry[k]));return achSummary_(as,ps);
 }finally{lock.releaseLock()}
}
