import { IComponent } from "./ComponentServices";
import SocketComponent, {URL} from '../utils/SocketComponent';

interface Exchange {
    message: string;
    names: string[];
    speaker_full_name: string;
    speaker_id: string;
    // Add other properties if needed
}

export default class DialogBox implements IComponent {
    private gameObject!: Phaser.GameObjects.Container;
    private aws_server = URL;
    private text!: Phaser.GameObjects.Text;

    constructor() {
        
        // Listen for events from the socket server
        SocketComponent.connect();

        // SocketComponent.on('response', (data) => {
        //     console.log('Received response:', data);
        // });

        // SocketComponent.on('simulation_event', (data) => {
        //     console.log('Simulation event:', data);
        // });

        //SocketComponent.reset();

        SocketComponent.on('drip_event', (data) => {
            let exchanges: Exchange[] = Object.values(data.exchanges);
            let convo = "";
            exchanges.forEach((exchange) => {
                console.log(exchange.speaker_full_name, exchange.message);
                convo += `${exchange.speaker_full_name}: ${exchange.message}\n\n`;
            });
            this.updateText(convo);
            console.log('Drip event:', data);
        });
    }

    init(go: Phaser.GameObjects.GameObject) {
        this.gameObject = go as Phaser.GameObjects.Container;
        
    }

    awake() {
        const { scene } = this.gameObject;
        const sceneWidth = scene.scale.width;
        const sceneHeight = scene.scale.height;
        const bgWidth = sceneWidth / 4; // Adjust the width as needed
        const bgHeight = sceneHeight;

        const bg = scene.add.rectangle(0, 0, bgWidth, bgHeight, 0x914f1d, 0.6);
        bg.setOrigin(0,0);

        const textWidth = bg.width * 0.9;
        this.text = scene.add.text(10,10, `ABC123`, {
            fontSize: '0.8em'
        });
        this.text.setWordWrapWidth(textWidth);

        // Create a container to hold the text
        const textContainer = scene.add.container(300,-240, [bg, this.text]);
        textContainer.setSize(textWidth, bgHeight); // Set the size of the container to match the background

        // Enable vertical scrolling for the container
        textContainer.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, bgWidth, bgHeight),
            draggable: true,
            useHandCursor: true
        });

        // const okText = scene.add.text(this.text.x + textWidth + 50, 10, 'PgUp', {
        //     backgroundColor: '#5c3010'
        // });
        // okText.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.pageUpPress);

        // const noText = scene.add.text(okText.x, okText.y + okText.height + 5, 'PgDn', {
        //     backgroundColor: '#5c3010'
        // });
        // noText.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.pageDnPress);

        //this.gameObject.add(bg);
        //this.gameObject.add(text);
        this.gameObject.add(textContainer);
        //this.gameObject.add(okText);
        //this.gameObject.add(noText);

        console.log(this.aws_server);
        this.addContestants();
    }

    updateText(convo: string) {
        this.text.setText(convo);
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