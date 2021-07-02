import { HashMap } from "../util/hashMap";
import { EventListener } from "./eventListener";

export class EventHandler {
    private static listeners: HashMap<EventListener> = {}

    /**
     * Emit a new event
     * @param eventName Name of the event 
     * @param payload Payload if the event
     */
    public static async emit(eventName: string, ...payload: any) {
        this.listeners[eventName]?.handleEvent(payload);
    }

    /**
     * Register new listener
     * @param eventName Name if the event
     * @param eventListener Listener to register
     */
    public static register(eventName: string, eventListener: EventListener) {
        this.listeners[eventName] = eventListener;
    }

    /**
     * Remove event from registry
     * @param eventName Name of the event to remove
     */
    public static unregister(eventName: string){
        this.listeners[eventName] = undefined;
    }
}