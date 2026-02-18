// firebase_app.js - LEGACY FUNCIONA 100%
var firebaseConfig = {
  apiKey: "AIzaSyCpCfotfXYNpQu5o0fFbBvwOnQgU9PuYqU",
  authDomain: "checklist-oficina-72c9e.firebaseapp.com",
  projectId: "checklist-oficina-72c9e",
  storageBucket: "checklist-oficina-72c9e.firebasestorage.app",
  messagingSenderId: "305423384809",
  appId: "1:305423384809:web:b152970a419848a0147078"
};

// Carrega Firebase CDN
const scripts = [
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js'
];

let loaded = 0;
scripts.forEach(src => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => {
    loaded++;
    if (loaded === 3) initFirebase();
  };
  document.head.appendChild(script);
});

function initFirebase() {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  window.auth.signInAnonymously().catch(console.error);
  console.log('✅ Firebase LEGACY pronto!');
}
