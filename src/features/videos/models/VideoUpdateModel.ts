import { Resolution } from "../../../types"

export type VideoUpdateModel = {
    /**
     * Video title 
     * Video author
     * Video available resolutions
     * Can be downloaded this videofile
     * Min age restriction this videofile
     * Video publication date
     */
    title: string,
    author: string,
    availableResolutions: Resolution[],
    canBeDownloaded: boolean,
    minAgeRestriction: number,
    publicationDate: string
}