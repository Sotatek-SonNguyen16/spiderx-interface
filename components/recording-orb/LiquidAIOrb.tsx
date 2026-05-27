import React from "react";

import styles from "./RecordingOrb.module.css";

export type LiquidAIOrbStatus = "idle" | "recording" | "processing";

type LiquidAIOrbProps = {
  status?: LiquidAIOrbStatus;
  size?: number;
};

const statusClassMap: Record<LiquidAIOrbStatus, string> = {
  idle: styles.liquidOrbIdle,
  recording: styles.liquidOrbRecording,
  processing: styles.liquidOrbProcessing,
};

export function LiquidAIOrb({ status = "idle", size = 320 }: LiquidAIOrbProps) {
  return (
    <div
      className={`${styles.liquidOrb} ${statusClassMap[status]}`}
      style={
        {
          "--orb-size": `${size}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.liquidOrbGlow} />
      <div className={styles.liquidOrbCore} />
    </div>
  );
}
