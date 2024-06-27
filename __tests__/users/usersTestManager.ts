import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { UserCreateModel } from '../../src/features/users/models/UserCreateModel';
import { auth } from '../../src/middlewares/authentication-basic';
import { ErrorsMessagesType } from "../../src/types";
import { HTTP_STATUSES, HttpStatuses } from "../../src/utils/helpers";

export const ROUTER_USERS_PATH = RouterPaths.users

export const usersTestManager = {
    async createUserNonAuth(data: UserCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(ROUTER_USERS_PATH)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async createUserWithErrors(data: UserCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .post(ROUTER_USERS_PATH)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus, errors)

        return res
    },
    async createUser(data: UserCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(ROUTER_USERS_PATH)
            .auth(auth.login, auth.password)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async deleteUser(id: string, expectedStatus: HttpStatuses = HTTP_STATUSES.NO_CONTEND_204) {
        const res = await request(app)
            .delete(`${ROUTER_USERS_PATH}/${id}`)
            .auth(auth.login, auth.password)
            .expect(expectedStatus)

        return res
    }
}