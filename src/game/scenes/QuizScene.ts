import * as Phaser from "phaser";
import { QUESTIONS } from "../questions";

export default class QuizScene extends Phaser.Scene {
  constructor() {
    super("quiz");
  }

  create(data: { roomIndex: number; hearts: number; points: number; startTimeMs: number }) {
    const quizQuestions = this.registry.get("quizQuestions") as typeof QUESTIONS;
    const q = quizQuestions[data.roomIndex];


    const w = this.scale.width;
    const h = this.scale.height;

    // Bigger panel so we have room for feedback + continue
    this.add
      .rectangle(w / 2, h / 2, 760, 440, 0x141a2b, 0.98)
      .setStrokeStyle(2, 0x5c3bff);

    this.add
      .text(w / 2, h / 2 - 190, "QUIZ CHECKPOINT", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#c7b9ff",
      })
      .setOrigin(0.5);

    this.add
      .text(w / 2, h / 2 - 150, q.question, {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#ffffff",
        wordWrap: { width: 700 },
        align: "center",
      })
      .setOrigin(0.5);

    // Feedback panel (hidden until answered)
    const feedbackBg = this.add
      .rectangle(w / 2, h / 2 + 110, 680, 110, 0x0f1426, 1)
      .setStrokeStyle(2, 0x2c3552)
      .setVisible(false);

    const feedback = this.add
      .text(w / 2, h / 2 + 110, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffd86b",
        wordWrap: { width: 640 },
        align: "center",
      })
      .setOrigin(0.5)
      .setVisible(false);

    let locked = false;
    let hearts = data.hearts;
    let points = data.points;

    const buttons: { btn: Phaser.GameObjects.Rectangle; txt: Phaser.GameObjects.Text }[] = [];

    const makeBtn = (i: number, y: number) => {
      const btn = this.add
        .rectangle(w / 2, y, 620, 48, 0x1f2436, 1)
        .setStrokeStyle(2, 0x2c3552);

      const txt = this.add
        .text(w / 2, y, q.answers[i], {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      btn.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
        if (locked) return;
        locked = true;

        // Disable all buttons visually
        buttons.forEach(({ btn, txt }) => {
          btn.disableInteractive();
          btn.setAlpha(0.75);
          txt.setAlpha(0.9);
        });

        const correct = i === q.correctIndex;

        // Highlight correct/selected
        const selected = buttons[i];
        if (correct) {
          selected.btn.setStrokeStyle(2, 0x12d58a);
          feedback.setColor("#7dffcf");
          feedback.setText(`✅ Correct!\n${q.explanation}`);
          points += 50;

        } else {
          selected.btn.setStrokeStyle(2, 0xff3b3b);
          buttons[q.correctIndex].btn.setStrokeStyle(2, 0x12d58a);

          feedback.setColor("#ffd86b");
          feedback.setText(
            `❌ Wrong.\nCorrect answer: ${q.answers[q.correctIndex]}\n${q.explanation}`
          );

          hearts -= 1;
        }

        feedbackBg.setVisible(true);
        feedback.setVisible(true);

        // Continue button (always in same place)
        const cont = this.add
          .rectangle(w / 2, h / 2 + 200, 220, 48, 0x12d58a, 1)
          .setStrokeStyle(2, 0x0b7d52);

        const contTxt = this.add
          .text(w / 2, h / 2 + 200, "CONTINUE", {
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#0b1020",
          })
          .setOrigin(0.5);

        cont.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
          const room = this.scene.get("room") as any;
          room.applyQuizResult({ hearts, points });
          room.scene.resume();
        });
      });

      buttons.push({ btn, txt });
    };

    // Answers moved UP so they never clash with feedback/continue
    makeBtn(0, h / 2 - 70);
    makeBtn(1, h / 2 - 10);
    makeBtn(2, h / 2 + 50);
  }
}
