import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {

    constructor (
        message: string
    ) {
        super(404, message)
    }
}