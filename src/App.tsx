import { useState } from "react";
import type { Playthrough } from "./types";
import BreedSelect from "./components/BreedSelect";
import GameScreen from "./components/GameScreen";

function App() {
  const [playthrough, setPlaythrough] = useState<Playthrough | null>(null);

  if (!playthrough) {
    return (
      <div className="app-shell">
        <BreedSelect onStart={setPlaythrough} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <GameScreen playthrough={playthrough} onUpdate={setPlaythrough} />
    </div>
  );
}

export default App;
