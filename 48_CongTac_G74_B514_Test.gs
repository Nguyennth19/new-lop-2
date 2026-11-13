/** G7.4-B.5.14 – server-side feature gate, OFF by default.
 * Isolated TEST deployment only. Requires two exact ScriptProperties and
 * an opt-in query parameter in the client. Never set this on MAIN.
 */
function g74B514ChoPhepTest_(){
  try{
    const p=PropertiesService.getScriptProperties();
    return p.getProperty('G74_B514_SCOPE')==='ISOLATED_TEST_WEBAPP' &&
           p.getProperty('G74_B514_COUNT_RENDERER')==='ENABLED';
  }catch(e){return false;}
}
/** Diagnostic is metadata-only, does not change user data. */
function g74B514TrangThaiTest_(){
  return {feature:'G7.4-B.5.14',enabled:g74B514ChoPhepTest_(),
    scope:'TEST_ONLY',mainRelease:false};
}
