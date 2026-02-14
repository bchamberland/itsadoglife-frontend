import type { Card, Playthrough } from "../types";
import styles from "./CardDisplay.module.css";

interface Props {
  card: Card;
  playthrough: Playthrough;
  onResolve: (choiceIndex: number | null) => void;
  loading: boolean;
  resolved?: boolean;
}

function checkCondition(
  condition: NonNullable<Card["choices"]>[number]["condition"],
  playthrough: Playthrough
): boolean {
  if (!condition) return true;
  switch (condition.type) {
    case "trait":
      return playthrough.traits.includes(condition.value ?? "");
    case "ability":
      return playthrough.abilities.includes(condition.value ?? "");
    case "stat":
      return (
        (playthrough.stats[condition.stat ?? ""] ?? 0) >=
        (condition.threshold ?? 0)
      );
    case "or":
      return (condition.requirements ?? []).some((r) =>
        checkCondition(r, playthrough)
      );
    case "and":
      return (condition.requirements ?? []).every((r) =>
        checkCondition(r, playthrough)
      );
    default:
      return true;
  }
}

export default function CardDisplay({ card, playthrough, onResolve, loading, resolved }: Props) {
  const isEvent = !card.choices || card.choices.length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        {card.is_major && <span className={styles.majorBadge}>Major</span>}
      </div>
      <p className={styles.description}>{card.description}</p>

      {card.visual_elements?.setting && (
        <p className={styles.flavor}>
          {card.visual_elements.action && `${card.visual_elements.action} `}
          {card.visual_elements.setting && `in ${card.visual_elements.setting}`}
        </p>
      )}

      {!resolved && (
        <div className={styles.choices}>
          {isEvent ? (
            <button
              className={styles.choiceBtn}
              onClick={() => onResolve(null)}
              disabled={loading}
            >
              {loading ? "Resolving..." : "Continue"}
            </button>
          ) : (
            card.choices!.map((choice, i) => {
              const available = checkCondition(choice.condition, playthrough);
              return (
                <button
                  key={i}
                  className={`${styles.choiceBtn} ${!available ? styles.locked : ""}`}
                  onClick={() => onResolve(i)}
                  disabled={loading || !available}
                >
                  {choice.label}
                  {!available && <span className={styles.lockIcon}> (locked)</span>}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
