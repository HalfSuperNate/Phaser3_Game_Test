import { createInteractiveGameObject } from '../utils';
import Phaser, { Input, Scene } from 'phaser';

export default class TestScene extends Scene {
    private gridEngine!: any;
    private lastKeyPressTime: number = 0; // Track the time of the last key press
    private heroActionCollider!: Phaser.GameObjects.Rectangle;

    constructor() {
        super('testscene');
    }

    preload() {
        // Preload assets for splash and title screens
    }

    create() {
        const isDebugMode = this.physics.config.debug;
        // Set up flag to track initialization status
        let isGridEngineInitialized = false;
        const interactiveLayers = this.add.group();
        const map = this.make.tilemap({ key: 'testmap' });
        map.addTilesetImage('ZeldaLike', 'tiles');

        const heroSprite = this.physics.add.sprite(0, 0, 'hero', 1);
        const npcSprite = this.physics.add.sprite(0, 0, 'npc', 1);

        map.layers.forEach((layer, index) => {
            const mapLayer = map.createLayer(index, 'ZeldaLike', 0, 0);
            if (mapLayer) {
                if (layer.name == 'bushes' || layer.name == 'boxes') {
                    interactiveLayers.add(mapLayer);
                }
                this.physics.add.collider(heroSprite, mapLayer);
            } else {
                console.error(`Failed to create layer for index ${index}`);
            }
        });

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
        
        this.heroActionCollider = createInteractiveGameObject(
            this,
            heroSprite.x,
            heroSprite.y,
            16,
            16,
            'action',
            isDebugMode
        );

        this.heroActionCollider.update = () => {
            const facingDirection = this.gridEngine.getFacingDirection('hero');

            switch (facingDirection) {
                case 'down': {
                    this.heroActionCollider.setX(heroSprite.x);
                    this.heroActionCollider.setY(heroSprite.y + 40);
                    break;
                }
                case 'up': {
                    this.heroActionCollider.setX(heroSprite.x);
                    this.heroActionCollider.setY(heroSprite.y);
                    break;
                }
                case 'left': {
                    this.heroActionCollider.setX(heroSprite.x - 16);
                    this.heroActionCollider.setY(heroSprite.y + 24);
                    break;
                }
                case 'right': {
                    this.heroActionCollider.setX(heroSprite.x + 16);
                    this.heroActionCollider.setY(heroSprite.y + 24);
                    break;
                }
            
                default: {
                    break;
                }
            }
        };

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
            if (charId === 'hero') {
                heroSprite.anims.play(`hero_${direction}`);
            } else {
                let _sprite = this.gridEngine.getSprite(charId);
                if (charId.includes('npc')){
                    _sprite.anims.play(`npc_${direction}`);
                    return;
                }
            }
        });
    
        this.gridEngine.movementStopped().subscribe(({ charId, direction }: { charId: string, direction: string }) => {
            if (charId === 'hero') {
                heroSprite.anims.play(`hero_idle_${direction}`);
                heroSprite.anims.stop();
            } else {
                let _sprite = this.gridEngine.getSprite(charId);
                if (charId.includes('npc')){
                    _sprite.anims.play(`npc_idle_${direction}`);
                    _sprite.anims.stop();
                    return;
                }
            }
        });
    
        this.gridEngine.directionChanged().subscribe(({ charId, direction }: { charId: string, direction: string }) => {
            if (charId === 'hero') {
                heroSprite.anims.play(`hero_idle_${direction}`);
            } else {
                let _sprite = this.gridEngine.getSprite(charId);
                if (charId.includes('npc')){
                    _sprite.anims.play(`npc_idle_${direction}`);
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
            this.heroActionCollider.update();
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