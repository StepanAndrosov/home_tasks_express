import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/utils'
import { RouterPaths } from '../../src/app'
import { VideoViewModel } from '../../src/features/videos/models/VideoViewModel'
import { videoTestManager } from './videoTestManager'
import { errRequiredAuthor, errRequiredAvailableResolutions, errRequiredTitle } from '../../src/features/videos/validations'

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
        const data = { title: '', author: 'Some author', availableResolutions: ['P144'] }
        const error = {
            errorsMessages: [{
                message: errRequiredTitle,
                field: 'title'
            }]
        }
        await videoTestManager.createVideoWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should`n create entity with bad author', async () => {
        const data = { title: 'Some title', author: '', availableResolutions: ['P144'] }
        const error = {
            errorsMessages: [{
                message: errRequiredAuthor,
                field: 'author'
            }]
        }
        await videoTestManager.createVideoWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should`n create entity with bad availableResolutions', async () => {
        const data = { title: 'Some title', author: 'Some author', availableResolutions: [] }
        const error = {
            errorsMessages: [{
                message: errRequiredAvailableResolutions,
                field: 'availableResolutions'
            }]
        }

        await videoTestManager.createVideoWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdEntity: VideoViewModel

    it('should create entity with correct data', async () => {

        const data = { title: 'Some title', author: 'Some author', availableResolutions: ['P144'] }

        const response = await videoTestManager.createVideo(data)

        createdEntity = response.body

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