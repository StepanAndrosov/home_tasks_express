import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { PostViewModel } from '../../src/features/posts/models/PostViewModel';
import { auth } from '../../src/middlewares/authentication-basic';
import { HTTP_STATUSES } from '../../src/utils/helpers';

export const createPost = async (blogId: string) => {
    const resp = await request(app)
        .post(RouterPaths.posts)
        .auth(auth.login, auth.password)
        .send({ title: 'Some title', shortDescription: 'Some description', content: 'Some content', blogId })
        .expect(HTTP_STATUSES.CREATED_201)

    return resp.body as PostViewModel
}

export const createPosts = async (blogId: string, count: number = 10) => {
    const posts: PostViewModel[] = []

    for (let i = 0; i <= count; i++) {
        const resp = await request(app)
            .post(RouterPaths.posts)
            .auth(auth.login, auth.password)
            .send({
                name: `Some title${i + 1}`, description: `Some description${i + 1}`, content: `Some content${i + 1}`, blogId
            })
            .expect(HTTP_STATUSES.CREATED_201)

        posts.push(resp.body as PostViewModel)
    }

    return posts
}