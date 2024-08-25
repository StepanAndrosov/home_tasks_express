
import { ObjectId } from "mongodb"
import { customRateCollection } from "../db/db"
import { CustomRateCreateModel } from "../features/security/models/CustomRateCreateModel"

export const customRateRepository = {
    async testDeleteData() {
        await customRateCollection.drop()
    },
    async createCustomRate(customRateData: CustomRateCreateModel) {
        const newCustomRate = {
            _id: new ObjectId(),
            ip: customRateData.ip,
            url: customRateData.url,
            date: new Date(Date.now()).toISOString(),
        }
        await customRateCollection.insertOne(newCustomRate)

        return true
    },
}