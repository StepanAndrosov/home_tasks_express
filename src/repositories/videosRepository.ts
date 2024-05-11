import { db } from "../db/db";
import { VideoModel } from "../features/videos/models/VideoModel";
import { VideoUpdateModel } from "../features/videos/models/VideoUpdateModel";
import { VideoCreateModel } from "../features/videos/models/VodeoCreateModel";
import { Resolution } from "../types";
import { DAY } from "../utils";
import { videosCollection } from "../db/db";

export const videosRepository = {
    testDeleteData() {
        db.videos = []
    },
    async getVideos(): Promise<VideoModel[]> {
        return await videosCollection.find({}).toArray()
    },
    async findVideo(id: number) {
        return await videosCollection.findOne({ id })
    },
    async createVideo(createData: VideoCreateModel) {
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

        await videosCollection.insertOne(newVideo)

        return newVideo
    },
    async updateVideo(id: number, foundVideo: VideoModel, updateData: VideoUpdateModel) {
        const newVideo = {
            ...foundVideo,
            ...updateData
        }
        await videosCollection.updateOne({ id }, { $set: newVideo })
    },
    async deleteVideo(id: number) {
        await videosCollection.deleteOne({ id })
    }
}