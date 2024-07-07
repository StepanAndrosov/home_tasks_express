import request from 'supertest';
import { app } from '../../src/app';
import { LoginAccessTokenModel } from '../../src/features/auth/models/LoginAccessTokenModel';
import { HTTP_STATUSES } from '../../src/utils/helpers';
import { DEFAULT_TEST_PASSWORD } from '../users/createUsers';
import { ROUTER_AUTH_PATH } from './authTestManager';

export const createLogin = async (login: string) => {
    const resp = await request(app)
        .post(`${ROUTER_AUTH_PATH}/login`)
        .send({ loginOrEmail: login, password: DEFAULT_TEST_PASSWORD })
        .expect(HTTP_STATUSES.OK_200)

    return resp.body as LoginAccessTokenModel
}