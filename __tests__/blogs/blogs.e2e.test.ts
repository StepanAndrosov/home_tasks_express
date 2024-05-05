import request from 'supertest'
import { RouterPaths, app } from '../../src/app'
import { BlogViewModel } from '../../src/features/blogs/models/BlogViewModel'
import { errRequiredBlogName, errRequiredDescription, errValidWebsiteUrl, errRequiredWebsiteUrl } from '../../src/features/blogs/validations'
import { HTTP_STATUSES } from '../../src/utils'
import { blogsTestManager } from './blogsTestManager'

describe('/blogs', () => {

    beforeAll(async () => {
        await request(app).delete(`${RouterPaths.testing}/all-data`)
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(RouterPaths.blogs + '/999999')
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
            .expect(HTTP_STATUSES.OK_200, [])
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
            .expect(HTTP_STATUSES.OK_200, [])
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
            .expect(HTTP_STATUSES.OK_200, [])
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
            .expect(HTTP_STATUSES.OK_200, [])
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
            .expect(HTTP_STATUSES.OK_200, [createdEntity])
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

        await request(app)
            .delete(`${RouterPaths.blogs}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.NO_CONTEND_204)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [])
    })
})