// SocketComponent.js
import io from 'socket.io-client';

// Define interfaces for data structures
interface Exchange {
    speaker_id: string;
    speaker_full_name: string;
    message: string;
    names: string[];
    timestamp: number;
}

interface Exchanges {
    [key: string]: Exchange;
}

export interface DripEventData {
    exchanges: Exchanges;
}

export const URL = 'https://burnitdao.ai'; // https://burnitdao.ai/api/contestants
const socket = io(URL); // Connect to Socket.IO server URL

const SocketComponent = {
    on: (eventName: string, callback: (data: any) => void) => {
        socket.on(eventName, callback);
    },
    off: (eventName: string, callback: (data: any) => void) => {
        socket.off(eventName, callback);
    },
    emit: (eventName: string, data: any) => {
        socket.emit(eventName, data);
    },
    disconnect: () => {
        socket.disconnect();
        console.log('Disconnected from server');
    },
    connect: () => {
        socket.connect();
        console.log('Connected to server');
    },

    // HTTP requests
    post: async (url: string, postData: any) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                //mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            return response.json();
        } catch (error) {
            console.error('Error encountered during POST request:', error);
            throw error;
        }
    },
    get: async (url: string) => {
        try {
            const response = await fetch(url, {
                method: 'GET', // or 'POST', 'PUT', etc.
                //mode: 'no-cors'
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        } catch (error) {
            console.error('Error encountered during GET request:', error);
            throw error;
        }
    }
};

export default SocketComponent;
