import { deviceRepository } from "../../../repositories/devicesRepository"


export const devicesService = {
    async deleteDevices(refreshToken: string, userId: string) {
        // find and decode refresh token payload 
        const [_, payload] = refreshToken.split('.')
        const decoded = Buffer.from(payload, 'base64').toString()

        const deviceId = JSON.parse(decoded).deviceId as string

        await deviceRepository.deleteDevices(userId, deviceId)

    }
}