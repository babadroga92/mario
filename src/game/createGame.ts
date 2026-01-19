// src/game/createGame.ts
import * as Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import RoomScene from "./scenes/RoomScene";
import UIScene from "./scenes/UIScene";
import QuizScene from "./scenes/QuizScene";
import EndScene from "./scenes/EndScene";
import { QUESTIONS } from "./questions";


export function createGame(parent: HTMLDivElement, username: string) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 640,
    backgroundColor: "#0b1020",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 1200 }, // ✅ add x
        debug: false,
      },
    },
    scene: [BootScene, RoomScene, UIScene, QuizScene, EndScene],
  });

  game.registry.set("username", username);
  // Pick 5 random questions for THIS run (no repeats within a run)
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  game.registry.set("quizQuestions", shuffled.slice(0, 5));

  return game;
}
