import io from 'socket.io-client';

const URL = 'http://3.14.10.132';
const socket = io(URL); // Connect to Socket.IO server URL

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});

export default socket;
