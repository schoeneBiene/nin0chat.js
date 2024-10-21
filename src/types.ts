export type UserInfo = {
    username: string,
    roles: number,
    id: string
}

export type Device = "web" | "mobile" | "bot";

export type Message = {
    userInfo: UserInfo,
    timestamp: bigint,
    content: string,
    id: string,
    device: Device
}
