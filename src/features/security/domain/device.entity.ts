import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { IDeviceModel } from '../models/IDeviceModel';
import { CreateDeviceDto } from "./CreateDeviceDto";

type DeviceMethods = typeof deviceMethods;
type DeviceStatics = typeof deviceStatics;

type DeviceModelType = Model<IDeviceModel, {}, DeviceMethods> & DeviceStatics;

export type DeviceDocument = HydratedDocument<IDeviceModel, DeviceMethods>;

export const DeviceSchema = new mongoose.Schema<IDeviceModel, DeviceModelType, DeviceMethods>({
    ip: { type: String, require: true },
    title: { type: String, require: true },
    lastActiveDate: { type: String, require: true },
    deviceId: { type: String, require: true },
    userId: { type: String, require: true }
})

const deviceMethods = {}

const deviceStatics = {
    createDevice(dto: CreateDeviceDto, userId: string, deviceId: string) {
        const newDevice = new DeviceModel()
        newDevice._id = new ObjectId()
        newDevice.ip = dto.ip
        newDevice.title = dto.title
        newDevice.lastActiveDate = new Date(Date.now()).toISOString()
        newDevice.deviceId = deviceId
        newDevice.userId = userId

        return newDevice;
    },
};

DeviceSchema.statics = deviceStatics;

export const DeviceModel = mongoose.model<IDeviceModel, DeviceModelType>('device', DeviceSchema)
