const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// 🔍 Повний шлях до ключа
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// 🔐 Перевіряємо, чи існує файл
if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ serviceAccountKey.json не знайдено! Перевір шлях.");
    throw new Error("serviceAccountKey.json is missing");
}

let serviceAccount;

try {
    // 🧾 Імпортуємо JSON з ключем
    serviceAccount = require(serviceAccountPath);
} catch (error) {
    console.error("❌ Помилка при читанні serviceAccountKey.json:", error);
    throw error;
}

// ✅ Ініціалізація Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase успішно ініціалізовано");
} catch (error) {
    console.error("❌ Помилка ініціалізації Firebase:", error);
    throw error;
}

// 🛠️ Експортуємо Firestore
const db = admin.firestore();
module.exports = { db };
