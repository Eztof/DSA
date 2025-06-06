// scripts/eigenschaften.js

import {
  getAll,
  setDocById,
  deleteDocById
} from "./firebase-utils.js";

const COLLECTION = "Eigenschaften";

/**
 * Lädt alle Eigenschaften aus Firestore
 * und füllt die Tabelle in eigenschaften.html.
 */
export async function ladeEigenschaften() {
  const liste = await getAll(COLLECTION);
  const container = document.getElementById("eigenschaftenListe");
  container.innerHTML = "";

  liste.forEach(({ id, data }) => {
    // data: { name, kuerzel, beschreibung }
    const { name, kuerzel, beschreibung = "" } = data;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input id="name-${id}" type="text" value="${name}"></td>
      <td><input id="kuerzel-${id}" type="text" value="${kuerzel}"></td>
      <td><input id="beschreibung-${id}" type="text" value="${beschreibung}"></td>
      <td class="actions">
        <button onclick="aktualisiereEigenschaft('${id}')">Speichern</button>
        <button onclick="loescheEigenschaft('${id}')">Löschen</button>
      </td>
    `;
    container.appendChild(row);
  });
}

/**
 * Fügt eine neue Eigenschaft hinzu.
 */
export async function hinzufuegenEigenschaft() {
  const nameInput = document.getElementById("eigenschaft-name").value.trim();
  const kuerzelInput = document.getElementById("eigenschaft-kuerzel").value.trim();
  const beschrInput = document.getElementById("eigenschaft-beschreibung").value.trim();

  if (!nameInput || !kuerzelInput) {
    alert("Name und Kürzel sind erforderlich.");
    return;
  }

  // ID aus Kürzel (z. B. "MU")
  const id = kuerzelInput.toUpperCase();

  await setDocById(COLLECTION, id, {
    name: nameInput,
    kuerzel: kuerzelInput.toUpperCase(),
    beschreibung: beschrInput
  });

  // Formular leeren
  document.getElementById("eigenschaft-name").value = "";
  document.getElementById("eigenschaft-kuerzel").value = "";
  document.getElementById("eigenschaft-beschreibung").value = "";

  await ladeEigenschaften();
}

/**
 * Aktualisiert eine bestehende Eigenschaft.
 * @param {string} id
 */
export async function aktualisiereEigenschaft(id) {
  const name  = document.getElementById(`name-${id}`).value.trim();
  const kuerzel = document.getElementById(`kuerzel-${id}`).value.trim();
  const beschr = document.getElementById(`beschreibung-${id}`).value.trim();

  if (!name || !kuerzel) {
    alert("Name und Kürzel dürfen nicht leer sein.");
    return;
  }

  await updateDocById(COLLECTION, id, {
    name,
    kuerzel: kuerzel.toUpperCase(),
    beschreibung: beschr
  });

  alert("Eigenschaft gespeichert.");
  await ladeEigenschaften();
}

/**
 * Löscht eine Eigenschaft per ID.
 * @param {string} id
 */
export async function loescheEigenschaft(id) {
  if (!confirm(`Eigenschaft "${id}" wirklich löschen?`)) return;
  await deleteDocById(COLLECTION, id);
  await ladeEigenschaften();
}
