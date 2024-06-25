import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { BlogViewModel } from '../../src/features/blogs/models/BlogViewModel';
import { auth } from '../../src/middlewares/authentication-basic';
import { HTTP_STATUSES } from '../../src/utils/helpers';

export const createBlog = async () => {
    const resp = await request(app)
        .post(RouterPaths.blogs)
        .auth(auth.login, auth.password)
        .send({
            name: 'Some name', description: 'Some description', websiteUrl: 'https://site.com'
        })
        .expect(HTTP_STATUSES.CREATED_201)

    return resp.body as BlogViewModel
}

export const createBlogs = async (count: number = 10) => {
    const blogs: BlogViewModel[] = []

    for (let i = 0; i <= count; i++) {
        const resp = await request(app)
            .post(RouterPaths.blogs)
            .auth(auth.login, auth.password)
            .send({
                name: `Some name${i + 1}`, description: `Some description${i + 1}`, websiteUrl: `https://site${i + 1}.com`
            })
            .expect(HTTP_STATUSES.CREATED_201)

        blogs.push(resp.body as BlogViewModel)
    }

    return blogs
}