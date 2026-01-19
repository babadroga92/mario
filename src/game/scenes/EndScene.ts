import * as Phaser from "phaser";
import { gameEvents } from "../events";

export default class EndScene extends Phaser.Scene {
  constructor() {
    super("end");
  }

  create(data: { username: string; score: number; timeMs: number; won: boolean }) {
    const w = this.scale.width;
    const h = this.scale.height;

    // Stop background music on end screen (optional but clean)
    const bgm = this.sound.get("bgm");
    if (bgm) bgm.stop();

    this.add.rectangle(w / 2, h / 2, w, h, 0x2a0b4f, 1);

    const title = data.won ? "QUEST COMPLETE!" : "GAME OVER";

    this.add
      .text(w / 2, 140, title, {
        fontFamily: "monospace",
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    if (data.won) {
      this.add
        .text(w / 2, 200, "🌸 You restored privacy to the kingdom! 👑", {
          fontFamily: "monospace",
          fontSize: "18px",
          color: "#ffd86b",
        })
        .setOrigin(0.5);

      // 🎉 Celebration pop
      this.tweens.add({
        targets: this.children.list,
        scale: { from: 0.95, to: 1 },
        duration: 300,
        ease: "Back.Out",
      });
    }

    // Submit score (React page will show leaderboard too)
    gameEvents.emit("SCORE_SUBMIT", {
      username: data.username,
      score: data.score,
      timeMs: data.timeMs,
      won: data.won,
    });

    this.add
      .text(w / 2, 280, "Leaderboard (Top 5) appears below the game.", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#c7b9ff",
      })
      .setOrigin(0.5);

    // Back to Home button
    const btnY = 390;

    const btn = this.add
      .rectangle(w / 2, btnY, 260, 50, 0x12d58a, 1)
      .setStrokeStyle(2, 0x0b7d52)
      .setInteractive({ useHandCursor: true });

    const btnText = this.add
      .text(w / 2, btnY, "🏠 BACK TO HOME", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#0b1020",
      })
      .setOrigin(0.5);

    btn.on("pointerdown", () => {
      window.location.href = "/";
    });

    // Hover polish
    btn.on("pointerover", () => {
      btn.setAlpha(0.9);
    });
    btn.on("pointerout", () => {
      btn.setAlpha(1);
    });
  }
}
