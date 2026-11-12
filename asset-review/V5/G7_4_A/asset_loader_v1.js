/* G7.4-A Asset Loader V1: browser/GAS-compatible. Safe by default: never auto-fetches, never replaces existing images.
 * Manifest path values are relative; assetBaseUrl MUST point to a verified static binary release.
 * Use from browser: window.KLAssetLoaderV1.create({manifestUrl, assetBaseUrl, allowCandidate:true}).
 */
(function (root, factory) {
  const lib=factory();
  if (typeof module==="object" && module.exports) module.exports=lib;
  if (root) root.KLAssetLoaderV1=lib;
})(typeof globalThis!=="undefined"?globalThis:null,function(){
  "use strict";
  const ID_RE=/^KL_(?:SH|M)(?:0[1-9]|1[0-2])_\d{3}$/;
  const HASH_RE=/^[a-f0-9]{64}$/;
  const PATH_RE=/^WEBP\/(?:SH|M)(?:0[1-9]|1[0-2])\/KL-(?:SH|M)(?:0[1-9]|1[0-2])-\d{2}\.webp$/;
  const isObject=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
  const fail=(code,extra)=>Object.freeze({ok:false,code,...(extra||{})});
  function validateManifest(data,options) {
    options=options||{};
    if(!isObject(data)||!Array.isArray(data.assets)) return fail("INVALID_MANIFEST");
    if(data.asset_count!==288||data.assets.length!==288) return fail("INCOMPLETE_MANIFEST",{found:data.assets.length});
    if(data.release_status!=="RELEASED"&&!options.allowCandidate) return fail("RELEASE_NOT_APPROVED");
    const seen=new Set(), paths=new Set(), table=Object.create(null);
    for(const item of data.assets) {
      if(!isObject(item)||typeof item.asset_id!=="string"||!ID_RE.test(item.asset_id))return fail("INVALID_ASSET_ID");
      if(seen.has(item.asset_id))return fail("DUPLICATE_ASSET_ID",{asset_id:item.asset_id});
      if(typeof item.relative_path!=="string"||!PATH_RE.test(item.relative_path)) return fail("UNSAFE_ASSET_PATH",{asset_id:item.asset_id});
      const idBits=item.asset_id.match(/^KL_(SH|M)(\d{2})_(\d{3})$/);
      const fileBits=item.relative_path.match(/^WEBP\/(SH|M)(\d{2})\/KL-(SH|M)(\d{2})-(\d{2})\.webp$/);
      if(!fileBits||idBits[1]!==fileBits[1]||idBits[2]!==fileBits[2]||idBits[1]!==fileBits[3]||idBits[2]!==fileBits[4]||Number(idBits[3])!==Number(fileBits[5]))return fail("PATH_ID_MISMATCH",{asset_id:item.asset_id});
      if(typeof item.webp_sha256!=="string"||!HASH_RE.test(item.webp_sha256))return fail("INVALID_CHECKSUM",{asset_id:item.asset_id});
      if(paths.has(item.relative_path))return fail("DUPLICATE_ASSET_PATH",{asset_id:item.asset_id});
      seen.add(item.asset_id);paths.add(item.relative_path);
      table[item.asset_id]=Object.freeze({id:item.asset_id,path:item.relative_path,label:String(item.label_vi||""),sha256:item.webp_sha256,approval:item.label_approval_status||"UNKNOWN",release:item.release_state||"UNKNOWN"});
    }
    return Object.freeze({ok:true,count:seen.size,items:Object.freeze(table),candidate:data.release_status!=="RELEASED"});
  }
  function validateBaseUrl(text,localAllowed){
    if(typeof text!=="string"||!text)return false;
    if(localAllowed && (text.startsWith("./")||text.startsWith("../"))) return !text.includes("..%")&&!text.includes("?")&&!text.includes("#");
    // URL must be HTTPS, immutable or versioned; avoid browser-only URL constructor in QA.
    // Restrict path characters; no credentials, query string, fragment, or insecure scheme.
    return /^https:\/\/[a-z0-9.-]+(?::443)?(?:\/[a-z0-9%._~!$&'()*+,;=:@/-]*)?$/i.test(text);
  }
  function create(options) {
    options=options||{};
    const settings={manifestUrl:options.manifestUrl||"",assetBaseUrl:options.assetBaseUrl||"",allowCandidate:!!options.allowCandidate,allowLocal:!!options.allowLocal,timeoutMs:Math.max(1000,Number(options.timeoutMs)||8000)};
    const fetchFn=options.fetchFn||(typeof fetch==="function"?fetch.bind(globalThis):null);
    let state="IDLE",index=null,inFlight=null,lastError=null;
    async function init(){
      if(index)return {ok:true,status:state,count:index.count,candidate:index.candidate};
      if(inFlight)return inFlight;
      if(!fetchFn)return fail("FETCH_UNAVAILABLE");
      if(typeof settings.manifestUrl!=="string"||!settings.manifestUrl) return fail("MANIFEST_URL_NOT_CONFIGURED");
      if(!validateBaseUrl(settings.manifestUrl,settings.allowLocal))return fail("UNSAFE_MANIFEST_URL");
      state="LOADING";
      inFlight=(async()=>{
        let abort,clock;
        try{
          if(typeof AbortController!=="undefined") {
            abort=new AbortController();
            clock=setTimeout(()=>abort.abort(),settings.timeoutMs);
          }
          const result=await fetchFn(settings.manifestUrl,{method:"GET",cache:"force-cache",signal:abort?abort.signal:undefined,credentials:"omit"});
          if(!result||!result.ok)throw new Error("HTTP_"+(result&&result.status||"UNKNOWN"));
          const json=await result.json();
          const parsed=validateManifest(json,{allowCandidate:settings.allowCandidate});
          if(!parsed.ok){state="FAILED";lastError=parsed.code;return parsed;}
          index=parsed;state="READY";lastError=null;return {ok:true,status:state,count:index.count,candidate:index.candidate};
        }catch(e){state="FAILED";lastError=e&&e.name==="AbortError"?"FETCH_TIMEOUT":"FETCH_FAILED";return fail(lastError);}
        finally{if(clock)clearTimeout(clock);inFlight=null;}
      })();
      return inFlight;
    }
    function useManifest(data) {
      const parsed=validateManifest(data,{allowCandidate:settings.allowCandidate});
      if(!parsed.ok){state="FAILED";lastError=parsed.code;return parsed;}
      index=parsed;state="READY";lastError=null;return {ok:true,status:state,count:parsed.count,candidate:parsed.candidate};
    }
    function lookup(assetId) {
      if(!ID_RE.test(String(assetId||""))) return fail("INVALID_ASSET_ID");
      if(!index)return fail("MANIFEST_NOT_READY");
      const found=index.items[assetId];
      return found?{ok:true,asset:found}:fail("ASSET_NOT_FOUND",{asset_id:assetId});
    }
    function resolve(assetId){
      const result=lookup(assetId);
      if(!result.ok)return result;
      if(!validateBaseUrl(settings.assetBaseUrl,settings.allowLocal))return fail("ASSET_HOST_NOT_CONFIGURED",{asset_id:assetId});
      const base=settings.assetBaseUrl.endsWith("/")?settings.assetBaseUrl:settings.assetBaseUrl+"/";
      const path=result.asset.path.split("/").map(encodeURIComponent).join("/");
      return {ok:true,url:base+path,asset:result.asset};
    }
    function mount(target,assetId,opts){
      opts=opts||{};
      if(!target||typeof target.appendChild!=="function")return fail("INVALID_TARGET");
      const resolved=resolve(assetId);
      if(!resolved.ok){ if(typeof opts.onFallback==="function")opts.onFallback(resolved.code,target);return resolved;}
      const doc=opts.document||(typeof document!=="undefined"?document:null);
      if(!doc||typeof doc.createElement!=="function")return fail("DOCUMENT_UNAVAILABLE");
      const img=doc.createElement("img");
      img.alt=opts.decorative?"":(opts.alt||resolved.asset.label||"Hình minh họa");
      img.width=Number(opts.width)||160;img.height=Number(opts.height)||160;
      img.loading=opts.eager?"eager":"lazy";img.decoding="async";img.referrerPolicy="no-referrer";
      img.dataset.klV5Asset=assetId;
      let settled=false;
      const onError=()=>{
        if(settled)return;settled=true;
        if(img.parentNode)img.parentNode.removeChild(img);
        if(typeof opts.onFallback==="function")opts.onFallback("IMAGE_LOAD_FAILED",target);
      };
      img.addEventListener("error",onError,{once:true});
      img.addEventListener("load",()=>{settled=true;if(typeof opts.onReady==="function")opts.onReady(img);},{once:true});
      img.src=resolved.url;
      target.appendChild(img);
      return {ok:true,asset_id:assetId,url:resolved.url,img};
    }
    return Object.freeze({
      init,useManifest,lookup,resolve,mount,
      status:()=>Object.freeze({state,hasManifest:!!index,count:index?index.count:0,lastError}),
      config:()=>Object.freeze({manifestUrl:settings.manifestUrl,assetBaseUrl:settings.assetBaseUrl,allowCandidate:settings.allowCandidate})
    });
  }
  return Object.freeze({create,validateManifest,validateBaseUrl});
});
