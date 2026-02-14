import type { Playthrough } from "../types";
import styles from "./StatsBar.module.css";

interface Props {
  playthrough: Playthrough;
}

function formatLifeStage(stage: string): string {
  return stage.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatsBar({ playthrough }: Props) {
  const { dog_name, current_life_stage, current_time, stats, traits, abilities, items } =
    playthrough;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <strong className={styles.name}>{dog_name}</strong>
        <span className={styles.stage}>{formatLifeStage(current_life_stage)}</span>
        <span className={styles.time}>Time: {current_time}</span>
      </div>

      <div className={styles.stats}>
        {Object.entries(stats).map(([key, val]) => (
          <div key={key} className={styles.stat}>
            <span className={styles.statLabel}>{key}</span>
            <span className={styles.statVal}>{typeof val === "number" && val % 1 !== 0 ? val.toFixed(1) : val}</span>
          </div>
        ))}
      </div>

      {traits.length > 0 && (
        <div className={styles.list}>
          <span className={styles.listLabel}>Traits:</span> {traits.join(", ")}
        </div>
      )}
      {abilities.length > 0 && (
        <div className={styles.list}>
          <span className={styles.listLabel}>Abilities:</span> {abilities.join(", ")}
        </div>
      )}
      {items.length > 0 && (
        <div className={styles.list}>
          <span className={styles.listLabel}>Items:</span> {items.join(", ")}
        </div>
      )}
    </div>
  );
}
