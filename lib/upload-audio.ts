import fs from "node:fs";
import { cloudinary } from "@/lib/cloudinary";

export async function uploadAudioAndGetPublicUrl(filePath: string) {
  if (!filePath) {
    throw new Error("Caminho do arquivo não informado");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error("Arquivo de áudio não encontrado");
  }

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "auto",
    folder: "mini-crm/tts-audios",
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary não retornou URL pública");
  }

  return result.secure_url;
}