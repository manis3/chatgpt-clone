'use client'
import useChat from "@/hooks/chat/useChat";
import React from "react";

export default function ChatComponent() {
  const {
    sendMessage,
    message,
    setMessage,
    input,
    setInput,
    listRef,
    streaming,
    setStreaming,
  } = useChat();
  return (
    <div className="max-w-3xl mx-auto p-6 h-[80vh] flex flex-col">
      <div ref={listRef} className="flex-1 overflow-auto space-y-4 mb-4">
        {message?.map((m: any) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justifyend" : "justify-start"
            }`}
          >
            <div
              className={`${
                m.role === "user" ? "bg-blue-600 text-white" : "bg-white border"
              } max-w-[80%] p-3 rounded-lg`}
            >
              {m.content || (m?.role === "assistant" && streaming ? "..." : "")}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={streaming}
        />
        <button
          type="submit"
          disabled={streaming}
          className="bg-blue-600 textwhite px-4 py-2 rounded"
        >
          {streaming ? "Streaming..." : "Send"}
        </button>
      </form>
    </div>
  );
}
