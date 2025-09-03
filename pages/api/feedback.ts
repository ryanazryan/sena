import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { score, note, game } = await req.json();

    if (!score || !game) {
      return NextResponse.json(
        { error: "Skor dan nama game wajib diisi." },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Game: ${game}
              Skor: ${score}/100
              Catatan siswa: ${note}
              Beri feedback singkat, positif, dan edukatif untuk siswa.`,
            },
          ],
        },
      ],
    });

    const feedback =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Tidak ada feedback.";

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Gagal membuat feedback AI" },
      { status: 500 }
    );
  }
}
