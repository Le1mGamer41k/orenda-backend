const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Отримуємо абсолютний шлях до ключа
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Перевірка на існування ключа
if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("❌ Файл serviceAccountKey.json не знайдено в каталозі сервера.");
}

// Завантажуємо ключ
const serviceAccount = require(serviceAccountPath);

// Ініціалізація Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Експорт Firestore
const db = admin.firestore();
module.exports = { db };
