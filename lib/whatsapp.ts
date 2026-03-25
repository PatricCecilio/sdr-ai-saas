type SendWhatsappMessageParams = {
  instanceId: string;
  instanceToken: string;
  clientToken?: string;
  phone: string;
  message: string;
};

export async function sendWhatsappMessage({
  instanceId,
  instanceToken,
  clientToken,
  phone,
  message,
}: SendWhatsappMessageParams) {
  const url = `https://api.z-api.io/instances/${instanceId}/token/${instanceToken}/send-text`;

  const resolvedClientToken = clientToken || process.env.ZAPI_CLIENT_TOKEN;

  if (!resolvedClientToken) {
    console.error("❌ ERRO CRÍTICO: Client-Token não configurado");
    return { ok: false, error: "Falta Client-Token" };
  }

  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const cleanMessage = String(message || "").trim();

  if (!instanceId || !instanceToken) {
    console.error("❌ ERRO: instanceId ou instanceToken ausente");
    return { ok: false, error: "instanceId ou instanceToken ausente" };
  }

  if (!cleanPhone) {
    console.error("❌ ERRO: telefone inválido");
    return { ok: false, error: "Telefone inválido" };
  }

  if (!cleanMessage) {
    console.error("❌ ERRO: mensagem vazia");
    return { ok: false, error: "Mensagem vazia" };
  }

  try {
    console.log("📤 Enviando mensagem para Z-API...", {
      instanceId,
      phone: cleanPhone,
      hasInstanceToken: Boolean(instanceToken),
      hasClientToken: Boolean(resolvedClientToken),
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Token": resolvedClientToken,
      },
      body: JSON.stringify({
        phone: cleanPhone,
        message: cleanMessage,
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      console.error("⚠️ Erro da Z-API ao enviar:", {
        status: response.status,
        data,
      });

      return {
        ok: false,
        status: response.status,
        error:
          typeof data === "object" && data !== null
            ? data.message || data.error || "Erro na Z-API"
            : "Erro na Z-API",
        data,
      };
    }

    console.log("✅ Mensagem enviada com sucesso!", data);

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error: any) {
    console.error("🚨 Falha total na comunicação com Z-API:", error?.message);

    return {
      ok: false,
      error: error?.message || "Erro inesperado ao enviar mensagem",
    };
  }
}