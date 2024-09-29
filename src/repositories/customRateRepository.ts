
import { CustomRateCreateModel } from "../features/security/models/CustomRateCreateModel"
import { CRateModel } from "../features/security/domain"

class CustomRateRepository {
    async testDeleteData() {
        await CRateModel.deleteMany({})
    }
    async createCustomRate(customRateData: CustomRateCreateModel) {
        const newCustomRate = CRateModel.createCRate(customRateData)
        await newCustomRate.save()
        return true
    }
}
export const customRateRepository = new CustomRateRepository()

