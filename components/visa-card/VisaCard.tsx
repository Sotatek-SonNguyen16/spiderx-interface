import React from "react";
import styles from "./VisaCard.module.css";
import { GrainOverlay } from "@/components/effects/GrainOverlay";

const ContactlessIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M13.5 15C15.1569 15 16.5 13.6569 16.5 12C16.5 10.3431 15.1569 9 13.5 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 12H15.01"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const VisaLogo = () => (
  <div style={{ position: "relative", width: "50px", height: "30px" }}>
    <svg viewBox="0 0 100 32" style={{ width: "100%", height: "100%" }}>
      <text
        x="0"
        y="24"
        fill="white"
        fontFamily="sans-serif"
        fontStyle="italic"
        fontWeight="bold"
        fontSize="30"
      >
        VISA
      </text>
    </svg>
  </div>
);

const MastercardLogo = () => (
  <div style={{ display: "flex", position: "relative" }}>
    <div
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.5)",
        marginRight: "-15px",
      }}
    ></div>
    <div
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.8)",
      }}
    ></div>
  </div>
);

export const VisaCard = () => {
  return (
    <div className={styles.cardContainer}>
      {/* Background Layer with Circles and Blur */}
      <div className={styles.background}>
        <div className={styles.blurContext}>
          <div className={`${styles.circle} ${styles.circleTop}`}></div>
          <div className={`${styles.circle} ${styles.circleBottom}`}></div>
        </div>
        <GrainOverlay />
      </div>

      {/* Content Layer */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.chip}></div>
          <div className={styles.contactless}>
            <ContactlessIcon />
          </div>
        </div>

        <div className={styles.cardNumber}>1234 5678 9000 0000</div>

        <div className={styles.footer}>
          <div className={styles.cardInfo}>
            <div className={styles.cardName}>JOY LAROY</div>
            <div className={styles.cardDate}>12/24</div>
          </div>
          {/* User asked for Visa, but image had Mastercard. I'll provide standard circles often seen on these glassmorphism cards */}
          <MastercardLogo />
        </div>
      </div>
    </div>
  );
};
