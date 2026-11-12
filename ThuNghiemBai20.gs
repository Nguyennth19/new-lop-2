/** G2.5 BAI 20 STAGING: read-only, never awards stars or changes progress. */
function layBaiToan20Test(){
 const wb=moBangDuAn_(),base=khoLayBaiHoc_('toan_b20');
 const plan=khoDocTab_(wb,'G23_Sau_Luot'),add=khoDocTab_(wb,'G23_Cau_Bo_Sung'),fix=khoDocTab_(wb,'G24_Sua_Du_Lieu');
 if(plan.length!==30)throw Error('G23_Sau_Luot phải có đúng 30 câu nguồn');
 // G2.5.2: LV2-A chỉ dùng ba bài lời văn; hai bài còn lại vẫn nằm trong Sheet nguồn để ôn sau.
 const visiblePlan=plan.filter(p=>p.session_id!=='LV2-A'||Number(p.question_order)<=3);
 const byId={};base.questions.forEach(q=>byId[q.id]=Object.assign({},q));
 add.forEach(v=>{
   let q={id:v.variant_id,level:v.suggested_level,sectionId:'g25',order:0,label:'Câu thử',type:v.question_type,
    prompt:v.prompt,answer:String(v.answer),unit:v.unit||'',theme:'blue',valid:true,skillId:v.skill_id,
    summary:'',solutionPrompt:v.answer_explanation||'',svg:''};
   if(v.variant_id==='G23-B20-N03'){q.n1='27';q.n2='16';q.op='+';}
   if(v.variant_id==='G23-B20-N04'){q.n1='35';q.n2='18';q.op='+';}
   if(v.variant_id==='G23-B20-N05'){q.n1='34';q.n2='29';q.op='+';}
   if(v.type==='vertical'){q.n1='48';q.n2='26';q.op='+';}
   if(['concept_exchange','concept_carry','mental_reasoning'].indexOf(q.type)>=0)q.type='concept';
   byId[q.id]=q;
 });
 fix.forEach(x=>{
   const q=byId[x.question_id];if(!q)return;
   try{
    if(x.change_type==='PUZZLE_JSON'){q.puzzle=JSON.parse(x.after);}
    if(x.change_type==='LANGUAGE'){const d=JSON.parse(x.after);q.prompt=d.prompt||q.prompt;q.solutionPrompt=d.solution_prompt||q.solutionPrompt;}
   }catch(e){throw Error('Bản sửa không hợp lệ: '+x.question_id);}
 });
 const ids=['LV1-A','LV1-B','LV2-A','LV2-B','LV3-A','LV3-B'],session={};
 ids.forEach(k=>session[k]={id:k,level:k.slice(0,3),title:'',minutes:'',questions:[]});
 const seen={};
 visiblePlan.forEach(p=>{
   const s=session[p.session_id],q=byId[p.question_id];
   if(!s||!q||!q.valid||seen[q.id])throw Error('Câu thiếu, trùng hoặc không hợp lệ: '+p.question_id);
   seen[q.id]=true;s.title=p.session_title;s.minutes=p.target_minutes;
   s.questions.push(Object.assign({},q,{skillId:p.skill_id,order:Number(p.question_order),label:'Câu '+p.question_order}));
 });
 ids.forEach(k=>{session[k].questions.sort((a,b)=>a.order-b.order);
    const expected=k==='LV2-A'?3:k.slice(0,3)==='LV1'?6:k.slice(0,3)==='LV2'?5:4;
    if(session[k].questions.length!==expected)throw Error('Số câu sai: '+k);
 });
 return {version:'G2.5.2-layout-test-v1',sessions:ids.map(k=>session[k]),notice:'BẢN TEST: LV2-A 3 bài, không ghi sao hoặc tiến độ'};
}