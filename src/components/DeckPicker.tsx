import type { DeckInfo } from "../types";
import styles from "./DeckPicker.module.css";

interface Props {
  unlockedDecks: string[];
  deckInfos: DeckInfo[] | null;
  onPick: (deckType: string) => void;
  loading: boolean;
  dogName: string;
}

function formatDeckName(deck: string): string {
  return deck
    .replace(/^breed_/, "")
    .replace(/^life_stage_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DeckPicker({ unlockedDecks, deckInfos, onPick, loading, dogName }: Props) {
  const infoMap = new Map(deckInfos?.map((d) => [d.deck_type, d]));

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Your Turn</h3>
      <p className={styles.hint}>
        Pick a deck to draw a card and see what happens next in {dogName}'s life.
      </p>
      <div className={styles.deckList}>
        {unlockedDecks.map((deck) => {
          const info = infoMap.get(deck);
          return (
            <button
              key={deck}
              className={styles.deckBtn}
              onClick={() => onPick(deck)}
              disabled={loading}
            >
              <span className={styles.deckIcon}>🃏</span>
              <span className={styles.deckLabel}>
                <span className={styles.deckName}>{formatDeckName(deck)}</span>
                {info && (
                  <span className={styles.remaining}>
                    {info.cards_remaining} cards remaining
                  </span>
                )}
              </span>
              <span className={styles.drawArrow}>&#8250;</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
