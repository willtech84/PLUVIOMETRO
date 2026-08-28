// ================================================
// PLUVIOMETRO DIGITAL - Google Apps Script
// ================================================
// INSTRUCOES:
// 1. Acesse script.google.com
// 2. Clique em "Novo projeto"
// 3. Apague tudo e cole este codigo
// 4. Clique em "Implantar" > "Nova implantacao"
// 5. Tipo: App da Web | Executar como: Eu | Acesso: Qualquer pessoa
// 6. Copie a URL gerada e cole no app Pluviometro
// ================================================

var SHEET_NAME = "Registros";
var BACKUP_FOLDER_NAME = "Pluviometro Backups";
var SPREADSHEET_NAME = "Pluviometro Digital";

function doPost(e) {
  try {
    var raw = e && e.postData ? e.postData.contents : "";
    if (!raw) return respond({ status: "error", message: "Sem dados recebidos" });

    var data = JSON.parse(raw);
    validatePayload(data);

    saveJsonToDrive(data);
    var added = data.entries.length ? saveToSheet(data) : 0;

    return respond({
      status: "ok",
      received: data.entries.length,
      saved: added,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return respond({ status: "error", message: String(err && err.message ? err.message : err) });
  }
}

function doGet(e) {
  return respond({ status: "ok", message: "Pluviometro Backup API ativa!", timestamp: new Date().toISOString() });
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Valida o formato antes de gravar qualquer coisa.
function validatePayload(data) {
  if (!data || typeof data !== "object") throw new Error("Payload invalido");
  if (!Array.isArray(data.entries)) throw new Error("Campo entries ausente ou invalido");
  if (data.entries.length > 10000) throw new Error("Quantidade de registros excede o limite de 10000");

  for (var i = 0; i < data.entries.length; i++) {
    var e = data.entries[i] || {};
    if (!e.id) throw new Error("Registro " + (i + 1) + " sem ID");
    if (!e.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(e.date))) {
      throw new Error("Registro " + (i + 1) + " com data invalida");
    }
    var rain = Number(e.rain);
    if (!isFinite(rain) || rain < 0) throw new Error("Registro " + (i + 1) + " com chuva invalida");
  }
}

function saveJsonToDrive(data) {
  var folder = getOrCreateFolder(BACKUP_FOLDER_NAME);
  var dateStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd_HH-mm-ss");
  var filename = "backup_pluviometro_" + dateStr + ".json";
  folder.createFile(filename, JSON.stringify(data, null, 2), MimeType.PLAIN_TEXT);
  cleanOldBackups(folder, 30);
}

function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

function cleanOldBackups(folder, maxFiles) {
  var files = [];
  var iter = folder.getFiles();
  while (iter.hasNext()) {
    var f = iter.next();
    files.push({ file: f, date: f.getDateCreated() });
  }
  files.sort(function(a, b) { return a.date - b.date; });
  while (files.length > maxFiles) files.shift().file.setTrashed(true);
}

function saveToSheet(data) {
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    var header = ["Data", "Hora", "Chuva (mm)", "Temp (C)", "Fenomeno", "Observacoes", "Cidade", "UF", "Importado em", "ID"];
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    var headerRange = sheet.getRange(1, 1, 1, header.length);
    headerRange.setFontWeight("bold").setBackground("#2563eb").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.hideColumns(10);
  }

  // Le IDs existentes de uma vez e tambem bloqueia duplicatas dentro do proprio lote.
  var lastRow = sheet.getLastRow();
  var existingIds = {};
  if (lastRow > 1) {
    var idValues = sheet.getRange(2, 10, lastRow - 1, 1).getValues();
    for (var i = 0; i < idValues.length; i++) {
      var existingId = String(idValues[i][0] || "");
      if (existingId) existingIds[existingId] = true;
    }
  }

  var now = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm");
  var entries = data.entries || [];
  var rows = [];

  for (var j = 0; j < entries.length; j++) {
    var entry = entries[j];
    var entryId = String(entry.id);
    if (existingIds[entryId]) continue;

    existingIds[entryId] = true;
    rows.push([
      String(entry.date || ""),
      String(entry.time || ""),
      Number(entry.rain || 0),
      entry.temp === "" || entry.temp == null ? "" : Number(entry.temp),
      entry.phenomena && entry.phenomena !== "none" ? String(entry.phenomena) : "",
      String(entry.notes || ""),
      String(entry.location || ""),
      String(entry.uf || ""),
      now,
      entryId
    ]);
  }

  // Uma unica escrita reduz o risco de timeout e acelera lotes grandes.
  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 10).setValues(rows);
    formatSheet(sheet);
  }

  return rows.length;
}

function getOrCreateSpreadsheet() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  var files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) return SpreadsheetApp.open(files.next());
  return SpreadsheetApp.create(SPREADSHEET_NAME);
}

function formatSheet(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var rows = sheet.getRange(2, 1, lastRow - 1, 9);
  rows.setBackground("#ffffff");
  sheet.autoResizeColumns(1, 9);
}
