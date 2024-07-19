
import { blackTokensCollection } from "../db/db"

export const blackListTokensQRepository = {
    async findBlackToken(accessToken: string) {
        const tokenData = await blackTokensCollection.findOne({ accessToken })
        if (!tokenData) return null
        return true
    },
}