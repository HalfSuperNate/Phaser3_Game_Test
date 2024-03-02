import { EventEmitter } from 'events';

class EventManager {
    private static instance: EventManager;
    private emitter: EventEmitter;

    private constructor() {
        this.emitter = new EventEmitter();
    }

    public static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    public emitEvent(eventName: string, eventData?: any) {
        this.emitter.emit(eventName, eventData); // Pass along eventData
    }

    public addEventListener(eventName: string, listener: (...args: any[]) => void) {
        this.emitter.on(eventName, listener);
    }

    public removeEventListener(eventName: string, listener: (...args: any[]) => void) {
        this.emitter.off(eventName, listener);
    }
}

export default EventManager;
