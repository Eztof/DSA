// scripts/talente.js

import {
  getAll,
  setDocById,
  updateDocById,
  deleteDocById
} from "./firebase-utils.js";

// Liste der gültigen Collections (Kategorien)
// Diese Namen MÜSSEN exakt mit euren Firestore-Collections übereinstimmen.
const KATEGORIEN = [
  "Kampftalente",
  "KoerperlicheTalente",
  "GesellschaftlicheTalente",
  "Naturtalente",
  "Wissenstalente",
  "Handwerkstalente"
];

/**
 * Lädt alle Talente für die gegebene Kategorie
 * und füllt die Tabelle in talente.html.
 * @param {string} kategorie
 */
export async function ladeTalente(kategorie) {
  if (!KATEGORIEN.includes(kategorie)) {
    console.error(`Ungültige Kategorie: ${kategorie}`);
    return;
  }

  const liste = await getAll(kategorie);
  const tableBody = document.getElementById("talentTabelle");
  tableBody.innerHTML = "";

  liste.forEach(({ id, data }) => {
    // Aus dem Dokument: data.name, data.typ, data.steigerung, data.ebe, data.eigenschaft_1, _2, _3, data.voraussetzungen (Array), data.ersatzweise (Array)
    const {
      name              = "",
      typ               = "",
      steigerung        = data.steigerung || "",
      ebe               = data.ebe || "",
      eigenschaft_1     = data.eigenschaft_1   ?? data.eigenschaft1   ?? "",
      eigenschaft_2     = data.eigenschaft_2   ?? data.eigenschaft2   ?? "",
      eigenschaft_3     = data.eigenschaft_3   ?? data.eigenschaft3   ?? "",
      voraussetzungen   = Array.isArray(data.voraussetzungen) ? data.voraussetzungen.join(", ") : "",
      ersatzweise       = Array.isArray(data.ersatzweise)       ? data.ersatzweise.join(", ")
                         : Array.isArray(data.verwandteTalente) ? data.verwandteTalente.join(", ")
                         : ""
    } = data;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input id="name-${id}" value="${name}"></td>
      <td><input id="typ-${id}" value="${typ}"></td>
      <td><input id="steigerung-${id}" value="${steigerung}"></td>
      <td><input id="ebe-${id}" value="${ebe}"></td>
      <td>
        <input style="width:30%" id="e1-${id}" value="${eigenschaft_1}" placeholder="Eig.1">
        <input style="width:30%" id="e2-${id}" value="${eigenschaft_2}" placeholder="Eig.2">
        <input style="width:30%" id="e3-${id}" value="${eigenschaft_3}" placeholder="Eig.3">
      </td>
      <td><input id="voraus-${id}" value="${voraussetzungen}"></td>
      <td><input id="ersatz-${id}" value="${ersatzweise}"></td>
      <td class="actions">
        <button onclick="speichereTalent('${kategorie}', '${id}')">Speichern</button>
        <button onclick="loescheTalent('${kategorie}', '${id}')">Löschen</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

/**
 * Fügt ein neues Talent in die gewählte Kategorie ein.
 * @param {string} kategorie
 */
export async function hinzufuegenTalent(kategorie) {
  if (!KATEGORIEN.includes(kategorie)) {
    alert("Ungültige Kategorie ausgewählt.");
    return;
  }

  const name        = document.getElementById("inputName").value.trim();
  const typ         = document.getElementById("inputTyp").value.trim();
  const steigerung  = document.getElementById("inputSteigerung").value.trim();
  const ebe         = document.getElementById("inputEBE").value.trim();
  const e1          = document.getElementById("inputEig1").value.trim();
  const e2          = document.getElementById("inputEig2").value.trim();
  const e3          = document.getElementById("inputEig3").value.trim();
  const vorausArr   = document.getElementById("inputVoraussetzungen").value
                       .split(",")
                       .map(s => s.trim())
                       .filter(Boolean);
  const ersatzArr   = document.getElementById("inputErsatzweise").value
                       .split(",")
                       .map(s => s.trim())
                       .filter(Boolean);

  if (!name || !typ || !steigerung) {
    alert("Bitte fülle mindestens Name, Typ und Steigerung aus.");
    return;
  }

  // ID aus dem Namen generieren
  const id = name.toLowerCase().replace(/\s+/g, "-");

  const payload = {
    name,
    typ,
    steigerung,
    ebe,
    eigenschaft_1: e1,
    eigenschaft_2: e2,
    eigenschaft_3: e3,
    voraussetzungen: vorausArr,
    ersatzweise: ersatzArr
  };

  await setDocById(kategorie, id, payload);
  await ladeTalente(kategorie);

  // Felder leeren
  [
    "inputName","inputTyp","inputSteigerung","inputEBE",
    "inputEig1","inputEig2","inputEig3",
    "inputVoraussetzungen","inputErsatzweise"
  ].forEach(id => document.getElementById(id).value = "");
}

/**
 * Speichert eine Änderung an einem bestehenden Talent.
 * @param {string} kategorie
 * @param {string} id
 */
export async function speichereTalent(kategorie, id) {
  const name       = document.getElementById(`name-${id}`).value.trim();
  const typ        = document.getElementById(`typ-${id}`).value.trim();
  const steigerung = document.getElementById(`steigerung-${id}`).value.trim();
  const ebe        = document.getElementById(`ebe-${id}`).value.trim();
  const e1         = document.getElementById(`e1-${id}`).value.trim();
  const e2         = document.getElementById(`e2-${id}`).value.trim();
  const e3         = document.getElementById(`e3-${id}`).value.trim();
  const vorausArr  = document.getElementById(`voraus-${id}`).value
                      .split(",")
                      .map(s => s.trim())
                      .filter(Boolean);
  const ersatzArr  = document.getElementById(`ersatz-${id}`).value
                      .split(",")
                      .map(s => s.trim())
                      .filter(Boolean);

  if (!name || !typ || !steigerung) {
    alert("Name, Typ und Steigerung dürfen nicht leer sein.");
    return;
  }

  const updates = {
    name,
    typ,
    steigerung,
    ebe,
    eigenschaft_1: e1,
    eigenschaft_2: e2,
    eigenschaft_3: e3,
    voraussetzungen: vorausArr,
    ersatzweise: ersatzArr
  };

  await updateDocById(kategorie, id, updates);
  alert("Talent gespeichert.");
  await ladeTalente(kategorie);
}

/**
 * Löscht ein Talent-Dokument.
 * @param {string} kategorie
 * @param {string} id
 */
export async function loescheTalent(kategorie, id) {
  if (!confirm(`Talent mit ID "${id}" wirklich löschen?`)) return;
  await deleteDocById(kategorie, id);
  await ladeTalente(kategorie);
}
