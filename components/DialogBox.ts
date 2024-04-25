import { IComponent } from "./ComponentServices";
import SocketComponent, {URL} from '../utils/SocketComponent';

interface Exchange {
    message: string;
    names: string[];
    speaker_full_name: string;
    speaker_id: string;
    // Add other properties if needed
}

const chatBox = document.getElementById('chatBox') as HTMLElement | null;

export default class DialogBox implements IComponent {
    //private gameObject!: Phaser.GameObjects.Container;
    private aws_server = URL;
    //private text!: Phaser.GameObjects.Text;

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
        //this.gameObject = go as Phaser.GameObjects.Container;
    }

    awake() {
        console.log(this.aws_server);
    }

    updateText(convo: string) {
        // Check if the chat box element exists
        if (chatBox) {
            // Append the text content to the existing chat box
            chatBox.innerHTML += convo;
        } else {
            console.error('Chat box element not found.');
        }
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
}