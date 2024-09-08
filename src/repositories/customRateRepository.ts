
import { CustomRateCreateModel } from "../features/security/models/CustomRateCreateModel"
import { CRateModel } from "../features/security/domain/cRate.entity"

export const customRateRepository = {
    async testDeleteData() {
        await CRateModel.deleteMany({})
    },
    async createCustomRate(customRateData: CustomRateCreateModel) {
        const newCustomRate = CRateModel.createCRate(customRateData)
        await newCustomRate.save()
        return true
    },
}