const utils = require('../utils');
const errors = require('../errors');
const { database } = require('../db/mongodb');

module.exports = async function (context, req) {
    try {
        await utils.validateUUIDField(context, req.query.accessLogID, 'The accessLogID specified in the URL does not match the UUID v4 format.');
        const collection = database.collection('accesslogs');
        const query = {
            docType: 'accessLog',
            _id: req.query.accessLogID,
            partitionKey: req.query.accessLogID,
            $or: [{ posMerchantID: req.query.id }, { tokenMerchantID: req.query.id }]
        };
        const accessLog = await collection.find(query).toArray();
        if (accessLog) {
            context.res = {
                body: accessLog
            };
        } else {
            utils.setContextResError(
                context,
                new errors.AccessLogNotFoundError(
                    'The accessLog of specified details doesn\'t exist.',
                    404
                )
            );
        }

    } catch (err) {
        utils.handleError(context, error);
    }
}