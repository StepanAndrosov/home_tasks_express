import { ObjectId } from "mongodb"
import { devicesCollection } from "../db/db"
import { getViewModelDevice } from "../repositories/devicesRepository"


export const devicesQRepository = {
    async getUserDevices(userId: string) {

        const devicesData = await devicesCollection.find({ userId: new ObjectId(userId) }).toArray()

        return devicesData.map((d) => getViewModelDevice(d))
    },
    async findDevice(id: string) {

        const devicesData = await devicesCollection.findOne({ _id: new ObjectId(id) })

        if (!devicesData) return null;;

        return devicesData
    },
    async findDevicesByOneOfTerms(findData: { [term: string]: string }[]) {
        const usersData = await devicesCollection.find({ $or: findData }).toArray()
        return usersData
    },
}