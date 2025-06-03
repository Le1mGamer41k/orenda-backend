const express = require("express");
const cors = require("cors");
const { db } = require("./firebase");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check (важливо для Render!)
app.get("/", (req, res) => {
    res.send("🎉 Backend is running!");
});

// GET: отримання відгуків з пагінацією
app.get("/api/reviews", async (req, res) => {
    const { flatId = "", page = 1 } = req.query;
    const pageSize = 10;

    try {
        const snapshot = await db
            .collection("reviews")
            .where("apartmentId", "==", flatId)
            .orderBy("createdAt", "desc")
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .get();

        const reviews = snapshot.docs.map((doc) => doc.data());
        res.json(reviews);
    } catch (error) {
        console.error("❌ GET /api/reviews error:", error.message);
        res.status(500).json({ error: "Помилка отримання відгуків" });
    }
});

// POST: додавання нового відгуку
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
        console.error("❌ POST /api/reviews error:", error.message);
        res.status(500).json({ error: "Не вдалося зберегти відгук" });
    }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на порту ${PORT}`);
});
