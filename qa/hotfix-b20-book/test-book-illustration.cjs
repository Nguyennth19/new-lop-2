#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('34_HinhAnhDungChung.html','utf8');
const cases=[];
const doc={readyState:'loading',addEventListener(){},
 createElement(tag){return {tag,dataset:{},className:'',setAttribute(n,v){this[n]=v;},remove(){this.removed=true;}}}
};
const ctx={document:doc};vm.runInNewContext(source,ctx);
const gallery=ctx.HINH_ANH_APP;
function target(){
 const children=[];return {children,dataset:{},classList:{add(){},remove(){}},setAttribute(n,v){this[n]=v;},
 appendChild(img){children.push(img);img.isConnected=true;img.parent=this;}};
}
function check(label,prompt,expected){
 const t=target(),result=gallery.word({id:'VAR_TEST',type:'word_problem',prompt},t);
 assert.equal(result,expected!==null,label+' attachment mismatch');
 if(expected){
  assert.equal(t.children.length,1,label+' image missing');
  assert.equal(t.children[0].src.endsWith(expected),true,label+' wrong file');
  assert.equal(t.children[0].alt,'',label+' image should be decorative');
 }else assert.equal(t.children.length,0,label+' should not add an image');
 cases.push(label);console.log('PASS',label);
}
check('Candy B20 Q016','Một hộp có 47 chiếc kẹo. Bé Lan bỏ thêm 34 chiếc kẹo.','math_wrapped_candy_160.webp');
check('Storybooks B20 Q021','Tủ sách có 34 quyển truyện. Thư viện nhận thêm 39 quyển truyện.','math_book_160.webp');
check('Existing book','Có 5 quyển sách.','math_book_160.webp');
check('Other storybook phrasing','Bé có 3 cuốn truyện.','math_book_160.webp');
check('Bookshelf alone','Tủ sách của lớp em.','math_book_160.webp');
check('Chicken unaffected','Đàn gà có 2 con gà mái.','math_hen_160.webp');
check('Unrelated question unaffected','Có 14 cây bút chì. ',null);
const t=target(),r=gallery.word({id:'NONWORD',type:'mental',prompt:'34 quyển truyện'},t);
assert.equal(r,false);assert.equal(t.children.length,0);cases.push('Non-word exercise unaffected');console.log('PASS Non-word exercise unaffected');
const failed=target();gallery.word({id:'VAR_B20_20261112_021',type:'word_problem',prompt:'34 quyển truyện'},failed);
const img=failed.children[0];img.onerror();assert.equal(img.removed,true);assert.equal(failed.dataset.klFailed,'1');
cases.push('Error handler keeps fallback slot');console.log('PASS Error handler keeps fallback slot');
console.log(JSON.stringify({stage:'B20-BOOK-HOTFIX',pass:cases.length,fail:0}));
