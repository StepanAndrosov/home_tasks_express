import { ObjectId } from "mongodb"
import { CreateDeviceDto } from "../features/security/domain/CreateDeviceDto"
import { DeviceModel } from "../features/security/domain/device.entity"
import { DeviceViewModel } from "../features/security/models/DeviceViewModel"
import { IDeviceModel } from "../features/security/models/IDeviceModel"

export const getViewModelDevice = (device: IDeviceModel): DeviceViewModel => {
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate,
        deviceId: device.deviceId
    }
}

class DevicesRepository {
    async testDeleteData() {
        await DeviceModel.deleteMany({})
    }
    async createDevice(createData: CreateDeviceDto, userId: string, deviceId: string) {

        const newDevice = DeviceModel.createDevice(createData, userId, deviceId)

        await newDevice.save()
    }
    async updateLastActiveDevice(id: ObjectId) {
        const foundedDevice = await DeviceModel.findOne({ _id: id })

        if (!foundedDevice) return false
        foundedDevice.lastActiveDate = new Date(Date.now()).toISOString()
        await foundedDevice.save()
        return true
    }
    async deleteDevices(userId: string, currentDevice: string) {
        const devices = await DeviceModel.find({ userId })

        const devicesDeleteIds = devices.filter((d) => d.deviceId.toString() !== currentDevice).map((d) => d._id)

        devicesDeleteIds.forEach(async (dId) => {
            await DeviceModel.deleteOne({ _id: dId })
        })
    }
    async deleteDevice(id: string) {
        await DeviceModel.deleteOne({ _id: new ObjectId(id) })
    }
}

export const devicesRepository = new DevicesRepository()