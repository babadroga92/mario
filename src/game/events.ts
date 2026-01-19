import mitt from "mitt";

type Events = {
  SCORE_SUBMIT: { username: string; score: number; timeMs: number; won: boolean };
};

export const gameEvents = mitt<Events>();
