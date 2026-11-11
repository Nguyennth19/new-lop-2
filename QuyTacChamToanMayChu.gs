/** G6: Chọn và chấm các câu Toán ở máy chủ; không tin danh sách do trình duyệt gửi. */
function achSelect_(data,lv){
 // Sao chép quy tắc lựa chọn V2.5 để máy chủ KHÔNG tin danh sách câu từ trình duyệt.
 const limits={toan_b20_lv1_ex1:{max:4},toan_b20_lv1_ex2:{perGroup:2},toan_b20_lv1_ex3:{max:2},
  toan_b20_lv2_problems:{max:4},toan_b20_lv3_ex1:{max:6},toan_b20_lv3_ex2:{max:6},toan_b20_lv3_ex3:{max:6},toan_b20_lv3_ex4:{max:4}};
 const sections=data.sections.filter(s=>data.levels.some(l=>l.level===lv&&l.id===s.levelId));
 const out=[];
 sections.forEach(section=>{
  const all=data.questions.filter(q=>q.valid&&q.sectionId===section.id).sort((a,b)=>a.order-b.order);
  const rule=limits[section.id]||{};
  if(rule.perGroup){
   const groups={};
   all.forEach(q=>{const name=q.group||'Chung';(groups[name]||(groups[name]=[])).push(q);});
   Object.values(groups).forEach(arr=>out.push(...arr.slice(0,rule.perGroup)));
  }else out.push(...all.slice(0,rule.max||all.length));
 });
 return out;
}
function achCheck_(q,fields){
 const v=k=>String(fields[k]===undefined?'':fields[k]).trim();
 if(q.type==='vertical'){
  const ans=String(q.answer).padStart(2,'0');
  const carry=(Number(q.n1)%10+Number(q.n2)%10)>=10?'1':'0';
  return v('ones')===ans[1]&&v('tens')===ans[0]&&v('carry')===carry;
 }
 if(q.type==='mental')return v('answer')!==''&&Number(v('answer'))===Number(q.answer);
 if(q.type==='missing_digit')return Array.isArray(q.puzzle)&&q.puzzle.every((row,i)=>row.every((cell,j)=>!cell||typeof cell!=='object'||v('p'+i+j)===String(cell.ans)));
 if(q.type==='word_problem'){
  return v('n1')!==''&&v('n2')!==''&&
   ((Number(v('n1'))===Number(q.n1)&&Number(v('n2'))===Number(q.n2))||(Number(v('n1'))===Number(q.n2)&&Number(v('n2'))===Number(q.n1)))&&
   v('op')===q.op&&v('sum')!==''&&Number(v('sum'))===Number(q.answer)&&v('answer')!==''&&Number(v('answer'))===Number(q.answer);
 }
 return false;
}
