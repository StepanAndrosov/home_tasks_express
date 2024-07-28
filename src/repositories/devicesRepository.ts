import { ObjectId } from "mongodb"
import { devicesCollection } from "../db/db"
import { DeviceCreateModel } from "../features/security/models/DeviceCreateModel"
import { randomUUID } from "crypto"


export const deviceRepository = {
    async testDeleteData() {
        await devicesCollection.drop()
    },
    async createDevice(createData: DeviceCreateModel) {

        const newDevice = {
            _id: new ObjectId(),
            ip: createData.ip,
            title: createData.title,
            lastActiveDate: new Date(Date.now()).toISOString(),
            deviceId: randomUUID()
        }
        await devicesCollection.insertOne(newDevice)
    }
}