import React, { useRef, useState } from "react";

export default function useAudioVisualizer() {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  //start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Recorded Audio Url:", audioUrl);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error Accessing microphone:", err);
    }
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    audioStream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setAudioStream(null);
  };

  return {
    startRecording,
    stopRecording,
    audioStream,
    isRecording,
  };
}
