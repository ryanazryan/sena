import * as functions from 'firebase-functions';
import { auth } from 'firebase-functions/v1';
import { GoogleGenAI } from "@google/genai";
import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';

// Inisialisasi Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

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

// Cloud Function yang akan terpicu saat pengguna dihapus
export const cleanupUserOnDelete = auth.user().onDelete(async (user) => {
    functions.logger.log('Menghapus data untuk user:', user.uid);

    const batch = db.batch();
    const submissionsRef = db.collection('gameSubmissions').where('userId', '==', user.uid);

    try {
        const snapshot = await submissionsRef.get();
        if (snapshot.empty) {
            functions.logger.log('Tidak ada data submissions ditemukan untuk user:', user.uid);
            return;
        }

        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        functions.logger.log('Semua data submissions berhasil dihapus untuk user:', user.uid);

    } catch (error) {
        functions.logger.error('Gagal menghapus data submissions untuk user:', user.uid, error);
    }
});

export const feedbackApi = functions.https.onRequest(app);