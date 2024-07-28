import { WithId } from "mongodb"

interface CustomRate {
    ip: string
    url: string
    date: string
}

export type CustomRateModel = WithId<CustomRate>