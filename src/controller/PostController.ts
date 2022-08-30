import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CommentInputDTO } from "../types/commentInputDTO";
import { PostDataInputDTO } from "../types/postDataInputDTO";
import { PostInputDTO } from "../types/postInputDTO";
import { PostsTypeInputDTO } from "../types/postsTypeInputDTO";

export class PostController {

    constructor(
        private postBusiness: PostBusiness
    ) {}

    createPost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string
            const { image, description, created_at, type } = req.body

            const post: PostInputDTO = {
                image,
                description,
                created_at,
                type,
                token
            }

            const newPost = await this.postBusiness.createPost(post)

            res.status(201).send({ message: "Post created successfully", newPost })

        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    getPost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string
            const postId = req.params.id

            const postInput: PostDataInputDTO = {
                token,
                postId
            }

            const post = await this.postBusiness.getPost(postInput)

            res.status(200).send({ post })

        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    getPostsByType = async (req: Request, res: Response) => {
        try {

            const token = req.headers.authorization as string
            const type  = req.query.type as string

            const postsTypeInput: PostsTypeInputDTO = {
                token,
                type
            }

            const postsList = await this.postBusiness.getPostsByType(postsTypeInput)

            res.status(200).send({postsList})
            
        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    likePost = async (req: Request, res: Response) => {
        try {

            const token = req.headers.authorization as string
            const {postId} = req.params

            const postInput: PostDataInputDTO = {
                token,
                postId
            }

            await this.postBusiness.likePost(postInput)

            res.status(201).send({ message: "Post successfully liked"})
            
        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    dislikePost = async (req: Request, res: Response) => {
        try {

            const token = req.headers.authorization as string
            const {postId} = req.params

            const postInput: PostDataInputDTO = {
                token,
                postId
            }

            await this.postBusiness.dislikePost(postInput)

            res.status(200).send({ message: "Post successfully disliked"})
            
        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    createComment = async (req: Request, res: Response) => {
        try {

            const token = req.headers.authorization as string
            const {postId} = req.params
            const { comment } = req.body

            const commentInput: CommentInputDTO = {
                token,
                postId,
                comment
            }

            await this.postBusiness.createComment(commentInput)

            res.status(201).send({ message: "Post created successfully"})
            
        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }
}