import { OPENAI_API_KEY } from "@/secrets/secrets";

export const getResponseFromAi = async (messages: any) => {
  const validRoles = ["system", "user", "assistant"];

  const cleanedMessages = messages
    .map(({ ...msg }) => ({
      ...msg,
      role: msg.role?.toLowerCase(),
    }))
    .filter(({ ...msg }) => validRoles.includes(msg.role));

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1:free",
      messages: cleanedMessages,
      stream: true, // ✅ enables chunked response
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API error: ${errText}`);
  }

  return res;
};
