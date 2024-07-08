import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { LoginCreateModel } from '../../src/features/auth/models/LoginCreateModel';
import { ErrorsMessagesType } from "../../src/types";
import { HTTP_STATUSES, HttpStatuses } from "../../src/utils/helpers";
import { RegistrationCreateModel } from '../../src/features/auth/models/RegistrationCreateModel';

export const ROUTER_AUTH_PATH = RouterPaths.auth

export const authTestManager = {

    async loginWithErrors(data: LoginCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.OK_200, errors?: ErrorsMessagesType) {
        const res = await request(app)
            .post(`${ROUTER_AUTH_PATH}/login`)
            .send(data)
            .expect(expectedStatus, errors)

        return res
    },
    async loginUser(data: LoginCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.OK_200) {
        const res = await request(app)
            .post(`${ROUTER_AUTH_PATH}/login`)
            .send(data)
            .expect(expectedStatus)

        return res
    },
    async registrationUser(data: RegistrationCreateModel, expectedStatus: HttpStatuses = HTTP_STATUSES.NO_CONTEND_204) {
        const res = await request(app)
            .post(`${ROUTER_AUTH_PATH}/registration`)
            .send(data)
            .expect(expectedStatus)

        return res
    },
}