/**
 * Quản lý phụ huynh V1 – máy chủ (Google Apps Script).
 * Không lưu PIN trong GitHub, HTML hay Sheet. Cần giới hạn quyền Web App theo gia đình.
 * API public chịu kiểm tra token + quyền; helper hậu tố _ chỉ chạy nội bộ.
 */
const PH_KEYS={SALT:'PH_PIN_SALT_V1',HASH:'PH_PIN_HASH_V1',LOCK:'PH_PIN_LOCK_V1',BOOT:'PH_PIN_BOOTSTRAP',VERSION:'PH_PIN_VERSION_V1'};
const PH_NOTE_SHEET='92_Ghi_chu_phu_huynh';
const PH_NOTE_HEADERS=['note_id','at_utc','profile_id','content'];
const PH_CACHE_PREFIX='PH_SESSION_V1_';
const PH_SESSION_SECONDS=600;
function phProps_(){return PropertiesService.getScriptProperties()}
function phDigest_(text){
 const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(text),Utilities.Charset.UTF_8);
 return bytes.map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');
}
function phPinHash_(salt,pin){
 // 1200 lần băm làm chậm thử PIN khi đọc lộ hash. PIN vẫn cần giới hạn lần nhập.
 let value=String(salt)+':'+String(pin);
 for(let i=0;i<1200;i++)value=phDigest_(value+':'+salt);
 return value;
}
function phVerify_(pin){
 const p=phProps_(),salt=p.getProperty(PH_KEYS.SALT),hash=p.getProperty(PH_KEYS.HASH);
 if(!salt||!hash||!/^\d{4}$/.test(String(pin||'')))return false;
 const candidate=phPinHash_(salt,String(pin));
 // So sánh cố định độ dài; không coi SHA-256 đơn lẻ là thay thế cho xác thực danh tính.
 let diff=0;for(let i=0;i<hash.length;i++)diff|=(hash.charCodeAt(i)^candidate.charCodeAt(i));
 return diff===0&&hash.length===candidate.length;
}
function phLock_(){
 const l=LockService.getScriptLock();l.waitLock(20000);return l;
}
function phValidatePin_(pin){
 const lock=phLock_();
 try{
  const props=phProps_(),now=Date.now();
  let obj;try{obj=JSON.parse(props.getProperty(PH_KEYS.LOCK)||'{}')}catch(e){obj={}}
  if(Number(obj.until||0)>now)return {ok:false,message:'Đã nhập sai quá số lần cho phép. Thử lại sau 15 phút.',locked:true};
  if(phVerify_(pin)){props.deleteProperty(PH_KEYS.LOCK);return {ok:true}}
  const count=Number(obj.count||0)+1;
  props.setProperty(PH_KEYS.LOCK,JSON.stringify(count>=5?{count:5,until:now+15*60*1000}:{count,until:0}));
  return {ok:false,message:count>=5?'Đã tạm khóa đăng nhập 15 phút.':'Mã PIN không đúng. Còn '+(5-count)+' lần thử.',locked:count>=5};
 }finally{lock.releaseLock()}
}
/**
 * CẤU HÌNH LẦN ĐẦU — CHỈ CHẠY TRONG EDITOR (tên hậu tố _).
 * 1. Apps Script > Project Settings > Script properties > tạo PH_PIN_BOOTSTRAP = PIN 4 số.
 * 2. Chạy phuHuynhKhoiTaoPin_ trong editor khi đăng nhập với chủ dự án.
 * 3. Hàm này xóa PH_PIN_BOOTSTRAP ngay sau khi lưu hash + salt.
 */
function phuHuynhKhoiTaoPin_(){
 const p=phProps_();
 if(p.getProperty(PH_KEYS.HASH))throw Error('PIN đã thiết lập. Không được ghi đè qua cơ chế khởi tạo.');
 const pin=p.getProperty(PH_KEYS.BOOT);
 if(!/^\d{4}$/.test(String(pin||'')))throw Error('Cần đặt Script Property PH_PIN_BOOTSTRAP đúng 4 chữ số.');
 const salt=Utilities.getUuid()+'-'+Utilities.getUuid();
 p.setProperties({[PH_KEYS.SALT]:salt,[PH_KEYS.HASH]:phPinHash_(salt,pin),[PH_KEYS.VERSION]:Utilities.getUuid()});
 p.deleteProperty(PH_KEYS.BOOT);
 p.deleteProperty(PH_KEYS.LOCK);
 return 'Đã cấu hình PIN. Đã xóa PH_PIN_BOOTSTRAP.';
}
function phuHuynhTrangThai(){
 return {configured:!!phProps_().getProperty(PH_KEYS.HASH)};
}
function phSessionKey_(token){
 return PH_CACHE_PREFIX+phDigest_(String(token||''));
}
function phRequire_(token){
 if(!/^[a-f0-9-]{70,90}$/i.test(String(token||'')))throw Error('Phiên phụ huynh không hợp lệ. Vui lòng đăng nhập lại.');
 const cache=CacheService.getScriptCache();
 const k=phSessionKey_(token);
 const value=cache.get(k);
 const version=phProps_().getProperty(PH_KEYS.VERSION);
 if(!value||!version||value!==version)throw Error('Phiên đã hết hạn. Vui lòng đăng nhập lại.');
 cache.put(k,version,PH_SESSION_SECONDS);
}
function phuHuynhDangNhap(pin){
 const p=phProps_();if(!p.getProperty(PH_KEYS.HASH))return {ok:false,message:'Chưa thiết lập mã PIN trong Apps Script.'};
 const verdict=phValidatePin_(pin);if(!verdict.ok)return verdict;
 const token=Utilities.getUuid()+'-'+Utilities.getUuid();
 CacheService.getScriptCache().put(phSessionKey_(token),p.getProperty(PH_KEYS.VERSION)||'',PH_SESSION_SECONDS);
 return {ok:true,token,expiresIn:PH_SESSION_SECONDS};
}
function phuHuynhDangXuat(token){
 if(/^[a-f0-9-]{70,90}$/i.test(String(token||'')))CacheService.getScriptCache().remove(phSessionKey_(token));
 return {ok:true};
}
function phSafe_(s,n){
 const t=String(s||'').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,' ').trim().slice(0,n);
 return /^[=+\-@]/.test(t)?"'"+t:t;
}
function phNotes_(){
 return achRows_(achS_(PH_NOTE_SHEET,PH_NOTE_HEADERS)).filter(r=>r.profile_id===achProfile_());
}
function phuHuynhTongQuan(token){
 phRequire_(token);
 const a=achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS),p=achS_(ACH_LEDGER,ACH_HEADERS_LEDGER);
 const summary=achSummary_(a,p);
 const entries=achRows_(p).filter(x=>x.profile_id===achProfile_()).slice(-120).reverse().map(x=>({
  id:String(x.event_key),at:String(x.at_utc),type:String(x.event_type),
  delta:Number(x.delta)||0,level:String(x.level||''),note:String(x.note||'')
 }));
 const notes=phNotes_().slice(-30).reverse().map(n=>({id:String(n.note_id),at:String(n.at_utc),content:String(n.content)}));
 return {summary,entries,notes};
}
function phuHuynhGhiChu(token,text){
 phRequire_(token);
 const content=phSafe_(text,400);
 if(content.length<3)throw Error('Ghi chú phải có ít nhất 3 ký tự.');
 const l=phLock_();
 try{
  phRequire_(token);
  const id='NOTE:'+Utilities.getUuid(),record={note_id:id,at_utc:new Date().toISOString(),profile_id:achProfile_(),content};
  achS_(PH_NOTE_SHEET,PH_NOTE_HEADERS).appendRow(PH_NOTE_HEADERS.map(k=>record[k]));
  return {ok:true,id};
 }finally{l.releaseLock()}
}
function phuHuynhDieuChinhSao(token,payload){
 phRequire_(token);
 if(!payload||typeof payload!=='object')throw Error('Thiếu thông tin giao dịch.');
 const delta=Number(payload.delta),pin=String(payload.pin||'');
 const note=phSafe_(payload.note,220);
 const requestId=String(payload.requestId||'');
 if(!Number.isSafeInteger(delta)||delta===0||Math.abs(delta)>10000)throw Error('Số sao phải là số nguyên từ 1 đến 10.000.');
 if(note.length<6)throw Error('Vui lòng nhập lý do tối thiểu 6 ký tự.');
 if(!/^[a-zA-Z0-9_-]{12,100}$/.test(requestId))throw Error('Mã giao dịch không hợp lệ.');
 // Dùng lock duy nhất bao trùm kiểm tra PIN, replay, số dư và ghi ledger.
 const lock=phLock_();
 try{
  phRequire_(token);
  // Re-auth nhạy cảm; PIN sai bị tính lần thử theo cùng khóa giao dịch.
  const props=phProps_(),now=Date.now();
  let attempts;try{attempts=JSON.parse(props.getProperty(PH_KEYS.LOCK)||'{}')}catch(e){attempts={}}
  if(Number(attempts.until||0)>now)throw Error('Mã PIN đang bị khóa 15 phút.');
  if(!phVerify_(pin)){
   const count=Number(attempts.count||0)+1;
   props.setProperty(PH_KEYS.LOCK,JSON.stringify(count>=5?{count:5,until:now+900000}:{count,until:0}));
   throw Error(count>=5?'Đã khóa PIN 15 phút.':'Mã PIN xác nhận chưa đúng.');
  }
  props.deleteProperty(PH_KEYS.LOCK);
  const sheet=achS_(ACH_LEDGER,ACH_HEADERS_LEDGER);
  const all=achRows_(sheet).filter(e=>e.profile_id===achProfile_());
  const eventKey='PARENT:'+requestId;
  const existing=all.find(e=>String(e.event_key)===eventKey);
  if(existing){
   if(Number(existing.delta)!==delta||String(existing.note)!==note)throw Error('Mã giao dịch đã được sử dụng với dữ liệu khác.');
   return {ok:true,duplicate:true,summary:achSummary_(achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS),sheet)};
  }
  const balance=all.reduce((n,e)=>n+Number(e.delta||0),0);
  if(balance+delta<0)throw Error('Ví sao không đủ để trừ.');
  const event={event_key:eventKey,at_utc:new Date().toISOString(),profile_id:achProfile_(),
   event_type:delta>0?'parent_bonus':'parent_redeem',delta,lesson_id:'',level:'',
   attempt_id:'',note};
  sheet.appendRow(ACH_HEADERS_LEDGER.map(k=>event[k]));
  return {ok:true,duplicate:false,summary:achSummary_(achS_(ACH_ATTEMPTS,ACH_HEADERS_ATTEMPTS),sheet)};
 }finally{lock.releaseLock()}
}
function phuHuynhDoiPin(token,oldPin,newPin){
 phRequire_(token);
 if(!/^\d{4}$/.test(String(newPin||'')))throw Error('PIN mới phải đúng 4 chữ số.');
 const l=phLock_();
 try{
  phRequire_(token);
  const props=phProps_(),now=Date.now();
  let obj;try{obj=JSON.parse(props.getProperty(PH_KEYS.LOCK)||'{}')}catch(e){obj={}}
  if(Number(obj.until||0)>now)throw Error('PIN đang bị khóa 15 phút.');
  if(!phVerify_(oldPin)){
   const count=Number(obj.count||0)+1;
   props.setProperty(PH_KEYS.LOCK,JSON.stringify(count>=5?{count:5,until:now+900000}:{count,until:0}));
   throw Error('PIN cũ không đúng.');
  }
  const salt=Utilities.getUuid()+'-'+Utilities.getUuid();
  props.setProperties({[PH_KEYS.SALT]:salt,[PH_KEYS.HASH]:phPinHash_(salt,newPin),[PH_KEYS.VERSION]:Utilities.getUuid()});
  props.deleteProperty(PH_KEYS.LOCK);
  CacheService.getScriptCache().remove(phSessionKey_(token));
  return {ok:true,logout:true};
 }finally{l.releaseLock()}
}

/**
 * Khôi phục PIN bị quên: chỉ chạy trong Apps Script Editor bởi chủ dự án.
 * Tạo PH_PIN_BOOTSTRAP là PIN 4 số trong Project Settings, rồi chạy hàm này.
 * Xóa property tạm, khóa các phiên cũ và ghi PIN mới; không bao giờ có API web reset PIN.
 */
function phuHuynhKhoiPhucPinQuanTri_(){
 const p=phProps_(),value=p.getProperty(PH_KEYS.BOOT);
 if(!/^\d{4}$/.test(String(value||'')))throw Error('PH_PIN_BOOTSTRAP phải đúng 4 chữ số.');
 const lock=phLock_();
 try{
  const salt=Utilities.getUuid()+'-'+Utilities.getUuid();
  p.setProperties({[PH_KEYS.SALT]:salt,[PH_KEYS.HASH]:phPinHash_(salt,value),[PH_KEYS.VERSION]:Utilities.getUuid()});
  p.deleteProperty(PH_KEYS.BOOT);p.deleteProperty(PH_KEYS.LOCK);
  return 'Đã khôi phục PIN và vô hiệu hóa mọi phiên đăng nhập cũ.';
 }finally{lock.releaseLock()}
}
