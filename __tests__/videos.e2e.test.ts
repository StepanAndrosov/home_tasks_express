import request from 'supertest'
import { app } from '../src/app'
import { HTTP_STATUSES } from '../src/utils'
import { RouterPaths } from '../src/app'
import { VideoViewModel } from '../src/features/videos/models/VideoViewModel'

describe('/users', () => {

    beforeAll(async () => {
        await request(app).delete(`${RouterPaths.testing}/all-data`)
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(RouterPaths.videos + '/999999')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should`n create entity with bad title', async () => {
        await request(app)
            .post(RouterPaths.videos)
            .send({ title: '', author: 'Some author', availableResolutions: ['P144'] })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [{
                    message: 'Bad Title',
                    field: 'title'
                }]
            })

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should`n create entity with bad author', async () => {
        await request(app)
            .post(RouterPaths.videos)
            .send({ title: 'Some title', author: '', availableResolutions: ['P144'] })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [{
                    message: 'Bad Author',
                    field: 'author'
                }]
            })

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should`n create entity with bad availableResolutions', async () => {
        await request(app)
            .post(RouterPaths.videos)
            .send({ title: 'Some title', author: 'Some author', availableResolutions: [] })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [{
                    message: 'Bad Resolutions',
                    field: 'availableResolutions'
                }]
            })

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdEntity: VideoViewModel

    it('should create entity with correct data', async () => {

        const data = { title: 'Some title', author: 'Some author', availableResolutions: ['P144'] }

        const response = await request(app)
            .post(RouterPaths.videos)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdEntity = response.body

        console.log(createdEntity, 'createdCource')

        expect(createdEntity.title).toEqual(data.title)
        expect(createdEntity.author).toEqual(data.author)
        expect(createdEntity.availableResolutions).toEqual(data.availableResolutions)

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [createdEntity])
    })

    it('should delete entity', async () => {

        await request(app)
            .delete(`${RouterPaths.videos}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.NO_CONTEND_204)

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })
})