import { Scene } from 'phaser';

export default class Preloader extends Scene {
    constructor() {
        super('preloader');
    }
    preload() {
        this.load.image('tiles', 'tiles/Overworld.png');
        this.load.tilemapTiledJSON('testmap', 'tiles/testmap.json');
        this.load.spritesheet('hero', 'tiles/character.png', {
            frameWidth: 16,
            frameHeight: 24
        });
        this.load.spritesheet('heroAtk', 'tiles/character.png', {
            frameWidth: 32,
            frameHeight: 24
        });
        this.load.spritesheet('npc', 'tiles/character.png', {
            frameWidth: 16,
            frameHeight: 24
        });
    }

    create() {
        this.scene.start('testscene');
    }
}