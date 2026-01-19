import * as Phaser from "phaser";


export default class UIScene extends Phaser.Scene {
  private heartsText!: Phaser.GameObjects.Text;
  private roomText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private pointsText!: Phaser.GameObjects.Text;

  constructor() {
    super("ui");
  }

  create() {
    const w = this.scale.width;

    // Top bar background (HUD)
    this.add.rectangle(w / 2, 36, w - 60, 56, 0x141a2b, 1).setStrokeStyle(2, 0x5c3bff);

    this.heartsText = this.add.text(60, 24, "❤️❤️❤️", {
      fontFamily: "monospace",
      fontSize: "20px",
    });

    this.roomText = this.add.text(210, 26, "ROOM 1/6", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#c7b9ff",
    }).setPadding(10, 6).setBackgroundColor("#2a2350");

    this.timerText = this.add.text(370, 26, "⏱ 0:00", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#ffd86b",
    }).setPadding(10, 6).setBackgroundColor("#1f2436");

    this.pointsText = this.add.text(w - 200, 26, "★ 0", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#7dffcf",
    }).setPadding(10, 6).setBackgroundColor("#1f2436");

    this.events.on("ui:update", (payload: { hearts: number; room: number; points: number; elapsedMs: number }) => {
      this.heartsText.setText("❤️".repeat(payload.hearts));
      this.roomText.setText(`ROOM ${payload.room}/6`);
      this.pointsText.setText(`★ ${payload.points}`);

      const totalSec = Math.floor(payload.elapsedMs / 1000);
      const min = Math.floor(totalSec / 60);
      const sec = String(totalSec % 60).padStart(2, "0");
      this.timerText.setText(`⏱ ${min}:${sec}`);
    });
  }
}
