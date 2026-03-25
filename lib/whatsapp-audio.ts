type SendWhatsappAudioParams = {
  instanceId: string;
  instanceToken: string;
  clientToken?: string;
  phone: string;
  audioUrl: string;
};

export async function sendWhatsappAudio({
  instanceId,
  instanceToken,
  clientToken,
  phone,
  audioUrl,
}: SendWhatsappAudioParams) {
  const resolvedClientToken = clientToken || process.env.ZAPI_CLIENT_TOKEN;

  if (!resolvedClientToken) {
    return { ok: false, error: "Falta Client-Token" };
  }

  const url = `https://api.z-api.io/instances/${instanceId}/token/${instanceToken}/send-audio`;
  const cleanPhone = String(phone || "").replace(/\D/g, "");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Token": resolvedClientToken,
    },
    body: JSON.stringify({
      phone: cleanPhone,
      audio: audioUrl,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: data?.message || "Erro ao enviar áudio",
      data,
    };
  }

  return {
    ok: true,
    status: response.status,
    data,
  };
}