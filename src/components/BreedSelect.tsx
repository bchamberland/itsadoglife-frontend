import { useEffect, useState } from "react";
import { listBreeds, startPlaythrough } from "../api";
import type { Breed, Playthrough } from "../types";
import styles from "./BreedSelect.module.css";

interface Props {
  onStart: (playthrough: Playthrough) => void;
}

export default function BreedSelect({ onStart }: Props) {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [selected, setSelected] = useState<Breed | null>(null);
  const [dogName, setDogName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listBreeds()
      .then((res) => setBreeds(res.breeds))
      .catch((e) => setError(e.message));
  }, []);

  async function handleStart() {
    if (!selected || !dogName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await startPlaythrough(
        selected.id,
        dogName.trim(),
        selected.art_style_name.toLowerCase().replace(/ /g, "_")
      );
      onStart(res.playthrough);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start");
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>It's a Dog Life</h1>

      <div className={styles.howToPlay}>
        <p>
          Experience life as a dog from birth to old age. Each turn draws a card
          — moments, decisions, and surprises that shape your dog's story.
          Your choices affect stats like <strong>energy</strong>,{" "}
          <strong>owner bond</strong>, and <strong>training</strong>. Every
          playthrough is different. There are no wrong answers, just a life
          well lived.
        </p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {!selected ? (
        <>
          <h2 className={styles.subtitle}>Choose Your Breed</h2>
          <div className={styles.breedList}>
            {breeds.map((breed) => (
              <button
                key={breed.id}
                className={styles.breedCard}
                onClick={() => setSelected(breed)}
              >
                <span className={styles.breedName}>{breed.name}</span>
                <span className={styles.artStyle}>{breed.art_style_name}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.nameForm}>
          <p className={styles.selectedBreed}>
            Breed: <strong>{selected.name}</strong>
            <button
              className={styles.changeBtn}
              onClick={() => setSelected(null)}
            >
              Change
            </button>
          </p>
          <label className={styles.label}>
            Name your dog:
            <input
              className={styles.input}
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              maxLength={100}
              autoFocus
            />
          </label>
          <button
            className={styles.startBtn}
            onClick={handleStart}
            disabled={loading || !dogName.trim()}
          >
            {loading ? "Starting..." : "Start Game"}
          </button>
        </div>
      )}
    </div>
  );
}
