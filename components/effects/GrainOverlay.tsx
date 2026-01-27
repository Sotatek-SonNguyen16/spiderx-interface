import React from "react";
import styles from "./GrainOverlay.module.css";

export const GrainOverlay = () => {
  return (
    <div className={styles.grainContainer}>
      <svg className={styles.noiseSvg} xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        {/* 
                   Use a rect to fill the space and apply the filter.
                   Using the filter directly on the rect.
                */}
        <rect
          width="100%"
          height="100%"
          filter="url(#noiseFilter)"
          opacity="1"
        />
      </svg>
    </div>
  );
};
