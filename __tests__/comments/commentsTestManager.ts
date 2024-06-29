import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { CommentCreateModel } from '../../src/features/comments/models/CommentCreateModel';
import { CommentUpdateModel } from '../../src/features/comments/models/CommentUpdateModel';
import { ErrorsMessagesType } from "../../src/types";
import { HTTP_STATUSES, HttpStatuses } from "../../src/utils/helpers";

export const ROUTER_COMENTS_PATH = RouterPaths.comments

export const commentsTestManager = {
    async createCommentNonAuth(data: CommentCreateModel, postId: string, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(`${RouterPaths.posts}/${postId}${ROUTER_COMENTS_PATH}`)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async createCommentWithErrors(data: CommentCreateModel, token: string, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .post(`${RouterPaths.posts}/${data.postId}${ROUTER_COMENTS_PATH}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(expectedStatus, errors)

        return res
    },
    async createComment(data: CommentCreateModel, token: string, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(`${RouterPaths.posts}/${data.postId}${ROUTER_COMENTS_PATH}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async updateCommentWithErrors(id: string, data: CommentUpdateModel, token: string, expectedStatus: HttpStatuses = HTTP_STATUSES.NO_CONTEND_204, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .put(`${ROUTER_COMENTS_PATH}/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(expectedStatus, errors)

        return res
    },
    async updateComment(id: string, data: CommentUpdateModel, token: string, expectedStatus: HttpStatuses = HTTP_STATUSES.NO_CONTEND_204) {
        const res = await request(app)
            .put(`${ROUTER_COMENTS_PATH}/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async deleteComment(id: string, token: string, expectedStatus: HttpStatuses = HTTP_STATUSES.NO_CONTEND_204) {
        const res = await request(app)
            .delete(`${ROUTER_COMENTS_PATH}/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(expectedStatus)

        return res
    }
}