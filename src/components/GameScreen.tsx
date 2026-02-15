import { useState } from "react";
import { drawCard, resolveCard } from "../api";
import type { Card, DeckInfo, OutcomesApplied, Playthrough } from "../types";
import StatsBar from "./StatsBar";
import DeckPicker from "./DeckPicker";
import CardDisplay from "./CardDisplay";
import OutcomeDisplay from "./OutcomeDisplay";
import styles from "./GameScreen.module.css";

type Phase = "pick_deck" | "show_card" | "show_outcome";

interface Props {
  playthrough: Playthrough;
  onUpdate: (playthrough: Playthrough) => void;
}

export default function GameScreen({ playthrough, onUpdate }: Props) {
  const [phase, setPhase] = useState<Phase>("pick_deck");
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [deckInfos, setDeckInfos] = useState<DeckInfo[] | null>(null);
  const [outcomes, setOutcomes] = useState<OutcomesApplied | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePickDeck(deckType: string) {
    setLoading(true);
    setError("");
    try {
      const res = await drawCard(playthrough.id, deckType);
      setCurrentCard(res.card);
      setDeckInfos(res.available_decks);
      setPhase("show_card");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to draw card");
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(choiceIndex: number | null) {
    if (!currentCard) return;
    setLoading(true);
    setError("");
    try {
      const res = await resolveCard(playthrough.id, currentCard.id, choiceIndex);
      onUpdate(res.playthrough);
      setOutcomes(res.outcomes);
      setPhase("show_outcome");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to resolve card");
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    setCurrentCard(null);
    setOutcomes(null);
    setPhase("pick_deck");
  }

  return (
    <div className={styles.container}>
      <StatsBar playthrough={playthrough} />

      {error && <p className={styles.error}>{error}</p>}

      {playthrough.completed && (
        <div className={styles.completed}>
          <h3>Game Complete!</h3>
          <p>{playthrough.dog_name}'s story has ended.</p>
        </div>
      )}

      {!playthrough.completed && phase === "pick_deck" && (
        <DeckPicker
          unlockedDecks={playthrough.unlocked_decks.filter(
            (d) =>
              !d.startsWith("life_stage_") ||
              d === `life_stage_${playthrough.current_life_stage}`
          )}
          deckInfos={deckInfos}
          onPick={handlePickDeck}
          loading={loading}
          dogName={playthrough.dog_name}
        />
      )}

      {(phase === "show_card" || phase === "show_outcome") && currentCard && (
        <CardDisplay
          card={currentCard}
          playthrough={playthrough}
          onResolve={handleResolve}
          loading={loading}
          resolved={phase === "show_outcome"}
        />
      )}

      {phase === "show_outcome" && outcomes && (
        <OutcomeDisplay outcomes={outcomes} onContinue={handleContinue} />
      )}
    </div>
  );
}
