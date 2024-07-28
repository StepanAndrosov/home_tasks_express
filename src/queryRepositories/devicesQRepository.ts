import { ObjectId } from "mongodb"
import { devicesCollection } from "../db/db"
import { getViewModelDevice } from "../repositories/devicesRepository"


export const deviceQRepository = {
    async getDevices(userId: string) {

        const devicesData = await devicesCollection.find({ _id: new ObjectId(userId) }).toArray()

        return devicesData.map((d) => getViewModelDevice(d))
    }
}