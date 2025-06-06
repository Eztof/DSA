// scripts/ui-helpers.js

/**
 * Erstellt eine Tabelle mit Kacheln, falls du später ein anderes Layout brauchst.
 * (Muss nicht verwendet werden, nur Platzhalter-Beispiel.)
 */
export function clearElement(id) {
  document.getElementById(id).innerHTML = "";
}

/**
 * Hilft dabei, eine ID (aus Name) zu generieren.
 * @param {string} name
 * @returns {string}
 */
export function generateId(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}
