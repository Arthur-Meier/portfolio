const preferences = new Set(['auto', 'light', 'dark']);

export function resolveTheme(preference, systemDark) {
  return preference === 'light' || preference === 'dark' ? preference : (systemDark ? 'dark' : 'light');
}

export function readPreference(storage, key, fallback) {
  try {
    const value = storage?.getItem(key);
    return preferences.has(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function writePreference(storage, key, value) {
  if (!preferences.has(value)) return;
  try { storage?.setItem(key, value); } catch { /* The current visit does not depend on persistence. */ }
}
