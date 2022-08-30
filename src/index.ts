import { PostBusiness } from "./business/PostBusiness"
import { UserBusiness } from "./business/UserBusiness"
import { app } from "./controller/app"
import { PostController } from "./controller/PostController"
import { UserController } from "./controller/UserController"
import { PostDatabase } from "./data/PostDatabase"
import { UserDatabase } from "./data/UserDatabase"
import { Authenticator } from "./services/Authenticator"
import { HashManager } from "./services/HashManager"
import { IdGenerator } from "./services/IdGenerator"

const userBusiness = new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new HashManager(),
    new Authenticator()
)
const userController = new UserController(
    userBusiness
)

const postBusiness = new PostBusiness(
    new PostDatabase(),
    new IdGenerator(),
    new Authenticator()
)

const postController = new PostController(
    postBusiness
)

// Usuário
app.get("/feed", userController.getFeed)
app.post("/signup", userController.signUp)
app.post("/login", userController.login)
app.post("/friendship/:id", userController.startFriendship)
app.post("/friendship/undo/:id", userController.undofriendship)

// Post
app.post("/post", postController.createPost)
app.get("/post", postController.getPostsByType)
app.get("/post/:id", postController.getPost)
app.post("/post/:postId/like", postController.likePost)
app.put("/post/:postId/dislike", postController.dislikePost)
app.post("/post/:postId/comment", postController.createComment)