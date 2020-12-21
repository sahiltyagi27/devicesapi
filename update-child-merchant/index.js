const utils = require('../utils');
const errors = require('../errors');
const { database } = require('../db/mongodb');
module.exports = async function (context, req) {
    try {

        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You\'ve requested to update a child merchant but the request body seems to be empty. Kindly pass the child merchant to be updated using request body in application/json format',
                    400
                )
            );
            return Promise.resolve();
        }
        
        let collection = database.collection('merchants');
        let docs = await collection.updateOne({ parentMerchantID: req.params.parentMerchantID, _id: req.params.childID }, { $set: req.body });
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