import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { BlogCreateModel } from '../../src/features/blogs/models/BlogCreateModel';
import { ErrorsMessagesType } from "../../src/types";
import { HTTP_STATUSES, HttpStatuses } from "../../src/utils/helpers";
import { BlogUpdateModel } from '../../src/features/blogs/models/BlogUpdateModel';
import { auth } from '../../src/middlewares/authentication-basic';

export const blogsTestManager = {
    async createBlogNonAuth(data: BlogCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(RouterPaths.blogs)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async createBlogWithErrors(data: BlogCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .post(RouterPaths.blogs)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus, errors)

        return res
    },
    async createBlog(data: BlogCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(RouterPaths.blogs)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async updateBlogWithErrors(id: string, data: BlogUpdateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .put(`${RouterPaths.blogs}/${id}`)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus, errors)
        return res
    },
    async updateBlog(id: string, data: BlogUpdateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .put(`${RouterPaths.blogs}/${id}`)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async deleteBlog(id: string, expectedStatus: HttpStatuses = HTTP_STATUSES.NO_CONTEND_204) {
        const res = await request(app)
            .delete(`${RouterPaths.blogs}/${id}`)
            .auth(auth.login, auth.password)
            .expect(expectedStatus)

        return res
    }
}