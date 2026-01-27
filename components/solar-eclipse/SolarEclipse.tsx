import React from "react";
import styles from "./SolarEclipse.module.css";
import { BlackCircle } from "./BlackCircle";
import { YellowCircle } from "./YellowCircle";
import { OrangeCircle } from "./OrangeCircle";
import { GradientCircle } from "./GradientCircle";
import { GrainOverlay } from "../effects/GrainOverlay";

export const SolarEclipse = () => {
  return (
    <div className={styles.eclipseContainer}>
      {/* Layering order controlled by Z-Index in CSS, but DOM order matters for default stacking context if z-index is equal.
                CSS Z-Indexes: 
                Black: 10
                Yellow: 9
                Orange: 8
                Gradient: 7
            */}
      <GradientCircle />
      <OrangeCircle />
      <YellowCircle />
      <BlackCircle />
    </div>
  );
};
