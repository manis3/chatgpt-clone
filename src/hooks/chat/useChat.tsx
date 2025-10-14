'use client'
import React, { useEffect, useRef, useState } from "react";

type Message = { id: string; role: "user" | "assistent"; content: string };
export default function useChat() {
  const [message, setMessage] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef?.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [message]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: input,
    };
    setMessage((m) => [...m, userMessage]);
    setInput("");

    const assistentId = String(Date.now() + 1);
    const assistentMessage: Message = {
      id: assistentId,
      role: "assistent",
      content: "",
    };
    setMessage((m) => [...m, assistentMessage]);

    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: [...message, userMessage] }),
      });

      if (!res.body) throw new Error("Np response body");

      const reader = res?.body?.getReader();
      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = !doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          setMessage((cur) =>
            cur.map((m) =>
              m.id === assistentId ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      }
    } catch (err) {
      setMessage((m) =>
        m.map((msg) =>
          msg.id === assistentId
            ? { ...msg, content: "[Error receiving response]" }
            : msg
        )
      );
    } finally {
      setStreaming(false);
    }
  };

  return {
    sendMessage,
    message,
    setMessage,
    input,
    setInput,
    streaming,
    setStreaming,
    listRef,
  };
}
