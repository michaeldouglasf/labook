export enum POST_TYPE {
    NORMAL = "NORMAL",
    EVENTO = "EVENTO"
}

export class Post {
    constructor(
        private id: string,
        private image: string,
        private description: string,
        private created_at: Date,
        private type: POST_TYPE,
        private creator_id: string
    ) {}

    public getId = (): string => this.id

    public getImage = (): string => this.image

    public getDescription = (): string => this.description

    public getCreatedAt = (): Date => this.created_at

    public getType = (): POST_TYPE => this.type

    public getCreatorId = (): string => this.creator_id

    public static toPostModel = (post: any): Post => {
        return new Post(
            post.id,
            post.image,
            post.description,
            post.created_at,
            post.type,
            post.creator_id
        )
    }

}