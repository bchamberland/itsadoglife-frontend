export interface Breed {
  id: string;
  name: string;
  art_style_name: string;
  unlock_condition: Record<string, unknown> | null;
  is_unlocked: boolean;
}

export interface TileSummary {
  id: string;
  sequence: number;
  trigger_type: string;
  image_url: string;
  image_status: string;
  events: Record<string, unknown>[];
}

export interface DeckState {
  drawn_cards: string[];
  reshuffles: number;
}

export interface Playthrough {
  id: string;
  breed_id: string;
  dog_name: string;
  art_style: string;
  current_time: number;
  current_life_stage: string;
  completed: boolean;
  stats: Record<string, number>;
  traits: string[];
  abilities: string[];
  items: string[];
  unlocked_decks: string[];
  deck_state: Record<string, DeckState>;
  tiles: TileSummary[];
  created_at: string;
}

export interface DeckInfo {
  deck_type: string;
  cards_remaining: number;
  reshuffles: number;
}

export interface Choice {
  label: string;
  condition?: {
    type: string;
    value?: string;
    stat?: string;
    threshold?: number;
    requirements?: Choice["condition"][];
  };
}

export interface Card {
  id: string;
  title: string;
  deck_type: string;
  is_major: boolean;
  card_types: string[];
  description: string;
  time_cost: number;
  valid_life_stages: string[];
  visual_elements?: {
    action?: string;
    setting?: string;
    mood?: string;
    notable_objects?: string[];
  };
  choices?: Choice[];
  outcomes?: {
    automatic: Record<string, unknown>;
  };
}

export interface OutcomesApplied {
  stat_changes: Record<string, number>;
  traits_gained: string[];
  abilities_gained: string[];
  items_gained: string[];
  decks_unlocked: string[];
  challenge_result: {
    stat: string;
    threshold: number;
    passed: boolean;
  } | null;
  life_stage_changed: string | null;
}

export interface BreedListResponse {
  breeds: Breed[];
}

export interface StartPlaythroughResponse {
  playthrough: Playthrough;
}

export interface GetPlaythroughResponse {
  playthrough: Playthrough;
}

export interface DrawCardResponse {
  card: Card;
  available_decks: DeckInfo[];
}

export interface ResolveCardResponse {
  playthrough: Playthrough;
  outcomes: OutcomesApplied;
  tile_created: TileSummary;
}
