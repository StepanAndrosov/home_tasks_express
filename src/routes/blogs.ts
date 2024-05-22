import express, { Request, Response } from 'express'
import { BlogCreateModel } from '../features/blogs/models/BlogCreateModel'
import { BlogIdParamsModel } from '../features/blogs/models/BlogIdParamsModel'
import { BlogViewModel } from '../features/blogs/models/BlogViewModel'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { blogsRepository } from '../repositories/blogsRepository'
import { ErrorsMessagesType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery } from '../types'
import { HTTP_STATUSES, } from '../utils'
import { validationBlogName, validationDescription, validationWebsiteUrl } from '../features/blogs/validations'
import { authenticationMiddleware } from '../middlewares/authentication '
import { BlogIdPostsPaginateModel } from '../features/blogs/models/BlogIdPostsPaginateModel'
import { BlogParamsModel } from '../features/blogs/models/BlogParamsModel'
import { sanitizeQuery } from '../features/blogs/sanitizeQuery'
import { blogsQRepository } from '../queryRepositories/blogsQRepository'
import { BlogIdPostCreateModel } from '../features/blogs/models/BlogIdPostCreateModel'
import { validationPostContent, validationPostDescription, validationPostTile } from '../features/posts/validations'
import { PostViewModel } from '../features/posts/models/PostViewModel'

export const getBlogsRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request, res: Response<BlogViewModel[]>) => {
        const blogs = await blogsRepository.getBlogs()
        res.json(blogs)
        res.status(HTTP_STATUSES.OK_200)
    })

    router.post('/',
        authenticationMiddleware,
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

            const foundBlog = await blogsRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            res.json(foundBlog)
            res.status(HTTP_STATUSES.OK_200)
        })
    router.get('/:blogId/posts',
        async (req: RequestWithParamsAndQuery<BlogParamsModel, { [key: string]: string | undefined }>, res: Response<BlogIdPostsPaginateModel>) => {
            const sanitizedQuery = sanitizeQuery(req.query)
            const posts = await blogsQRepository.getBlogIdPosts(req.params.blogId, sanitizedQuery)
            res.json(posts)
            res.status(HTTP_STATUSES.OK_200)
        })

    router.post('/:blogId/posts',
        authenticationMiddleware,
        validationPostTile(),
        validationPostDescription(),
        validationPostContent(),
        inputValidMiddleware,
        async (req: Request, res: Response<PostViewModel | ErrorsMessagesType>) => {

            const foundBlog = await blogsRepository.findBlog(req.params.blogId)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const post = await blogsQRepository.createBlogIdPosts(req.params.blogId, req.body, foundBlog.name)

            res.status(HTTP_STATUSES.CREATED_201)
            res.send(post)
        })

    router.put('/:id',
        authenticationMiddleware,
        validationBlogName(),
        validationDescription(),
        validationWebsiteUrl(),
        inputValidMiddleware,
        async (req: Request, res: Response<ErrorsMessagesType>) => {
            const foundBlog = await blogsRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            await blogsRepository.updateBlog(foundBlog, req.body)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/:id',
        authenticationMiddleware,
        async (req: Request, res: Response<BlogViewModel>) => {
            const foundBlog = await blogsRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            await blogsRepository.deleteBlog(req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
