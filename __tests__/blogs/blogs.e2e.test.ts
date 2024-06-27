import { HTTP_STATUSES } from './../../src/utils/helpers';
import request from 'supertest'
import { RouterPaths, app } from '../../src/app'
import { BlogViewModel } from '../../src/features/blogs/models/BlogViewModel'
import { errRequiredBlogName, errRequiredDescription, errValidWebsiteUrl, errRequiredWebsiteUrl } from '../../src/features/blogs/validations'
import { blogsTestManager } from './blogsTestManager'
import { MongoMemoryServer } from 'mongodb-memory-server';
import { db } from '../../src/db/db';

describe('/blogs', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        console.log(mongoServer.getUri())
        await db.run(mongoServer.getUri())
    })

    afterAll(async () => {
        await db.stop()
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(RouterPaths.blogs + '/6676a23681ff6de724021d0b')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should`n create entity if none auth 401', async () => {
        const data = { name: 'Some name', description: 'Some description', websiteUrl: 'https://site.com' }

        await blogsTestManager.createBlogNonAuth(
            data,
            HTTP_STATUSES.NOT_AUTHORIZED_401,
        )

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should`n create entity with bad name', async () => {
        const data = { name: '', description: 'Some description', websiteUrl: 'https://site.com' }
        const error = {
            errorsMessages: [{
                message: errRequiredBlogName,
                field: 'name'
            }]
        }
        await blogsTestManager.createBlogWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should`n create entity with bad description', async () => {
        const data = { name: 'Some name', description: '', websiteUrl: 'https://site.com' }
        const error = {
            errorsMessages: [{
                message: errRequiredDescription,
                field: 'description'
            }]
        }
        await blogsTestManager.createBlogWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should`n create entity with bad websiteUrl', async () => {
        const data = { name: 'Some name', description: 'Some description', websiteUrl: 'site.com' }
        const error = {
            errorsMessages: [{
                message: errValidWebsiteUrl,
                field: 'websiteUrl'
            }]
        }

        await blogsTestManager.createBlogWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdEntity: BlogViewModel

    it('should create entity with correct data', async () => {

        const data = { name: 'Some name', description: 'Some description', websiteUrl: 'https://site.com' }

        const response = await blogsTestManager.createBlog(data)

        createdEntity = response.body

        expect(createdEntity.name).toEqual(data.name)
        expect(createdEntity.description).toEqual(data.description)
        expect(createdEntity.websiteUrl).toEqual(data.websiteUrl)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdEntity] })
    })

    it('should`n update entity with bad data', async () => {

        const data = { name: '', description: '', websiteUrl: '' }

        const errors = {
            errorsMessages: [
                {
                    message: errRequiredBlogName,
                    field: 'name'
                },
                {
                    message: errRequiredDescription,
                    field: 'description'
                },
                {
                    message: errRequiredWebsiteUrl,
                    field: 'websiteUrl'
                },

            ]
        }

        await blogsTestManager.updateBlogWithErrors(createdEntity.id, data, HTTP_STATUSES.BAD_REQUEST_400, errors)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity)
    })

    it('should update entity with correct data', async () => {

        const data = { name: 'New Some Name', description: 'New Some Description', websiteUrl: 'https://new-site.com' }

        await blogsTestManager.updateBlog(createdEntity.id, data, HTTP_STATUSES.NO_CONTEND_204)

        const response = await request(app)
            .get(`${RouterPaths.blogs}/${createdEntity.id}`)

        createdEntity = response.body

        expect(createdEntity.name).toEqual(data.name)
        expect(createdEntity.description).toEqual(data.description)
        expect(createdEntity.websiteUrl).toEqual(data.websiteUrl)

        await request(app)
            .get(`${RouterPaths.blogs}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity)
    })

    it('should delete entity', async () => {

        await blogsTestManager.deleteBlog(createdEntity.id)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
})