"use client";

import React, { useState } from "react";
import { ParallaxProvider, useParallax } from "react-scroll-parallax";
import styles from "./ParallaxWing.module.css";

// Inner component to use the parallax hooks (must be inside Provider)
const Scene = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle Mouse Move specific to this container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate position relative to center of the box (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 }); // Reset on leave
  };

  // Scroll Parallax Configurations
  const deepCloudParallax = useParallax<HTMLDivElement>({
    speed: -2, // Very slow background
  });

  const cloudParallax = useParallax<HTMLDivElement>({
    speed: -0, // Subtle vertical parallax
  });

  const midCloudParallax = useParallax<HTMLDivElement>({
    speed: -7, // Slightly faster than background
  });

  const nearCloudParallax = useParallax<HTMLDivElement>({
    speed: -9, // Catching up to wing area
  });

  const wingParallax = useParallax<HTMLDivElement>({
    speed: 5,
  });

  const frontCloudParallax = useParallax<HTMLDivElement>({
    speed: 15, // Extremely fast foreground
  });

  return (
    <div
      className={styles.sceneContainer}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.sunlightOverlay}></div>

      {/* Deep Background: Cloud */}
      <div
        ref={deepCloudParallax.ref}
        className={`${styles.parallaxLayer} ${styles.deepCloudLayer}`}
      >
        <div
          style={{
            transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 5}px)`,
            transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <img
            src="/images/cloud.png"
            alt="Deep Cloud"
            className={styles.cloudImg}
          />
        </div>
      </div>

      {/* Background: Cloud */}
      <div
        ref={cloudParallax.ref}
        className={`${styles.parallaxLayer} ${styles.cloudLayer}`}
      >
        <div
          style={{
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 15}px) scale(1.1)`,
            transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Using standard img tag as per user specific file requests.
                        In Next.js Image component is better but standard img works for local assets if public. */}
          <img
            src="/images/cloud.png"
            alt="Cloud Background"
            className={styles.cloudImg}
          />
        </div>
      </div>

      {/* Mid Layer: Cloud (New Image) */}
      <div
        ref={midCloudParallax.ref}
        className={`${styles.parallaxLayer} ${styles.midCloudLayer}`}
      >
        <div
          style={{
            transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 5}px)`,
            transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <img
            src="/images/cloud-removebg-preview.png"
            alt="Mid Cloud"
            className={styles.cloudImg}
          />
        </div>
      </div>

      {/* Near Layer: Cloud */}
      <div
        ref={nearCloudParallax.ref}
        className={`${styles.parallaxLayer} ${styles.nearCloudLayer}`}
      >
        <div
          style={{
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 8}px)`,
            transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <img
            src="/images/cloud-removebg-preview.png"
            alt="Near Cloud"
            className={styles.cloudImg}
          />
        </div>
      </div>

      {/* Atmosphere/Mist Transition Layer */}
      <div className={styles.mistLayer}></div>

      {/* Foreground: Wing */}
      <div
        ref={wingParallax.ref}
        className={`${styles.parallaxLayer} ${styles.wingLayer}`}
      >
        <div
          style={{
            transform: `translate(${mousePos.x * -50}px, ${mousePos.y * -25}px)`,
            transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <img
            src="/images/wing.png"
            alt="Wing Foreground"
            className={styles.wingImg}
          />
        </div>
      </div>

      {/* Front Layer: Cloud (New Image) */}
      <div
        ref={frontCloudParallax.ref}
        className={`${styles.parallaxLayer} ${styles.frontCloudLayer}`}
      >
        <div
          style={{
            transform: `translate(${mousePos.x * -80}px, ${mousePos.y * -40}px)`,
            transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <img
            src="/images/cloud-removebg-preview.png"
            alt="Front Cloud"
            className={styles.cloudImg}
          />
        </div>
      </div>

      {/* Overlays for "Window" Effect */}
      <div className={styles.gradientOverlay}></div>
      <div className={styles.blurOverlay}></div>

      {/* Flight Information Content */}
      <div className={styles.flightContent}>
        <div className={styles.routeRow}>
          <div className={styles.airportCode}>ISB</div>
          <div className={styles.flightIcon}>✈</div>
          <div className={styles.airportCode}>SIN</div>
        </div>

        <div className={styles.detailsRow}>
          <div className={styles.airlineInfo}>
            <span className={styles.airlineLabel}>Airline</span>
            <span className={styles.airlineName}>Lion Air</span>
          </div>
          <div className={styles.timeInfo}>
            <span className={styles.timeLabel}>Boarding</span>
            <span className={styles.timeValue}>14:30</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ParallaxWing = () => {
  return (
    <ParallaxProvider>
      <Scene />
    </ParallaxProvider>
  );
};
