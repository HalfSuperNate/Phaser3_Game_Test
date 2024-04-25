import React from 'react';
import EventManager from '../components/EventManager';
import SocketComponent, {URL} from '../utils/SocketComponent';

const Nav = () => {
    const handleButtonClick = (event: string, data?: any) => {
        const eventManager = EventManager.getInstance();
        if (eventManager) {
            eventManager.emitEvent(event, data);
        } else {
            console.error("Game events are not available");
        }
    };

    const addContestantsClick = async () => {
        try {
            const data = {
                contestant_ids: ["0", "1", "2"]
            };
            const postData = await SocketComponent.post(`https://burnitdao.ai/api/contestants/batch`, data);
            console.log(postData);
        } catch (error) {
            console.error('Error adding contestants:', error);
        }
    };

    const getContestantsCountClick = async () => {
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
    };

    return (
        <>
            <button onClick={() => handleButtonClick('movement', { direction: 'toggleCameraMode' })}>
                Toggle Camera
            </button>
            <button onClick={() => addContestantsClick()}>
                + Contestants
            </button>
            <button onClick={() => getContestantsCountClick()}>
                Log Count
            </button>
            <button onClick={() => SocketComponent.reset()}>
                Reset Server
            </button>
        </>
    )
}

export default Nav;