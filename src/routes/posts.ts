import express, { Request, Response } from 'express'
import { BlogViewModel } from '../features/blogs/models/BlogViewModel'
import { PostCreateModel } from '../features/posts/models/PostCreateModel'
import { PostIdParamsModel } from '../features/posts/models/PostIdParamsModel'
import { PostModel } from '../features/posts/models/PostModel'
import { PostViewModel } from '../features/posts/models/PostViewModel'
import { validationPostBlogId, validationPostContent, validationPostDescription, validationPostTile } from '../features/posts/validations'
import { authenticationMiddleware } from '../middlewares/authentication '
import { inputValidMiddleware } from '../middlewares/input-valid'
import { blogsRepository } from '../repositories/blogsRepository'
import { postsRepository } from '../repositories/postsRepository'
import { ErrorsMessagesType, RequestWithBody, RequestWithParams } from '../types'
import { HTTP_STATUSES, } from '../utils'
import { postsQRepository } from '../queryRepositories/postsQRepository'
import { sanitizeQuery } from '../features/blogs/sanitizeQuery'
import { PostsPaginateModel } from '../features/posts/models/PostsPaginateModel'

export const getPostsRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request<{}, {}, {}, { [key: string]: string | undefined }>, res: Response<PostsPaginateModel>) => {

        const sanitizedQuery = sanitizeQuery(req.query)

        const posts = await postsQRepository.getPosts(sanitizedQuery)
        res.json(posts)
        res.status(HTTP_STATUSES.OK_200)
    })

    router.post('/',
        authenticationMiddleware,
        validationPostTile(),
        validationPostDescription(),
        validationPostContent(),
        validationPostBlogId(),
        inputValidMiddleware,
        async (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel | ErrorsMessagesType>) => {

            const foundBlog = await blogsRepository.findBlog(req.body.blogId)
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

            const foundPost = await postsRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            res.json(foundPost)
            res.status(HTTP_STATUSES.OK_200)
        })

    router.put('/:id',
        authenticationMiddleware,
        validationPostTile(),
        validationPostDescription(),
        validationPostContent(),
        validationPostBlogId(),
        inputValidMiddleware,
        async (req: Request, res: Response<ErrorsMessagesType>) => {

            const foundPost = await postsRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            await postsRepository.updatePost(foundPost, req.body)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/:id',
        authenticationMiddleware,
        async (req: Request, res: Response<BlogViewModel>) => {
            const foundPost = await postsRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            await postsRepository.deletePost(req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
