import express, { Request, Response } from 'express'
import { BlogIdParamsModel } from '../features/blogs/models/BlogIdParamsModel'
import { BlogViewModel } from '../features/blogs/models/BlogViewModel'
import { PostCreateModel } from '../features/posts/models/PostCreateModel'
import { PostIdParamsModel } from '../features/posts/models/PostIdParamsModel'
import { PostModel } from '../features/posts/models/PostModel'
import { PostViewModel } from '../features/posts/models/PostViewModel'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { blogsRepository } from '../repositories/blogsRepository'
import { postsRepository } from '../repositories/postsRepository'
import { ErrorsMessagesType, RequestWithBody, RequestWithParams } from '../types'
import { HTTP_STATUSES, } from '../utils'
import { validationPostBlogId, validationPostContent, validationPostDescription, validationPostTile } from '../features/posts/validations'
import { authenticationMiddleware } from '../middlewares/authentication '

export const getPostsRouter = () => {
    const router = express.Router()

    router.get('/', (req: Request, res: Response<PostModel[]>) => {
        const posts = postsRepository.getPosts()
        res.json(posts)
        res.sendStatus(HTTP_STATUSES.OK_200)
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

            const newPost = postsRepository.createPost(req.body, foundBlog.name)
            res
                .status(HTTP_STATUSES.CREATED_201)
                .send(newPost)
        })

    router.get('/:id',
        (req: RequestWithParams<PostIdParamsModel>, res: Response<PostViewModel>) => {

            const foundPost = postsRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            res.json(foundPost)
            res.sendStatus(HTTP_STATUSES.OK_200)
        })

    router.put('/:id',
        authenticationMiddleware,
        validationPostTile(),
        validationPostDescription(),
        validationPostContent(),
        validationPostBlogId(),
        inputValidMiddleware,
        (req: Request, res: Response<ErrorsMessagesType>) => {

            const foundPost = postsRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const foundindex = postsRepository.findIndex(foundPost)

            if (foundindex < 0) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            postsRepository.updatePost(foundindex, foundPost, req.body)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/:id',
        authenticationMiddleware,
        (req: Request, res: Response<BlogViewModel>) => {
            const foundPost = postsRepository.findPost(req.params.id)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            const foundindex = postsRepository.findIndex(foundPost)

            if (foundindex < 0) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            postsRepository.deletePost(foundindex)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
