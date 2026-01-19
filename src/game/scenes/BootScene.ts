import * as Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload() {
    // Load music from Next.js public folder
    this.load.audio("bgm", "/audio/mario.mp3");
  }

  create() {
    // Create tiny textures we can scale + tint (pixel-art style)
    const makeTexture = (key: string, hex: number) => {
      const g = this.add.graphics();
      g.fillStyle(hex, 1);
      g.fillRect(0, 0, 1, 1);
      g.generateTexture(key, 1, 1);
      g.destroy();
    };

    makeTexture("px-green", 0x00d48f);
    makeTexture("px-red", 0xff3b3b);
    makeTexture("px-gold", 0xffd86b);
    makeTexture("px-pink", 0xff6bd6); // queen

    // flower texture (3x3)
    const g2 = this.add.graphics();
    g2.fillStyle(0xffffff, 1);
    g2.fillRect(1, 0, 1, 1);
    g2.fillRect(0, 1, 3, 1);
    g2.fillRect(1, 2, 1, 1);
    g2.generateTexture("px-flower", 3, 3);
    g2.destroy();

    const startTimeMs = Date.now();

    this.scene.start("room", {
      roomIndex: 0,
      hearts: 3,
      points: 0,
      startTimeMs,
    });

    this.scene.launch("ui");
  }
}
