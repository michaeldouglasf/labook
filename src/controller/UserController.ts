import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { FeedInputDTO } from "../types/feedInputDTO";
import { LoginInputDTO } from "../types/loginInputDTO";
import { SignupInputDTO } from "../types/signupInputDTO";
import { startFriendshipInputDTO } from "../types/startFriendshipInputDTO";
import { undoFriendshipInputDTO } from "../types/undoFriendshipInputDTO";

export class UserController {

    constructor(
        private userBusiness: UserBusiness
    ) { }

    signUp = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body

            const user: SignupInputDTO = {
                name,
                email,
                password
            }

            const token = await this.userBusiness.signUp(user)

            res.status(201).send({ message: "User created successfully", token })

        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const user: LoginInputDTO = {
                email,
                password
            }

            const token = await this.userBusiness.login(user)

            res.status(200).send({ message: "User logged in successfully", token })

        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    startFriendship = async (req: Request, res: Response) => {
        try {

            const token = req.headers.authorization as string
            const { id } = req.params

            const newFriend: startFriendshipInputDTO = {
                id,
                token
            }

            await this.userBusiness.startFriendship(newFriend)

            res.status(201).send({ message: "Successful friendship created" })

        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    undofriendship = async (req: Request, res: Response) => {
        try {

            const token = req.headers.authorization as string
            const { id } = req.params

            const undoFriend: undoFriendshipInputDTO = {
                id,
                token
            }

            await this.userBusiness.deleteFriendship(undoFriend)

            res.status(201).send({ message: "Successful friendship deleted" })

        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    getFeed = async (req: Request, res: Response) => {
        try {

            const token = req.headers.authorization as string
            const size = Number(req.query.size) > 0 ? Number(req.query.size) : 5
            const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1

            const feedInput: FeedInputDTO = {
                token,
                size,
                page
            }

            const feed = await this.userBusiness.getFeed(feedInput)

            res.status(200).send({ feed })

        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }
}