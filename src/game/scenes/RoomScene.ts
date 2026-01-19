import * as Phaser from "phaser";

type PlatformDef = [number, number, number?]; // [x, y, width?]
type EnemyDef = [number, number] | [number, number, number, number]; // [x,y] or [x,y,minX,maxX]

const ROOMS: {
  platforms: PlatformDef[];
  enemies: EnemyDef[];
  doorY: number;
}[] = [
  // room 1 (tutorial-ish)
  {
    platforms: [
      [220, 400, 120],
      [470, 340, 110],
      [740, 280, 110],
    ],
    enemies: [[520, 520]],
    doorY: 260,
  },

  // room 2
  {
    platforms: [
      [240, 410, 160],
      [520, 350, 140],
      [360, 290, 110],
      [740, 270, 120],
    ],
    enemies: [
      [420, 520],
      [520, 325],
    ],
    doorY: 250,
  },

  // room 3
  {
    platforms: [
      [220, 410, 130],
      [380, 350, 110],
      [560, 290, 140],
      [730, 230, 110],
    ],
    enemies: [
      [520, 520],
      [620, 265],
    ],
    doorY: 215,
  },

  // room 4
  {
    platforms: [
      [240, 410, 140],
      [500, 370, 170],
      [760, 320, 120],
      [560, 260, 140],
    ],
    enemies: [
      [760, 520],
      [500, 345],
    ],
    doorY: 300,
  },

  // room 5
  {
    platforms: [
      [220, 410, 140],
      [450, 340, 120],
      [660, 270, 160],
      [830, 220, 110],
    ],
    enemies: [
      [520, 520],
      [660, 245],
      [450, 315],
    ],
    doorY: 205,
  },

  // room 6 (final)
  {
    platforms: [
      [260, 410, 160],
      [500, 350, 140],
      [740, 290, 140],
    ],
    enemies: [],
    doorY: 0,
  },
];

type RoomState = {
  roomIndex: number; // 0..5
  hearts: number;
  points: number;
  startTimeMs: number;
};

export default class RoomScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyShootEnter!: Phaser.Input.Keyboard.Key;
  private keyShootX!: Phaser.Input.Keyboard.Key;

  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private bullets!: Phaser.Physics.Arcade.Group;

  private enemies!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  private door?: Phaser.GameObjects.Rectangle;

  private state!: RoomState;
  private hasFlower = false;

  constructor() {
    super("room");
  }

  init(data: RoomState) {
    this.state = data;
  }

  create() {
    // Start background music once (browser allows after user interaction)
    if (!this.sound.get("bgm")) {
      const music = this.sound.add("bgm", { loop: true, volume: 0.35 });
      music.play();
    }

    const w = this.scale.width;
    const h = this.scale.height;

    const cfg = ROOMS[this.state.roomIndex];

    // background frame
    this.add
      .rectangle(w / 2, h / 2 + 40, w - 60, h - 100, 0x0b1020, 1)
      .setStrokeStyle(2, 0x5c3bff);

    // expanded vertical bounds
    this.physics.world.setBounds(30, 60, w - 60, h - 110);

    this.platforms = this.physics.add.staticGroup();

    // floor
    const floor = this.add
      .rectangle(w / 2, h - 80, w - 60, 40, 0x3a7bff)
      .setStrokeStyle(2, 0x72a6ff);
    this.physics.add.existing(floor, true);
    this.platforms.add(floor as any);

    // platforms
    (cfg.platforms as any).forEach((p: any) => {
      const [x, y, width] = p;
      this.addPlatform(x, y, width ?? 90);
    });

    // player
    this.player = this.physics.add.sprite(110, h - 140, "");
    this.player.setSize(22, 28);
    this.player.setVisible(false);

    this.attachEmoji(this.player, "🦸‍♂️", 30);

    this.player.setCollideWorldBounds(true);

    // enemies
    this.enemies = this.physics.add.group();

    // Make platform enemies patrol on the platform they belong to.
    (cfg.enemies as EnemyDef[]).forEach((edef) => {
      const [ex, ey] = edef;

      // If rails are already provided (x,y,minX,maxX) use them
      if (edef.length === 4) {
        const [, , minX, maxX] = edef as [number, number, number, number];
        this.spawnEnemy(ex, ey, { minX, maxX });
        return;
      }

      // Otherwise: try to find a platform whose top is near this enemy y (platformY - 20..30)
      const platformMatch = this.findPlatformForEnemy(cfg.platforms, ex, ey);

      if (platformMatch) {
        const { px, width } = platformMatch;
        const rails = this.railsForPlatform(px, width);
        this.spawnEnemy(ex, ey, rails);
      } else {
        // ground enemy
        this.spawnEnemy(ex, ey);
      }
    });

    // bullets
    this.bullets = this.physics.add.group({ allowGravity: false });

    // collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    // SHOOT KILL = +25
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      bullet.destroy();
      enemy.destroy();
      this.addPoints(25);
    });

    // STOMP KILL = +25, otherwise damage
    this.physics.add.overlap(this.player, this.enemies, (_p, _e) => {
      const e = _e as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

      const playerFalling = this.player.body.velocity.y > 0;
      const playerAbove = this.player.body.bottom <= e.body.top + 10;

      if (playerFalling && playerAbove) {
        e.destroy();
        this.addPoints(25);
        this.player.setVelocityY(-380);
        return;
      }

      if ((this.player as any)._hitLock) return;
      (this.player as any)._hitLock = true;

      this.state.hearts -= 1;
      this.updateUI();

      this.player.setVelocityX(this.player.x < e.x ? -220 : 220);
      this.player.setVelocityY(-220);

      this.time.delayedCall(500, () => ((this.player as any)._hitLock = false));

      if (this.state.hearts <= 0) this.endGame(false);
    });

    // door for rooms 1-5
    if (this.state.roomIndex < 5) {
      this.door = this.add
        .rectangle(w - 150, cfg.doorY, 40, 60, 0x12d58a)
        .setStrokeStyle(2, 0x0b7d52);
      this.add.text(w - 158, cfg.doorY - 14, "→", {
        fontFamily: "monospace",
        fontSize: "20px",
      });

      this.physics.add.existing(this.door, true);
      this.physics.add.overlap(this.player, this.door as any, () => this.onReachExit());
    }

    // final room setup
    if (this.state.roomIndex === 5) {
      this.setupFinalRoom(w, h);
    }

    // input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.keyShootEnter = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keyShootX = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    this.updateUI();
  }

  update() {
    const left = this.cursors.left?.isDown || this.keyA.isDown;
    const right = this.cursors.right?.isDown || this.keyD.isDown;
    const jump = this.cursors.up?.isDown || this.cursors.space?.isDown;

    const shoot =
      Phaser.Input.Keyboard.JustDown(this.keyShootEnter) ||
      Phaser.Input.Keyboard.JustDown(this.keyShootX);

    if (left) this.player.setVelocityX(-220);
    else if (right) this.player.setVelocityX(220);
    else this.player.setVelocityX(0);

    if (jump && this.player.body.blocked.down) this.player.setVelocityY(-650);

    if (shoot) this.fire();

    this.updateUI();
    this.patrolEnemies();
  }

  private addPlatform(x: number, y: number, width = 90) {
    const r = this.add.rectangle(x, y, width, 22, 0x3a7bff).setStrokeStyle(2, 0x72a6ff);
    this.physics.add.existing(r, true);
    this.platforms.add(r as any);
  }

  private spawnEnemy(x: number, y: number, patrol?: { minX: number; maxX: number }) {
    const e = this.physics.add.sprite(x, y, "");
    e.setSize(24, 24);
    e.setVisible(false);

    this.attachEmoji(e, "🥷", 26);


    // We handle turning ourselves; do not bounce off world bounds
    e.setCollideWorldBounds(false);
    (e as any).dir = -1;

    if (patrol) {
      (e as any).minX = patrol.minX;
      (e as any).maxX = patrol.maxX;
    } else {
      // ground enemies can roam widely
      (e as any).minX = 60;
      (e as any).maxX = this.scale.width - 60;
    }

    this.enemies.add(e);
    return e;
  }

  private patrolEnemies() {
    this.enemies.getChildren().forEach((obj) => {
      const e = obj as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody & {
        dir?: number;
        minX?: number;
        maxX?: number;
      };

      const dir = e.dir ?? -1;
      const speed = 100;

      e.setVelocityX(dir * speed);

      const minX = e.minX ?? 60;
      const maxX = e.maxX ?? this.scale.width - 60;

      // turn around at patrol boundaries
      if (e.x <= minX) e.dir = 1;
      if (e.x >= maxX) e.dir = -1;
    });
  }

  private fire() {
    const b = this.physics.add.sprite(this.player.x + 16, this.player.y, "");
    b.setSize(10, 6);
    b.setVisible(false);

    this.attachEmoji(b, "⚡", 20);

    b.body.allowGravity = false;
    b.setVelocityX(520);

    this.bullets.add(b);
    this.time.delayedCall(900, () => b.destroy());
  }

  private onReachExit() {
    if ((this as any)._exitLock) return;
    (this as any)._exitLock = true;

    if (this.state.roomIndex >= 5) return;

    this.scene.pause();
    this.scene.launch("quiz", {
      roomIndex: this.state.roomIndex,
      hearts: this.state.hearts,
      points: this.state.points,
      startTimeMs: this.state.startTimeMs,
    });
  }

  // Find a platform whose top is near the enemy (enemy y is usually platformY - ~25)
  private findPlatformForEnemy(platforms: PlatformDef[], ex: number, ey: number) {
    for (const p of platforms) {
      const [px, py, w = 90] = p;
      const expectedEnemyY = py - 25;

      // y close enough to be considered "on this platform"
      if (Math.abs(ey - expectedEnemyY) > 18) continue;

      // x should be within platform width
      const half = w / 2;
      if (ex >= px - half && ex <= px + half) {
        return { px, py, width: w };
      }
    }
    return null;
  }

  // rails for platform patrol (small padding so enemy doesn't visually clip off edge)
  private railsForPlatform(px: number, width: number) {
    const pad = 18;
    return { minX: px - width / 2 + pad, maxX: px + width / 2 - pad };
  }

  private setupFinalRoom(w: number, h: number) {
    this.hasFlower = false;

    // Pick a random platform in the final room and place the flower above it
    const cfg = ROOMS[this.state.roomIndex];
    const plats = cfg.platforms as any[];

    const pick = plats[Math.floor(Math.random() * plats.length)];
    const [px, py, pWidth = 120] = pick;

    // random x within platform width (padding so it doesn't hang off edge)
    const pad = 22;
    const fx = Phaser.Math.Between(px - pWidth / 2 + pad, px + pWidth / 2 - pad);
    const fy = py - 30;

    const flower = this.physics.add.sprite(fx, fy, "");
    flower.setSize(24, 24);
    flower.setVisible(false);
    flower.body.allowGravity = false;

    this.attachEmoji(flower, "🌸", 28);


    const queen = this.physics.add.sprite(w - 190, h - 140, "");
    queen.setSize(28, 38);
    queen.setVisible(false);
    queen.body.allowGravity = false;

    this.attachEmoji(queen, "👸", 34);


    // Make final room harder: extra enemies on ground + platforms
    // Ground enemies
    this.spawnEnemy(420, 520);
    this.spawnEnemy(620, 520);

    // Platform enemies with rails inferred automatically (because y matches a platform top)
    this.spawnEnemy(260, 385); // on platform y=410
    this.spawnEnemy(500, 325); // on platform y=350
    this.spawnEnemy(740, 265); // on platform y=290

    this.physics.add.overlap(this.player, flower, () => {
      flower.destroy();
      this.hasFlower = true;
      // (No score rule change requested for flower/queen, so leaving as-is)
      this.addPoints(250);
    });

    this.physics.add.overlap(this.player, queen, () => {
      if (!this.hasFlower) return;
      this.addPoints(500);
      this.endGame(true);
    });

    this.add
      .text(w / 2, 120, "Find the flower 🌸 and bring it to the Queen!", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#c7b9ff",
      })
      .setOrigin(0.5);
  }

  private updateUI() {
    const elapsedMs = Date.now() - this.state.startTimeMs;
    this.scene.get("ui").events.emit("ui:update", {
      hearts: this.state.hearts,
      room: this.state.roomIndex + 1,
      points: this.state.points,
      elapsedMs,
    });
  }

  public applyQuizResult(nextData: { hearts: number; points: number }) {
    this.state.hearts = nextData.hearts;
    this.state.points = nextData.points;

    // Always stop the quiz scene if it's still around
    if (this.scene.isActive("quiz") || this.scene.isPaused("quiz")) {
      this.scene.stop("quiz");
    }

    // If dead -> end game (do NOT resume or restart)
    if (this.state.hearts <= 0) {
      this.endGame(false);
      return;
    }

    // Continue to next room
    this.scene.resume(); // resume the room scene (it was paused)
    this.scene.restart({
      roomIndex: this.state.roomIndex + 1,
      hearts: this.state.hearts,
      points: this.state.points,
      startTimeMs: this.state.startTimeMs,
    });

    (this as any)._exitLock = false;
  }

  private endGame(won: boolean) {
    const elapsedMs = Date.now() - this.state.startTimeMs;
    this.scene.stop("ui");
    this.scene.start("end", {
      username: this.registry.get("username"),
      score: this.state.points,
      timeMs: elapsedMs,
      won,
    });
  }

  // NEW RULE: points are direct (no scaling) for kills.
  private addPoints(delta: number) {
    this.state.points += delta;
    this.updateUI();
  }


  private attachEmoji(
    target: Phaser.GameObjects.Sprite,
    emoji: string,
    size = 28
  ) {
    const txt = this.add
      .text(target.x, target.y, emoji, {
        fontSize: `${size}px`,
      })
      .setOrigin(0.5);
  
    // keep emoji synced to physics body
    this.events.on("update", () => {
      txt.setPosition(target.x, target.y);
    });
  
    // clean up automatically
    target.on("destroy", () => {
      txt.destroy();
    });
  
    return txt;
  }
  
}


