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
    private isEventListenerAdded = false;

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
        
        if (!this.isEventListenerAdded) {
            SocketComponent.on('drip_event', (data) => {
                let exchanges: Exchange[] = Object.values(data.exchanges);
                let convo = "";
                let uniqueMessages: string[] = [];
        
                exchanges.forEach((exchange) => {
                    // Check if the message is not already in the uniqueMessages list
                    if (!uniqueMessages.includes(exchange.message)) {
                        // Add the message to the uniqueMessages list
                        uniqueMessages.push(exchange.message);
                        
                        // Append the message to the conversation
                        convo += `<span style="font-weight: bold;">[${leadZeros(exchange.speaker_id)}] ${exchange.speaker_full_name}:</span> ${exchange.message}<br><br>`;
                    }
                });

                if (convo !== "") {
                    this.updateText(convo);
                }
                console.log('Drip event:', data);
            });
        
            // Set the flag to indicate that the event listener has been added
            this.isEventListenerAdded = true;
        }
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
            const isScrolledToBottom = chatBox.scrollHeight - chatBox.clientHeight <= chatBox.scrollTop + 1;
            // Append the text content to the existing chat box
            chatBox.innerHTML += convo;
            if (isScrolledToBottom) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
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

function leadZeros(str: string) {
    if (str.length === 1) {
        return `000${str}`;
    } else if (str.length === 2) {
        return `00${str}`;
    } else if (str.length === 3) {
        return `0${str}`;
    } else {
        return str;
    }
}