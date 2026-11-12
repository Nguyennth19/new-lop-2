/* G7.4-A.2 - isolated ZIP Deflate extraction for unchanged G7 WebP binary assets.
 * Supports the verified ZIP shape: local file headers, no data descriptor, method 8 (or 0).
 * Designed for GitHub blob uploads through connector; no browser runtime dependency.
 */
(function(root,factory){
 const lib=factory();if(typeof module==="object"&&module.exports)module.exports=lib;
 if(root)root.KLZipG7=lib;
})(typeof globalThis!=="undefined"?globalThis:null,function(){
"use strict";
const ALPHABET="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const REV=new Uint8Array(128);for(let i=0;i<64;i++)REV[ALPHABET.charCodeAt(i)]=i;
function decode64(s){
 let out=new Uint8Array(Math.floor(s.length*3/4)),p=0;
 for(let i=0;i<s.length;i+=4){
  const a=REV[s.charCodeAt(i)],b=REV[s.charCodeAt(i+1)],c=s[i+2]==="="?0:REV[s.charCodeAt(i+2)],d=s[i+3]==="="?0:REV[s.charCodeAt(i+3)];
  out[p++]=(a<<2)|(b>>>4);if(s[i+2]!=="=")out[p++]=((b&15)<<4)|(c>>>2);if(s[i+3]!=="=")out[p++]=((c&3)<<6)|d;
 }return out.subarray(0,p);
}
function encode64(u){
 const chunks=[];let buf="";for(let i=0;i<u.length;i+=3){
  const a=u[i],b=i+1<u.length?u[i+1]:0,c=i+2<u.length?u[i+2]:0;
  buf+=ALPHABET[a>>>2]+ALPHABET[((a&3)<<4)|(b>>>4)]+(i+1<u.length?ALPHABET[((b&15)<<2)|(c>>>6)]:"=")+(i+2<u.length?ALPHABET[c&63]:"=");
  if(buf.length>=65536){chunks.push(buf);buf=""}
 }if(buf)chunks.push(buf);return chunks.join("");
}
const CRC_TABLE=new Uint32Array(256);
for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?(0xedb88320^(c>>>1)):(c>>>1);CRC_TABLE[i]=c>>>0;}
function crc32(u){let c=0xffffffff;for(let i=0;i<u.length;i++)c=CRC_TABLE[(c^u[i])&255]^(c>>>8);return (c^0xffffffff)>>>0}
function inflate(dat,limit){
 let pos=0,buf=0,bits=0;
 function read(n){
  while(bits<n){if(pos>=dat.length)throw Error("ZIP_DEFLATE_EOF");buf|=dat[pos++]<<bits;bits+=8}
  const v=buf&((1<<n)-1);buf>>>=n;bits-=n;return v;
 }
 function tree(lengths){
  let max=0;const freq=new Array(16).fill(0);
  for(const len of lengths)if(len){freq[len]++;max=Math.max(max,len)}
  let code=0;const next=new Array(16).fill(0);
  for(let i=1;i<=15;i++){code=(code+freq[i-1])*2;next[i]=code}
  const map=new Map();
  for(let s=0;s<lengths.length;s++){const n=lengths[s];if(!n)continue;let c=next[n]++,reverse=0;
   for(let i=0;i<n;i++){reverse=(reverse<<1)|(c&1);c>>>=1}map.set(n*65536+reverse,s)}
  return {max,map};
 }
 function symbol(t){
  let v=0;for(let l=1;l<=t.max;l++){v|=read(1)<<(l-1);const s=t.map.get(l*65536+v);if(s!==undefined)return s}
  throw Error("ZIP_INVALID_HUFFMAN");
 }
 const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
 const le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 const db=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
 const de=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
 const order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
 const out=new Uint8Array(limit);let p=0,end=false;
 while(!end){
  end=read(1)===1;const type=read(2);
  if(type===0){
   buf=0;bits=0;const len=dat[pos]|dat[pos+1]<<8,nlen=dat[pos+2]|dat[pos+3]<<8;pos+=4;
   if(((len^nlen)&65535)!==65535)throw Error("ZIP_STORED_BLOCK_LENGTH");
   if(p+len>limit)throw Error("ZIP_OUTPUT_LIMIT");
   out.set(dat.subarray(pos,pos+len),p);pos+=len;p+=len;continue;
  }
  let lt,dt;
  if(type===1){lt=tree(Array.from({length:288},(_,i)=>i<144?8:i<256?9:i<280?7:8));dt=tree(new Array(32).fill(5))}
  else if(type===2){
   const nl=read(5)+257,nd=read(5)+1,nc=read(4)+4,codeLength=new Array(19).fill(0);
   for(let i=0;i<nc;i++)codeLength[order[i]]=read(3);
   const ct=tree(codeLength),all=[];
   while(all.length<nl+nd){
    const s=symbol(ct);
    if(s<16)all.push(s);
    else if(s===16){if(!all.length)throw Error("ZIP_REPEAT_WITHOUT_PREVIOUS");const n=read(2)+3,v=all[all.length-1];for(let i=0;i<n;i++)all.push(v)}
    else{const n=s===17?read(3)+3:read(7)+11;for(let i=0;i<n;i++)all.push(0)}
   }
   lt=tree(all.slice(0,nl));dt=tree(all.slice(nl,nl+nd));
  }else throw Error("ZIP_BAD_BLOCK");
  while(true){
   const sym=symbol(lt);
   if(sym<256){if(p>=limit)throw Error("ZIP_OUTPUT_LIMIT");out[p++]=sym;continue}
   if(sym===256)break;
   const li=sym-257;if(li<0||li>=lb.length)throw Error("ZIP_BAD_LENGTH");
   const len=lb[li]+read(le[li]),di=symbol(dt);
   if(di>=db.length)throw Error("ZIP_BAD_DISTANCE");
   const distance=db[di]+read(de[di]);
   if(distance>p||p+len>limit)throw Error("ZIP_INVALID_COPY");
   for(let i=0;i<len;i++){out[p]=out[p-distance];p++}
  }
 }
 if(p!==limit)throw Error("ZIP_UNCOMPRESSED_LENGTH_MISMATCH");
 return out;
}
function unzip64(s){
 const data=decode64(s),u16=i=>data[i]|data[i+1]<<8,u32=i=>(data[i]|data[i+1]<<8|data[i+2]<<16|data[i+3]<<24)>>>0;
 const entries=[];let i=0;
 while(i+30<=data.length && u32(i)===0x04034b50){
  const flags=u16(i+6),method=u16(i+8),check=u32(i+14),comp=u32(i+18),uncomp=u32(i+22),nameLen=u16(i+26),extra=u16(i+28);
  if(flags&8)throw Error("ZIP_DATA_DESCRIPTOR_UNSUPPORTED");
  const name=String.fromCharCode(...data.subarray(i+30,i+30+nameLen));
  const start=i+30+nameLen+extra;
  if(start+comp>data.length)throw Error("ZIP_TRUNCATED_FILE");
  const blob=method===8?inflate(data.subarray(start,start+comp),uncomp):method===0?data.slice(start,start+comp):null;
  if(!blob||blob.length!==uncomp)throw Error("ZIP_DECODE_FAILED:"+name);
  if(crc32(blob)!==check)throw Error("ZIP_CRC_MISMATCH:"+name);
  if(!/^WEBP\/(?:SH|M)(?:0[1-9]|1[0-2])\/KL-(?:SH|M)(?:0[1-9]|1[0-2])-\d{2}\.webp$/.test(name))throw Error("ZIP_INVALID_PATH:"+name);
  if(blob[0]!==82||blob[1]!==73||blob[2]!==70||blob[3]!==70||blob[8]!==87||blob[9]!==69||blob[10]!==66||blob[11]!==80)throw Error("ZIP_NOT_WEBP:"+name);
  entries.push({path:name,bytes:blob,base64:encode64(blob),crc32:check});
  i=start+comp;
 }
 return entries;
}
return Object.freeze({decode64,encode64,unzip64,crc32});
});
