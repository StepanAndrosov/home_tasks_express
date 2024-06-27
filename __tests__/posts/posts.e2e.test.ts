import request from 'supertest'
import { RouterPaths, app } from '../../src/app'
import { BlogViewModel } from '../../src/features/blogs/models/BlogViewModel'
import { PostViewModel } from '../../src/features/posts/models/PostViewModel'
import { errRequiredBlogId, errRequiredContent, errRequiredPostDescription, errRequiredPostTitle } from '../../src/features/posts/validations'
import { HTTP_STATUSES } from '../../src/utils/helpers'
import { blogsTestManager } from '../blogs/blogsTestManager'
import { postsTestManager } from './postsTestManager'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { db } from '../../src/db/db'

describe('/posts', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })

    afterAll(async () => {
        await db.stop()
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(RouterPaths.posts + '/6676a23681ff6de724021d0b')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    let createdBlog: BlogViewModel

    it('should`n create post if none auth 401', async () => {
        const blogData = { name: 'Some name', description: 'Some description', websiteUrl: 'https://site.com' }
        const response = await blogsTestManager.createBlog(blogData)
        createdBlog = response.body

        const data = { title: 'Some title', shortDescription: 'Some description', content: 'Some content', blogId: createdBlog.id }

        await postsTestManager.createPostNonAuth(
            data,
            HTTP_STATUSES.NOT_AUTHORIZED_401,
        )

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlog]
            })

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should`n create entity with bad title', async () => {
        const data = { title: '', shortDescription: 'Some description', content: 'Some content', blogId: createdBlog.id }
        const error = {
            errorsMessages: [{
                message: errRequiredPostTitle,
                field: 'title'
            }]
        }
        await postsTestManager.createPostWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should`n create entity with bad description', async () => {
        const data = { title: 'Some title', shortDescription: '', content: 'Some content', blogId: createdBlog.id }
        const error = {
            errorsMessages: [{
                message: errRequiredPostDescription,
                field: 'shortDescription'
            }]
        }
        await postsTestManager.createPostWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should`n create entity with bad content', async () => {
        const data = { title: 'Some title', shortDescription: 'Some description', content: '', blogId: createdBlog.id }
        const error = {
            errorsMessages: [{
                message: errRequiredContent,
                field: 'content'
            }]
        }

        await postsTestManager.createPostWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should`n create entity with bad blogId', async () => {
        const data = { title: 'Some title', shortDescription: 'Some description', content: 'Some content', blogId: '' }
        const error = {
            errorsMessages: [{
                message: errRequiredBlogId,
                field: 'blogId'
            }]
        }

        await postsTestManager.createPostWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdEntity: PostViewModel

    it('should create entity with correct data', async () => {

        const data = { title: 'Some title', shortDescription: 'Some description', content: 'Some content', blogId: createdBlog.id }

        const response = await postsTestManager.createPost(data)

        createdEntity = response.body

        expect(createdEntity.title).toEqual(data.title)
        expect(createdEntity.shortDescription).toEqual(data.shortDescription)
        expect(createdEntity.content).toEqual(data.content)
        expect(createdEntity.blogId).toEqual(data.blogId)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdEntity] })
    })

    it('should`n update entity with bad data', async () => {

        const data = { title: '', shortDescription: '', content: '', blogId: '' }

        const errors = {
            errorsMessages: [
                {
                    message: errRequiredPostTitle,
                    field: 'title'
                },
                {
                    message: errRequiredPostDescription,
                    field: 'shortDescription'
                },
                {
                    message: errRequiredContent,
                    field: 'content'
                },
                {
                    message: errRequiredBlogId,
                    field: 'blogId'
                },

            ]
        }

        await postsTestManager.updatePostWithErrors(createdEntity.id, data, HTTP_STATUSES.BAD_REQUEST_400, errors)

        await request(app)
            .get(`${RouterPaths.posts}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity)
    })

    it('should update entity with correct data', async () => {

        const data = { title: 'Some new title', shortDescription: 'Some new description', content: 'Some new content', blogId: createdBlog.id }

        await postsTestManager.updatePost(createdEntity.id, data, HTTP_STATUSES.NO_CONTEND_204)

        const response = await request(app)
            .get(`${RouterPaths.posts}/${createdEntity.id}`)

        createdEntity = response.body

        expect(createdEntity.title).toEqual(data.title)
        expect(createdEntity.shortDescription).toEqual(data.shortDescription)
        expect(createdEntity.content).toEqual(data.content)
        expect(createdEntity.blogId).toEqual(data.blogId)

        await request(app)
            .get(`${RouterPaths.posts}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity)
    })

    it('should delete entity', async () => {

        await postsTestManager.deletePosts(createdEntity.id)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
})