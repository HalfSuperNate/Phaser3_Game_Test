import ComponentService from '../components/ComponentServices';
import DialogBox from '../components/DialogBox';

export default class UIScene extends Phaser.Scene {
    private components!: ComponentService;

    preloadComplete = false;
    createComplete = false;

    constructor() {
        super({ key: 'UIScene', active: true });
    }

    async preload() {
        // Preload assets for splash and title screens
        this.components = new ComponentService();
        this.preloadComplete = true;
    }

    async create() {
        await this.preload();
        // Create and Add UI elements
        //*** DIALOG BOX ***
        const dialogBox = this.add.container(0, this.scale.height * 0.8);
        this.components.addComponent(dialogBox, new DialogBox());

        //*** DIALOG BOX END ***
        this.createComplete = true;
    }
}