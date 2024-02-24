import React, { useState, useEffect } from 'react';

import { Game as GameType } from 'phaser';
// import GridEngine from 'grid-engine';
// import isMobile from 'is-mobile';

const Game = () => {
    const isDevelopment = process?.env?.NODE_ENV !== 'production';
    const [game, setGame] = useState<GameType>();
    const [initialized, setInitialized] = useState(false);
    const dialogMessages = useState([]);
    const menuItems = useState([]);
    const gameTexts = useState([]);

    const [messages, setMessages] = useState([]);

    // Create game inside useEffect once
    // ^ only once
    useEffect(() => {
        async function initPhaser() {
            const Phaser = await import('phaser');
            const { default: GridEngine } = await import('grid-engine');

            const { default: Preloader } = await import('../scenes/Preloader');
            const { default: TestScene } = await import('../scenes/TestScene');
            // do this otherwise dev hot-reload
            // will create a number of Phaser instances
            // if (game) {
            //     console.log('GAME ACTIVE');
            //     return;
            // }

            const phaserGame = new Phaser.Game({
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

            // if (isDevelopment) {
            //   window.phaserGame = phaserGame;
            // }
        }
        if (!initialized) {
            initPhaser();
        }
    }, [initialized]);

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
        </>
    )
}

export default Game;