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

const URL = 'http://3.14.10.132';
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
    }
};

export default SocketComponent;
