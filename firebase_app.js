// firebase_app.js FINAL - checklist-oficina-72c9e ✅
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCpCfotfXYNpQu5o0fFbBvwOnQgU9PuYqU",
  authDomain: "checklist-oficina-72c9e.firebaseapp.com",
  projectId: "checklist-oficina-72c9e",
  storageBucket: "checklist-oficina-72c9e.firebasestorage.app",
  messagingSenderId: "305423384809",
  appId: "1:305423384809:web:b152970a419848a0147078"
};

const app = initializeApp(firebaseConfig);
window.db = getFirestore(app);
window.auth = getAuth(app);

signInAnonymously(window.auth).then(() => {
  console.log('✅ Login anônimo OK!');
}).catch(err => console.error('❌ Auth error:', err));

console.log('🔥 Firebase checklist-oficina-72c9e ✅');
console.log('📊 db:', window.db);
console.log('👤 auth:', window.auth);
