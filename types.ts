
export type Sport = 'Basketball' | 'Volleyball';

export interface GameMetadata {
  sport: Sport;
}

export interface StatEvent {
  id: string;
  timestamp: number;
  type: string;
  value?: number;
  team: 'home'; // Only tracking one team now
}

export interface GameState {
  metadata: GameMetadata;
  events: StatEvent[];
}

export const APP_COLORS = {
  primary: '#2563EB', // Electric Blue
  secondary: '#374151', // Grey
  accent: '#EF4444', // Red for misses
  background: '#000000',
  text: '#FFFFFF',
};
