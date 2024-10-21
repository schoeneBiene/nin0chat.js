import Events from "./Events";
import SocketConnection from "./SocketConnection";
import Opcodes from "./opcodes";
import {Message, UserInfo} from "./types";

type EventPayloads = {
    "message": Message;
    "connect": UserInfo;
    "close": undefined;
};

type EventListenerList = {
    [K in keyof EventPayloads]: Array<(arg: EventPayloads[K]) => void>
}

export default class Client {
    token: string;
    //@ts-expect-error
    connection: SocketConnection;
    eventListeners: EventListenerList = {
        message: [],
        connect: [],
        close: []
    }

    constructor(token: string) {
        this.token = token;

    }

    connect() {
        this.connection = new SocketConnection(this.token, this.emitEvent);
    }
    
    sendMessage(content: string) {
        this.connection.send(Opcodes.MESSAGE, { content })
    }

    emitEvent = <K extends keyof EventPayloads>(event: K, data: EventPayloads[K]) => {
        this.eventListeners[event].forEach((listener) => listener(data))
    }

    on<K extends keyof EventPayloads>(event: K, listener: (arg: EventPayloads[K]) => void) {
        this.eventListeners[event].push(listener);
    }
}
