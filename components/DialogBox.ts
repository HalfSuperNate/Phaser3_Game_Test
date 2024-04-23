import { IComponent } from "./ComponentServices";
import SocketComponent, { URL } from '../utils/SocketComponent';

export default class DialogBox implements IComponent {
    private gameObject!: Phaser.GameObjects.Container;
    aws_server = URL;

    constructor() {
        
        // Listen for events from the socket server
        SocketComponent.connect();

        // SocketComponent.on('response', (data) => {
        //     console.log('Received response:', data);
        // });

        // SocketComponent.on('simulation_event', (data) => {
        //     console.log('Simulation event:', data);
        // });

        SocketComponent.on('drip_event', (data) => {
            console.log('Drip event:', data);
        });
    }

    init(go: Phaser.GameObjects.GameObject) {
        this.gameObject = go as Phaser.GameObjects.Container;
        
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

    addContestants() {
        const data = {
            "contestant_ids": ["0", "1", "2"]
        }
        
        const postData = SocketComponent.post(`${this.aws_server}/api/contestants/batch`,data);
        console.log(postData);
    }

    getContestantCount() {
        const getData = SocketComponent.get(`${this.aws_server}/api/contestants/count`);
        console.log(getData);
    }

    async pageUpPress() {
        alert("Page Up Pressed! This currently adds contestants 0,1,2.");
        const data = {
            "contestant_ids": ["0", "1", "2"]
        }
        
        const postData = await SocketComponent.post(`http://3.14.10.132/api/contestants/batch`,data);
        console.log(postData);
    }

    async pageDnPress() {
        alert("Page Down Pressed! This currently gets the contestant count.");
        const getData = await SocketComponent.get(`http://3.14.10.132/api/contestants/count`);
        console.log(getData);
    }
}