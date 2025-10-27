"use client";
import React, { useEffect, useRef } from "react";

const AUDIO_CONFIG = {
  FFT_SIZE: 512,
  SMOOTHING: 0.8,
  MIN_BAR_HEIGHT: 2,
  MIN_BAR_WIDTH: 2,
  BAR_SPACING: 1,
  COLOR: {
    MIN_INTENSITY: 100,
    MAX_INTENSITY: 255,
    INTENISTY_RANGE: 155,
  },
} as const;

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
  onClick: () => void;
}

export default function AudioVisualizer({
  stream,
  isRecording,
  onClick,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanup = () => {
    if (animationFrameRef?.current) {
      cancelAnimationFrame(animationFrameRef?.current);
    }
    if (audioContextRef?.current) {
      audioContextRef?.current?.close();
    }
  };

  useEffect(() => {
    return cleanup();
  }, []);

  useEffect(() => {
    if (stream && isRecording) {
      startVisualization();
    } else {
      cleanup();
    }
  }, [stream, isRecording]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef?.current && containerRef?.current) {
        const container = containerRef?.current;
        const canvas = canvasRef?.current;
        const dpr = window.devicePixelRatio || 1;

        //set canvas size based on container and device pixel ratio

        const rect = container?.getBoundingClientRect();

        //Account for the 2px total margin (1px on each size)
        canvas.width = (rect.width - 2) * dpr;
        canvas.height = (rect.height - 2) * dpr;

        //scale canvas css size to match container minus margins

        canvas.style.width = `${rect.width - 2}px`;
        canvas.style.height = `${rect.height - 2}px`;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startVisualization = async () => {
    try {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = AUDIO_CONFIG.FFT_SIZE;
      analyzer.smoothingTimeConstant = AUDIO_CONFIG.SMOOTHING;
      analyserRef.current = analyzer;

      const source = audioContext.createMediaStreamSource(stream!);
      source.connect(analyzer);

      draw();
    } catch (err) {
      console.error("Error starting visualization:", err);
    }
  };

  const getBarColor = (noramlizedHeight: number) => {
    const intensity =
      Math.floor(noramlizedHeight * AUDIO_CONFIG.COLOR.INTENISTY_RANGE) +
      AUDIO_CONFIG.COLOR.MIN_INTENSITY;

    return `rgb(${intensity}, ${intensity}, ${intensity})`;
  };

  const drawBar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    centerY: number,
    width: number,
    height: number,
    color: string
  ) => {
    ctx.fillStyle = color;

    //Draw upper bar (above center)
    ctx.fillRect(x, centerY - height, width, height);

    //Draw lower bar (below center)
    ctx.fillRect(x, centerY, width, height);
  };

  const draw = () => {
    if (!isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !analyserRef.current) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    const analyzer = analyserRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);

    const drawFrame = () => {
      animationFrameRef.current = requestAnimationFrame(drawFrame);

      //Get Current Frequency data
      analyzer.getByteFrequencyData(frequencyData);

      //clear canvas - use CSS pixels for clearing
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      //calcualte dimensions in CSS pixels
      const barWidth = Math.max(
        AUDIO_CONFIG.MIN_BAR_WIDTH,
        canvas.width / dpr / bufferLength - AUDIO_CONFIG.BAR_SPACING
      );

      const centerY = canvas.height / dpr / 2;
      let x = 0;

      //Draw each frequency bar
      for (let i = 0; i < bufferLength; i++) {
        const noramlizedHeight = frequencyData[i] / 255; //conver to 0-1 range
        const barHeight = Math.max(
          AUDIO_CONFIG.MIN_BAR_HEIGHT,
          noramlizedHeight * centerY
        );

        drawBar(
          ctx,
          x,
          centerY,
          barWidth,
          barHeight,
          getBarColor(noramlizedHeight)
        );
        x += barWidth + AUDIO_CONFIG.BAR_SPACING;
      }
    };

    drawFrame();
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-pointer rounded-lg bg-background/80 backdrop-blur"
      onClick={onClick}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
