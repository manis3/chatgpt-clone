import React from "react";
import { Button } from "../Button/default";
import { Check, Copy } from "lucide-react";
import { cn } from "@/utils/cn";
import useCopyToClipboard from "@/hooks/copy/useCopyToClipboard";

type CopyButtonProps = {
  content: string;
  copyMessage?: string;
};

export default function CopyButton({ content, copyMessage }: CopyButtonProps) {
  const { isCopied, handleCopy } = useCopyToClipboard({
    text: content,
    copyMessage,
  });
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className="relative h-6 w-6"
      aria-label="Copy to clipboard"
      onClick={handleCopy}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Check
          className={cn("h-4 w-4 transition-transform ease-in-out", {
            "scale-100": isCopied,
            "scale-0": !isCopied,
          })}
        />
      </div>
      <Copy
        className={cn("h-4 w-4 transition-transform ease-in-out", {
          "scale-0": isCopied,
          "scale-100": !isCopied,
        })}
      />
    </Button>
  );
}
