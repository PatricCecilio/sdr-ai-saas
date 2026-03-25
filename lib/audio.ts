import OpenAI from "openai";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function extractAudioUrl(body: any) {
  return (
    body?.audio?.audioUrl ||
    body?.audio?.url ||
    body?.message?.audio?.audioUrl ||
    body?.message?.audio?.url ||
    body?.data?.audio?.audioUrl ||
    body?.data?.audio?.url ||
    body?.audioUrl ||
    body?.message?.audioUrl ||
    body?.data?.audioUrl ||
    body?.url ||
    body?.message?.url ||
    body?.data?.url ||
    null
  );
}

export function isAudioMessage(messageType: string, body?: any) {
  if (
    body?.audio ||
    body?.message?.audio ||
    body?.data?.audio ||
    body?.audioUrl ||
    body?.message?.audioUrl ||
    body?.data?.audioUrl
  ) {
    return true;
  }

  const normalized = String(messageType || "").toLowerCase();

  return [
    "audio",
    "ptt",
    "voice",
    "voicemessage",
    "audiomessage",
  ].includes(normalized);
}

function detectExtensionFromUrl(audioUrl: string) {
  const cleanUrl = String(audioUrl || "").split("?")[0].toLowerCase();

  if (cleanUrl.endsWith(".mp3")) return "mp3";
  if (cleanUrl.endsWith(".mp4")) return "mp4";
  if (cleanUrl.endsWith(".mpeg")) return "mpeg";
  if (cleanUrl.endsWith(".mpga")) return "mpga";
  if (cleanUrl.endsWith(".m4a")) return "m4a";
  if (cleanUrl.endsWith(".wav")) return "wav";
  if (cleanUrl.endsWith(".webm")) return "webm";
  if (cleanUrl.endsWith(".ogg")) return "ogg";

  return "ogg";
}

export async function transcribeAudioFromUrl(audioUrl: string) {
  if (!audioUrl) {
    throw new Error("URL do áudio não informada");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada");
  }

  const response = await fetch(audioUrl);

  if (!response.ok) {
    throw new Error(`Falha ao baixar áudio: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!buffer.length) {
    throw new Error("Áudio vazio");
  }

  const extension = detectExtensionFromUrl(audioUrl);
  const tempFilePath = path.join(
    os.tmpdir(),
    `wa-audio-${Date.now()}.${extension}`
  );

  fs.writeFileSync(tempFilePath, buffer);

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "gpt-4o-mini-transcribe",
    });

    return transcription.text?.trim() || "";
  } finally {
    try {
      fs.unlinkSync(tempFilePath);
    } catch {}
  }
}