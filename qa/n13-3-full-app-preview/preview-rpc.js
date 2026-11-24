/* Synthetic fixtures, in-memory only. No provider, no genuine answer records. */
(function(){
 'use strict';
 const calls=[],denied=[];
 const now=new Date(),today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 const day=(delta)=>{const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+delta);return d.toISOString().slice(0,10);};
 const levels=['LV1','LV2','LV3'].map(level=>({id:'test_'+level,level,name:level}));
 const sections=levels.map(l=>({id:'test_'+l.level+'_mental',levelId:l.id,name:'Bài tập mẫu – không ghi điểm thật',type:'mental'}));
 const questions=levels.map((l,i)=>({id:'toan_b20_TEST_'+l.level,level:l.level,sectionId:sections[i].id,order:i+1,label:'Câu mẫu',type:'mental',valid:true,prompt:'Tính nhẩm',n1:String(26+i),n2:'17',op:'+',answer:String(43+i),theme:'blue',group:'Tính nhẩm'}));
 const lesson={lesson:{id:'toan_b20',title:'Bài 20 – mẫu synthetic',rendererPolicies:[]},levels,sections,questions};
 const summary={earned:0,balance:0,bonus:0,spent:0,attempts:0,completed:0,lectures:0,tests:0,activeSeconds:0,accuracy:0,days:0,streak:0,badges:[],badgeCount:0,week:Array.from({length:7},(_,i)=>({day:day(i-6),label:['CN','T2','T3','T4','T5','T6','T7'][new Date(day(i-6)+'T12:00:00Z').getUTCDay()],minutes:0,attempts:0,active:false})),attendance:Array.from({length:14},(_,i)=>({day:day(i-13),attempts:0,completed:0,progressing:0,status:i===13?'empty':'missed'})),week4:[],subjects:[{name:'Toán',percent:null,attempts:0},{name:'Tiếng Việt',percent:null,attempts:0},{name:'Tiếng Anh',percent:null,attempts:0}],skills:[],recent:[],asOf:now.toISOString(),isDemo:true};
 const progress={lessonId:'toan_b20',source:'server',completedLevels:{LV1:false,LV2:false,LV3:false},correctQuestions:{},attemptCount:0,serverTime:now.toISOString()};
 function clone(v){return JSON.parse(JSON.stringify(v));}
 function chain(success,failure){
  return new Proxy(Object.create(null),{get(_,name){
   if(name==='withSuccessHandler')return f=>chain(f,failure);
   if(name==='withFailureHandler')return f=>chain(success,f);
   return (...args)=>{calls.push(String(name));queueMicrotask(()=>{
    if(name==='layBaiToan20')return success?.(clone(lesson));
    if(name==='layTongQuanThanhTich')return success?.(clone(summary));
    if(name==='layTienDoHocTap')return success?.(clone(progress));
    // Never return a success receipt for any mutation/auth request.
    denied.push(String(name));failure?.({message:'FULL APP TEST: chỉ mô phỏng, thao tác máy chủ bị chặn'});
   });};
  }});
 }
 Object.defineProperty(window,'LOP2_PREVIEW_GOOGLE',{value:Object.freeze({script:Object.freeze({run:chain()})}),configurable:false,writable:false});
 window.LOP2_PREVIEW_DIAGNOSTICS=Object.freeze({snapshot:()=>({calls:[...calls],denied:[...denied],providerWrites:0,mode:'SYNTHETIC_ONLY'})});
 document.addEventListener('DOMContentLoaded',()=>{
  const dlg=document.getElementById('lop2ReviewDialog'),list=document.getElementById('lop2ReviewList');
  const notice=document.getElementById('lop2PreviewNotice'),home=document.getElementById('home');
  if(home&&notice)home.parentNode.insertBefore(notice,home);
  for(const v of window.LOP2_REVIEW_VARIANTS){const section=document.createElement('section');section.dataset.lesson=v.lessonId;section.style.cssText='padding:8px 0;border-bottom:1px solid #ddd';const p=document.createElement('p');p.textContent=v.lessonId+' · '+v.prompt;section.append(p);for(const c of v.choices){const label=document.createElement('span');label.style.cssText='display:inline-block;margin:3px;padding:5px;border:1px solid #ccc;border-radius:5px';label.textContent=c.text;section.append(label);}list.append(section);}
  document.getElementById('lop2ReviewOpen').addEventListener('click',()=>dlg.showModal());document.getElementById('lop2ReviewClose').addEventListener('click',()=>dlg.close());
 });
})();
