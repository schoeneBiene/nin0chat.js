import WebSocket from "ws"
import Opcodes from "./opcodes";
import Events from "./Events";
import {UserInfo} from "./types";

export default class SocketConnection {
    socket: WebSocket;
    token: string;
    userInfo: UserInfo | undefined;
    emitEvent: (event: Events, data?: any) => void

    constructor(token: string, emitEvent: (event: Events, data?: any) => void) {
        this.token = token;
        this.emitEvent = emitEvent;

        this.socket = new WebSocket("wss://chatws.nin0.dev");
        this.socket.on("message", this.onMessage)
        this.socket.on("open", this.onOpen)
        this.socket.on("close", (code, reason) => {
            this.emitEvent(Events.CLOSE)
        })
    }

    send(opcode: number, data: { [key: string]: any }) {
        const toSend = JSON.stringify({
            op: opcode,
            d: data
        })


        this.socket.send(toSend)
    }

    onMessage = (rawData: WebSocket.Data) => {
        const data = JSON.parse(rawData as string) as { op: number, d: { [key: string]: any } };

        if(data.op === Opcodes.LOGIN) {
            //@ts-expect-error too lazy to make type info for this
            this.userInfo = data.d;
            this.emitEvent(Events.CONNECT, this.userInfo)
        }

        if(data.op === Opcodes.HEARTBEAT) {
            this.send(Opcodes.HEARTBEAT, {});
        }

        if(data.op === Opcodes.MESSAGE) {
            this.emitEvent(Events.MESSAGE, data.d)
        }
    }

    onOpen = () => {
        this.send(Opcodes.LOGIN, {
            anon: false,
            token: this.token,
            device: "bot"
        })
    }
}
