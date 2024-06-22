import { sanitizeQuery } from '../utils/helpers';
import express, { Request, Response } from 'express'
import { BlogCreateModel } from '../features/blogs/models/BlogCreateModel'
import { BlogIdParamsModel } from '../features/blogs/models/BlogIdParamsModel'
import { BlogIdPostsPaginateModel } from '../features/blogs/models/BlogIdPostsPaginateModel'
import { BlogParamsModel } from '../features/blogs/models/BlogParamsModel'
import { BlogViewModel } from '../features/blogs/models/BlogViewModel'
import { BlogsPaginateModel } from '../features/blogs/models/BlogsPaginateModel'
import { validationBlogName, validationDescription, validationWebsiteUrl } from '../features/blogs/validations'
import { PostViewModel } from '../features/posts/models/PostViewModel'
import { validationPostContent, validationPostDescription, validationPostTile } from '../features/posts/validations'
import { authenticationBasicMiddleware } from '../middlewares/authentication-basic'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { blogsQRepository } from '../queryRepositories/blogsQRepository'
import { blogsRepository } from '../repositories/blogsRepository'
import { ErrorsMessagesType, RequestWithBody, RequestWithParams, RequestWithParamsAndQuery } from '../types'
import { HTTP_STATUSES, } from '../utils/helpers'

export const getBlogsRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request<{}, {}, {}, { [key: string]: string | undefined }>, res: Response<BlogsPaginateModel>) => {

        const sanitizedQuery = sanitizeQuery(req.query)

        const blogs = await blogsQRepository.getBlogs(sanitizedQuery)
        res.json(blogs)
        res.status(HTTP_STATUSES.OK_200)
    })

    router.post('/',
        authenticationBasicMiddleware,
        validationBlogName(),
        validationDescription(),
        validationWebsiteUrl(),
        inputValidMiddleware,
        async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | ErrorsMessagesType>) => {

            const newBlog = await blogsRepository.createBlog(req.body)
            res
                .status(HTTP_STATUSES.CREATED_201)
                .send(newBlog)
        })

    router.get('/:id',
        async (req: RequestWithParams<BlogIdParamsModel>, res: Response<BlogViewModel>) => {

            const foundBlog = await blogsQRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            res.json(foundBlog)
            res.status(HTTP_STATUSES.OK_200)
        })
    router.get('/:blogId/posts',
        async (req: RequestWithParamsAndQuery<BlogParamsModel, { [key: string]: string | undefined }>, res: Response<BlogIdPostsPaginateModel>) => {

            const foundBlog = await blogsQRepository.findBlog(req.params.blogId)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const sanitizedQuery = sanitizeQuery(req.query)
            const posts = await blogsQRepository.getBlogIdPosts(req.params.blogId, sanitizedQuery)
            res.json(posts)
            res.status(HTTP_STATUSES.OK_200)
        })

    router.post('/:blogId/posts',
        authenticationBasicMiddleware,
        validationPostTile(),
        validationPostDescription(),
        validationPostContent(),
        inputValidMiddleware,
        async (req: Request, res: Response<PostViewModel | ErrorsMessagesType>) => {

            const foundBlog = await blogsQRepository.findBlog(req.params.blogId)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const post = await blogsRepository.createBlogIdPosts(req.params.blogId, req.body, foundBlog.name)

            res.status(HTTP_STATUSES.CREATED_201)
            res.send(post)
        })

    router.put('/:id',
        authenticationBasicMiddleware,
        validationBlogName(),
        validationDescription(),
        validationWebsiteUrl(),
        inputValidMiddleware,
        async (req: Request, res: Response<ErrorsMessagesType>) => {
            const foundBlog = await blogsQRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            await blogsRepository.updateBlog(foundBlog, req.body)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/:id',
        authenticationBasicMiddleware,
        async (req: Request, res: Response<BlogViewModel>) => {
            const foundBlog = await blogsQRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            await blogsRepository.deleteBlog(req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
