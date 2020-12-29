const utils = require('../utils');
const errors = require('../errors');
const { database } = require('../db/mongodb');
const uuid = require('uuid');
module.exports = async function (context, req) {
    try {
        if(!uuid.validate(req.params.accessLogID)){
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The accessLogID specified in the URL does not match the UUID v4 format.',
                    400
                )
            )
        }

        const collection = database.collection('accesslogs');
        const accessLog = await collection.find({_id : req.params.accessLogID}).toArray();
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
        return Promise.resolve();
    } catch (error) {
        utils.handleError(context, error);
    }
}