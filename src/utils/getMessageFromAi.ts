import { OPENAI_API_KEY } from "@/secrets/secrets";

export const getResponseFromAi = async (message: any) => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      message,
      stream: true,
    }),
  });
  return res;
};
