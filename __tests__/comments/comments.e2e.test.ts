import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { RouterPaths, app } from '../../src/app'
import { db } from '../../src/db/db'
import { BlogViewModel } from '../../src/features/blogs/models/BlogViewModel'
import { CommentViewModel } from '../../src/features/comments/models/CommentViewModel'
import { errRequiredCommentContent } from '../../src/features/comments/validations'
import { PostViewModel } from '../../src/features/posts/models/PostViewModel'
import { UserViewModel } from '../../src/features/users/models/UserViewModel'
import { HTTP_STATUSES } from '../../src/utils/helpers'
import { createBlog } from '../blogs/createBlogs'
import { createLogin } from '../login/createLogin'
import { createPost } from '../posts/createPosts'
import { createUser } from '../users/createUsers'
import { ROUTER_COMENTS_PATH, commentsTestManager } from './commentsTestManager'

const validContent = '21-sym-Length-Content'

describe('/comments', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })

    afterAll(async () => {
        await db.stop()
    })

    let createdBlog: BlogViewModel
    let createdPost: PostViewModel

    it('should return 200 and empty array', async () => {
        createdBlog = await createBlog()
        createdPost = await createPost(createdBlog.id)
        await request(app)
            .get(`${RouterPaths.posts}/${createdPost.id}${ROUTER_COMENTS_PATH}`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(ROUTER_COMENTS_PATH + '/6676a23681ff6de724021d0b')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should`n create comment if none auth 401', async () => {

        const data = { content: validContent, postId: createdPost.id }

        await commentsTestManager.createCommentNonAuth(
            data,
            createdPost.id,
            HTTP_STATUSES.NOT_AUTHORIZED_401,
        )

        await request(app)
            .get(`${RouterPaths.posts}/${createdPost.id}${ROUTER_COMENTS_PATH}`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdUser: UserViewModel
    let token: string


    it('should`n create entity with bad login', async () => {

        createdUser = await createUser()
        token = (await createLogin(createdUser.login)).accessToken
        const data = { content: '', postId: createdPost.id }
        const error = {
            errorsMessages: [{
                message: errRequiredCommentContent,
                field: 'content'
            }]
        }

        await commentsTestManager.createCommentWithErrors(
            data,
            token,
            HTTP_STATUSES.BAD_REQUEST_400,
            error
        )

        await request(app)
            .get(`${RouterPaths.posts}/${createdPost.id}${ROUTER_COMENTS_PATH}`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdEntity: CommentViewModel

    it('should create entity with correct data', async () => {

        const data = { content: validContent, postId: createdPost.id }

        const response = await commentsTestManager.createComment(
            data,
            token
        )

        createdEntity = response.body

        expect(createdEntity.content).toEqual(data.content)
        expect(createdEntity.commentatorInfo.userId).toEqual(createdUser.id)
        expect(createdEntity.commentatorInfo.userLogin).toEqual(createdUser.login)

        await request(app)
            .get(`${ROUTER_COMENTS_PATH}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity)

        await request(app)
            .get(`${RouterPaths.posts}/${createdPost.id}${ROUTER_COMENTS_PATH}`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdEntity] })
    })

    it('should`n update entity with bad data', async () => {

        const data = { content: '' }

        const errors = {
            errorsMessages: [
                {
                    message: errRequiredCommentContent,
                    field: 'content'
                }
            ]
        }

        await commentsTestManager.updateCommentWithErrors(createdEntity.id, data, token, HTTP_STATUSES.BAD_REQUEST_400, errors)

        await request(app)
            .get(`${ROUTER_COMENTS_PATH}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity)
    })
    it('should`n update entity with correct data', async () => {

        const data = { content: 'new-valid-Length-Content' }

        await commentsTestManager.updateComment(createdEntity.id, data, token)

        const response = await request(app)
            .get(`${ROUTER_COMENTS_PATH}/${createdEntity.id}`)

        createdEntity = response.body

        expect(createdEntity.content).toEqual(data.content)

        await request(app)
            .get(`${ROUTER_COMENTS_PATH}/${createdEntity.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity)
    })

    it('should delete entity', async () => {

        await commentsTestManager.deleteComment(createdEntity.id, token)

        await request(app)
            .get(`${RouterPaths.posts}/${createdPost.id}${ROUTER_COMENTS_PATH}`)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
})