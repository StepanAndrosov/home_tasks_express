import { Resolution } from "../../../types"

export type VideoUpdateModel = {
    /**
     * Video title 
     */
    title: string,
    author: string,
    availableResolutions: Resolution[],
    canBeDownloaded: boolean,
    minAgeRestriction: number,
    publicationDate: string
}