// Type definitions for Bunny Hop Coding Adventure

import type { BunnyHopGame } from './game';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Position, Size {}

export interface Bunny {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  onGround: boolean;
  jumping: boolean;
  color: string;
}

export interface Platform extends Rect {
  moving?: boolean;
  moveSpeed?: number;
  moveRange?: number;
  moveX?: boolean;
  moveY?: boolean;
  originalX?: number;
  originalY?: number;
  startX?: number;
  directionX?: number;
  directionY?: number;
}

export interface Collectible extends Position {
  id: string;
}

export interface Obstacle extends Rect {}

export interface Goal extends Rect {}

export interface Level {
  name: string;
  instructions?: string;
  instruction?: string;
  startX: number;
  startY: number;
  groundY: number;
  platforms?: Platform[];
  carrots?: Collectible[];
  stars?: Collectible[];
  coins?: Collectible[];
  obstacles?: Obstacle[];
  goal: Goal;
  hint?: string;
  startCode?: string;
  requiredCarrots?: number;
}

export interface GameState {
  bunnyX: number;
  bunnyY: number;
  collectedCarrots: string[];
  moveHistory: MoveAction[];
}

export interface MoveAction {
  action: 'moveRight' | 'moveLeft' | 'jump' | 'wait' | 'collect';
  steps?: number;
  seconds?: number;
}

export interface Pyodide {
  globals: {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
  };
  runPython: (code: string) => any;
}

declare global {
  interface Window {
    game: BunnyHopGame | null;
    pyodide: Pyodide | undefined;
    loadPyodide: () => Promise<Pyodide>;
  }
}

export {};

