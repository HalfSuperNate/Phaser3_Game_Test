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
        // *** Character Animations
        this.createPlayerAnimation('up',30,32);
        this.createPlayerAnimation('right',16,18);
        this.createPlayerAnimation('down',2,4);
        this.createPlayerAnimation('left',44,46);
        this.createPlayerAnimation('idle_up',29,29);
        this.createPlayerAnimation('idle_right',15,15);
        this.createPlayerAnimation('idle_down',1,1);
        this.createPlayerAnimation('idle_left',43,43);
        // *** 

        this.cameras.main.startFollow(heroSprite, true);
        this.cameras.main.setFollowOffset(-heroSprite.width, -heroSprite.height);

        const gridEngineConfig = {
            characters: [
                {
                    id: 'hero',
                    sprite: heroSprite,
                    startPosition: { x: 8, y: 8 }
                }
            ]
        };

        this.gridEngine.create(map, gridEngineConfig);

        this.gridEngine.movementStarted().subscribe(({ direction }: { direction: string }) => {
            //this.lastKeyPressTime = Date.now(); // Update the last key press time
            heroSprite.anims.play(direction);
        });
    
        this.gridEngine.movementStopped().subscribe(({ direction }: { direction: string }) => {
            heroSprite.anims.play(`idle_${direction}`);
            heroSprite.anims.stop();
            
        });
    
        this.gridEngine.directionChanged().subscribe(({ direction }: { direction: string }) => {
            heroSprite.anims.play(`idle_${direction}`);
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
        name: string,
        startFrame: number,
        endFrame: number,
    ) {
        this.anims.create({
          key: name,
          frames: this.anims.generateFrameNumbers("hero", {
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