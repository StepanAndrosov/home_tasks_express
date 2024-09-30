import { randomUUID } from "crypto"
import { devicesQRepository } from "../../../queryRepositories/devicesQRepository"
import { devicesRepository } from "../../../repositories/devicesRepository"
import { Result } from "../../../types"
import { getDeviceInfoByToken } from "../../../utils/helpers"
import { CreateDeviceDto } from "../domain/CreateDeviceDto"

export const devicesService = {
    async createDevice(createData: CreateDeviceDto, userId: string, refreshToken?: string) {

        const { deviceId } = getDeviceInfoByToken(refreshToken)

        const foundDevices = await devicesQRepository.findDevicesBySeveralTerms(
            [
                { userId },
                { deviceId },

            ]
        )

        if (foundDevices.length && refreshToken) {
            await devicesRepository.updateLastActiveDevice(foundDevices[0]._id)
            return {
                deviceId: foundDevices[0].deviceId
            }
        } else {
            const deviceId = randomUUID()
            await devicesRepository.createDevice(createData, userId, deviceId)
            console.log(deviceId, 'create device')
            return {
                deviceId
            }
        }
    },
    async deleteDevices(refreshToken: string, userId: string) {

        const { deviceId } = getDeviceInfoByToken(refreshToken)

        await devicesRepository.deleteDevices(userId, deviceId)

    },
    async deleteDevice(deviceId: string, userId: string): Promise<Result<undefined>> {

        const foundDevice = await devicesQRepository.findDevicesByOneOfTerms([
            { deviceId }
        ])
        if (!foundDevice[0]) {
            return {
                status: 'BadRequest'
            }
        }
        console.log(foundDevice[0].deviceId, 'deleteDevice')
        if (foundDevice[0].userId.toString() !== userId) {
            return {
                status: 'Forbidden'
            }
        }
        await devicesRepository.deleteDevice(foundDevice[0]._id.toString())

        return { status: 'Success' }
    }
}