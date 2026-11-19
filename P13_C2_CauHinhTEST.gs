/** P1.3-C.2 TEST-ONLY opt-in. Defaults OFF; never accepts flags from URL/client. */
function p13C2GASTestEnabled_() {
  const p = PropertiesService.getScriptProperties();
  return p.getProperty('LOP2_ENVIRONMENT') === 'GAS_TEST'
    && p.getProperty('P13_C2_UNIFIED_RESOLVER') === 'ENABLED'
    && p.getProperty('P13_C2_OWNER_TEST_APPROVAL') === 'APPROVED_FOR_GAS_TEST';
}
/** Read-only display for test administrators; never changes script properties. */
function p13C2Status_() {
  return Object.freeze({
    gate: 'P1.3-C.2',
    enabled: p13C2GASTestEnabled_(),
    release: 'GAS_TEST_ONLY',
    productionAuthorized: false
  });
}
