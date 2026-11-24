/** TEST synthetic read-only endpoints. No provider or real rewards. */
function layBaiToan20(){return khoLayBaiHoc_('toan_b20');}
function layTienDoHocTap(){return {lessonId:'toan_b20',source:'server',completedLevels:{LV1:false,LV2:false,LV3:false},correctQuestions:{},attemptCount:0,serverTime:new Date().toISOString(),testOnly:true};}
function layTongQuanThanhTich(){
 const now=new Date(),today=Utilities.formatDate(now,'Asia/Ho_Chi_Minh','yyyy-MM-dd');
 const day=i=>{const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);};
 return {earned:0,balance:0,bonus:0,spent:0,attempts:0,completed:0,lectures:0,tests:0,activeSeconds:0,accuracy:0,days:0,streak:0,badges:[],badgeCount:0,week:Array.from({length:7},(_,i)=>({day:day(i-6),label:['CN','T2','T3','T4','T5','T6','T7'][new Date(day(i-6)+'T12:00:00Z').getUTCDay()],minutes:0,attempts:0,active:false})),attendance:Array.from({length:14},(_,i)=>({day:day(i-13),attempts:0,completed:0,progressing:0,status:i===13?'empty':'missed'})),week4:[],subjects:[{name:'Toán',percent:null,attempts:0},{name:'Tiếng Việt',percent:null,attempts:0},{name:'Tiếng Anh',percent:null,attempts:0}],skills:[],recent:[],asOf:now.toISOString(),isDemo:true};
}
function fullAppDeny_(){throw Error('FULL APP TEST: không ghi điểm, sao, tiến độ hoặc quản trị phụ huynh.');}
function ghiNhanKetQuaToan20(){return fullAppDeny_();}
function d2ChamTinCayTest(){return fullAppDeny_();}
function phuHuynhTrangThai(){return fullAppDeny_();}
function kiemTraFullAppTest(){const t=fullAppTestRead_();const out={environment:'SYNTHETIC_ONLY',tabs:Object.keys(t).length,questions:t['04_Cau_hoi'].length,baseline:'MATCH',writes:'DENY'};console.log(JSON.stringify(out));return out;}
