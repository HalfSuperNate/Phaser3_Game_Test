import React, { useEffect, useState } from 'react';
import DialogModal from '../components/DialogModal';
import EventManager from '../components/EventManager';

//import { Game as GameType } from 'phaser';
// import GridEngine from 'grid-engine';
// import isMobile from 'is-mobile';

const Game = () => {
    const isDevelopment = process?.env?.NODE_ENV !== 'production';
    const [game, setGame] = useState<Phaser.Game | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    // Define state variables for dialog type and message
    const [dialogType, setDialogType] = useState<string>('');
    const [dialogMessage, setDialogMessage] = useState<string>('');

    // Create game inside useEffect once
    // ^ only once
    useEffect(() => {
        async function initPhaser() {
            const { default: Phaser } = await import('phaser');
            const { default: GridEngine } = await import('grid-engine');

            const { default: Preloader } = await import('../scenes/Preloader');
            const { default: TestScene } = await import('../scenes/TestScene');
            // do this otherwise dev hot-reload
            // will create a number of Phaser instances
            if (game) {
                console.log('GAME ACTIVE');
                return;
            }

            const phaserGame: Phaser.Game = new Phaser.Game({
                type: Phaser.AUTO,
                title: 'some-game-title',
                parent: 'game-content',
                // orientation: Phaser.Scale.LANDSCAPE,
                // LocalStorageName: 'some-game-title',
                width: 400,
                height: 300,
                // zoom,
                // autoRound: true,
                pixelArt: true,
                scale: {
                    zoom: 2
                    // autoCenter: Phaser.Scale.CENTER_BOTH
                    // mode: Phaser.Scale.NONE
                },
                scene: [
                    // BootScene,
                    // LoadAssetsScene,
                    // GameScene,
                    // MainMenuScene,
                    Preloader,
                    TestScene
                ],
                physics: {
                    default: 'arcade',
                    arcade: {
                        debug: isDevelopment
                        // gravity: { y: 0 }
                    }
                },
                plugins: {
                    scene: [
                        {
                            key: 'gridEngine',
                            plugin: GridEngine,
                            mapping: 'gridEngine'
                        }
                    ]
                },
                backgroundColor: '#000000'
            });

            setGame(phaserGame);
            setInitialized(true);
        }

        // Initialize Phaser when the component mounts
        if (!initialized) {
            initPhaser();
        }

        // Cleanup function: Destroy the game instance when the component unmounts
        return () => {
            if (game) {
                game.destroy(true);
                setGame(null);
            }
        };
    }, [initialized]);

    useEffect(() => {
        const eventManager = EventManager.getInstance();
        // Subscribe to the 'openDialog' event
        const openDialogListener = (data: { dialogType: string, message: string }) => {
            setShowDialog(true);
            //console.log('Dialog opened with message:', data.message);
            // Update the dialog content based on the received message
            setDialogType(data.dialogType);
            setDialogMessage(data.message);
        };
        eventManager.addEventListener('openDialog', openDialogListener);

        // Cleanup: Remove event listener when component unmounts
        return () => {
            eventManager.removeEventListener('openDialog', openDialogListener);
        };
    }, []);
    
    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    // Cleanup logic executed outside useEffect
    useEffect(() => {
        const gameContent = document.getElementById('game-content');
        if (gameContent) {
            const canvasElements = gameContent.querySelectorAll('canvas');
            if (canvasElements.length > 1) {
                canvasElements.forEach((canvas, index) => {
                    if (index > 0) {
                        canvas.remove();
                    }
                });
            }
        }
    }, [game]);

    return (
        <>
            <div id="game-content" key="game-content">
                {/* game canvas renders here */}
            </div>
            <DialogModal 
                showDialog={showDialog} 
                onClose={handleCloseDialog} 
                dialogType={dialogType} // Pass dialogType
                dialogMessage={dialogMessage} // Pass dialogMessage
            />
            <button onClick={() => {
                    if (initialized && game) {
                        const eventManager = EventManager.getInstance();
                        if (game.events) {
                            eventManager.emitEvent('openDialog', { dialogType: dialogType, message: dialogMessage });
                        } else {
                            console.error("Game events are not available");
                        }
                    } else {
                        console.error("Game is not initialized or available");
                    }
                }}>Click for Dialog Test
            </button>
            <button onClick={() => {
                    if (initialized && game) {
                        const eventManager = EventManager.getInstance();
                        if (game.events) {
                            eventManager.emitEvent('movement', { direction: 'left' });
                        } else {
                            console.error("Game events are not available");
                        }
                    } else {
                        console.error("Game is not initialized or available");
                    }
                }}>⬅
            </button>
            <button onClick={() => {
                    if (initialized && game) {
                        const eventManager = EventManager.getInstance();
                        if (game.events) {
                            eventManager.emitEvent('movement', { direction: 'right' });
                        } else {
                            console.error("Game events are not available");
                        }
                    } else {
                        console.error("Game is not initialized or available");
                    }
                }}>➡
            </button>
            <button onClick={() => {
                    if (initialized && game) {
                        const eventManager = EventManager.getInstance();
                        if (game.events) {
                            eventManager.emitEvent('movement', { direction: 'up' });
                        } else {
                            console.error("Game events are not available");
                        }
                    } else {
                        console.error("Game is not initialized or available");
                    }
                }}>⬆
            </button>
            <button onClick={() => {
                    if (initialized && game) {
                        const eventManager = EventManager.getInstance();
                        if (game.events) {
                            eventManager.emitEvent('movement', { direction: 'down' });
                        } else {
                            console.error("Game events are not available");
                        }
                    } else {
                        console.error("Game is not initialized or available");
                    }
                }}>⬇
            </button>
            <button onClick={() => {
                    if (initialized && game) {
                        const eventManager = EventManager.getInstance();
                        if (game.events) {
                            eventManager.emitEvent('movement', { direction: 'attack' });
                        } else {
                            console.error("Game events are not available");
                        }
                    } else {
                        console.error("Game is not initialized or available");
                    }
                }}>🗡️
            </button>
        </>
    )
}

export default Game;