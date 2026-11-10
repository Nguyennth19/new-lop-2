/** Máy chủ Apps Script: phục vụ giao diện lớp 2 V2.1. */
function doGet() {
  return HtmlService.createTemplateFromFile('GiaoDien').evaluate()
    .setTitle('Lớp 2 Vui Học – V2.1')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}
/** Ghép partial HTML, CSS, JavaScript trong một trang HtmlService. */
function napThanhPhan(tenTep) {
  return HtmlService.createHtmlOutputFromFile(tenTep).getContent();
}
