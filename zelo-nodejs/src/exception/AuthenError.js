class AuthenError extends Error {
    constructor(message = 'Not Authorize') {
        super();
        this.status = 401;
        this.message = message;
    }
}

module.exports = AuthenError;
