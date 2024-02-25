import { getRandomValues, randomInt } from 'crypto';
import Phaser, { Input, Scene } from 'phaser';

export default class TestScene extends Scene {
    private gridEngine!: any;
    private lastKeyPressTime: number = 0; // Track the time of the last key press

    constructor() {
        super('testscene');
    }

    preload() {
        // Preload assets for splash and title screens
    }

    create() {
        // Set up flag to track initialization status
        let isGridEngineInitialized = false;
        const map = this.make.tilemap({ key: 'testmap' });
        map.addTilesetImage('ZeldaLike', 'tiles');
        map.layers.forEach((layer, index) => {
            map.createLayer(index, 'ZeldaLike', 0, 0);
        });

        const heroSprite = this.physics.add.sprite(0, 0, 'hero', 1);
        const npcSprite = this.physics.add.sprite(0, 0, 'npc', 1);
        // *** Character Animations
        // hero
        this.createPlayerAnimation('hero','up',30,32);
        this.createPlayerAnimation('hero','right',16,18);
        this.createPlayerAnimation('hero','down',2,4);
        this.createPlayerAnimation('hero','left',44,46);
        this.createPlayerAnimation('hero','idle_up',29,29);
        this.createPlayerAnimation('hero','idle_right',15,15);
        this.createPlayerAnimation('hero','idle_down',1,1);
        this.createPlayerAnimation('hero','idle_left',43,43);
        //npc
        this.createPlayerAnimation('npc','up',30,32);
        this.createPlayerAnimation('npc','right',16,18);
        this.createPlayerAnimation('npc','down',2,4);
        this.createPlayerAnimation('npc','left',44,46);
        this.createPlayerAnimation('npc','idle_up',29,29);
        this.createPlayerAnimation('npc','idle_right',15,15);
        this.createPlayerAnimation('npc','idle_down',1,1);
        this.createPlayerAnimation('npc','idle_left',43,43);
        // *** 

        this.cameras.main.startFollow(heroSprite, true);
        this.cameras.main.setFollowOffset(-heroSprite.width, -heroSprite.height);

        const gridEngineConfig = {
            characters: [
                {
                    id: 'hero',
                    sprite: heroSprite,
                    startPosition: { x: 8, y: 8 }
                },
                {
                    id: 'npc0',
                    sprite: npcSprite,
                    startPosition: { x: 10, y: 8 },
                    speed: 1.5,
                }
            ]
        };

        this.gridEngine.create(map, gridEngineConfig);

        this.gridEngine.moveRandomly('npc0', 1500);

        this.gridEngine.movementStarted().subscribe(({ charId, direction }: { charId: string, direction: string }) => {
            //this.lastKeyPressTime = Date.now(); // Update the last key press time
            if (charId === 'hero') {
                heroSprite.anims.play(`hero_${direction}`);
            } else {
                if (charId.includes('npc')){
                    npcSprite.anims.play(`npc_${direction}`);
                    return;
                }
            }
            
        });
    
        this.gridEngine.movementStopped().subscribe(({ charId, direction }: { charId: string, direction: string }) => {
            if (charId === 'hero') {
                heroSprite.anims.play(`hero_idle_${direction}`);
                heroSprite.anims.stop();
            } else {
                if (charId.includes('npc')){
                    npcSprite.anims.play(`npc_idle_${direction}`);
                    npcSprite.anims.stop();
                    return;
                }
            }
        });
    
        this.gridEngine.directionChanged().subscribe(({ charId, direction }: { charId: string, direction: string }) => {
            if (charId === 'hero') {
                heroSprite.anims.play(`hero_idle_${direction}`);
            } else {
                if (charId.includes('npc')){
                    npcSprite.anims.play(`npc_idle_${direction}`);
                    return;
                }
            }
        });

        // Function to handle random movement
        const handleRandomMovement = () => {
            if (!isGridEngineInitialized) return; // Exit if gridEngine is not initialized

            const currentTime = Date.now();
            if (currentTime - this.lastKeyPressTime >= 10000) {
                const randomDirection = this.getRandomDirection();
                if(randomDirection === 'null') {
                    this.lastKeyPressTime = Date.now();
                    return;
                }
                heroSprite.anims.play(randomDirection);
                this.gridEngine.move('hero', randomDirection);
            }
        };

        // Timer for random movement
        this.time.addEvent({
            delay: 1000, // Check every second
            callback: handleRandomMovement,
            callbackScope: this,
            loop: true
        });

        // Update initialization flag after gridEngine is initialized
        isGridEngineInitialized = true;
    }

    // *** Create Anims
    createPlayerAnimation(
        spriteSheet: string,
        name: string,
        startFrame: number,
        endFrame: number,
    ) {
        this.anims.create({
          key: `${spriteSheet}_${name}`,
          frames: this.anims.generateFrameNumbers(spriteSheet, {
            start: startFrame,
            end: endFrame,
          }),
          frameRate: 4,
          repeat: -1,
          yoyo: true,
        });
    }
    // ***

    update() {
        const cursors = this.input.keyboard?.createCursorKeys();
        if (cursors) {
            if (cursors.left.isDown) {
                this.gridEngine.move('hero', 'left');
                this.lastKeyPressTime = Date.now(); // Update the last key press time
            } else if (cursors.right.isDown) {
                this.gridEngine.move('hero', 'right');
                this.lastKeyPressTime = Date.now(); // Update the last key press time
            } else if (cursors.up.isDown) {
                this.gridEngine.move('hero', 'up');
                this.lastKeyPressTime = Date.now(); // Update the last key press time
            } else if (cursors.down.isDown) {
                this.gridEngine.move('hero', 'down');
                this.lastKeyPressTime = Date.now(); // Update the last key press time
            }
        }
    }

    // Random direction generator
    private getRandomDirection() {
        const directions = ['up', 'down', 'left', 'right', 'null'];
        const randomIndex = Phaser.Math.Between(0, directions.length - 1);
        return directions[randomIndex];
    }
}