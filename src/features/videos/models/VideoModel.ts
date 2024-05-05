import { Resolution } from "../../../types";

export interface VideoModel {
    /**
     * Video id 
     */
    id: number,
    /**
    * Video title 
    */
    title: string,
    /**
    * Video author
    */
    author: string,
    /**
    * Video available resolutions
    */
    availableResolutions: Resolution[]
    /**
    *  Can be downloaded this videofile
    */
    canBeDownloaded: boolean,
    /**
    *  Min age restriction this videofile
    */
    minAgeRestriction: number | null,
    /**
    *  Video created at
    */
    createdAt: string,
    /**
    *  Video publication date
    */
    publicationDate: string,
}
