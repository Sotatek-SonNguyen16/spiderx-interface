"use client";

import { useEffect, useState } from "react";

import styles from "./RecordingOrb.module.css";
import { RecordingOrb, type RecordingOrbStatus } from "./RecordingOrb";

export function AIRecordingPanel() {
  const [status, setStatus] = useState<RecordingOrbStatus>("idle");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (status !== "recording") return;

    const timer = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  const startRecording = () => {
    setSeconds(0);
    setStatus("recording");
  };

  const stopRecording = () => {
    setStatus("processing");

    window.setTimeout(() => {
      setStatus("idle");
    }, 2200);
  };

  const forceError = () => {
    setStatus("error");
  };

  const reset = () => {
    setSeconds(0);
    setStatus("idle");
  };

  return (
    <div className={styles.panelRoot}>
      <RecordingOrb status={status} seconds={seconds} />

      <div className={styles.panelActions}>
        {status === "idle" && (
          <button className={styles.panelButton} onClick={startRecording} type="button">
            Start recording
          </button>
        )}

        {status === "recording" && (
          <button className={styles.panelButton} onClick={stopRecording} type="button">
            Stop recording
          </button>
        )}

        {status === "processing" && (
          <button className={styles.panelButton} disabled type="button">
            Processing...
          </button>
        )}

        {status !== "recording" && status !== "processing" && (
          <button className={`${styles.panelButton} ${styles.panelDanger}`} onClick={forceError} type="button">
            Simulate error
          </button>
        )}

        <button className={styles.panelButton} onClick={reset} type="button">
          Reset
        </button>
      </div>
    </div>
  );
}
