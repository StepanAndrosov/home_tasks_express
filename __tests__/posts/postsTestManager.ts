import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { PostCreateModel } from '../../src/features/posts/models/PostCreateModel';
import { PostUpdateModel } from '../../src/features/posts/models/PostUpdateModel';
import { ErrorsMessagesType } from "../../src/types";
import { HTTP_STATUSES, HttpStatuses } from "../../src/utils/helpers";
import { auth } from '../../src/middlewares/authentication-basic';

export const postsTestManager = {
    async createPostNonAuth(data: PostCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(RouterPaths.posts)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async createPostWithErrors(data: PostCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .post(RouterPaths.posts)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus, errors)

        return res
    },
    async createPost(data: PostCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(RouterPaths.posts)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async updatePostWithErrors(id: string, data: PostUpdateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .put(`${RouterPaths.posts}/${id}`)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus, errors)
        return res
    },
    async updatePost(id: string, data: PostUpdateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .put(`${RouterPaths.posts}/${id}`)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus)

        return res
    }
}