import { ObjectId } from "mongodb"
import { devicesQRepository } from "../../../queryRepositories/devicesQRepository"
import { devicesRepository } from "../../../repositories/devicesRepository"
import { Result } from "../../../types"
import { DeviceCreateModel } from "../models/DeviceCreateModel"
import { randomUUID } from "crypto"
import { getDeviceIdByToken } from "../../../utils/helpers"


export const devicesService = {
    async createDevice(createData: DeviceCreateModel, userId: ObjectId, refreshToken?: string) {

        const foundedDevices = await devicesQRepository.findDevicesBySeveralTerms(
            [
                { userId },
                { title: createData.title },
                { ip: createData.ip },
            ]
        )
        if (foundedDevices.length && refreshToken) {
            return {
                deviceId: foundedDevices[0].deviceId
            }
        } else {
            const deviceId = randomUUID()
            await devicesRepository.createDevice(createData, userId, deviceId)

            return {
                deviceId
            }
        }
    },
    async deleteDevices(refreshToken: string, userId: string) {

        const { deviceId } = getDeviceIdByToken(refreshToken)

        await devicesRepository.deleteDevices(userId, deviceId)

    },
    async deleteDevice(deviceId: string, userId: string): Promise<Result<undefined>> {

        const foundedDevice = await devicesQRepository.findDevicesByOneOfTerms([
            { deviceId }
        ])


        if (!foundedDevice[0]) {
            return {
                status: 'BadRequest'
            }
        }

        console.log(foundedDevice[0].deviceId, 'deleteDevice')


        if (foundedDevice[0].userId.toString() !== userId) {
            return {
                status: 'Forbidden'
            }
        }

        await devicesRepository.deleteDevice(foundedDevice[0]._id.toString())

        return { status: 'Success' }
    }
}