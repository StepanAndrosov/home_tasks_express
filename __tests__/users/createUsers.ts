import request from 'supertest';
import { app } from '../../src/app';
import { UserViewModel } from '../../src/features/users/models/UserViewModel';
import { auth } from '../../src/middlewares/authentication-basic';
import { HTTP_STATUSES } from '../../src/utils/helpers';
import { ROUTER_USERS_PATH } from './usersTestManager';

export const createPost = async () => {
    const resp = await request(app)
        .post(ROUTER_USERS_PATH)
        .auth(auth.login, auth.password)
        .send({ login: 'Somelogin', password: 'password', email: 'some@email.com' })
        .expect(HTTP_STATUSES.CREATED_201)

    return resp.body as UserViewModel
}

export const createPosts = async (count: number = 10) => {
    const posts: UserViewModel[] = []

    for (let i = 0; i <= count; i++) {
        const resp = await request(app)
            .post(ROUTER_USERS_PATH)
            .auth(auth.login, auth.password)
            .send({
                name: `Somelogin${i + 1}`, description: `password${i + 1}`, content: `some${i + 1}@email.com`
            })
            .expect(HTTP_STATUSES.CREATED_201)

        posts.push(resp.body as UserViewModel)
    }

    return posts
}