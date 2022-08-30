import { CustomError } from "./CustomError";

export class InvalidInputError extends CustomError {

    constructor(
        message: string
    ) {
        super(417, message)
    }
}