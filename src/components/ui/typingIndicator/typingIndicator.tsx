import { Dot } from "lucide-react";
import React from "react";

export default function TypingIndicator() {
  return (
    <div className="justify-left flex space-x-1">
      <div className="rounded-lg bg-muted p-3">
        <div className="flex -space-x-2.5">
          <Dot className="h-5 w-5 animate-typing-dot-bounce" />
          <Dot className="h-5 w-5 animate-typing-dot-bounce" />
          <Dot className="h-5 w-5 animate-typing-dot-bounce " />
        </div>
      </div>
    </div>
  );
}
