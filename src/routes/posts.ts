import express, { Request, Response } from 'express';
import { BlogViewModel } from '../features/blogs/models/BlogViewModel';
import { CommentViewModel } from '../features/comments/models/CommentViewModel';
import { CommentsPaginateModel } from '../features/comments/models/CommentsPaginateModel';
import { validationCommentContent } from '../features/comments/validations';
import { PostCreateModel } from '../features/posts/models/PostCreateModel';
import { PostIdCommentsParamsModel } from '../features/posts/models/PostIdCommentsParamsModel';
import { PostIdParamsModel } from '../features/posts/models/PostIdParamsModel';
import { PostViewModel } from '../features/posts/models/PostViewModel';
import { PostsPaginateModel } from '../features/posts/models/PostsPaginateModel';
import { validationPostBlogId, validationPostContent, validationPostDescription, validationPostTile } from '../features/posts/validations';
import { authenticationBasicMiddleware } from '../middlewares/authentication-basic';
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer';
import { inputValidMiddleware } from '../middlewares/input-valid';
import { blogsQRepository } from '../queryRepositories/blogsQRepository';
import { postsQRepository } from '../queryRepositories/postsQRepository';
import { usersQRepository } from '../queryRepositories/usersQRepository';
import { commentsRepository } from '../repositories/commentsRepository';
import { postsRepository } from '../repositories/postsRepository';
import { ErrorsMessagesType, RequestWithBody, RequestWithParams, RequestWithParamsAndQuery } from '../types';
import { getDeviceInfoByToken, HTTP_STATUSES, sanitizeQuery, } from '../utils/helpers';
import { commentsService } from '../features/comments/service';

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

            const updated = await postsRepository.updatePost(req.params.id, req.body)
            if (!updated) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
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
        async (req: RequestWithParamsAndQuery<PostIdCommentsParamsModel, { [key: string]: string | undefined }>, res: Response<CommentsPaginateModel>) => {
            console.log(req.params)
            const foundPost = await postsQRepository.findPost(req.params.postId)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const sanitizedQuery = sanitizeQuery(req.query)
            const token = req.headers.authorization
            const { userId } = getDeviceInfoByToken(token)

            const commentsQuery = await postsQRepository.getPostIdComments(req.params.postId, sanitizedQuery)

            const allPromise = Promise.all(
                commentsQuery.items
                    .map(async (comment) => await commentsService.parseCommentWithMyStatus(comment, userId))
            );

            const comments = await allPromise

            res.json({
                ...commentsQuery,
                items: comments
            })
            res.status(HTTP_STATUSES.OK_200)
        })

    router.post('/:postId/comments',
        authenticationBearerMiddleware,
        validationCommentContent(),
        inputValidMiddleware,
        async (req: Request, res: Response<CommentViewModel | ErrorsMessagesType>) => {

            console.log(req.params, req.body)

            const user = await usersQRepository.findUserById(req.body.id)
            if (!user) {
                res
                    .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
                return
            }
            const foundPost = await postsQRepository.findPost(req.params.postId)
            if (!foundPost) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const comment = await commentsRepository.createComment({ content: req.body.content, postId: foundPost.id }, { userId: user?.id, userLogin: user?.login })

            res.status(HTTP_STATUSES.CREATED_201)
            res.send(comment)
        })

    return router
}
