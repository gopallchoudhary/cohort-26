class ApiError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }


    static badRequest(message = "Bad request") {
        throw new ApiError(400, message)
    }

    static unauthorized(message = "Unauthorized") {
        throw new ApiError(401, message)
    }

    static conflict(message = "Conflict - User already exists   ") {
        throw new ApiError(409, message)
    }

    static forbidden(message = "forbidden") {
        throw new ApiError(412, message)
    }


    static notFound(message = "Not found") {
        throw new ApiError(412, message)
    }
    
}

export default ApiError