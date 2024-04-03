import { Scene } from 'phaser';

export default class Preloader extends Scene {
    constructor() {
        super('preloader');
    }
    async preload() {
        this.load.image('tiles', 'tiles/Overworld.png');
        this.load.tilemapTiledJSON('testmap', 'tiles/testmap.json');
        // Call createRandomSprite to get the PNG data URL
        const randomHero = await this.createRandomSprite();

        // Load the spritesheet with the base64-encoded data URI
        this.load.spritesheet('hero', randomHero, {
            frameWidth: 32,
            frameHeight: 32
        });
        // this.load.spritesheet('hero', 'tiles/character2.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        for (let i = 0; i < 20; i++) {
            let randomNPC = await this.createRandomSprite();
            this.load.spritesheet(`npc${i}`, randomNPC, {
                frameWidth: 32,
                frameHeight: 32
            });
            
        }
        this.load.spritesheet('npc', 'tiles/character.png', {
            frameWidth: 32,
            frameHeight: 24
        });
    }

    create() {
        this.scene.start('testscene');
    }

    private getRandom(min: number, max: number) {
        const randomIndex = Phaser.Math.Between(min, max);
        return randomIndex;
    }

    private async createRandomSprite(): Promise<string> {
        const spriteURL = `https://bafybeievbtmulipmzjflbs25ti3w5tk63u3slwgo2zrxcdwz3zea5rqphi.ipfs.nftstorage.link/${this.getRandom(1,20)}.png`;
    
        // Return the combined data URL
        return spriteURL;
    }
}