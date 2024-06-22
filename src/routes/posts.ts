import express, { Request, Response } from 'express'
import { BlogViewModel } from '../features/blogs/models/BlogViewModel'
import { PostCreateModel } from '../features/posts/models/PostCreateModel'
import { PostIdParamsModel } from '../features/posts/models/PostIdParamsModel'
import { PostViewModel } from '../features/posts/models/PostViewModel'
import { PostsPaginateModel } from '../features/posts/models/PostsPaginateModel'
import { validationPostBlogId, validationPostContent, validationPostDescription, validationPostTile } from '../features/posts/validations'
import { authenticationBasicMiddleware } from '../middlewares/authentication-basic'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { blogsQRepository } from '../queryRepositories/blogsQRepository'
import { postsQRepository } from '../queryRepositories/postsQRepository'
import { postsRepository } from '../repositories/postsRepository'
import { ErrorsMessagesType, RequestWithBody, RequestWithParams, RequestWithParamsAndQuery } from '../types'
import { HTTP_STATUSES, sanitizeQuery, } from '../utils/helpers'
import { PostIdCommentsParamsModel } from '../features/posts/models/PostIdCommentsParamsModel'

export const getPostsRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request<{}, {}, {}, { [key: string]: string | undefined }>, res: Response<PostsPaginateModel>) => {

        const sanitizedQuery = sanitizeQuery(req.query)

        const posts = await postsQRepository.getPosts(sanitizedQuery)
        res.json(posts)
        res.status(HTTP_STATUSES.OK_200)
    })

    router.post('/',
        authenticationBasicMiddleware,
        validationPostTile(),
        validationPostDescription(),
        validationPostContent(),
        validationPostBlogId(),
        inputValidMiddleware,
        async (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel | ErrorsMessagesType>) => {

            const foundBlog = await blogsQRepository.findBlog(req.body.blogId)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const newPost = await postsRepository.createPost(req.body, foundBlog.name)
            res
                .status(HTTP_STATUSES.CREATED_201)
                .send(newPost)
        })

    router.get('/:id',
        async (req: RequestWithParams<PostIdParamsModel>, res: Response<PostViewModel>) => {

            const foundPost = await postsQRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            res.json(foundPost)
            res.status(HTTP_STATUSES.OK_200)
        })

    router.put('/:id',
        authenticationBasicMiddleware,
        validationPostTile(),
        validationPostDescription(),
        validationPostContent(),
        validationPostBlogId(),
        inputValidMiddleware,
        async (req: Request, res: Response<ErrorsMessagesType>) => {

            const foundPost = await postsQRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            await postsRepository.updatePost(foundPost, req.body)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/:id',
        authenticationBasicMiddleware,
        async (req: Request, res: Response<BlogViewModel>) => {
            const foundPost = await postsQRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            await postsRepository.deletePost(req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.get('/:postId/comments',
        async (req: RequestWithParamsAndQuery<PostIdCommentsParamsModel, { [key: string]: string | undefined }>, res: Response<PostViewModel>) => {

            const foundPost = await postsQRepository.findPost(req.params.postId)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const sanitizedQuery = sanitizeQuery(req.query)
            res.json(foundPost)
            res.status(HTTP_STATUSES.OK_200)
        })

    return router
}
