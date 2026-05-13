// ================================
// Google Apps Script — Repair Dashboard API
// วางโค้ดนี้ใน Google Apps Script แล้ว Deploy เป็น Web App
// ================================

const SHEET_ID = '1JrVY0MHVRq4eAyi-fjKQVRW7LCz8v2vJlQpwm41Iy6E';

function doGet(e) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0];
    const data  = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return jsonResponse({ error: 'No data', rows: [] });
    }

    const headers = data[0].map(h => h.toString().trim());
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        const val = row[i];
        if (val instanceof Date) {
          // Format as M/D/YYYY to match existing parsing
          const d = new Date(val);
          obj[h] = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
        } else {
          obj[h] = (val === null || val === undefined) ? '' : val.toString();
        }
      });
      return obj;
    });

    return jsonResponse({ rows: rows, updated: new Date().toISOString() });

  } catch (err) {
    return jsonResponse({ error: err.message, rows: [] });
  }
}

function jsonResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
