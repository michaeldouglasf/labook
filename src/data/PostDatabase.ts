import { Post } from "../model/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {

    private static TABLE_NAME = "labook_post"
    
    insertPost =  async (newPost: Post) => {
        try {

            await BaseDatabase.connection()
                .insert({
                    id: newPost.getId(),
                    image: newPost.getImage(),
                    description: newPost.getDescription(),
                    created_at: newPost.getCreatedAt(),
                    type: newPost.getType(),
                    creator_id: newPost.getCreatorId()
                })
                .into(PostDatabase.TABLE_NAME)


        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    selectPostbyId = async (postId: string) => {
        try {
            const post = await BaseDatabase.connection()
                .select("*")
                .from(PostDatabase.TABLE_NAME)
                .where({ id: postId })

            return post[0] && Post.toPostModel(post[0])

            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    selectPostByType = async (type: string) => {
        try {
            const result = await BaseDatabase.connection()
                .select("*")
                .from(PostDatabase.TABLE_NAME)
                .where({type})
                .orderBy("created_at")

            return result && result.map((post) => {
                Post.toPostModel(post)
            })
            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    checkLikeOnPost = async (userId: string, postId: string) => {
        try {

            const result = await BaseDatabase.connection()
                .select("*")
                .from("labook_like")
                .where({
                    user_id: userId
                })
                .andWhere({
                    post_id: postId
                })
            
            return result[0]
            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
    
    insertLike = async (userId: string, postId: string) => {
        try {

            await BaseDatabase.connection()
                .insert({
                    post_id: postId,
                    user_id: userId
                })
                .into("labook_like")
            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    insertDislike = async (userId: string, postId: string) => {
        try {

            await BaseDatabase.connection()
                .update({
                    status: "dislike"
                })
                .into("labook_like")
                .where({
                    user_id: userId
                })
                .andWhere({
                    post_id: postId
                })

            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    changeDislikeToLike = async (userId: string, postId: string) => {
        try {

            await BaseDatabase.connection()
                .update({
                    status: "like"
                })
                .into("labook_like")
                .where({
                    user_id: userId
                })
                .andWhere({
                    post_id: postId
                })

            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    insertComment = async (id: string, userId: string, postId: string, comment: any) => {
        try {
            await BaseDatabase.connection()
                .insert({
                    id,
                    user_id: userId,
                    post_id: postId,
                    comment
                })
                .into("labook_comment")
                
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}