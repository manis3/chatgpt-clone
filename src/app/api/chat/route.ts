import { NextRequest } from "next/server";
import { API_MODE, OPENAI_API_KEY } from "@/secrets/secrets";
import { getResponseFromAi } from "@/utils/getMessageFromAi";
import { streamFromterator } from "@/utils/stream-utils";

async function* mockResponseGenerator(prompt: string) {
  const reply = `This is a mock streaming response for: ${prompt}\n\n`;
  const tokens = reply.split(/(\s+)/);
  for (const t of tokens) {
    yield t;
    await new Promise((r) => setTimeout(r, 60));
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message } = body || {};
  const prompt = message?.map((m: any) => m.content).join("\n") || "";

  // ✅ REAL MODE: OpenRouter Streaming
  if (API_MODE === "openai") {
    const res = await getResponseFromAi(message);
    if (!res.body) {
      return new Response("No response body", { status: 500 });
    }

    // Create a clean streaming transformer
    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);

            // Split SSE lines and extract JSON
            const lines = chunk.split("\n").filter((line) => line.trim().startsWith("data:"));
            for (const line of lines) {
              const jsonStr = line.replace(/^data:\s*/, "").trim();
              if (jsonStr === "[DONE]") continue;

              try {
                const json = JSON.parse(jsonStr);
                const delta = json?.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(new TextEncoder().encode(delta));
                }
              } catch (err) {
                console.warn("Could not parse chunk:", jsonStr);
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 🧪 MOCK MODE
  const iterator = mockResponseGenerator(prompt);
  const stream = streamFromterator(iterator);
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
