/** G7.5 ISOLATED TEST project ONLY. Do NOT copy doGet into existing AppScript V6 project. */
function doGet(e) {
  return HtmlService.createTemplateFromFile('G75_GAS_Compatibility_Preview').evaluate()
    .setTitle('G7.5 TEST – Vietnamese TTS Compatibility');
}
function g75Include(fileName) {
  if (fileName !== 'G75_SpeechService_JS') throw new Error('G7.5 include not allowlisted');
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}
