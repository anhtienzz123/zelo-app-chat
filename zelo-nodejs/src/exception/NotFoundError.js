class NotFoundError extends Error {
    constructor(message) {
        super();
        this.status = 404;
        this.message = message + ' not found';
    }
}

module.exports = NotFoundError;
