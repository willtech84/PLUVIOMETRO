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

// ================================================
// ENDPOINT PRINCIPAL - recebe dados do app
// ================================================
function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : "";
    if (!raw) {
      return respond({ status: "error", message: "Sem dados recebidos" });
    }

    var data = JSON.parse(raw);

    saveJsonToDrive(data);

    var added = 0;
    if (data.entries && data.entries.length > 0) {
      added = saveToSheet(data);
    }

    return respond({ status: "ok", saved: added, timestamp: new Date().toISOString() });

  } catch (err) {
    return respond({ status: "error", message: err.toString() });
  }
}

// ================================================
// ENDPOINT GET - teste de conectividade
// ================================================
function doGet(e) {
  return respond({ status: "ok", message: "Pluviometro Backup API ativa!", timestamp: new Date().toISOString() });
}

// ================================================
// HELPER - resposta JSON
// ================================================
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================
// SALVA JSON NO GOOGLE DRIVE
// ================================================
function saveJsonToDrive(data) {
  var folder = getOrCreateFolder(BACKUP_FOLDER_NAME);
  var dateStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd_HH-mm-ss");
  var filename = "backup_pluviometro_" + dateStr + ".json";
  var content = JSON.stringify(data, null, 2);
  folder.createFile(filename, content, MimeType.PLAIN_TEXT);
  cleanOldBackups(folder, 30);
}

// ================================================
// BUSCA OU CRIA PASTA NO DRIVE
// ================================================
function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(name);
}

// ================================================
// REMOVE BACKUPS ANTIGOS
// ================================================
function cleanOldBackups(folder, maxFiles) {
  var files = [];
  var iter = folder.getFiles();
  while (iter.hasNext()) {
    var f = iter.next();
    files.push({ file: f, date: f.getDateCreated() });
  }
  files.sort(function(a, b) { return a.date - b.date; });
  while (files.length > maxFiles) {
    files.shift().file.setTrashed(true);
  }
}

// ================================================
// SALVA REGISTROS NA PLANILHA
// ================================================
function saveToSheet(data) {
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    var header = ["Data", "Hora", "Chuva (mm)", "Temp (C)", "Fenomeno", "Observacoes", "Cidade", "UF", "Importado em", "ID"];
    sheet.appendRow(header);
    var headerRange = sheet.getRange(1, 1, 1, header.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#2563eb");
    headerRange.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.hideColumns(10);
  }

  var lastRow = sheet.getLastRow();
  var existingIds = {};
  if (lastRow > 1) {
    var idValues = sheet.getRange(2, 10, lastRow - 1, 1).getValues();
    for (var i = 0; i < idValues.length; i++) {
      existingIds[String(idValues[i][0])] = true;
    }
  }

  var now = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm");
  var added = 0;
  var entries = data.entries || [];

  for (var j = 0; j < entries.length; j++) {
    var entry = entries[j];
    var entryId = String(entry.id || "");
    if (!existingIds[entryId]) {
      sheet.appendRow([
        entry.date     || "",
        entry.time     || "",
        entry.rain     || 0,
        entry.temp     || 0,
        (entry.phenomena && entry.phenomena !== "none") ? entry.phenomena : "",
        entry.notes    || "",
        entry.location || "",
        entry.uf       || "",
        now,
        entryId
      ]);
      added++;
    }
  }

  if (added > 0) {
    formatSheet(sheet);
  }

  return added;
}

// ================================================
// BUSCA OU CRIA PLANILHA
// ================================================
function getOrCreateSpreadsheet() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    // Script standalone, continua abaixo
  }

  var files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }

  return SpreadsheetApp.create(SPREADSHEET_NAME);
}

// ================================================
// FORMATA PLANILHA COM CORES ALTERNADAS
// ================================================
function formatSheet(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  for (var i = 2; i <= lastRow; i++) {
    var color = (i % 2 === 0) ? "#f8fafc" : "#ffffff";
    sheet.getRange(i, 1, 1, 9).setBackground(color);
  }
  sheet.autoResizeColumns(1, 9);
}
