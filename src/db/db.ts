import { Collection, MongoClient } from "mongodb";
import mongoose from 'mongoose';

import { AccessTokenModel } from "../features/auth/models/AccessTokenModel";
import { CustomRateModel } from "../features/security/models/CustomRateModel";

let client = {} as MongoClient

export let blackTokensCollection = {} as Collection<AccessTokenModel>
export let customRateCollection = {} as Collection<CustomRateModel>

export const db = {
    client: {} as MongoClient,

    async run(MONGO_URL: string) {
        try {
            await mongoose.connect(MONGO_URL)
            console.log('✅ It is ok')

            // ==========================================================
            client = new MongoClient(MONGO_URL)

            blackTokensCollection = client.db().collection<AccessTokenModel>('black-tokens')
            customRateCollection = client.db().collection<CustomRateModel>('custom-rate')

            await client.connect()
            console.log('✅ Connected successfully to server')
            return true
        } catch (e) {
            console.log('❌ Unsuccessfully connected to server')
            await client.close()

            console.log('❌  No connection')
            await mongoose.disconnect()
            return false
        }
    },
    async stop() {
        await client.close()
        console.log('✅ Connection successfully closed')
    }
}