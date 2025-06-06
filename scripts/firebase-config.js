// scripts/firebase-config.js

// 1. Importiere nur das Nötigste
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 2. Deine Firebase-Konfigurationsdaten
const firebaseConfig = {
  apiKey: "AIzaSyBHIftX5AvSJaPAiUIek0TBVjEtxwZo7Ow",
  authDomain: "dsapp-6722f.firebaseapp.com",
  projectId: "dsapp-6722f",
  // (falls nötig: storageBucket, messagingSenderId, appId, measurementId)
};

// 3. Initialisiere Firebase
const app = initializeApp(firebaseConfig);

// 4. Exportiere Firestore-Instanz
export const db = getFirestore(app);
