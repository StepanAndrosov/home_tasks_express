import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { ICustomRateModel } from "../models/ICustomRateModel";
import { CreateCRateDto } from "./";

type CRateMethods = typeof cRateMethods;
type CRateStatics = typeof cRateStatics;

type CRateModelType = Model<ICustomRateModel, {}, CRateMethods> & CRateStatics;

export type CRateDocument = HydratedDocument<ICustomRateModel, CRateMethods>;

export const CRateSchema = new mongoose.Schema<ICustomRateModel, CRateModelType, CRateMethods>({
    ip: { type: String, require: true },
    url: { type: String, require: true },
    date: { type: String, require: true }
})

const cRateMethods = {}

const cRateStatics = {
    createCRate(dto: CreateCRateDto) {
        const newCRate = new CRateModel()
        newCRate._id = new ObjectId()
        newCRate.ip = dto.ip
        newCRate.url = dto.url
        newCRate.date = new Date(Date.now()).toISOString()

        return newCRate;
    },
};

CRateSchema.statics = cRateStatics;

export const CRateModel = mongoose.model<ICustomRateModel, CRateModelType>('custom-rate', CRateSchema)
