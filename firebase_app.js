// firebase_app.js - LEGACY FUNCIONA 100% + MULTI OFICINA

var firebaseConfig = {
  apiKey: "AIzaSyCpCfotfXYNpQu5o0fFbBvwOnQgU9PuYqU",
  authDomain: "checklist-oficina-72c9e.firebaseapp.com",
  projectId: "checklist-oficina-72c9e",
  storageBucket: "checklist-oficina-72c9e.firebasestorage.app",
  messagingSenderId: "305423384809",
  appId: "1:305423384809:web:b152970a419848a0147078"
};

// ==========================================
// CARREGAMENTO CDN FIREBASE 8
// ==========================================

const scripts = [
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js",
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js",
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"
];

let loaded = 0;

scripts.forEach(src => {
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => {
    loaded++;
    if (loaded === scripts.length) initFirebase();
  };
  document.head.appendChild(script);
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================

function initFirebase() {
  firebase.initializeApp(firebaseConfig);

  window.db = firebase.firestore();
  window.auth = firebase.auth();

  window.auth.signInAnonymously().catch(console.error);

  console.log("✅ Firebase LEGACY pronto!");
}

// ==========================================
// FUNÇÕES MULTI OFICINA
// ==========================================

async function salvarNoFirebase(checklist) {
  if (!window.db) throw new Error("Firebase não inicializado");

  const oficinaId = window.OFICINA_CONFIG?.id;
  if (!oficinaId) throw new Error("OFICINA_CONFIG.id não definido");

  await window.db
    .collection("oficinas")
    .doc(oficinaId)
    .collection("checklists")
    .doc(String(checklist.id))
    .set(checklist);

  console.log("✅ Checklist salvo na oficina:", oficinaId);
}

async function buscarChecklistsNuvem() {
  if (!window.db) throw new Error("Firebase não inicializado");

  const oficinaId = window.OFICINA_CONFIG?.id;
  if (!oficinaId) throw new Error("OFICINA_CONFIG.id não definido");

  const snapshot = await window.db
    .collection("oficinas")
    .doc(oficinaId)
    .collection("checklists")
    .get();

  return snapshot.docs.map(doc => doc.data());
}

// ==========================================
// EXPORT PARA IMPORT DINÂMICO
// ==========================================

export { salvarNoFirebase, buscarChecklistsNuvem };
