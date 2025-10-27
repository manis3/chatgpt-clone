"use client";

import AudioVisualizer from "@/components/ui/audioVisualizer/audioVisualizer";
import React from "react";
import useAudioVisualizer from "./hooks/useAudioVisualizer";

export function ShadCnChat() {
  const { audioStream, isRecording, startRecording, stopRecording } =
    useAudioVisualizer();
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <p className="font-bold text-xl ">Start Recording Audio</p>
      <div>
        <AudioVisualizer
          stream={audioStream}
          isRecording={isRecording}
          onClick={stopRecording}
        />
      </div>
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
        >
          Stop Recording
        </button>
      )}
    </div>
  );
}
