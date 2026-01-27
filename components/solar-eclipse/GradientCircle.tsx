import React from "react";
import styles from "./SolarEclipse.module.css";

export const GradientCircle = () => {
  return (
    <div
      className={`${styles.commonCircle} ${styles.blurEffect} ${styles.gradientCircle}`}
    ></div>
  );
};
