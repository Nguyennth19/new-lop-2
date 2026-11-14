/* G7.5 V2 – pure text planning helpers. No DOM, network, grading or student data. */
(function (root, maker) {
  const api = maker();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.G75V2 = api;
})(typeof window !== 'undefined' ? window : null, function () {
'use strict';
const UNIT_VARIANTS = [
  {symbol:'kg', read:'ki lô gam', word:/\b(?:ki|ky|kí|ký)[\s-]*lô[\s-]*gam\b/giu},
  {symbol:'km', read:'ki lô mét', word:/\b(?:ki|ky|kí|ký)[\s-]*lô[\s-]*mét\b/giu},
  {symbol:'mm', read:'mi li mét', word:/\bmi[\s-]*li[\s-]*mét\b/giu},
  {symbol:'cm', read:'xăng ti mét', word:/\bxăng[\s-]*ti[\s-]*mét\b/giu},
  {symbol:'dm', read:'đề xi mét', word:/\bđề[\s-]*xi[\s-]*mét\b/giu},
  {symbol:'ml', read:'mi li lít', word:/\bmi[\s-]*li[\s-]*lít\b/giu},
  {symbol:'l', read:'lít'}, {symbol:'m', read:'mét'}, {symbol:'đ', read:'đồng'}
];
const SIGNS = {'+':'cộng','-':'trừ','−':'trừ','–':'trừ','×':'nhân','*':'nhân','÷':'chia',':':'chia','=':'bằng','>':'lớn hơn','<':'bé hơn'};
const OPERAND = '(?:\\d+(?:[.,]\\d+)?|[xX])';
const LETTER='\\p{L}\\p{N}';
function normalize(source, opts={}) {
  if (typeof source !== 'string') return '';
  if (opts.lang && !/^vi(?:-|$)/i.test(opts.lang)) return source;
  let t=source.normalize('NFC');
  // Decorative emoji without suppressing words; semantic pictures must be authored in speechText.
  t=t.replace(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu,' ');
  t=t.replace(/→/g,' sang ').replace(/↔/g,' hai chiều ');
  // Normalize known unit word spellings first; preserve agreed V1.2 acoustics.
  for(const u of UNIT_VARIANTS) if(u.word) t=t.replace(u.word,u.read);
  // Parenthesized unit labels only; parenthesized numbers and explanations remain.
  for(const u of UNIT_VARIANTS){
    const sym=u.symbol.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const paren=new RegExp('\\(\\s*'+sym+'\\s*\\)','giu');
    const sep=new RegExp('(?<!\\p{L})'+sym+'(?![\\p{L}\\p{N}])','giu');
    t=t.replace(paren,' '+u.read+' ');
    t=t.replace(sep,(_match,at,whole)=> (at>0 && /\d/.test(whole[at-1]) ? " " : "")+u.read);
  }
  // Handle display-only sign lists and signs following the word 'dấu'.
  t=t.replace(/\b[dD]ấu\s*>\s*,\s*<\s*,\s*=/gu,'dấu lớn hơn, dấu bé hơn, dấu bằng');
  t=t.replace(/\(\s*\+\s*,\s*[−–-]\s*\)/g,'dấu cộng hoặc dấu trừ');
  t=t.replace(/\bdấu\s*([+−–×*÷=><:-])/giu,(whole,op)=> (whole[0]==='D'?'Dấu ':'dấu ')+SIGNS[op]);
  t=t.replace(/\(\s*([=><+−–])\s*\)/g,(_s,op)=>'dấu '+SIGNS[op]);
  t=t.replace(/\bSGK\b/g,'sách giáo khoa').replace(/\bPV\s+(\d+)/g,'phạm vi $1');
  const mathContext=opts.context||'auto';
  const mathDiv=mathContext==='math' || /(?:phép chia|chia|tính|kết quả|\s:\s|:\s*\d+\s*=)/iu.test(source);
  // Operator must follow a letter/number and precede a number, variable or unknown.
  // A word hyphen ('tách - gộp') fails the right-operand test and is preserved.
  t=t.replace(/(?<=[\p{L}\p{N}])\s*([+−–*×÷=><-])\s*(?=\d|[xX]\b|\?)/gu,(_s,op)=>' '+SIGNS[op]+' ');
  // ':' only in an arithmetic expression; 7:15 remains time in auto mode.
  if(mathDiv)t=t.replace(/(?<=\d)\s*:\s*(?=\d)/g,' chia ');
  // x is a variable unless explicitly identified as multiplication in metadata.
  if(mathContext==='math' && opts.xAsMultiplication===true)
    t=t.replace(/(\d+)\s+[xX]\s+(?=\d+)/g,'$1 nhân ');
  t=t.replace(/\bbằng\s*\?/giu,'bằng mấy?');
  // Preserve newlines for pedagogical segmentation and sentence rhythm.
  return t.replace(/[ \t]{2,}/g,' ').replace(/ *\n */g,'\n').trim();
}
const PROFILES=Object.freeze({
  default:{rate:.92,pitch:1.10,pause:280,label:'Đọc đề / kể chuyện'},
  question:{rate:.90,pitch:1.12,pause:400,label:'Đặt câu hỏi'},
  encouragement:{rate:.90,pitch:1.06,pause:350,label:'Hướng dẫn / động viên'},
  solution_math:{rate:.86,pitch:1.05,pause:420,label:'Bài giải / phép tính'},
  praise:{rate:.96,pitch:1.18,pause:320,label:'Khen ngợi'}
});
function profileOf(text, hint='auto') {
  if(hint && hint!=='auto' && PROFILES[hint])return hint;
  const s=text.trim();
  if(/^(Chính xác|Giỏi lắm|Tuyệt vời|Xuất sắc|Hoàn hảo|Đúng rồi)/iu.test(s))return 'praise';
  if(/^(Gợi ý|Em hãy|Em kiểm tra|Hãy thử|Nhớ|Muốn tìm)/iu.test(s))return 'encouragement';
  if(/^(Bài giải|Đáp số|Số .* là:|\d+\s+(cộng|trừ|nhân|chia|bằng))/iu.test(s))return 'solution_math';
  if(/[?]\s*$/.test(s))return 'question';
  return 'default';
}
function segments(source, options={}) {
 const lang=options.lang||'vi-VN';
 const text=options.normalized===true?source:normalize(source,{lang,context:options.context||'auto',xAsMultiplication:options.xAsMultiplication});
 const lines=text.split(/\n+/).map(s=>s.trim()).filter(Boolean);
 const parts=[];
 for(const line of lines) {
   // punctuation is only split when followed by a space; 1.5 and 7:15 stay intact.
   for(const sentence of line.split(/(?<=[.!?;])\s+(?=\S)/u)) {
     if(sentence.trim())parts.push(sentence.trim());
   }
 }
 return parts.map((text,index)=>({index,text,profile:profileOf(text,options.profile),...(PROFILES[profileOf(text,options.profile)])}));
}
return {normalize,segments,profileOf,PROFILES};
});
