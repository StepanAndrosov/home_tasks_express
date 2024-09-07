import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { ErrorsMessagesType } from "../../src/types";
import { HTTP_STATUSES, HttpStatuses } from "../../src/utils/helpers";
import { auth } from '../../src/middlewares/authentication-basic';
import { CreateBlogDto, UpdateBlogDto } from '../../src/features/blogs/domain';

export const blogsTestManager = {
    async createBlogNonAuth(data: CreateBlogDto, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(RouterPaths.blogs)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async createBlogWithErrors(data: CreateBlogDto, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .post(RouterPaths.blogs)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus, errors)

        return res
    },
    async createBlog(data: CreateBlogDto, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(RouterPaths.blogs)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async updateBlogWithErrors(id: string, data: UpdateBlogDto, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .put(`${RouterPaths.blogs}/${id}`)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus, errors)
        return res
    },
    async updateBlog(id: string, data: UpdateBlogDto, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
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