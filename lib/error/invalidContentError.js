class InvalidContentError extends Error {
    constructor() {
        super('JWT content is not valid');
    }
}

module.exports = InvalidContentError;