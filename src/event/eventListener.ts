
export abstract class EventListener {

    /**
     * Handle the event
     * @param payload Payload of the event
     */
    public abstract handleEvent(...payload: any): void;

}