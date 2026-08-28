// Persistência compatível e segura para os registros pluviométricos.
const STORAGE_KEY = 'pluviometro_entries';
const BACKUP_KEY = 'pluviometro_entries_backup';

export function loadEntries(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries, storage = globalThis.localStorage) {
  const payload = JSON.stringify(Array.isArray(entries) ? entries : []);
  // Mantém uma cópia do último estado válido antes da substituição.
  try {
    const previous = storage.getItem(STORAGE_KEY);
    if (previous) storage.setItem(BACKUP_KEY, previous);
    storage.setItem(STORAGE_KEY, payload);
    return true;
  } catch {
    return false;
  }
}

export function restoreEntriesBackup(storage = globalThis.localStorage) {
  try {
    const backup = storage.getItem(BACKUP_KEY);
    if (!backup) return [];
    const parsed = JSON.parse(backup);
    if (!Array.isArray(parsed)) return [];
    storage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  } catch {
    return [];
  }
}

export { STORAGE_KEY, BACKUP_KEY };
