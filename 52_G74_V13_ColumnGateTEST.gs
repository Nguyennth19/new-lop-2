/** G7.4 COLUMN_CALC_REFERENCE_V1.3, independent Apps Script TEST project only.
 * Feature defaults OFF. Never activate on a project sharing MAIN Script Properties.
 */
function g74V13ColumnTestAllowed_(){
 try{
  var p=PropertiesService.getScriptProperties();
  return p.getProperty('G74_B514_SCOPE')==='ISOLATED_TEST_WEBAPP' &&
         p.getProperty('G74_V13_COLUMN_TEST')==='ENABLED';
 }catch(e){return false;}
}
function g74V13ColumnTestStatus_(){
 return {feature:'COLUMN_CALC_REFERENCE_V1.3',scope:'TEST_ONLY',
   enabled:g74V13ColumnTestAllowed_(),productionActivation:false,
   gradingPolicy:'B20_LEGACY_UNCHANGED',studentRewardsEnabled:false};
}
