const admin = require('firebase-admin');

// 🔐 Отримуємо ключ із змінної середовища
const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJSON) {
    console.error("❌ Змінна FIREBASE_SERVICE_ACCOUNT не задана в середовищі");
    throw new Error("FIREBASE_SERVICE_ACCOUNT is missing");
}

let serviceAccount;

try {
    serviceAccount = JSON.parse(serviceAccountJSON);
} catch (error) {
    console.error("❌ Помилка парсингу JSON ключа:", error);
    throw error;
}

// ✅ Ініціалізація Firebase Admin
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase успішно ініціалізовано");
} catch (error) {
    console.error("❌ Помилка ініціалізації Firebase:", error);
    throw error;
}

const db = admin.firestore();
module.exports = { db };
