import { createInteractiveGameObject } from '../utils';
import Phaser, { Input, Scene } from 'phaser';
import EventManager from '../components/EventManager';

interface MovementEventData {
    direction: string;
}

interface Dialogue {
    dialogType: string;
    message: string;
}

const eventManager = EventManager.getInstance();

export default class TestScene extends Scene {
    private gridEngine!: any;
    private lastKeyPressTime: number = 0; // Track the time of the last key press
    private heroActionCollider!: Phaser.GameObjects.Rectangle;

    constructor() {
        super('testscene');
    }

    isAttacking = false;
    isMoving = false;
    isDialog = false;

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

        let currentHeroSprite: Phaser.Physics.Arcade.Sprite;
        const heroSprite = this.physics.add.sprite(0, 0, 'hero', 1);
        currentHeroSprite = heroSprite;
        const heroAtkSprite = this.physics.add.sprite(-10, -10, 'heroAtk', 34);
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
        this.createAnimation('hero','up',30,32,16,24,-1,true);
        this.createAnimation('hero','right',16,18,16,24,-1,true);
        this.createAnimation('hero','down',2,4,16,24,-1,true);
        this.createAnimation('hero','left',44,46,16,24,-1,true);
        this.createAnimation('hero','idle_up',29,29,16,24,-1,true);
        this.createAnimation('hero','idle_right',15,15,16,24,-1,true);
        this.createAnimation('hero','idle_down',1,1,16,24,-1,true);
        this.createAnimation('hero','idle_left',43,43,16,24,-1,true);
        this.createAnimation('hero','show',108,108,16,24,-1,true);
        this.createAnimation('heroAtk','attack_down',30,33,32,24,0,false);
        this.createAnimation('heroAtk','attack_left',37,40,32,24,0,false);
        this.createAnimation('heroAtk','attack_up',44,47,32,24,0,false);
        this.createAnimation('heroAtk','attack_right',51,54,32,24,0,false);
        //npc
        this.createAnimation('npc','up',30,32,16,24,-1,true);
        this.createAnimation('npc','right',16,18,16,24,-1,true);
        this.createAnimation('npc','down',2,4,16,24,-1,true);
        this.createAnimation('npc','left',44,46,16,24,-1,true);
        this.createAnimation('npc','idle_up',29,29,16,24,-1,true);
        this.createAnimation('npc','idle_right',15,15,16,24,-1,true);
        this.createAnimation('npc','idle_down',1,1,16,24,-1,true);
        this.createAnimation('npc','idle_left',43,43,16,24,-1,true);
        // *** 

        //*** CAMERA ***
        // Follow main character
        // this.cameras.main.startFollow(currentHeroSprite, true);
        // this.cameras.main.setFollowOffset(-currentHeroSprite.width, -currentHeroSprite.height);

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
        //*** MAIN CHARACTER COLLIDER END ***

        const gridEngineConfig = {
            characters: [
                {
                    id: 'hero',
                    sprite: currentHeroSprite,
                    startPosition: { x: 8, y: 8 }
                },
                {
                    id: 'npc0',
                    sprite: npcSprite,
                    startPosition: { x: 10, y: 8 },
                    speed: 1.5,
                },
                {
                    id: 'heroAtk',
                    sprite: heroAtkSprite,
                    startPosition: { x: -10, y: -10 },
                    speed: 0,
                }
            ]
        };

        this.gridEngine.create(map, gridEngineConfig);

        this.gridEngine.moveRandomly('npc0', 1500);

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
                            const dialogues = [
                                { dialogType: 'Sign Says...', message: 'Hello World' },
                                { dialogType: 'Sign Says...', message: 'End' },
                                // Add more dialogues if needed
                            ];
                            eventManager.emitEvent('openDialog', dialogues);
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

        //*** ONSCREEN KEYS ***
        // // Create a white box graphics object
        // const whiteBox = this.add.graphics();
        
        // // Set the fill style to white
        // whiteBox.fillStyle(0xffffff, 1);
        
        // // Draw a rectangle representing the white box
        // whiteBox.fillRect(0, this.cameras.main.height - 100, 100, 100); // Adjust size as needed
        
        // // Set the depth of the white box to ensure it's rendered on top of other elements
        // whiteBox.setDepth(Number.MAX_SAFE_INTEGER);
        
        // // Set the white box to ignore camera movement
        // whiteBox.setScrollFactor(0);

        // // Create an input rectangle that covers the entire screen
        // const inputRect = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0);
        
        // // Make the input rectangle interactive
        // inputRect.setInteractive();

        // // Track when the input rectangle is pressed
        // inputRect.on('pointerdown', () => {
        //     console.log('Rectangle pressed');
        //     isDragging = false;
        // });

        // // Track when the input rectangle is released
        // inputRect.on('pointerup', () => {
        //     console.log('Rectangle released');
        // });

        eventManager.addEventListener('movement', (data: MovementEventData) => {
            if (data.direction === 'toggleCameraMode') {toggleCameraMode(); return;}
            this.inputPressed();
            if (data.direction === 'attack') {
                const currentDirection = this.gridEngine.getFacingDirection('hero');
                currentHeroSprite = heroAtkSprite;
                heroSprite.anims.play(`heroAtk_attack_${currentDirection}`);
                this.isAttacking = true;
                this.time.delayedCall(50, () => {
                    currentHeroSprite = heroSprite;
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
          frameRate: 4,
          repeat: repeat, // -1 for infinite
          yoyo: yoyo,
        });
    }
    // ***

    update() {
        const cursors = this.input.keyboard?.createCursorKeys();
        const spaceKey = this.input.keyboard?.addKey(Input.Keyboard.KeyCodes.SPACE);
        const heroSprite = this.gridEngine.getSprite('hero');
        const heroAtkSprite = this.gridEngine.getSprite('heroAtk');

        const currentDirection = this.gridEngine.getFacingDirection('hero');
        this.heroActionCollider.update();
        let currentHeroSprite: Phaser.Physics.Arcade.Sprite = this.isAttacking ? heroAtkSprite : heroSprite;

        if (cursors && spaceKey) {
            if (Input.Keyboard.JustDown(spaceKey)) {
                this.inputPressed();
                currentHeroSprite = heroAtkSprite;
                heroSprite.anims.play(`heroAtk_attack_${currentDirection}`);
                this.isAttacking = true;
                this.time.delayedCall(50, () => {
                    currentHeroSprite = heroSprite;
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