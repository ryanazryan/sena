import * as functions from "firebase-functions";
import { auth } from "firebase-functions/v1";
import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const ai = new GoogleGenAI({
    apiKey: functions.config().gemini.api_key!,
});

const app = express();

const corsOptions = {
    origin: "https://senaeducation.com", 
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.post('/feedback', async (req, res) => {
    try {
        const { score, note, game, level, teacherNote } = req.body;

        if (!score || !game) {
            return res.status(400).json({ error: "Skor dan nama game wajib diisi." });
        }

        const prompt = `
            Seorang siswa telah menyelesaikan sebuah game edukasi.
            Nama Game: "${game}"
            Level: ${level || 'Tidak ditentukan'}
            Skor yang diberikan guru: ${score}/10
            Catatan dari siswa: "${note || 'Tidak ada.'}"
            Catatan dari guru: "${teacherNote || 'Tidak ada.'}"

            Tugas Anda adalah memberikan feedback yang singkat, positif, dan edukatif untuk siswa dalam Bahasa Indonesia.
            Struktur feedback harus sebagai berikut:
            1.  **Apresiasi:** Berikan pujian atas usaha dan skor yang dicapai.
            2.  **Analisis Singkat:** Berikan komentar singkat tentang apa arti skor tersebut.
            3.  **Saran Konstruktif:** Berikan satu atau dua saran konkret yang dapat membantu siswa untuk lebih baik lagi.
            4.  **Motivasi:** Akhiri dengan kalimat penyemangat.

            Pastikan bahasa yang digunakan ramah dan memotivasi untuk siswa SMP.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                role: "user",
                parts: [{
                    text: prompt,
                }],
            }],
        });

        const feedback = response.candidates?.[0]?.content?.parts?.[0]?.text || "Luar biasa! Terus tingkatkan prestasimu.";

        const cleanedFeedback = feedback.replace(/(\*|_|#)/g, '');

        return res.status(200).json({ feedback: cleanedFeedback });
    } catch (err) {
        console.error("Gemini API error:", err);
        return res.status(500).json({ error: "Gagal membuat feedback AI. Silakan coba lagi nanti." });
    }
});

export const cleanupUserOnDelete = auth.user().onDelete(async (user) => {
    functions.logger.log('Memulai proses cleanup untuk user:', user.uid);

    const batch = db.batch();

    const userProfileRef = db.collection('users').doc(user.uid);
    batch.delete(userProfileRef);

    const submissionsRef = db.collection('gameSubmissions').where('userId', '==', user.uid);

    try {
        const snapshot = await submissionsRef.get();
        if (!snapshot.empty) {
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
        }

        await batch.commit();
        functions.logger.log('Semua data (profil dan submissions) berhasil dihapus untuk user:', user.uid);

    } catch (error) {
        functions.logger.error('Gagal menghapus data untuk user:', user.uid, error);
    }
});

export const feedbackApi = functions.https.onRequest(app);