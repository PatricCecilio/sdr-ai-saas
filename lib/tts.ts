import OpenAI from "openai";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSpeechFromText(text: string) {
  const cleanText = String(text || "").trim();

  if (!cleanText) {
    throw new Error("Texto vazio para gerar áudio");
  }

  const speechText = cleanText
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\bvocê\b/gi, "tu")
    .replace(/\bpara você\b/gi, "pra ti")
    .replace(/\bestá\b/gi, "tá")
    .replace(/:\s/g, ". ")
    .replace(/;\s/g, ". ")
    .replace(/[“”"]/g, "");

  const outputPath = path.join(os.tmpdir(), `tts-${Date.now()}.mp3`);

  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "nova",
    input: speechText,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
}