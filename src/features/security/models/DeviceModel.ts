import { ObjectId, WithId } from "mongodb"

interface Device {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
    userId: string
}

export type DeviceModel = WithId<Device>

