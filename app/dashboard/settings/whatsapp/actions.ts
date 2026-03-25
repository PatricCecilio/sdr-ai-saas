"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function normalize(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text.length ? text : null;
}

export async function saveCompanySettings(formData: FormData) {
  const connectionId = String(formData.get("connectionId") || "").trim();

  if (!connectionId) {
    throw new Error("connectionId não encontrado ao salvar as configurações.");
  }

  await prisma.whatsappConnection.update({
    where: { id: connectionId },
    data: {
      companyName: normalize(formData.get("companyName")),
      companySegment: normalize(formData.get("companySegment")),
      companyCity: normalize(formData.get("companyCity")),
      companyWebsite: normalize(formData.get("companyWebsite")),
      companyInstagram: normalize(formData.get("companyInstagram")),
      companyDescription: normalize(formData.get("companyDescription")),
      companyServices: normalize(formData.get("companyServices")),
      companyDifferentials: normalize(formData.get("companyDifferentials")),
      companyToneOfVoice: normalize(formData.get("companyToneOfVoice")),
      companyInstructions: normalize(formData.get("companyInstructions")),
    },
  });

  redirect("/dashboard/settings/whatsapp?saved=1");
}