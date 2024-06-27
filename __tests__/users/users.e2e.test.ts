import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { app } from '../../src/app'
import { db } from '../../src/db/db'
import { UserViewModel } from '../../src/features/users/models/UserViewModel'
import { errRequiredLogin, errRequiredPassword } from '../../src/features/users/validations'
import { HTTP_STATUSES } from '../../src/utils/helpers'
import { ROUTER_USERS_PATH, usersTestManager } from './usersTestManager'

describe('/users', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })

    afterAll(async () => {
        await db.stop()
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get(ROUTER_USERS_PATH)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(ROUTER_USERS_PATH + '/6676a23681ff6de724021d0b')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should`n create user if none auth 401', async () => {

        const data = { login: 'Somelogin', password: 'password', email: 'some@email.com' }

        await usersTestManager.createUserNonAuth(
            data,
            HTTP_STATUSES.NOT_AUTHORIZED_401,
        )

        await request(app)
            .get(ROUTER_USERS_PATH)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })


    it('should`n create entity with bad login', async () => {
        const data = { login: '', password: 'password', email: 'some@email.com' }
        const error = {
            errorsMessages: [{
                message: errRequiredLogin,
                field: 'login'
            }]
        }

        await usersTestManager.createUserWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(ROUTER_USERS_PATH)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should`n create entity with bad password', async () => {
        const data = { login: 'Somelogin', password: '', email: 'some@email.com' }
        const error = {
            errorsMessages: [{
                message: errRequiredPassword,
                field: 'password'
            }]
        }

        await usersTestManager.createUserWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(ROUTER_USERS_PATH)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdEntity: UserViewModel

    it('should create entity with correct data', async () => {

        const data = { login: 'Somelogin', password: 'password', email: 'some@email.com' }

        const response = await usersTestManager.createUser(data)

        createdEntity = response.body

        expect(createdEntity.login).toEqual(data.login)
        expect(createdEntity.email).toEqual(data.email)

        await request(app)
            .get(ROUTER_USERS_PATH)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdEntity] })
    })

    it('should delete entity', async () => {

        await usersTestManager.deleteUser(createdEntity.id)

        await request(app)
            .get(ROUTER_USERS_PATH)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
})