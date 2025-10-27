import AudioVisualizer from "@/components/ui/audioVisualizer/audioVisualizer";
import React from "react";

export default function ShadCnChat() {
  return (
    <div>
      <AudioVisualizer
        stream={audioStream}
        isRecording={isRecording}
        onClick={stopRecording}
      />
    </div>
  );
}
