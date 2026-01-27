import React from "react";
import styles from "./GlowMobile.module.css";

export const GlowMobile = () => {
  return (
    <div className={styles.mobileContainer}>
      {/* Large Solid Circle */}
      <div className={styles.largeCircle}></div>

      {/* Two Small Circles */}
      <div className={styles.smallCirclesGroup}>
        <div className={`${styles.smallCircle} ${styles.circle1}`}></div>
        <div className={`${styles.smallCircle} ${styles.circle2}`}></div>
      </div>

      {/* <div className={styles.content}>
        <h1 className={styles.title}>
          Partner with
          <br />
          Excellence
        </h1>
        <p className={styles.subtitle}>
          Experience the warmth of dedicated partnership and cutting-edge
          solutions.
        </p>
        <div className={styles.button}>Get Started</div>
      </div> */}
    </div>
  );
};
