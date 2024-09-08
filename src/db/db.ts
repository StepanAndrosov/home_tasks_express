import mongoose from 'mongoose';

export const db = {
    async run(MONGO_URL: string) {
        try {
            await mongoose.connect(MONGO_URL)
            console.log('✅ Mongoose Connected successfully to server')
            return true
        } catch (e) {
            console.log('❌ Unsuccessfully connected to server')
            await mongoose.disconnect()
            return false
        }
    },
    async stop() {
        await mongoose.disconnect()
        console.log('✅ Connection successfully closed')
    }
}