"use client";

import { useState } from "react";

import { LiquidAIOrb, type LiquidAIOrbStatus } from "./LiquidAIOrb";
import { RecordingOrb, type RecordingOrbStatus, type RecordingOrbVariant } from "./RecordingOrb";
import { UiverseOrb } from "./UiverseOrb";
import styles from "./RecordingOrb.module.css";

type BaseOrbSample = {
  name: string;
  tone: string;
};

type RecordingOrbSample = BaseOrbSample & {
  kind: "recording";
  status: RecordingOrbStatus;
  variant: RecordingOrbVariant;
  seconds?: number;
};

type LiquidOrbSample = BaseOrbSample & {
  kind: "liquid";
  status: LiquidAIOrbStatus;
};

type UiverseOrbSample = BaseOrbSample & {
  kind: "uiverse";
};

type OrbSample = RecordingOrbSample | LiquidOrbSample | UiverseOrbSample;

const orbSamples: OrbSample[] = [
  {
    kind: "recording",
    name: "Aqua Core",
    tone: "Clean assistant recording",
    status: "idle",
    variant: "aqua",
  },
  {
    kind: "recording",
    name: "Aurora Stream",
    tone: "Soft AI processing flow",
    status: "processing",
    variant: "aurora",
  },
  {
    kind: "recording",
    name: "Ember Live",
    tone: "High energy voice capture",
    status: "recording",
    variant: "ember",
    seconds: 24,
  },
  {
    kind: "recording",
    name: "Prism Lens",
    tone: "Glossy premium recorder",
    status: "recording",
    variant: "prism",
    seconds: 58,
  },
  {
    kind: "liquid",
    name: "Liquid AI",
    tone: "Warm liquid analyzing orb",
    status: "processing",
  },
  {
    kind: "uiverse",
    name: "Uiverse Pulse",
    tone: "Blurred dual-color rotating orb",
  },
  {
    kind: "recording",
    name: "Void Signal",
    tone: "Dark compact command UI",
    status: "processing",
    variant: "void",
  },
];

export function OrbVariantGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSample = orbSamples[activeIndex];

  return (
    <section className={styles.galleryShell}>
      <aside className={styles.galleryList} aria-label="Orb samples">
        {orbSamples.map((sample, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              aria-pressed={isActive}
              className={`${styles.galleryItem} ${isActive ? styles.galleryItemActive : ""}`}
              key={sample.name}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <span className={styles.galleryItemName}>{sample.name}</span>
              <span className={styles.galleryItemTone}>{sample.tone}</span>
            </button>
          );
        })}
      </aside>

      <div className={styles.galleryPreview}>
        <div className={styles.galleryPreviewMeta}>
          <span className={styles.galleryPreviewKicker}>Selected orb</span>
          <h2 className={styles.galleryPreviewTitle}>{activeSample.name}</h2>
          <p className={styles.galleryPreviewTone}>{activeSample.tone}</p>
        </div>

        {activeSample.kind === "liquid" && <LiquidAIOrb size={300} status={activeSample.status} />}

        {activeSample.kind === "uiverse" && <UiverseOrb />}

        {activeSample.kind === "recording" && (
          <RecordingOrb
            seconds={activeSample.seconds}
            size={230}
            status={activeSample.status}
            variant={activeSample.variant}
          />
        )}
      </div>
    </section>
  );
}
