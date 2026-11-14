const assert=require('node:assert/strict');
const {normalize,segments,profileOf}=require('./math_speech_v2.js');
const C=[
['36 − 12 = 24 (kg)','36 trừ 12 bằng 24 ki lô gam'],
['8 + 5 = ?','8 cộng 5 bằng mấy?'],
['20 : 5 = 4','20 chia 5 bằng 4'],
['1 dm = 10 cm','1 đề xi mét bằng 10 xăng ti mét'],
['1m > 90cm','1 mét lớn hơn 90 xăng ti mét'],
['15l + 20l < 40l','15 lít cộng 20 lít bé hơn 40 lít'],
['1000đ','1000 đồng'],
['Tìm x: x + 5 = 12','Tìm x: x cộng 5 bằng 12'],
['Bài giải:','Bài giải:'],
['Sơ đồ tách - gộp','Sơ đồ tách - gộp'],
['7:15','7:15'],
['Chọn dấu >, <, = thích hợp','Chọn dấu lớn hơn, dấu bé hơn, dấu bằng thích hợp'],
['36kg, 12 ký-lô-gam','36 ki lô gam, 12 ki lô gam'],
['Dấu +?','Dấu cộng?'],
['1.5 + 2 = 3.5','1.5 cộng 2 bằng 3.5'],
['35cm','35 xăng ti mét'],
['10mm','10 mi li mét'],
['2km','2 ki lô mét'],
['250ml','250 mi li lít'],
['12m','12 mét'],
['8đ','8 đồng'],
['15 l','15 lít'],
['8 × 3 = 24','8 nhân 3 bằng 24'],
['8 * 3 = 24','8 nhân 3 bằng 24'],
['8 ÷ 4 = 2','8 chia 4 bằng 2'],
['8 - 4 = 4','8 trừ 4 bằng 4'],
['8 – 4 = 4','8 trừ 4 bằng 4'],
['20 > 10','20 lớn hơn 10'],
['20 < 30','20 bé hơn 30'],
['20 = 20','20 bằng 20'],
['1m = 100cm','1 mét bằng 100 xăng ti mét'],
['3kg + 2kg = 5kg','3 ki lô gam cộng 2 ki lô gam bằng 5 ki lô gam'],
['10cm - 5cm = 5cm','10 xăng ti mét trừ 5 xăng ti mét bằng 5 xăng ti mét'],
['Dấu >','Dấu lớn hơn'],
['dấu <','dấu bé hơn'],
['dấu =','dấu bằng'],
['dấu −','dấu trừ'],
['dấu ×','dấu nhân'],
['SGK','sách giáo khoa'],
['PV 100','phạm vi 100'],
['Đơn vị → Chục → Trăm','Đơn vị sang Chục sang Trăm'],
['2:30','2:30'],
['36 (kg)','36 ki lô gam'],
['7 (cm)','7 xăng ti mét'],
['Em hãy giải bài toán nhé!','Em hãy giải bài toán nhé!']
];
let failed=[];
for(let i=0;i<C.length;i++){const [a,b]=C[i],got=normalize(a);if(got!==b)failed.push({case:i+1,input:a,expected:b,actual:got});}
assert.deepEqual(failed,[],'V2 45-case normalization regression');
assert.equal(normalize('8 + 5 = ?',{lang:'en-GB'}),'8 + 5 = ?');
assert.equal(normalize('2 x 5 = 10'),'2 x 5 bằng 10');
assert.equal(normalize('2 x 5 = 10',{context:'math',xAsMultiplication:true}),'2 nhân 5 bằng 10');
const data=segments('Bao gạo nặng 36 kg.\nHỏi còn mấy kg?\nBài giải:\n36 − 12 = 24 (kg).\nChính xác!');
assert.deepEqual(data.map(x=>x.profile),['default','question','solution_math','solution_math','praise']);
console.log(`PASS ${C.length} normalized cases + 4 context/prosody checks. Mock/text only, not human-audible.`);
