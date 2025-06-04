require("dotenv").config(); // або: { path: 'etc/secrets/.env' } — тільки якщо ти справді зберігаєш ключі не в корені

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

// 🔐 Ініціалізація Firebase через SERVICE_ACCOUNT_KEY з .env
const serviceAccountJSON = process.env.SERVICE_ACCOUNT_KEY;

if (!serviceAccountJSON) {
    console.error("❌ Змінна середовища SERVICE_ACCOUNT_KEY відсутня!");
    process.exit(1);
}

let serviceAccount;

try {
    // 🔧 FIX: перетворюємо \\n в справжні \n
    serviceAccount = JSON.parse(serviceAccountJSON.replace(/\\n/g, '\n'));

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase успішно ініціалізовано");
} catch (error) {
    console.error("❌ Помилка ініціалізації Firebase:", error);
    process.exit(1);
}

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check
app.get("/", (req, res) => {
    res.send("🎉 Backend is running!");
});

// POST: Додати відгук
app.post("/api/reviews", async (req, res) => {
    const { Gmail, Review, apartmentId } = req.body;

    if (!Gmail || !Review || !apartmentId) {
        return res.status(400).json({ error: "Всі поля обов'язкові" });
    }

    try {
        await db.collection("reviews").add({
            Gmail,
            Review,
            apartmentId,
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ message: "✅ Відгук збережено" });
    } catch (error) {
        console.error("❌ POST /api/reviews error:", error);
        res.status(500).json({ error: "Не вдалося зберегти відгук" });
    }
});

// GET: Отримати відгуки
app.get("/api/reviews", async (req, res) => {
    const { flatId = "", page = 1 } = req.query;
    const pageSize = 10;

    try {
        const query = db
            .collection("reviews")
            .where("apartmentId", "==", flatId)
            .orderBy("createdAt", "desc")
            .offset((page - 1) * pageSize)
            .limit(pageSize);

        const snapshot = await query.get();
        const reviews = snapshot.docs.map((doc) => doc.data());

        res.json(reviews);
    } catch (error) {
        console.error("❌ GET /api/reviews error:", error);
        res.status(500).json({ error: "Помилка отримання відгуків" });
    }
});

// Обробка 404
app.use(/.*/, (req, res) => {
    console.warn(`🚫 Невідомий маршрут: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "Маршрут не знайдено" });
});

// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на порту ${PORT}`);
});
