import { createInteractiveGameObject } from '../utils/utils';
import Phaser, { Input, Scene } from 'phaser';
import EventManager from '../components/EventManager';
import TotalSupplyFetcher from '../utils/TotalSupplyFetcher';
import { dialogues } from '../utils/dialogues';

interface MovementEventData {
    direction: string;
}

const eventManager = EventManager.getInstance();
const random = new Phaser.Math.RandomDataGenerator();

export default class TestScene extends Scene {
    private gridEngine!: any;
    private lastKeyPressTime: number = 0; // Track the time of the last key press
    private heroActionCollider!: Phaser.GameObjects.Rectangle;
    private numNPCs: number = 0;

    constructor() {
        super('testscene');
    }

    preloadComplete = false;
    createComplete = false;
    isAttacking = false;
    isMoving = false;
    isDialog = false;

    async preload() {
        // Preload assets for splash and title screens
        this.preloadComplete = true;
    }

    async create() {
        await this.preload();
        const isDebugMode = this.physics.config.debug;
        // Set up flag to track initialization status
        let isGridEngineInitialized = false;
        const interactiveLayers = this.add.group();
        const map = this.make.tilemap({ key: 'testmap' });
        map.addTilesetImage('ZeldaLike', 'tiles');

        let currentHeroSprite: Phaser.Physics.Arcade.Sprite;
        const heroSprite = this.physics.add.sprite(0, 0, 'hero', 1);
        currentHeroSprite = heroSprite;
        const npcSprite = this.physics.add.sprite(0, 0, 'npc', 1);

        map.layers.forEach((layer, index) => {
            const mapLayer = map.createLayer(index, 'ZeldaLike', 0, 0);
            if (mapLayer) {
                if (layer.name == 'bushes' || layer.name == 'boxes'|| layer.name == 'signs') {
                    interactiveLayers.add(mapLayer);
                }
                this.physics.add.collider(heroSprite, mapLayer);
            } else {
                console.error(`Failed to create layer for index ${index}`);
            }
        });

        // *** Character Animations
        // hero
        this.createAnimation('hero','up',11,14,32,24,-1,true);
        this.createAnimation('hero','right',6,9,32,24,-1,true);
        this.createAnimation('hero','down',1,4,32,24,-1,true);
        this.createAnimation('hero','left',16,19,32,24,-1,true);
        this.createAnimation('hero','idle_up',11,11,32,24,-1,true);
        this.createAnimation('hero','idle_right',6,6,32,24,-1,true);
        this.createAnimation('hero','idle_down',1,1,32,24,-1,true);
        this.createAnimation('hero','idle_left',16,16,32,24,-1,true);
        this.createAnimation('hero','show',81,81,32,24,-1,true);
        this.createAnimation('hero','attack_down',21,24,32,24,0,false);
        this.createAnimation('hero','attack_left',26,29,32,24,0,false);
        this.createAnimation('hero','attack_up',31,34,32,24,0,false);
        this.createAnimation('hero','attack_right',36,39,32,24,0,false);
        //npc
        this.createAnimation('npc','up',11,14,32,24,-1,true);
        this.createAnimation('npc','right',6,9,32,24,-1,true);
        this.createAnimation('npc','down',1,4,32,24,-1,true);
        this.createAnimation('npc','left',16,19,32,24,-1,true);
        this.createAnimation('npc','idle_up',11,11,32,24,-1,true);
        this.createAnimation('npc','idle_right',6,6,32,24,-1,true);
        this.createAnimation('npc','idle_down',1,1,32,24,-1,true);
        this.createAnimation('npc','idle_left',16,16,32,24,-1,true);
        // *** 

        //*** CAMERA ***
        let isDragging = false;
        let lastPointerPosition: { x: number, y: number } | null = null;
        // Define a variable to track the camera mode
        let isPanningMode = false;

        // Function to toggle between panning and follow modes
        const toggleCameraMode = () => {
            if (isPanningMode) {
                // Remove event listeners for panning
                this.input.off('pointerdown');
                this.input.off('pointerup');
                this.input.off('pointermove');

                // Follow main character
                this.cameras.main.startFollow(currentHeroSprite, true);
                this.cameras.main.setFollowOffset(-currentHeroSprite.width, -currentHeroSprite.height);
            } else {
                // Stop following main character (if it's already following)
                this.cameras.main.stopFollow();

                // Add event listeners to handle mouse drag for panning
                this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                    isDragging = true;
                    lastPointerPosition = { x: pointer.position.x, y: pointer.position.y };
                });

                this.input.on('pointerup', () => {
                    isDragging = false;
                    lastPointerPosition = null;
                });

                this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
                    if (isDragging && lastPointerPosition) {
                        // Calculate the distance moved since the last frame
                        const dx = pointer.position.x - lastPointerPosition.x;
                        const dy = pointer.position.y - lastPointerPosition.y;

                        // Invert the direction of movement for both X and Y axes
                        const invertedDx = -dx;
                        const invertedDy = -dy;

                        // Adjust the camera position by the inverted distance
                        this.cameras.main.scrollX += invertedDx;
                        this.cameras.main.scrollY += invertedDy;

                        // Round the camera position to the nearest pixel
                        this.cameras.main.scrollX = Math.round(this.cameras.main.scrollX);
                        this.cameras.main.scrollY = Math.round(this.cameras.main.scrollY);

                        // Update the last pointer position
                        lastPointerPosition = { x: pointer.position.x, y: pointer.position.y };
                    }
                });
            }

            // Toggle the camera mode flag
            isPanningMode = !isPanningMode;
            console.log("Camera is Panning: " + `${isPanningMode}`);
        };

        // Call toggleCameraMode to switch between camera modes
        toggleCameraMode();
        //*** CAMERA END ***
        
        //*** MAIN CHARACTER COLLIDER ***
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
                    this.heroActionCollider.setX(heroSprite.x + 10);
                    this.heroActionCollider.setY(heroSprite.y + 35);
                    break;
                }
                case 'up': {
                    this.heroActionCollider.setX(heroSprite.x + 10);
                    this.heroActionCollider.setY(heroSprite.y + 10);
                    break;
                }
                case 'left': {
                    this.heroActionCollider.setX(heroSprite.x);
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
        //*** MAIN CHARACTER COLLIDER END ***

        let gridEngineConfig = {
            characters: [
                {
                    id: 'hero',
                    sprite: currentHeroSprite,
                    startPosition: { x: 8, y: 8 }
                },
                {
                    id: 'npc0',
                    sprite: npcSprite,
                    startPosition: { x: 0, y: 11 },
                    speed: 1.5,
                }
            ]
        };

        //*** NPC SPAWNER ***
        // Create an array to store references to all NPC sprites
        const npcSprites: Phaser.Physics.Arcade.Sprite[] = [];

        // Listen for the totalSupplyFetched event
        EventManager.getInstance().addEventListener('totalSupplyFetched', (totalSupply: number) => {
            //console.log('Total supply fetched:', totalSupply);
            // Handle the total supply data here, e.g., store it in a variable or use it in your scene
            this.numNPCs = totalSupply;
        });

        // Fetch total supply
        await TotalSupplyFetcher.fetchTotalSupply();

        // Define the number of NPCs you want to create
        const numNPCs = this.numNPCs; //171; // totalSupply from contract
        console.log("Spawned NPCs:", numNPCs);

        // Define the NPC sprite configuration (assuming npcSprite is defined elsewhere)
        const npcSpriteConfig = { x: 0, y: 0, texture: 'npc', frame: 1 };

        // Iterate to create each NPC sprite
        for (let i = 0; i < numNPCs; i++) {
            // Clone the existing NPC sprite
            const npcSprite = this.physics.add.sprite(npcSpriteConfig.x, npcSpriteConfig.y, npcSpriteConfig.texture, npcSpriteConfig.frame);

            // Add NPC sprite to the array
            npcSprites.push(npcSprite);
            
            // Configure each NPC sprite as needed
            // For example, you can set different positions for each NPC sprite
            //npcSprite.setPosition( /* Set position here */ );
            let X = 0;
            let Y = 0;
            if (i < 30 ) {
                X = i;
                Y = 11;
            } else if (i < 60) {
                X = 0;
                Y = 12;
            } else if (i < 90) {
                X = 3;
                Y = 13;
            } else if (i < 120) {
                X = 25;
                Y = 3;
            } else if (i < 150) {
                X = 25;
                Y = 16;
            } else if (i < 180) {
                X = 16;
                Y = 16;
            }

            // Add the NPC sprite to the grid engine configuration or handle its behavior
            gridEngineConfig.characters.push({
                id: `npc${i}`, // Unique ID for the NPC
                sprite: npcSprite,
                startPosition: { x: X, y: Y },
                speed: 1.5,
                // Add any other properties or configurations needed for the NPC
            });
        }

        this.gridEngine.create(map, gridEngineConfig);
        for (let i = 1; i < numNPCs; i++) {
            this.gridEngine.moveRandomly(`npc${i}`, random.integerInRange(500, 1500)); // Move NPC randomly
        }
        //this.gridEngine.moveRandomly('npc0', 1500); // original NPC
        //*** NPC SPAWNER END ***

        this.gridEngine.movementStarted().subscribe(({ charId, direction }: { charId: string, direction: string }) => {
            if (charId === 'hero') {
                this.isMoving = true;
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
                this.isMoving = false;
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

        // Helper function to handle interaction logic
        const handleInteraction = (tile: Phaser.Tilemaps.Tile | Phaser.Physics.Arcade.Sprite) => {
            if (tile instanceof Phaser.Tilemaps.Tile) {
                switch (tile.layer?.name) {
                    case 'bushes': {
                        if (this.isAttacking) {
                            this.time.delayedCall(50, () => {
                                tile.setVisible(false);
                                tile.properties.ge_collide = false;
                                //tile.destroy(); causes an error if walked over after destroy
                            });
                        }
                        break;
                    }
                    case 'signs': {
                        if (this.isAttacking && !this.isDialog) {
                            const facingDirection = this.gridEngine.getFacingDirection('hero')
                            heroSprite.anims.play(`hero_idle_${facingDirection}`);
                            //console.log('DISPLAY SIGN MESSAGE');
                            // Trigger the dialog when interacting with signs
                            const _dialogues = [
                                dialogues[0],
                                dialogues[1],
                                dialogues[2]
                            ];
                            eventManager.emitEvent('openDialog', _dialogues);
                            this.isDialog = true;
                        } else {
                            this.isDialog = false;
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
            } else if (tile instanceof Phaser.Physics.Arcade.Sprite) {
                // Handle sprite interaction here if needed
            }
        };

        this.physics.add.overlap(
            this.heroActionCollider,
            interactiveLayers,
            (objA, objB) => {
                const tile = [objA, objB].find<Phaser.Tilemaps.Tile>(
                    (obj): obj is Phaser.Tilemaps.Tile =>
                        obj instanceof Phaser.Tilemaps.Tile
                );
                // Check if tile is defined before calling handleInteraction
                if (tile && tile.properties.ge_collide) {
                    handleInteraction(tile);
                }
            },
            undefined, // context
            this // overlapCallbackContext, set to 'this' to use the current scene as the context for the callback
        );

        // Function to handle random movement
        const handleRandomMovement = () => {
            if (!isGridEngineInitialized) return;

            const currentTime = Date.now();
            const numOfMoves = 5;
            if (currentTime - this.lastKeyPressTime >= 10000) {
                this.gridEngine.setSpeed('hero', 1.5);
                for (let i = 0; i < numOfMoves; i++) {
                    this.addQueueMovement(this.getRandomDirection());
                }
                //const randomDirection = this.getRandomDirection();
                //this.addQueueMovement(randomDirection);
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

        eventManager.addEventListener('movement', (data: MovementEventData) => {
            if (data.direction === 'toggleCameraMode') {toggleCameraMode(); return;}
            this.inputPressed();
            if (data.direction === 'attack') {
                const currentDirection = this.gridEngine.getFacingDirection('hero');
                heroSprite.anims.play(`hero_attack_${currentDirection}`);
                this.isAttacking = true;
                this.time.delayedCall(500, () => {
                    if (this.isMoving) {
                        heroSprite.anims.play(`hero_${currentDirection}`);
                    } else {
                        heroSprite.anims.play(`hero_idle_${currentDirection}`);
                    }
                    // Set isAttacking back to false
                    this.isAttacking = false;
                });
                return;
            }

            // Check if move direction is blocked
            const nextPosition = this.gridEngine.getTilePosInDirection('hero', undefined, data.direction);
            const isNextPositionBlocked = this.gridEngine.isBlocked(nextPosition);

            if (isNextPositionBlocked) {
                this.gridEngine.move('hero', data.direction);
            }

            // Handle movement based on the direction provided in the data   
            this.gridEngine.addQueueMovements('hero', [data.direction], {
                pathBlockedStrategy: 'SKIP',
                pathBlockedWaitTimeoutMs: 1000,
            });      
        });

        this.createComplete = true;
    }

    // *** Create Anims
    createAnimation(
        spriteSheet: string,
        name: string,
        startFrame: number,
        endFrame: number,
        frameWidth: number,
        frameHeight: number,
        repeat: number,
        yoyo: boolean
    ) {
        const frames = [];
        let _frameRate = 4;
        if (name.includes('attack')){
            // attack anim speed
            _frameRate = 12;
        }

        for (let i = startFrame; i <= endFrame; i++) {
            frames.push({
                key: spriteSheet,
                frame: i,
                duration: 0,
                frameWidth: frameWidth,
                frameHeight: frameHeight
            });
        }

        this.anims.create({
          key: `${spriteSheet}_${name}`,
          frames: frames,
          frameRate: _frameRate,
          repeat: repeat, // -1 for infinite
          yoyo: yoyo,
        });
    }
    // ***

    update() {
        if(!this.createComplete) return;
        const cursors = this.input.keyboard?.createCursorKeys();
        const spaceKey = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.SPACE);
        const heroSprite = this.gridEngine.getSprite('hero');
        const currentDirection = this.gridEngine.getFacingDirection('hero');
        this.heroActionCollider.update();

        if (cursors && spaceKey) {
            if (Input.Keyboard.JustDown(spaceKey)) {
                this.inputPressed();
                heroSprite.anims.play(`hero_attack_${currentDirection}`);
                this.isAttacking = true;
                this.time.delayedCall(500, () => {
                    if (this.isMoving) {
                        heroSprite.anims.play(`hero_${currentDirection}`);
                    } else {
                        heroSprite.anims.play(`hero_idle_${currentDirection}`);
                    }
                    // Set isAttacking back to false
                    this.isAttacking = false;
                });
            } else if (cursors.left.isDown && !this.isAttacking) {
                this.moveCharacter('left');
            } else if (cursors.right.isDown && !this.isAttacking) {
                this.moveCharacter('right');
            } else if (cursors.up.isDown && !this.isAttacking) {
                this.moveCharacter('up');
            } else if (cursors.down.isDown && !this.isAttacking) {
                this.moveCharacter('down');
            }
        }
    }

    moveCharacter(direction: string) {
        this.inputPressed();
        switch (direction) {
            case 'up':
                this.gridEngine.move('hero', 'up');
                break;
            case 'down':
                this.gridEngine.move('hero', 'down');
                break;
            case 'left':
                this.gridEngine.move('hero', 'left');
                break;
            case 'right':
                this.gridEngine.move('hero', 'right');
                break;
            default:
                break;
        }
    }

    private addQueueMovement(direction: string) {
        if(direction === 'wait') {
            this.time.delayedCall(3000, () => {
                //wait 3 sec
            });
            return;
        }

        this.gridEngine.addQueueMovements('hero', [direction], {
            pathBlockedStrategy: 'SKIP',
            pathBlockedWaitTimeoutMs: 1000,
        });
    }

    private inputPressed() {
        this.lastKeyPressTime = Date.now(); // Update the last key press time
        this.gridEngine.clearEnqueuedMovements('hero');
        this.gridEngine.setSpeed('hero', 4);
    }

    // Random direction generator
    private getRandomDirection() {
        const directions = ['up', 'down', 'left', 'right', 'wait'];
        const randomIndex = Phaser.Math.Between(0, directions.length - 1);
        return directions[randomIndex];
    }
}