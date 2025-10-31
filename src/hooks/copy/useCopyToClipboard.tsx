import { Flag } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

type useCopyToClipboardProps = {
  text: string;
  copyMessage?: string;
};
export default function useCopyToClipboard({
  text,
  copyMessage = "Copied to clipboard",
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(copyMessage);
        setIsCopied(true);
        if (timeOutRef.current) {
          clearTimeout(timeOutRef.current);
          timeOutRef.current = null;
        }
        timeOutRef.current = setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        alert("Failed to copy to clipboard");
      });
  }, [text, copyMessage]);

  return { isCopied, handleCopy };
}
