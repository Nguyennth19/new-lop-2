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

/** G7.4-C4 – separate TEST-only visual-policy audit switch. Default OFF.
 * Requires an isolated Apps Script TEST project, NOT a deployment in MAIN project.
 */
function g74C4ChoPhepTest_(){
  try {
    const p=PropertiesService.getScriptProperties();
    return p.getProperty('G74_B514_SCOPE')==='ISOLATED_TEST_WEBAPP' &&
           p.getProperty('G74_C4_VISUAL_POLICY')==='ENABLED';
  }catch(e){return false;}
}
