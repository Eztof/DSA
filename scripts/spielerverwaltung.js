// scripts/spielerverwaltung.js

import {
  getAll,
  setDocById,
  updateDocById,
  deleteDocById
} from "./firebase-utils.js";

// Firestore-Collection-Name
const COLLECTION = "Spieler";

/**
 * Lädt alle Spieler-Dokumente und füllt die Tabelle.
 */
export async function ladeSpieler() {
  const liste = await getAll(COLLECTION);
  const tableBody = document.getElementById("spielerTabelle");
  tableBody.innerHTML = "";

  liste.forEach(({ id, data }) => {
    // data: { spielername, passwort }
    const spielername = data.spielername || "";
    const passwortHash = data.passwort || "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" id="name-${id}" value="${spielername}"></td>
      <td><input type="text" id="pw-${id}" value="${passwortHash}"></td>
      <td class="actions">
        <button onclick="speichereSpieler('${id}')">Speichern</button>
        <button onclick="loescheSpieler('${id}')">Löschen</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

/**
 * Fügt einen neuen Spieler hinzu (Name + Passworthash).
 */
export async function hinzufuegenSpieler() {
  const nameInput = document.getElementById("player-name").value.trim();
  const pwInput   = document.getElementById("player-password").value.trim();

  if (!nameInput || !pwInput) {
    alert("Bitte Spielername und Passwort eingeben.");
    return;
  }

  // Erstelle eine ID aus dem Spielernamen (z. B. "maxmustermann")
  const id = nameInput.toLowerCase().replace(/\s+/g, "-");

  // Hier: Du solltest im echten Projekt das Passwort sicher hashen!
  // In diesem Beispiel speichern wir es "ungehasht" im Feld 'passwort'
  // (Nur zu Demonstrationszwecken – im echten Einsatz: immer Hash eines Passworts!)
  const payload = {
    spielername: nameInput,
    passwort: pwInput
  };

  await setDocById(COLLECTION, id, payload);

  document.getElementById("player-name").value = "";
  document.getElementById("player-password").value = "";

  await ladeSpieler();
}

/**
 * Aktualisiert einen existierenden Spieler.
 * @param {string} id
 */
export async function speichereSpieler(id) {
  const name    = document.getElementById(`name-${id}`).value.trim();
  const pwHash  = document.getElementById(`pw-${id}`).value.trim();

  if (!name || !pwHash) {
    alert("Spielername und Passwort dürfen nicht leer sein.");
    return;
  }

  const updates = {
    spielername: name,
    passwort: pwHash
  };

  await updateDocById(COLLECTION, id, updates);
  alert("Spieler gespeichert.");
  await ladeSpieler();
}

/**
 * Löscht einen Spieler.
 * @param {string} id
 */
export async function loescheSpieler(id) {
  if (!confirm(`Spieler "${id}" wirklich löschen?`)) return;
  await deleteDocById(COLLECTION, id);
  await ladeSpieler();
}
