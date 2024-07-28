import { deviceQRepository } from "../../../queryRepositories/devicesQRepository"
import { deviceRepository } from "../../../repositories/devicesRepository"
import { Result } from "../../../types"


export const devicesService = {
    async deleteDevices(refreshToken: string, userId: string) {
        // find and decode refresh token payload 
        const [_, payload] = refreshToken.split('.')
        const decoded = Buffer.from(payload, 'base64').toString()

        const deviceId = JSON.parse(decoded).deviceId as string

        await deviceRepository.deleteDevices(userId, deviceId)

    },
    async deleteDevice(refreshToken: string, userId: string): Promise<Result<undefined>> {
        // find and decode refresh token payload 
        const [_, payload] = refreshToken.split('.')
        const decoded = Buffer.from(payload, 'base64').toString()

        const deviceId = JSON.parse(decoded).deviceId as string

        const foundedDevice = await deviceQRepository.findDevice(deviceId)

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

        await deviceRepository.deleteDevice(deviceId)

        return { status: 'Success' }
    }
}