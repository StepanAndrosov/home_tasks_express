import { CRateModel } from "../features/security/domain/cRate.entity"

export const customRatesQRepository = {
    async getCustomRates(custom: { ip: string, url: string }) {
        const customRateData = await CRateModel.find({ $and: [{ ip: custom.ip }, { url: custom.url }] })
        return customRateData
    }
}