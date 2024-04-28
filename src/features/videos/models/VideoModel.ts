import { Resolution } from "../../../types";

export interface VideoModel {
    /**
     * Video id 
     * Video title 
     * Video author
     * Can be downloaded this videofile
     * Min age restriction this videofile
     * Video created at
     * Video publication date
     * Video available resolutions
     */
    id: number,
    title: string,
    author: string,
    availableResolutions: Resolution[]
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
}
