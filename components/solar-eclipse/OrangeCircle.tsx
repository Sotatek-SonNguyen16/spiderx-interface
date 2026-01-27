import React from "react";
import styles from "./SolarEclipse.module.css";

export const OrangeCircle = () => {
  return (
    <div
      className={`${styles.commonCircle} ${styles.blurEffect} ${styles.orangeCircle}`}
    ></div>
  );
};
