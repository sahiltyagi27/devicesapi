class BaseError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ConsumerApiFunctionsBaseError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.BaseError = BaseError;

class DeviceApiServerError extends BaseError {
    constructor (message, code) {
        super(message, code);
        this.name = 'DeviceApiServerError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DeviceApiServerError = DeviceApiServerError;


class UserNotAuthenticatedError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'UserNotAuthenticatedError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.UserNotAuthenticatedError = UserNotAuthenticatedError;

class EmptyRequestBodyError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'EmptyRequestBodyError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.EmptyRequestBodyError = EmptyRequestBodyError;

class MissingMerchantID extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'MissingMerchantID';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MissingMerchantID = MissingMerchantID;


class FieldValidationError extends BaseError {
    constructor(message, code) {
        super(message);
        this.name = 'FieldValidationError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.FieldValidationError = FieldValidationError;
class InvalidUUIDError extends BaseError {
    constructor(message, code) {
        super(message, code);
        this.name = 'InvalidUUIDError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.InvalidUUIDError = InvalidUUIDError;

class AccessLogNotFoundError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'AccessLogNotFoundError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AccessLogNotFoundError = AccessLogNotFoundError;

class MerchantNotFoundError extends BaseError {
    constructor (message, code) {
        super(message);
        this.name = 'MerchantNotFoundError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MerchantNotFoundError = MerchantNotFoundError;
