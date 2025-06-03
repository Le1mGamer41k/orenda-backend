const admin = require('firebase-admin');

const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJSON) {
    throw new Error("❌ FIREBASE_SERVICE_ACCOUNT не задано у середовищі.");
}

const serviceAccount = JSON.parse(serviceAccountJSON);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = { db };
