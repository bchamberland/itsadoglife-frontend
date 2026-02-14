import type { OutcomesApplied } from "../types";
import styles from "./OutcomeDisplay.module.css";

interface Props {
  outcomes: OutcomesApplied;
  flavorText: string | null;
  onContinue: () => void;
}

export default function OutcomeDisplay({ outcomes, flavorText, onContinue }: Props) {
  const statEntries = Object.entries(outcomes.stat_changes);
  const hasAnything =
    statEntries.length > 0 ||
    outcomes.traits_gained.length > 0 ||
    outcomes.abilities_gained.length > 0 ||
    outcomes.items_gained.length > 0 ||
    outcomes.decks_unlocked.length > 0 ||
    outcomes.challenge_result ||
    outcomes.life_stage_changed;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Results</h3>

      {flavorText && (
        <p className={styles.flavorText}>{flavorText}</p>
      )}

      {outcomes.challenge_result && (
        <p className={outcomes.challenge_result.passed ? styles.pass : styles.fail}>
          {outcomes.challenge_result.stat} challenge (threshold{" "}
          {outcomes.challenge_result.threshold}):{" "}
          {outcomes.challenge_result.passed ? "Passed!" : "Failed"}
        </p>
      )}

      {outcomes.life_stage_changed && (
        <p className={styles.stageChange}>
          Life stage changed to{" "}
          <strong>
            {outcomes.life_stage_changed.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </strong>
          !
        </p>
      )}

      {statEntries.length > 0 && (
        <div className={styles.section}>
          {statEntries.map(([stat, delta]) => (
            <span
              key={stat}
              className={delta > 0 ? styles.positive : styles.negative}
            >
              {stat}: {delta > 0 ? "+" : ""}
              {delta}
            </span>
          ))}
        </div>
      )}

      {outcomes.traits_gained.length > 0 && (
        <p className={styles.gained}>Traits gained: {outcomes.traits_gained.join(", ")}</p>
      )}
      {outcomes.abilities_gained.length > 0 && (
        <p className={styles.gained}>Abilities gained: {outcomes.abilities_gained.join(", ")}</p>
      )}
      {outcomes.items_gained.length > 0 && (
        <p className={styles.gained}>Items gained: {outcomes.items_gained.join(", ")}</p>
      )}
      {outcomes.decks_unlocked.length > 0 && (
        <p className={styles.gained}>Decks unlocked: {outcomes.decks_unlocked.join(", ")}</p>
      )}

      {!hasAnything && <p className={styles.nothing}>Nothing happened.</p>}

      <button className={styles.continueBtn} onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}
