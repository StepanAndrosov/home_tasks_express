import { WithId } from "mongodb"


interface Device {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export type DeviceModel = WithId<Device>

