import type { DeckInfo } from "../types";
import styles from "./DeckPicker.module.css";

interface Props {
  unlockedDecks: string[];
  deckInfos: DeckInfo[] | null;
  onPick: (deckType: string) => void;
  loading: boolean;
}

function formatDeckName(deck: string): string {
  return deck
    .replace(/^breed_/, "")
    .replace(/^life_stage_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DeckPicker({ unlockedDecks, deckInfos, onPick, loading }: Props) {
  const infoMap = new Map(deckInfos?.map((d) => [d.deck_type, d]));

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Choose a Deck</h3>
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
              <span>{formatDeckName(deck)}</span>
              {info && (
                <span className={styles.remaining}>
                  {info.cards_remaining} left
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
