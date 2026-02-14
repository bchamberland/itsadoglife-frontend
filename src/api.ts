import type {
  BreedListResponse,
  StartPlaythroughResponse,
  GetPlaythroughResponse,
  DrawCardResponse,
  ResolveCardResponse,
} from "./types";

const API = "https://itsadoglife-e21a00531497.herokuapp.com";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function listBreeds(): Promise<BreedListResponse> {
  return request("/api/breeds");
}

export function startPlaythrough(
  breed_id: string,
  dog_name: string,
  art_style: string
): Promise<StartPlaythroughResponse> {
  return request("/api/playthrough/start", {
    method: "POST",
    body: JSON.stringify({ breed_id, dog_name, art_style }),
  });
}

export function getPlaythrough(id: string): Promise<GetPlaythroughResponse> {
  return request(`/api/playthrough/${id}`);
}

export function drawCard(
  playthroughId: string,
  deck_type: string
): Promise<DrawCardResponse> {
  return request(`/api/playthrough/${playthroughId}/draw`, {
    method: "POST",
    body: JSON.stringify({ deck_type }),
  });
}

export function resolveCard(
  playthroughId: string,
  card_id: string,
  choice_index: number | null
): Promise<ResolveCardResponse> {
  return request(`/api/playthrough/${playthroughId}/resolve`, {
    method: "POST",
    body: JSON.stringify({ card_id, choice_index }),
  });
}
