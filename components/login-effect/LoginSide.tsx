import React from "react";
import styles from "./LoginSide.module.css";

export const LoginSide = () => {
  return (
    <div className={styles.loginSideContainer}>
      {/* 
               Layer 1: Dark (#0f1716)
               Layer 2: Teal (#3eb28f)
               Layer 3: Light (#caf0e5)
               
               Constructed to visually display Dark (top) -> Teal -> Light (bottom)
            */}
      <div className={`${styles.blob} ${styles.blobDark}`}></div>
      <div className={`${styles.blob} ${styles.blobTeal}`}></div>
      <div className={`${styles.blob} ${styles.blobLight}`}></div>
    </div>
  );
};
