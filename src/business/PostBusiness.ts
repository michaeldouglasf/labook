import { PostDatabase } from "../data/PostDatabase";
import { Post } from "../model/Post";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { CommentInputDTO } from "../types/commentInputDTO";
import { PostDataInputDTO } from "../types/postDataInputDTO";
import { PostInputDTO } from "../types/postInputDTO";
import { PostsTypeInputDTO } from "../types/postsTypeInputDTO";
import { ConflictError } from "./errors/ConflictError";
import { InvalidInputError } from "./errors/InvalidInputError";
import { NotFoundError } from "./errors/NotFoundError";
import { UnauthorizedError } from "./errors/UnauthorizedError";

export class PostBusiness {

    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ) { }


    createPost = async (post: PostInputDTO) => {

            const { token } = post
            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            const { description, type } = post
            let { created_at, image } = post

            if (!description || !type) {
                throw new InvalidInputError("Invalid input. Image, description, created_at and type are required")
            }

            if (type !== "NORMAL" && type !== "EVENTO") {
                throw new InvalidInputError("Invalid type. Type must be NORMAL or EVENTO")
            }

            if (!created_at) {
                created_at = new Date()
            }

            const postId = this.idGenerator.generate()

            const newPost = new Post(postId, image, description, created_at, type, userTokenData.id)

            await this.postDatabase.insertPost(newPost)

            return newPost

    }

    getPost = async (postInput: PostDataInputDTO) => {

            const { token, postId } = postInput

            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            if (postId === ":id") {
                throw new InvalidInputError("Fill the :id with the post id")
            }

            if (!postId) {
                throw new InvalidInputError("Invalid postId")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            const post = await this.postDatabase.selectPostbyId(postId)

            if (!post) {
                throw new NotFoundError("Post not found")
            }

            return post
    }

    getPostsByType = async (postsTypeInput: PostsTypeInputDTO) => {

            const { token, type } = postsTypeInput

            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            if (!type) {
                throw new InvalidInputError("Please fill in the query field, with the post type 'normal' or 'evento.")
            }

            const postsList = await this.postDatabase.selectPostByType(type)

            return postsList

    }

    likePost = async (postInput: PostDataInputDTO) => {

            const { token, postId } = postInput

            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            if (!postId || postId === ":postId") {
                throw new InvalidInputError("Fill the :postId with the post id")
            }

            const post = await this.postDatabase.selectPostbyId(postId)

            if (!post) {
                throw new NotFoundError("Post not found")
            }

            const userLike = await this.postDatabase.checkLikeOnPost(userTokenData.id, postId)

            if (!userLike) {
                await this.postDatabase.insertLike(userTokenData.id, postId)
            } else if (userLike?.status === "dislike") {
                await this.postDatabase.changeDislikeToLike(userTokenData.id, postId)
            } else {
                throw new ConflictError("You already liked this post") 
            }

    }

    dislikePost = async (postInput: PostDataInputDTO) => {

            const { token, postId} = postInput

            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            if (!postId || postId === ":postId") {
                throw new InvalidInputError("Fill the :postId with the post id")
            }

            const post = await this.postDatabase.selectPostbyId(postId)

            if (!post) {
                throw new NotFoundError("Post not found")
            }

            const userLike = await this.postDatabase.checkLikeOnPost(userTokenData.id, postId)

            if (!userLike) {
                throw new Error("You can only dislike a post that you have previously liked")
            }

            if (userLike?.status === "dislike") {
                throw new ConflictError("You have already disliked this post")
            }

            await this.postDatabase.insertDislike(userTokenData.id, postId)

    }

    createComment = async (commentInput: CommentInputDTO) => {

            const { token, postId, comment } = commentInput

            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            if (!postId || postId === ":postId") {
                throw new InvalidInputError("Fill the :postId with the post id")
            }

            const post = await this.postDatabase.selectPostbyId(postId)

            if (!post) {
                throw new NotFoundError("Post not found")
            }

            if(!comment) {
                throw new InvalidInputError("Invalid input. Comment is required")
            }

            const id = this.idGenerator.generate()

            await this.postDatabase.insertComment(id, userTokenData.id, postId, comment)

    }
}