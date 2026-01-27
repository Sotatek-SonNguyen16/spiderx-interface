import React from "react";
import styles from "./SolarEclipse.module.css";

export const YellowCircle = () => {
  return (
    <div
      className={`${styles.commonCircle} ${styles.blurEffect} ${styles.yellowCircle}`}
    ></div>
  );
};
