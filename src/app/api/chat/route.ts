import { NextRequest, NextResponse } from "next/server";
import { API_MODE, OPENAI_API_KEY } from "@/secrets/secrets";
import { getResponseFromAi } from "@/utils/getMessageFromAi";
import { streamFromterator } from "@/utils/stream-utils";

// NOTE: function* = Generator Function for streaming.
// You can yield data, and next() the iterator to get new chunks.
async function* mockResponseGenerator(prompt: string) {
  const reply =
    `This is a mock streaming response for: ${prompt}\n\n` +
    "We stream this back token by token to simulate real-time output.\n";
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

  if (API_MODE === "openai") {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Invalid OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // Call OpenAI with streaming: this shows a simple fetch proxy. Depending on the OpenAI API you target,
    // you might need to adjust headers and parsing. We forward the stream directly to the client.
    const openAiRes = await getResponseFromAi(message);

    if (!openAiRes?.body) {
      return NextResponse.json(
        { error: "No body from provider" },
        { status: 500 }
      );
    }

    // Return OpenAI stream directly
    return new Response(openAiRes.body, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Otherwise, fallback to mock streaming mode
  const iterator = mockResponseGenerator(prompt);
  const stream = streamFromterator(iterator);

  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
