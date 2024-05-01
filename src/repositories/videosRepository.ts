import { db } from "../db/db";
import { VideoModel } from "../features/videos/models/VideoModel";
import { VideoUpdateModel } from "../features/videos/models/VideoUpdateModel";
import { VideoCreateModel } from "../features/videos/models/VodeoCreateModel";
import { Resolution } from "../types";
import { DAY } from "../utils";

let videosData = db.videos

export const videosRepository = {
    testDeleteData() {
        videosData = []
    },
    getVideos() {
        return videosData
    },
    findVideo(id: number) {
        return videosData.find(v => v.id === id)
    },
    findIndex(video: VideoModel) {
        return videosData.indexOf(video)
    },
    createVideo(createData: VideoCreateModel) {
        const newVideo = {
            id: Date.now(),
            title: createData.title,
            author: createData.author,
            availableResolutions: createData.availableResolutions as Resolution[],
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date(Date.now()).toISOString(),
            publicationDate: new Date(Date.now() + DAY).toISOString(),
        }

        videosData.push(newVideo)

        return newVideo
    },
    updateVideo(index: number, foundVideo: VideoModel, updateData: VideoUpdateModel) {
        const newVideo = {
            ...foundVideo,
            ...updateData
        }
        videosData.splice(index, 1, newVideo)
    },
    deleteVideo(index: number) {
        videosData.splice(index, 1)
    }
}