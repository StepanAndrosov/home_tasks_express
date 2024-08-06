import { ObjectId } from "mongodb"
import { devicesQRepository } from "../../../queryRepositories/devicesQRepository"
import { devicesRepository } from "../../../repositories/devicesRepository"
import { Result } from "../../../types"
import { DeviceCreateModel } from "../models/DeviceCreateModel"


export const devicesService = {
    async createDevice(createData: DeviceCreateModel, userId: ObjectId) {
        const foundedDevices = await devicesQRepository.findDevicesByOneOfTerms(
            [
                { title: createData.title }
            ]
        )
        if (foundedDevices.length)
            return

        await devicesRepository.createDevice(createData, userId)

    },
    async deleteDevices(refreshToken: string, userId: string) {
        // find and decode refresh token payload 
        const [_, payload] = refreshToken.split('.')
        const decoded = Buffer.from(payload, 'base64').toString()

        const deviceId = JSON.parse(decoded).deviceId as string

        await devicesRepository.deleteDevices(userId, deviceId)

    },
    async deleteDevice(refreshToken: string, userId: string): Promise<Result<undefined>> {
        // find and decode refresh token payload 
        const [_, payload] = refreshToken.split('.')
        const decoded = Buffer.from(payload, 'base64').toString()

        const deviceId = JSON.parse(decoded).deviceId as string

        const foundedDevice = await devicesQRepository.findDevice(deviceId)

        if (!foundedDevice) {
            return {
                status: 'BadRequest'
            }
        }

        if (foundedDevice.userId.toString() !== userId) {
            return {
                status: 'Forbidden'
            }
        }

        await devicesRepository.deleteDevice(deviceId)

        return { status: 'Success' }
    }
}