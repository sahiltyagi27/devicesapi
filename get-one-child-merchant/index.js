const utils = require('../utils');
const errors = require('../errors');
const { database } = require('../db/mongodb');
const uuid = require('uuid');

module.exports = async function (context, req) {
    try {
        if (!uuid.validate(req.params.parentMerchantID)) {
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The parentMerchantID specified in the URL does not match the UUID v4 format.',
                    400
                )
            )
            return Promise.resolve()
        }

        if (!uuid.validate(req.params.childID)) {
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The childID specified in the URL does not match the UUID v4 format.',
                    400
                )
            )
            return Promise.resolve();
        }

        let collection = database.collection('merchants');
        let docs = await collection.findOne({ parentMerchantID: req.params.parentMerchantID, _id: req.params.childID });
        if (docs) {
            context.res = {
                body: docs
            }
            return Promise.resolve();
        } else {
            utils.setContextResError(
                context,
                new errors.MerchantNotFoundError(
                    'The merchant of specified details doesn\'t exist.',
                    404
                )
            );
        }
    } catch (error) {
        utils.handleError(context, error);
    }
}