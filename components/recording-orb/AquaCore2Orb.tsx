import React from "react";

import styles from "./RecordingOrb.module.css";

export type AquaCore2OrbStatus = "idle" | "recording";

type AquaCore2OrbProps = {
  status?: AquaCore2OrbStatus;
  size?: number;
};

const statusClassMap: Record<AquaCore2OrbStatus, string> = {
  idle: styles.aquaCore2Idle,
  recording: styles.aquaCore2Recording,
};

export function AquaCore2Orb({ status = "idle", size = 230 }: AquaCore2OrbProps) {
  return (
    <div
      className={`${styles.aquaCore2Container} ${statusClassMap[status]}`}
      style={
        {
          "--aqua-core-2-size": `${size}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.aquaCore2Clip}>
        <div className={styles.aquaCore2Orb}>
          <div className={styles.aquaCore2Inner} />
          <div className={styles.aquaCore2Inner} />
          <div className={styles.aquaCore2Inner} />
        </div>
      </div>
    </div>
  );
}
