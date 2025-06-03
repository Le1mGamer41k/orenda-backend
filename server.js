const express = require("express");
const cors = require("cors");
const { db } = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/reviews", async (req, res) => {
    const { flatId = "", page = 1 } = req.query;
    const pageSize = 10;

    try {
        const snapshot = await db.collection("reviews")
            .where("apartmentId", "==", flatId)
            .orderBy("createdAt", "desc")
            .offset((page - 1) * pageSize)
            .limit(pageSize)
            .get();

        const reviews = snapshot.docs.map(doc => doc.data());
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Помилка отримання відгуків" });
    }
});

app.post("/api/reviews", async (req, res) => {
    const { Gmail, Review, apartmentId } = req.body;
    try {
        await db.collection("reviews").add({
            Gmail,
            Review,
            apartmentId,
            createdAt: new Date().toISOString()
        });
        res.status(201).json({ message: "Відгук збережено" });
    } catch (error) {
        res.status(500).json({ error: "Не вдалося зберегти відгук" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на порту ${PORT}`);
});
