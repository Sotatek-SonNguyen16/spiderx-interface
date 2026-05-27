import React from "react";

import styles from "./RecordingOrb.module.css";

export type RecordingOrbStatus = "idle" | "recording" | "processing" | "error";
export type RecordingOrbVariant = "aqua" | "aurora" | "ember" | "prism" | "void";

type RecordingOrbProps = {
  status?: RecordingOrbStatus;
  seconds?: number;
  size?: number;
  variant?: RecordingOrbVariant;
};

const statusClassMap: Record<RecordingOrbStatus, string> = {
  idle: styles.isIdle,
  recording: styles.isRecording,
  processing: styles.isProcessing,
  error: styles.isError,
};

const variantClassMap: Record<RecordingOrbVariant, string> = {
  aqua: styles.variantAqua,
  aurora: styles.variantAurora,
  ember: styles.variantEmber,
  prism: styles.variantPrism,
  void: styles.variantVoid,
};

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export function RecordingOrb({
  status = "idle",
  seconds = 0,
  size = 180,
  variant = "aqua",
}: RecordingOrbProps) {
  const statusText = {
    idle: "Ready to record",
    recording: "Recording...",
    processing: "AI is analyzing...",
    error: "Recording failed",
  }[status];

  return (
    <div className={styles.recordingOrbWrapper}>
      <div
        className={`${styles.recordingOrb} ${statusClassMap[status]} ${variantClassMap[variant]}`}
        style={
          {
            "--orb-size": `${size}px`,
          } as React.CSSProperties
        }
      >
        <div className={`${styles.recordingOrbHalo} ${styles.recordingOrbHaloOne}`} />
        <div className={`${styles.recordingOrbHalo} ${styles.recordingOrbHaloTwo}`} />

        <div className={styles.recordingOrbCore}>
          <div className={styles.recordingOrbShine} />
          <div className={styles.recordingOrbInnerGlow} />
        </div>
      </div>

      <div className={styles.recordingOrbInfo}>
        <div className={styles.recordingOrbStatus}>{statusText}</div>

        {status === "recording" && (
          <div className={styles.recordingOrbTime}>{formatTime(seconds)}</div>
        )}

        {status === "idle" && (
          <div className={styles.recordingOrbCaption}>
            Tap the button to start recording
          </div>
        )}

        {status === "processing" && (
          <div className={styles.recordingOrbCaption}>
            Please wait while AI processes your audio
          </div>
        )}
      </div>
    </div>
  );
}
