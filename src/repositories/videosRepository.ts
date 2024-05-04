import { db } from "../db/db";
import { VideoModel } from "../features/videos/models/VideoModel";
import { VideoUpdateModel } from "../features/videos/models/VideoUpdateModel";
import { VideoCreateModel } from "../features/videos/models/VodeoCreateModel";
import { Resolution } from "../types";
import { DAY } from "../utils";

export const videosRepository = {
    testDeleteData() {
        db.videos = []
    },
    getVideos() {
        return db.videos
    },
    findVideo(id: number) {
        return db.videos.find(v => v.id === id)
    },
    findIndex(video: VideoModel) {
        return db.videos.indexOf(video)
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

        db.videos.push(newVideo)

        return newVideo
    },
    updateVideo(index: number, foundVideo: VideoModel, updateData: VideoUpdateModel) {
        const newVideo = {
            ...foundVideo,
            ...updateData
        }
        db.videos.splice(index, 1, newVideo)
    },
    deleteVideo(index: number) {
        db.videos.splice(index, 1)
    }
}