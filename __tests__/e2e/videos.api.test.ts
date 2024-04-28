import request from 'supertest'
import { app } from '../../src/app'
import { HTTP_STATUSES } from '../../src/utils'
import { RouterPaths } from '../../src/app'

describe('/videos', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/')
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

    it('should`n create entity', async () => {
        await request(app)
            .post(RouterPaths.videos)
            .send({ title: '' })
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should create entity with correct data', async () => {

        const title = 'new entity'

        const response = await request(app)
            .post(RouterPaths.videos)
            .send({ title })
            .expect(HTTP_STATUSES.CREATED_201)

        const createdCource = response.body

        expect(createdCource).toEqual({
            // id: expect.any(Number),
            // title: title
        })

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [{ id: 1, title }])
    })

    it('should delete course', async () => {

        await request(app)
            .delete(RouterPaths.videos + '/1')
            .expect(HTTP_STATUSES.NO_CONTEND_204)

        await request(app)
            .get(RouterPaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    })
})