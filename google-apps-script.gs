/**
 * STEP-BY-STEP (Hinglish):
 * 1. Ek naya Google Sheet banayein (sheets.google.com) — naam de dein "Contact Leads".
 * 2. Sheet ke andar: Extensions > Apps Script kholein.
 * 3. Wahan jo default code hai use hata kar ye pura code paste kar dein.
 * 4. Upar "Deploy" > "New deployment" > gear icon > "Web app" choose karein.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. "Deploy" dabayein, Google permission maangega — allow kar dein.
 * 6. Jo "Web app URL" milega (…/exec se khatam hoga), use copy karke
 *    src/config.js file me GOOGLE_SHEET_ENDPOINT me paste kar dein.
 * 7. Bas — ab contact form se aane wala data is Sheet me apne aap add hoga.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Header row agar sheet khaali hai to add karo
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Message"]);
  }

  var data = e.parameter;

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.email || "",
    data.phone || "",
    data.message || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "Lens & Frame contact endpoint is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
