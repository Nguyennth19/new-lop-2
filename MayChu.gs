/** Máy chủ Apps Script: phục vụ giao diện Lớp 2 V2.2. */
function doGet(e) {
  g3aQaContext_(); // TEST access only: reject anonymous or non-allowlisted sessions.
  if (e && e.parameter && e.parameter.g3bSmoke === '1') {
    // Same identity check as the lesson UI; this standalone page has no keys.
    return HtmlService.createHtmlOutputFromFile('G3B_BrowserSmoke')
      .setTitle('G3-B – B20 GAS TEST')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }
  return HtmlService.createTemplateFromFile('GiaoDien').evaluate()
    .setTitle('Lớp 2 – V2.2')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}
/**
 * Đọc nguyên văn nội dung CSS/JS partial để lồng vào GiaoDien.
 * KHÔNG dùng createHtmlOutputFromFile().getContent() vì các partial JavaScript
 * chứa toán tử < và template literals (HTML động) không phải tài liệu HTML hoàn chỉnh.
 * Chỉ gọi với tên tệp nội bộ cố định, không nhận tên từ dữ liệu người dùng.
 */
function napThanhPhan(tenTep) {
  return HtmlService.createTemplateFromFile(tenTep).getRawContent();
}
