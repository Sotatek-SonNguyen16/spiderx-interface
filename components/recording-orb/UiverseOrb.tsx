import React from "react";

import styles from "./RecordingOrb.module.css";

type UiverseOrbProps = {
  size?: number;
};

export function UiverseOrb({ size = 200 }: UiverseOrbProps) {
  return (
    <div
      className={styles.uiverseOrbContainer}
      style={
        {
          "--uiverse-orb-size": `${size}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.uiverseOrb}>
        <div className={styles.uiverseOrbInner} />
        <div className={styles.uiverseOrbInner} />
      </div>
    </div>
  );
}
