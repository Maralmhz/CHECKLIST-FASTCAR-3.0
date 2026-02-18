// config.js - Fast Car Centro Automotivo
// Configuração completa para Checklist Veicular

window.OFICINA_CONFIG = {
    oficina_id: "fastcar",  // Identificador único da oficina
    nome: "FAST CAR CENTRO AUTOMOTIVO",
    subtitulo: "CHECKLIST DE ENTRADA E INSPEÇÃO VEICULAR",
    cnpj: "60.516.882/0001-74",
    logo: "logo.png",
    corPrimaria: "#c32421",
    endereco: "Av. Régulus, 248 - Jardim Riacho das Pedras, Contagem - MG, 32241-210",
    telefone: "(31) 2342-1699",
    whatsapp: "(31) 99457-9274"
};

// ============================================
// CONFIGURAÇÃO FIREBASE (PRINCIPAL)
// ============================================
window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyCpCfotfXYNpQu5o0fFbBvwOnQgU9PuYqU",
    authDomain: "checklist-oficina-72c9e.firebaseapp.com",
    databaseURL: "https://checklist-oficina-72c9e-default-rtdb.firebaseio.com",
    projectId: "checklist-oficina-72c9e",
    storageBucket: "checklist-oficina-72c9e.firebasestorage.app",
    messagingSenderId: "305423384809",
    appId: "1:305423384809:web:b152970a419848a0147078"
};

// ============================================
// CONFIGURAÇÃO GIST (LEGADO - DESATIVADO)
// ============================================
// Token revogado - não usar mais
window.CLOUD_CONFIG = {
    TOKEN: '',  // Token revogado por segurança
    GIST_ID: '75e76a26d9b0c36f602ec356f525680a',
    FILENAME: 'backup_fastcar.json'
};
