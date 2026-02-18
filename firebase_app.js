// firebase_app.js LEGACY - FUNCIONA SEM MODULE
// https://firebase.google.com/docs/web/setup#available-libraries

// Config seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyCpCfotfXYNpQu5o0fFbBvwOnQgU9PuYqU",
  authDomain: "checklist-oficina-72c9e.firebaseapp.com",
  projectId: "checklist-oficina-72c9e",
  storageBucket: "checklist-oficina-72c9e.firebasestorage.app",
  messagingSenderId: "305423384809",
  appId: "1:305423384809:web:b152970a419848a0147078"
};

// CDN Firebase v9 compat (LEGACY API)
const script1 = document.createElement('script');
script1.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';
document.head.appendChild(script2);

const script3 = document.createElement('script');
script3.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js';
document.head.appendChild(script3);

script3.onload = () => {
  const app = firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  
  firebase.auth().signInAnonymously().catch(console.error);
  
  console.log('✅ Firebase LEGACY OK!');
  console.log('🔥 window.db:', window.db);
  console.log('👤 window.auth:', window.auth);
};
