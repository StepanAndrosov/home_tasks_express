import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { app } from '../../src/app'
import { db } from '../../src/db/db'
import { UserViewModel } from '../../src/features/users/models/UserViewModel'
import { verifyJWT } from '../../src/utils/genJWT'
import { HTTP_STATUSES } from '../../src/utils/helpers'
import { DEFAULT_TEST_PASSWORD, createUser } from '../users/createUsers'
import { ROUTER_AUTH_PATH, authTestManager } from './authTestManager'
import { errLengthPassword } from '../../src/features/auth/validations'

const TEST_SECRET_KEY = '123456'

describe('/auth', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })

    afterAll(async () => {
        await db.stop()
    })

    it('should return 401 without header', async () => {
        await request(app)
            .get(`${ROUTER_AUTH_PATH}/me`)
            .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
    })

    let user: UserViewModel
    let token: string

    it('should login user', async () => {

        user = await createUser()
        const response = await authTestManager.loginUser({ loginOrEmail: user.login, password: DEFAULT_TEST_PASSWORD })

        token = response.body.accessToken

        const verify = verifyJWT(token, TEST_SECRET_KEY)

        const payload64 = token.split('.')[1]
        const decodedPayload = Buffer.from(payload64, 'base64').toString() // {"id":"667cfd124754502097cf5efa","name":"Somelogin","iat":1719467282507,"exp":1719640082507}

        expect(verify).toBeTruthy()
        expect(decodedPayload).toContain(user.id)
        expect(decodedPayload).toContain(user.login)
    })

    it('should`n create token', async () => {
        const data = { loginOrEmail: user.login, password: '12345' }

        const error = {
            errorsMessages: [{
                message: errLengthPassword,
                field: 'password'
            }]
        }

        const response = await authTestManager.loginWithErrors(
            data,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        const wrongToken = response.body.accessToken

        const verify = verifyJWT(wrongToken, TEST_SECRET_KEY)

        expect(verify).toBeFalsy()
    })

    it('should get me data', async () => {

        const me = {
            email: user.email, login: user.login, userId: user.id
        }

        await request(app)
            .get(`${ROUTER_AUTH_PATH}/me`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HTTP_STATUSES.OK_200, me)
    })

    it('should`n get me data without token', async () => {

        const wrongToken = ''

        await request(app)
            .get(`${ROUTER_AUTH_PATH}/me`)
            .set('Authorization', `Bearer ${wrongToken}`)
            .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
    })

})