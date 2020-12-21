const errors = require('../errors');
const { MongoError } = require('mongodb');

class BaseError extends Error {
    constructor (message, code) {
        super(message);
        this.name = 'ConsumerApiFunctionsBaseError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseError = BaseError;
exports.handleError = (context, error) => {
    context.log.error('deviceApi error = ' + error);
    switch (error.constructor) {
        case errors.InvalidUUIDError:
        case errors.MissingWebShopTokenError:
        case errors.WebShopNotFoundError:
            this.setContextResError(context, error);
            break;
        case MongoError:
            this.handleMongoErrors(context, error);
            break;
        default:
            this.handleDefaultError(context, error);
            break;
    }
};
exports.handleDefaultError = (context, error) => {
    const response = error.error;
    if (response && response.reasonPhrase) {
        if (posApiErrorCodes.includes(response.reasonPhrase)) {
            const errorFormatted = new errors.PosApiError(
                response.reasonPhrase,
                response.description,
                response.code
            );

            this.setContextResError(
                context,
                errorFormatted
            );

        } else {
            this.setMerchantWebApiContextResError(context, error.error, error.statusCode);

        }
    } else {
        this.setContextResError(
            context,
            new errors.DeviceApiServerError(
                'Something went wrong. Please try again later.',
                500
            )
        );
    }
};

exports.setContextResError = (context, error) => {
    const body = {
        code: error.code,
        description: error.message,
        reasonPhrase: error.name
    };

    context.res = {
        status: error.code,
        body: body
    };

    if (error.name !== 'StripeError') {
        console.log(body);
    }
};

exports.validateUUIDField = (context, id, message = 'The point-of-service id specified in the URL does not match the UUID v4 format.') => {
    return new Promise((resolve, reject) => {
        if (validator.isUUID(id, 4)) {
            resolve();
        } else {
            reject(
                new errors.InvalidUUIDError(message, 400)
            );
        }
    });
};
