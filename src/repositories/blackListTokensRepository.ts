
import { blackTokensCollection } from "../db/db"

export const blackListTokensRepository = {
    async testDeleteData() {
        await blackTokensCollection.drop()
    },
    async createBlackToken(token: string) {
        const newToken = {
            accessToken: token
        }
        await blackTokensCollection.insertOne(newToken)

        return true
    },
}