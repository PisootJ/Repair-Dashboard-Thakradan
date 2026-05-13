// ================================
// Google Apps Script — Repair Dashboard API v2
// Deploy: Web App | Execute as: Me | Access: Anyone
// ================================

const SHEET_ID = '1JrVY0MHVRq4eAyi-fjKQVRW7LCz8v2vJlQpwm41Iy6E';

function doGet(e) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0];
    const data  = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return respond({ error: 'No data', rows: [] }, e);
    }

    const headers = data[0].map(h => h.toString().trim());
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        const val = row[i];
        if (val instanceof Date) {
          const d = new Date(val);
          obj[h] = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
        } else {
          obj[h] = (val === null || val === undefined) ? '' : val.toString().trim();
        }
      });
      return obj;
    });

    return respond({ rows: rows, count: rows.length, updated: new Date().toISOString() }, e);

  } catch (err) {
    return respond({ error: err.message, rows: [] }, e);
  }
}

// รองรับทั้ง JSON และ JSONP (callback parameter)
function respond(data, e) {
  const json = JSON.stringify(data);
  const callback = e && e.parameter && e.parameter.callback;

  if (callback) {
    // JSONP mode — ใช้�