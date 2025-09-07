import * as functions from 'firebase-functions';
import { GoogleGenAI } from "@google/genai";
import express from 'express';
import cors from 'cors';

const ai = new GoogleGenAI({
    apiKey: functions.config().gemini.api_key!,
});

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.post('/feedback', async (req, res) => {
    try {
        const { score, note, game } = req.body;

        if (!score || !game) {
            return res.status(400).json({ error: "Skor dan nama game wajib diisi." });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                role: "user",
                parts: [{
                    text: `Game: ${game}
                    Skor: ${score}/100
                    Catatan siswa: ${note}
                    Beri feedback singkat, positif, dan edukatif untuk siswa.`,
                }],
            }],
        });

        const feedback = response.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada feedback.";

        return res.status(200).json({ feedback });
    } catch (err) {
        console.error("Gemini API error:", err);
        return res.status(500).json({ error: "Gagal membuat feedback AI" });
    }
});

export const feedbackApi = functions.https.onRequest(app);