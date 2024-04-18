import { IComponent } from "./ComponentServices";
//import socket from '../utils/socketConnection';

export default class DialogBox implements IComponent {
    private gameObject!: Phaser.GameObjects.Container;

    init(go: Phaser.GameObjects.GameObject) {
        this.gameObject = go as Phaser.GameObjects.Container;

        /*
        // Listen for events from the socket server
        socket.on('response', (data) => {
            console.log(data);
        });

        socket.on('simulation_event', (data) => {
            console.log(data);
        });

        socket.on('drip_event', (data) => {
            console.log(data);
        });
        */
    }

    awake() {
        const { scene } = this.gameObject;

        const bg = scene.add.rectangle(0,0, scene.scale.width, 150, 0x914f1d, 0.6);
        bg.setOrigin(0);

        const textWidth = bg.width * 0.7;
        const text = scene.add.text(10,10, `Speaker_A: Text from dialog goes here.\nSpeaker_B: Other text goes here. Then if there is more text that continues it may look something like this, what do you think?`, {
            fontSize: '1em'
        });
        text.setWordWrapWidth(textWidth);

        const okText = scene.add.text(text.x + textWidth + 50, 10, 'PgUp', {
            backgroundColor: '#5c3010'
        });
        okText.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.pageUpPress);

        const noText = scene.add.text(okText.x, okText.y + okText.height + 5, 'PgDn', {
            backgroundColor: '#5c3010'
        });
        noText.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.pageDnPress);

        this.gameObject.add(bg);
        this.gameObject.add(text);
        this.gameObject.add(okText);
        this.gameObject.add(noText);
    }

    pageUpPress() {
        alert("Page Up Pressed! This would tab up to previous conversations.");
    }

    pageDnPress() {
        alert("Page Down Pressed! This would tab down to the next or latest conversation.");
    }
}