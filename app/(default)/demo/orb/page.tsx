import { AIRecordingPanel } from "@/components/recording-orb/AIRecordingPanel";
import { OrbVariantGallery } from "@/components/recording-orb/OrbVariantGallery";
import styles from "@/components/recording-orb/RecordingOrb.module.css";

export default function OrbDemoPage() {
  return (
    <section className={styles.demoPage}>
      <div className={styles.demoContainer}>
        <header className={styles.demoHeader}>
          <span className={styles.demoEyebrow}>AI Recording Orb</span>
          <h1 className={styles.demoTitle}>Default Layout Demo</h1>
          <p className={styles.demoDescription}>
            Orb duoc render bang CSS gradient va animation, khong dung PNG. Ban demo gom 4 trang thai va panel
            tuong tac de test luong recording, processing, error.
          </p>
        </header>

        <OrbVariantGallery />

        <section className={styles.interactiveCard}>
          <AIRecordingPanel />
        </section>
      </div>
    </section>
  );
}
