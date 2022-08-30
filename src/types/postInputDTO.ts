import { POST_TYPE } from "../model/Post"

export type PostInputDTO = {
    image: string
    description: string
    created_at?: Date
    type: POST_TYPE
    token: string
}