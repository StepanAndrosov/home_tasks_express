import { ObjectId } from "mongodb"
import { DeviceModel } from "../features/security/domain/device.entity"
import { getViewModelDevice } from "../repositories/devicesRepository"

export const devicesQRepository = {
    async getUserDevices(userId: string) {

        const devicesData = await DeviceModel.find({ userId })

        return devicesData.map((d) => getViewModelDevice(d))
    },
    async findDevice(id: string) {

        const devicesData = await DeviceModel.findOne({ _id: new ObjectId(id) })

        if (!devicesData) return null;;

        return devicesData
    },
    async findDevicesByOneOfTerms(findData: { [term: string]: string }[]) {
        const devicesData = await DeviceModel.find({ $or: findData })
        return devicesData
    },
    async findDevicesBySeveralTerms(findData: { [term: string]: string | ObjectId }[]) {
        const devicesData = await DeviceModel.find({ $and: findData })
        return devicesData
    },
}