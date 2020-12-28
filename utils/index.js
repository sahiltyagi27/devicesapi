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
exports.handleMongoErrors = (context, error) => {
    switch (error.code) {
        case 11000:
            handleDuplicateDocumentInserts(context);
            break;
        default:
            this.handleDefaultError(context, error);
            break;
    }
};

const handleDuplicateDocumentInserts = context => {
    let className, entity;

    if (context.req.body.docType === 'pointOfService') {
        className = 'DuplicatePointOfServiceError';
        entity = 'pointOfService';
    }
    if (context.req.body.docType === 'pointOfServiceAuth') {
        className = 'DuplicatePointOfServiceAuthError';
        entity = 'pointOfServiceAuth';
    }
    if (context.req.body.docType === 'modules') {
        className = 'DuplicateModulesError';
        entity = 'modules';
    }
    if (context.req.body.docType === 'zones') {
        className = 'DuplicateZonesError';
        entity = 'zones';
    }
    if (context.req.body.docType === 'accessGroups') {
        className = 'DuplicateAccessGroupsError';
        entity = 'accessGroups';
    }
    if (context.req.body.docType === 'accessToken') {
        className = 'DuplicateAccessTokenError';
        entity = 'accessToken';
    }
    if (context.req.body.docType === 'schedules') {
        className = 'DuplicateSchedulesError';
        entity = 'schedules';
    }
    if (context.req.body.docType === 'sites') {
        className = 'DuplicateSitesError';
        entity = 'sites';
    }
    if (context.req.body.docType === 'moduleTemplates') {
        className = 'DuplicateModuleTemplatesError';
        entity = 'moduleTemplates';
    }
    if (context.req.body.docType === 'components') {
        className = 'DuplicateComponentsError';
        entity = 'components';
    }
    if (context.req.body.docType === 'accessLog') {
        className = 'DuplicateAccessLogError';
        entity = 'accessLog';
    }
    if (context.req.body.docType === 'posGroups') {
        className = 'DuplicatePOSGroupsError';
        entity = 'posGroups';
    }
    this.setContextResError(
        context,
        new errors[className](
            `You've requested to create a new ${entity} but a ${entity} with the specified _id field already exists.`,
            409
        )
    );
};
