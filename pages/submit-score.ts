import type { NextApiRequest, NextApiResponse } from "next";
import { collection, addDoc } from "firebase/firestore";
import { GoogleGenAI } from "@google/genai"; 
import { db } from "../src/lib/firebase";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { score, note, game, screenshotUrl } = req.body;

    await addDoc(collection(db, "scores"), {
      score,
      note,
      game,
      screenshotUrl: screenshotUrl || null,
      createdAt: new Date(),
    });

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Seorang siswa memainkan game "${game}" dan mendapat skor ${score}/1000.\nCatatan siswa: ${note || "Tidak ada catatan"}.\nBerikan feedback singkat yang memotivasi dan edukatif.`,
    });

    const feedback = response.text; 
    return res.status(200).json({ feedback });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Gagal menghasilkan feedback AI." });
  }
}
