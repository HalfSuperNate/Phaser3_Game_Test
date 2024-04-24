import { IComponent } from "./ComponentServices";
import SocketComponent, {URL} from '../utils/SocketComponent';

export default class DialogBox implements IComponent {
    private gameObject!: Phaser.GameObjects.Container;
    private aws_server = URL;

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

        console.log(this.aws_server);
    }

    async addContestants() {
        try {
            const data = {
                contestant_ids: ["0", "1", "2"]
            };
            const postData = await SocketComponent.post(`https://burnitdao.ai/api/contestants/batch`, data);
            console.log(postData);
        } catch (error) {
            console.error('Error adding contestants:', error);
        }
    }

    async getContestantCount() {
        try {
            const response = await SocketComponent.get(`https://burnitdao.ai/api/contestants/count`);
            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log(data);
            } else {
                // Handle non-JSON response
                console.error('Unexpected response format:', await response.text());
            }
        } catch (error) {
            console.error('Error getting contestant count:', error);
        }
    }

    async pageUpPress() {
        alert("Page Up Pressed! This currently adds contestants 0,1,2.");
        try {
            const data = {
                contestant_ids: ["0", "1", "2"]
            };
            const postData = await SocketComponent.post(`https://burnitdao.ai/api/contestants/batch`, data);
            console.log(postData);
        } catch (error) {
            console.error('Error adding contestants:', error);
        }
    }

    async pageDnPress() {
        alert("Page Down Pressed! This currently gets the contestant count.");
        try {
            const response = await SocketComponent.get(`https://burnitdao.ai/api/contestants/count`);
            console.log(response);
        } catch (error) {
            console.error('Error getting contestant count:', error);
        }
    }
}