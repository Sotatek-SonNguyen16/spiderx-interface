"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./TokyoReveal.module.css";
import { GrainOverlay } from "../effects/GrainOverlay";

export const TokyoReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Scroll progress for the single screen duration (enter view to leave view)
  // Scroll progress for the single screen duration (enter view to leave view)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Trigger as it crosses the viewport
  });

  // Reveal: starts hidden (y=100%) pushed down, moves to 0% (natural position)
  // "100%" means it's pushed down by its full height, effectively hidden below the frame.
  const towerY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  // We need to maintain the x centering. Framer motion overrides the CSS transform.
  // We can just set x to "-50%" consistently.
  const towerX = "-50%";

  const towerScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);

  // Title Parallax - Slide from Top
  // Starts high up (-100% or more) and settles or moves slightly for parallax
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["-150%", "0%", "-20%"],
  );
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Content
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  // Description slides up slightly
  const descriptionY = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);

  // Meta Animations: Left from left, Right from right
  const metaLeftX = useTransform(scrollYProgress, [0.2, 0.5], [-100, 0]);
  const metaRightX = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.stickyWrapper}>
        <div className={styles.windowFrame}>
          {/* Background Grain */}
          <div className={styles.grain}></div>

          {/* Square Sky Background */}
          <div className={styles.skySquare}>
            <Image
              src="/images/tower-background.png"
              alt="Sky Background"
              fill
              className={styles.backgroundImage}
            />
          </div>

          {/* Big Title */}
          <motion.h1
            className={styles.titleBig}
            style={{ y: titleY, opacity: titleOpacity }}
          >
            TOKYO
          </motion.h1>

          {/* Description - Centered below Title */}
          <motion.div
            className={styles.descriptionContainer}
            style={{ opacity: contentOpacity, y: descriptionY }}
          >
            <p className={styles.description}>
              The Tokyo Tower is a communications and observation tower located
              in the Shiba-koen district of Minato, Tokyo, Japan. Standing 333
              meters tall, the distinctive orange-and-white lattice tower was
              completed in 1958 and is renowned for its resemblance to the
              Eiffel Tower.
            </p>
          </motion.div>

          {/* Split Meta Container - Flanking the tower */}
          <div className={styles.metaContainer}>
            <motion.div
              className={styles.metaLeft}
              style={{ x: metaLeftX, opacity: contentOpacity }}
            >
              <span className={styles.japaneseTitle}>東京タワー</span>
            </motion.div>
            <motion.div
              className={styles.metaRight}
              style={{ x: metaRightX, opacity: contentOpacity }}
            >
              <div className={styles.numberLine}></div>
              <span className={styles.number}>03</span>
            </motion.div>
          </div>

          {/* Tower - Centered in front */}
          <motion.div
            className={styles.towerContainer}
            style={{ y: towerY, x: towerX, scale: towerScale }}
          >
            <Image
              src="/images/toyko-tower-gen.png"
              alt="Tokyo Tower"
              width={800}
              height={1200}
              className={styles.towerImage}
              priority
            />
          </motion.div>

          <div className={styles.bottomContainer}></div>
          <GrainOverlay />
        </div>
      </div>
    </div>
  );
};
