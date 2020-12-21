const utils = require('../utils');
const errors = require('../errors');
const { database } = require('../db/mongodb');
module.exports = async function (context, req) {
    try {
        let collection = database.collection('merchants');
        let docs = await collection.deleteOne({ parentMerchantID: req.params.parentMerchantID, _id: req.params.childID });
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