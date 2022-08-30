import { UserDatabase } from "../data/UserDatabase";
import { User } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { FeedInputDTO } from "../types/feedInputDTO";
import { LoginInputDTO } from "../types/loginInputDTO";
import { SignupInputDTO } from "../types/signupInputDTO";
import { startFriendshipInputDTO } from "../types/startFriendshipInputDTO";
import { undoFriendshipInputDTO } from "../types/undoFriendshipInputDTO";
import { ConflictError } from "./errors/ConflictError";
import { InvalidInputError } from "./errors/InvalidInputError";
import { NotFoundError } from "./errors/NotFoundError";
import { UnauthorizedError } from "./errors/UnauthorizedError"

export class UserBusiness {

    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator
    ) { }

    signUp = async (user: SignupInputDTO) => {

            const { name, email, password } = user

            if (!name || !email || !password) {
                throw new InvalidInputError("Invalid input. Name, email and password are required")
            }

            if (password.length < 6) {
                throw new InvalidInputError("Invalid password. Password must have at least 6 characters")
            }

            if (email.includes("@") === false) {
                throw new InvalidInputError("Invalid email. Email must contain @")
            }

            const registeredUser = await this.userDatabase.getUserByEmail(email)

            if (registeredUser) {
                throw new NotFoundError("User already exists")
            }

            const id = this.idGenerator.generate()
            const cryptedPassword = this.hashManager.createHash(password)

            const newUser = new User(id, name, email, cryptedPassword)

            await this.userDatabase.insertUser(newUser)

            const token = this.authenticator.generateToken({ id })

            return token
    }

    login = async (user: LoginInputDTO) => {

            const { email, password } = user

            if (!email || !password) {
                throw new InvalidInputError("Invalid input. Email and password are required")
            }

            const userFromDB = await this.userDatabase.getUserByEmail(email)

            if (!userFromDB) {
                throw new NotFoundError("Invalid credentials")
            }

            const isPasswordCorrect = this.hashManager.compareHash(password, userFromDB.getPassword())

            if (!isPasswordCorrect) {
                throw new NotFoundError("Invalid credentials")
            }

            const token = this.authenticator.generateToken({ id: userFromDB.getId() })

            return token
    }

    startFriendship = async (newFriend: startFriendshipInputDTO) => {

            const { id, token } = newFriend

            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            if (!id || id === ":id") {
                throw new InvalidInputError("Fill the :id with the user id")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            const userFromDB = await this.userDatabase.getUserById(id)

            if (!userFromDB) {
                throw new NotFoundError("Invalid credentials, no id registration")
            }

            const registeredFriendship = await this.userDatabase.checkFriendship(userTokenData.id, id)


            if (registeredFriendship) {
                throw new ConflictError("Friendship already exists")
            }


            await this.userDatabase.insertFriendship(userTokenData.id, id)
            await this.userDatabase.insertFriendship(id, userTokenData.id)

    }

    deleteFriendship = async (undoFriend: undoFriendshipInputDTO) => {

            const { id, token } = undoFriend

            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            if (!id || id === ":id") {
                throw new InvalidInputError("Fill the :id with the user id")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            const userFromDB = await this.userDatabase.getUserById(id)

            if (!userFromDB) {
                throw new NotFoundError("Invalid credentials, no id registration on database")
            }

            const registeredFriendship = await this.userDatabase.checkFriendship(userTokenData.id, id)

            if (!registeredFriendship) {
                throw new NotFoundError("Non Existing Friendship")
            }

            await this.userDatabase.deleteFriendship(userTokenData.id, id)
            await this.userDatabase.deleteFriendship(id, userTokenData.id)

    }

    getFeed = async (feedInput: FeedInputDTO) => {

            const { token, size, page } = feedInput

            if (!token) {
                throw new InvalidInputError("First, you need to login and get a token")
            }

            const userTokenData = this.authenticator.getTokenData(token)

            if (!userTokenData) {
                throw new UnauthorizedError("Invalid token")
            }

            const offset = size * (page - 1)

            const feed = await this.userDatabase.selectFeed(userTokenData.id, size, offset)

            return feed
    }

}