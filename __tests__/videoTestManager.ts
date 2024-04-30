import { VideoCreateModel } from "../src/features/videos/models/VodeoCreateModel";
import { HTTP_STATUSES, HttpStatuses } from "../src/utils";
import request from 'supertest'
import { RouterPaths, app } from '../src/app'
import { ErrorsMessagesType } from "../src/types";
import { VideoModel } from "../src/features/videos/models/VideoModel";


export const videoTestManager = {
    async createVideoWithErrors(data: VideoCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .post(RouterPaths.videos)
            .send(data)
            .expect(expectedStatus, errors)

        return res
    },
    async createVideo(data: VideoCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(RouterPaths.videos)
            .send(data)
            .expect(expectedStatus)

        return res
    }
}