import { customRateCollection } from "../db/db"


export const customRatesQRepository = {
    async getCustomRates(custom: { ip: string, url: string }) {

        const customRateData = await customRateCollection.find({ $or: [{ ip: custom.ip }, { url: custom.url }] }).toArray()

        return customRateData

    }
}