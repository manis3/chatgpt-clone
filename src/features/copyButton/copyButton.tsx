import CopyButton from "@/components/ui/copyButton/copyButton";
import React from "react";

export default function CopyButtonDemo() {
  return (
    <CopyButton
      content="Text to be copied"
      copyMessage="Copied to clipboard!"
    />
  );
}
