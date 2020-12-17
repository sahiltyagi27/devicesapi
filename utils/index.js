
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
