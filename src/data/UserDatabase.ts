import { User } from "../model/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

    private static TABLE_NAME = "labook_user"

    insertUser = async (newUser: User): Promise<void> => {
        try {
            await BaseDatabase.connection()
                .insert({
                    id: newUser.getId(),
                    name: newUser.getName(),
                    email: newUser.getEmail(),
                    password: newUser.getPassword()
                })
                .into(UserDatabase.TABLE_NAME)
            
        } catch (error: any) {
            console.log(error)
            throw new Error(error.sqlMessage || error.message)
        }
    }

    getUserByEmail = async (email: string) => {
        try {
            const result = await BaseDatabase.connection()
                .select("*")
                .from(UserDatabase.TABLE_NAME)
                .where({ email })
            
            return result[0] && User.toUserModel(result[0])

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    getUserById = async (id: string) => {
        try {
            const result = await BaseDatabase.connection()
                .select("*")
                .from(UserDatabase.TABLE_NAME)
                .where({ id })
            
            return result[0] && User.toUserModel(result[0])

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    checkFriendship = async (requestId: string, requestedId: string) => {
        try {
            const result = await BaseDatabase.connection()
                .select("*")
                .where("request_id", requestId)
                .andWhere("requested_id", requestedId)
                .into("labook_friendship")

            return result[0]
            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    insertFriendship = async (requestId: string, requestedId: string): Promise<void> => {
        try {
            await BaseDatabase.connection()
                .insert({
                    request_id: requestId,
                    requested_id: requestedId
                })
                .into("labook_friendship")
            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    deleteFriendship = async (requestId: string, requestedId: string): Promise<void> => {
        try {

            await BaseDatabase.connection()
                .delete()
                .where("request_id", requestId)
                .andWhere("requested_id", requestedId)
                .into("labook_friendship")
            
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    selectFeed = async (userId: string, size: number, offset: number) => {
        try {
            
            const result = await BaseDatabase.connection()
                .select("*")
                .from("labook_friendship")
                .innerJoin("labook_user", "labook_user.id", "labook_friendship.requested_id")
                .innerJoin("labook_post", "labook_post.creator_id", "labook_friendship.requested_id")
                .where("labook_friendship.request_id", userId)
                .limit(size)
                .offset(offset)
            
            return result

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

}