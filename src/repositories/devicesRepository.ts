import { ObjectId } from "mongodb"
import { devicesCollection } from "../db/db"
import { DeviceCreateModel } from "../features/security/models/DeviceCreateModel"
import { randomUUID } from "crypto"
import { DeviceModel } from "../features/security/models/DeviceModel"
import { DeviceViewModel } from "../features/security/models/DeviceViewModel"

export const getViewModelDevice = (device: DeviceModel): DeviceViewModel => {
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate,
        deviceId: device.deviceId
    }
}

export const deviceRepository = {
    async testDeleteData() {
        await devicesCollection.drop()
    },
    async createDevice(createData: DeviceCreateModel, userId: ObjectId) {

        const newDevice = {
            _id: new ObjectId(),
            ip: createData.ip,
            title: createData.title,
            lastActiveDate: new Date(Date.now()).toISOString(),
            deviceId: randomUUID(),
            userId
        }
        await devicesCollection.insertOne(newDevice)
    },
    async deleteDevices(userId: string, currentDevice: string) {
        const devices = await devicesCollection.find({ userId: new ObjectId(userId) }).toArray()

        const devicesDeleteIds = devices.filter((d) => d._id.toString() !== currentDevice).map((d) => d._id)

        devicesDeleteIds.forEach(async (dId) => {
            await devicesCollection.deleteOne({ _id: dId })
        })
    }
}