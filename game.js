// Sources:
// buttons: https://snowbillr.github.io/blog/2018-07-03-buttons-in-phaser-3/
// Multiple scenes: https://phaser.io/examples/v3/view/game-objects/lights/change-scene

import Phaser from "phaser"

let game;

const gameOptions = {
    playerGravity: 800,
    maxSpeed: 150,
    acceleration: 10,
    platformPairCount: 8
}

// There are better ways to do this
let currentGame = {
    time: 0,
    score: 0,
    level: 1
}

const howToPlay = `
Move using the arrow keys.

The goal of the game is to fall down 20 levels while collecting ores and
avoiding falling stalactites. Spending more time in levels loses you points.

Scoring:
Copper: +500, Silver: +1000, Gold: +2500, Diamond: +5000,
Falling down a level: +2500, Touching a falling stalactite: -10000
Score decreases by 500 every second.
`

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x333333,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 450
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: [MainMenu, PlayGame, GameOver]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

// Main menu scene
class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }
    preload() {
        this.load.image("background", "assets/background.png");
    }

    create() {
        let background = this.add.image(game.config.width / 2, game.config.height / 2, "background");
        background.setScale(Math.max(game.config.width / background.width, game.config.height / background.height))

        this.TitleText = this.add.text(48, 96, "Untitled :D", {fontFamily: "Ubuntu", fontSize: "48px", fill: "#ffffff"})
        this.HTPText = this.add.text(48, 212, "", {fontFamily: "Ubuntu", fontSize: "20px", fill: "#991111"})
        
        const playButton = this.add.text(48, 160, "Play", {fontFamily: "Ubuntu", fontSize: "24px", fill: "#bbbbbb"});
        playButton.setInteractive();

        playButton.on('pointerover', () => {
            playButton.setColor("#ffffff");
        });

        playButton.on('pointerout', () => {
            playButton.setColor("#bbbbbb");
        });

        playButton.on('pointerdown', () => {
            currentGame = {time: 0, score: 0, level: 1};
            this.scene.start("PlayGame");
        });

        const HTPButton = this.add.text(48, 192, "How to play", {fontFamily: "Ubuntu", fontSize: "24px", fill: "#bbbbbb"});
        HTPButton.setInteractive();

        HTPButton.on('pointerover', () => {
            HTPButton.setColor("#ffffff");
            this.HTPText.setText(howToPlay);
        });

        HTPButton.on('pointerout', () => {
            HTPButton.setColor("#bbbbbb");
            this.HTPText.setText("");
        });
    }

    update() {
    }
}

// Game over scene
class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }
    preload() {
        this.load.image("background", "assets/background.png");
    }

    create() {
        let background = this.add.image(game.config.width / 2, game.config.height / 2, "background");
        background.setScale(Math.max(game.config.width / background.width, game.config.height / background.height))

        this.GameOverText = this.add.text(24, 12, "You Completed the game!", {fontFamily: "Ubuntu", fontSize: "24px", fill: "#ffffff"});
        this.scoreText = this.add.text(24, 36, "Final score " + currentGame.score, {fontFamily: "Ubuntu", fontSize: "24px", fill: "#ffffff"});
        this.timeText = this.add.text(24, 60, "Final time " + Math.round(currentGame.time * 100) / 100 + " seconds", {fontFamily: "Ubuntu", fontSize: "24px", fill: "#ffffff"});

        const playButton = this.add.text(48, 160, "Play Again", {fontFamily: "Ubuntu", fontSize: "24px", fill: "#bbbbbb"});
        playButton.setInteractive();

        playButton.on('pointerover', () => {
            playButton.setColor("#ffffff");
        });

        playButton.on('pointerout', () => {
            playButton.setColor("#bbbbbb");
        });

        playButton.on('pointerdown', () => {
            currentGame = {time: 0, score: 0, level: 1};
            this.scene.start("PlayGame");
        });

        const menuButton = this.add.text(48, 192, "Main menu", {fontFamily: "Ubuntu", fontSize: "24px", fill: "#bbbbbb"});
        menuButton.setInteractive();

        menuButton.on('pointerover', () => {
            menuButton.setColor("#ffffff");
        });

        menuButton.on('pointerout', () => {
            menuButton.setColor("#bbbbbb");
        });

        menuButton.on('pointerdown', () => {
            this.scene.start("MainMenu");
        });
    }

    update() {
    }
}

// Main scene to playing
class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
        this.TriggerTimer = Phaser.Time.TimerEvent;
        this.StalactiteTimer = Phaser.Time.TimerEvent;
    }

    preload() {
        this.load.image("background", "assets/background.png");
        this.load.image("platform", "assets/platform.png");
        this.load.image("copper", "assets/copper.png");
        this.load.image("silver", "assets/silver.png");
        this.load.image("gold", "assets/gold.png");
        this.load.image("diamond", "assets/diamond.png");
        this.load.spritesheet("player", "assets/player.png", {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("stalactite", "assets/stalactite.png", {frameWidth: 16, frameHeight: 16});
    }

    create() {
        // Creating non level specific elements
        let background = this.add.image(game.config.width / 2, game.config.height / 2, "background");
        background.setScale(Math.max(game.config.width / background.width, game.config.height / background.height))

        const menuButton = this.add.text(game.config.width - 150, 12, "Main menu", {fontFamily: "Ubuntu", fontSize: "24px", fill: "#bbbbbb"});
        menuButton.setInteractive();

        menuButton.on('pointerover', () => {
            menuButton.setColor("#ffffff");
        });

        menuButton.on('pointerout', () => {
            menuButton.setColor("#bbbbbb");
        });

        menuButton.on('pointerdown', () => {
            this.scene.start("MainMenu");
        });

        this.levelText = this.add.text(24, 12, "Level " + currentGame.level, {fontFamily: "Ubuntu", fontSize: "24px", fill: "#ffffff"})
        this.scoreText = this.add.text(24, 36, "Score " + currentGame.score, {fontFamily: "Ubuntu", fontSize: "24px", fill: "#ffffff"})
        this.timeText = this.add.text(24, 60, "Time " + currentGame.time, {fontFamily: "Ubuntu", fontSize: "24px", fill: "#ffffff"})
        
        // Creating the level
        this.platformGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        this.copperGroup = this.physics.add.group();
        this.silverGroup = this.physics.add.group();
        this.goldGroup = this.physics.add.group();
        this.diamondGroup = this.physics.add.group();
        this.stalactiteGroup = this.physics.add.group({});

        this.generateLevelObjects();
        
        // Spawning the player
        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height * 0.05, "player");
        this.player.body.gravity.y = gameOptions.playerGravity;
        
        // Adding collision between objects
        this.physics.add.collider(this.player, this.platformGroup);
        this.physics.add.collider(this.platformGroup, this.copperGroup);
        this.physics.add.collider(this.platformGroup, this.silverGroup);
        this.physics.add.collider(this.platformGroup, this.goldGroup);
        this.physics.add.collider(this.platformGroup, this.diamondGroup);

        this.physics.add.overlap(this.player, this.copperGroup, this.collectCopper, null, this);
        this.physics.add.overlap(this.player, this.silverGroup, this.collectSilver, null, this);
        this.physics.add.overlap(this.player, this.goldGroup, this.collectGold, null, this);
        this.physics.add.overlap(this.player, this.diamondGroup, this.collectDiamond, null, this);

        this.physics.add.overlap(this.player, this.stalactiteGroup, this.playerDied, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Event timers
        this.TriggerTimer = this.time.addEvent({
            callback: this.scoring,
            callbackScope: this,
            delay: 100,
            loop: true
        });

        this.StalactiteTimer = this.time.addEvent({
            callback: this.spawnStalactite,
            callbackScope: this,
            delay: 400 - (10 * currentGame.level),
            loop: true
        });
    }

    generateLevelObjects() {
        // Genering level objects
        // Starting platform
        this.platformGroup.create(game.config.width / 2, game.config.height * 0.2, "platform");

        // platforms, ores and enemies
        for (let i = 0; i < gameOptions.platformPairCount; i++) {
            let spawnRandomizer = Phaser.Math.Between(1, 3);
            let oreRandomizer = Phaser.Math.Between(1, 10);

            let x = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
            let x2 = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
            let y = game.config.height * 0.3 + i * game.config.height * 0.7 / gameOptions.platformPairCount;
            let y2 = y - 12;

            this.platformGroup.create(x, y, "platform");
            this.platformGroup.create(x2, y, "platform");
            
            // Randomize ore spawns
            switch (spawnRandomizer) {
                case 1:
                    break;
                case 2:
                case 3:
                    switch (oreRandomizer) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            this.copperGroup.create(x, y2, "copper");
                            break;
                        case 5:
                        case 6:
                        case 7:
                            this.silverGroup.create(x, y2, "silver");
                            break;
                        case 8:
                        case 9:
                            this.goldGroup.create(x, y2, "gold");
                            break;
                        case 10: 
                            this.diamondGroup.create(x, y2, "diamond");
                            break;
                    }
                    break;
            }
        }
    }

    // Unloading level specific elements
    unloadLevel() {
        this.platformGroup.clear(true, false);
        this.copperGroup.clear(true, false);
        this.silverGroup.clear(true, false);
        this.goldGroup.clear(true, false);
        this.diamondGroup.clear(true, false);
        this.stalactiteGroup.clear(true, false);

        // Resetting the players position and velocity
        this.player.setPosition(game.config.width / 2, game.config.height * 0.05);
        this.player.body.velocity.y = gameOptions.maxSpeed;
    }

    // Time penalty
    scoring() {
        currentGame.score -= 50;
        currentGame.time += 0.1;
    }

    // There is probably a better way to do this to all of the ores using the same function
    collectCopper(player, ore) {
        ore.disableBody(true, true);
        currentGame.score += 500;
    }

    collectSilver(player, ore) {
        ore.disableBody(true, true);
        currentGame.score += 1000;
    }

    collectGold(player, ore) {
        ore.disableBody(true, true);
        currentGame.score += 2500;
    }

    collectDiamond(player, ore) {
        ore.disableBody(true, true);
        currentGame.score += 5000;
    }

    // Spawning falling stalactites
    spawnStalactite() {
        let x = Phaser.Math.Between(0, game.config.width);
        if (Phaser.Math.Between(0,1) && !(x > (game.config.width / 2 - 30) && x < (game.config.width / 2 + 30))) {
            this.stalactiteGroup.create(x, 0, "stalactite");
            this.stalactiteGroup.setVelocityY(gameOptions.maxSpeed);
        }
    }

    // Removing points and resetting the players position & velocity
    playerDied(player, stalactite) {
        currentGame.score -= 10000
        player.setPosition(game.config.width / 2, game.config.height * 0.05);
        this.player.body.velocity.y = gameOptions.maxSpeed;
    }

    
    update() {
        this.timeText.setText("Time " + Math.round(currentGame.time * 100) / 100 + " seconds")
        this.scoreText.setText("Score " + currentGame.score)

        // Input handling
        // There is a built in way to handle acceleration in Phaser but I wanted to try to do it manually and succeeded :D
        if (this.cursors.left.isDown) {
            // if moving to the opposite direction, deaccelerate with multiplier
            // else if already close to max speed, set to max speed
            // else, accelerate
            if (this.player.body.velocity.x > 0) {
                if (this.player.body.touching.down) {
                    this.player.body.velocity.x -= 2 * gameOptions.acceleration;
                } else {
                    this.player.body.velocity.x -= gameOptions.acceleration;
                }
            } else if (this.player.body.velocity.x < -(gameOptions.maxSpeed - gameOptions.acceleration)) {
                this.player.body.velocity.x = -gameOptions.maxSpeed;
            } else {
                this.player.body.velocity.x -= gameOptions.acceleration;
            }
        } else if (this.cursors.right.isDown) {
            // if moving to the opposite direction, deaccelerate with multiplier
            // else if already close to max speed, set to max speed
            // else, accelerate
            if (this.player.body.velocity.x < 0) {
                if (this.player.body.touching.down) {
                    this.player.body.velocity.x += 2 * gameOptions.acceleration;
                } else {
                    this.player.body.velocity.x += gameOptions.acceleration;
                }
            } else if (this.player.body.velocity.x > (gameOptions.maxSpeed - gameOptions.acceleration)) {
                this.player.body.velocity.x = gameOptions.maxSpeed;
            } else {
                this.player.body.velocity.x += gameOptions.acceleration;
            }
        } else {
            // Acceleration multiplier changes depending if the player is or is not touching the ground
            if (this.player.body.touching.down) {
                if (this.player.body.velocity.x <= 2 * gameOptions.acceleration && this.player.body.velocity.x >= 2 * -gameOptions.acceleration) {
                    this.player.body.velocity.x = 0;
                } else if (this.player.body.velocity.x > 0) {
                    this.player.body.velocity.x -= 2 * gameOptions.acceleration;
                } else {
                    this.player.body.velocity.x += 2 * gameOptions.acceleration;
                }
            } else {
                if (this.player.body.velocity.x <= 0.5 * gameOptions.acceleration && this.player.body.velocity.x >= 0.5 * -gameOptions.acceleration) {
                    this.player.body.velocity.x = 0;
                } else if (this.player.body.velocity.x > 0) {
                    this.player.body.velocity.x -= 0.5 * gameOptions.acceleration;
                } else {
                    this.player.body.velocity.x += 0.5 * gameOptions.acceleration;
                }
            }
        }

        // Jumping
        if(this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-gameOptions.playerGravity / 2);
        }

        // Level transition
        if (this.player.y > game.config.height) {
            currentGame.score += 2500;

            if (currentGame.level == 20) {
                this.scene.start("GameOver");
            } else {
                currentGame.level += 1;
            }

            console.log("unloading level...");
            this.unloadLevel();
            console.log("generating new level...");
            this.generateLevelObjects();
            console.log("New level created.");
            this.levelText.setText("Level " + currentGame.level)
        }
    }
}