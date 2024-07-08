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
import { emailAdapter } from '../../src/adapters/emailAdapter'
import { authService } from '../../src/features/auth/service'

const TEST_SECRET_KEY = '123456'

describe('/auth-registration', () => {

    beforeAll(async () => {

        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })

    afterAll(async () => {
        await db.stop()
    })

    emailAdapter.sendMail = jest.fn().mockImplementation((to: string, confirmationCode: string) => true)
    const registrationUserUseCase = authService.registration

    it('should register', async () => {
        const data = { login: 'Somelogin', password: DEFAULT_TEST_PASSWORD, email: 'some@email.com' }

        const result = await registrationUserUseCase(data)

        expect(result.status).toBe('Success')
        expect(emailAdapter.sendMail).toHaveBeenCalledTimes(1)
    })

    it('shouldn`t register twice', async () => {
        const data = { login: 'Somelogin', password: DEFAULT_TEST_PASSWORD, email: 'some@email.com' }

        const result = await registrationUserUseCase(data)
        expect(result.status).toBe('BadRequest')
        expect(result.errorMessages).toStrictEqual([{ field: 'login', message: 'user already exists' }])
    })


})