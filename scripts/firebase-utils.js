// scripts/firebase-utils.js

import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

/**
 * Hol alle Dokumente einer Collection.
 * @param {string} collectionName
 * @returns {Promise<Array<{id: string, data: Object}>>}
 */
export async function getAll(collectionName) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const result = [];
  snapshot.forEach(docSnap => {
    result.push({ id: docSnap.id, data: docSnap.data() });
  });
  return result;
}

/**
 * Erstelle oder überschreibe ein Dokument in einer Collection.
 * @param {string} collectionName
 * @param {string} id
 * @param {Object} payload
 */
export async function setDocById(collectionName, id, payload) {
  await setDoc(doc(db, collectionName, id), payload);
}

/**
 * Aktualisiere ein existierendes Dokument.
 * @param {string} collectionName
 * @param {string} id
 * @param {Object} updates
 */
export async function updateDocById(collectionName, id, updates) {
  await updateDoc(doc(db, collectionName, id), updates);
}

/**
 * Lösche ein Dokument per ID.
 * @param {string} collectionName
 * @param {string} id
 */
export async function deleteDocById(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}
