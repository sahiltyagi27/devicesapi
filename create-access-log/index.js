const { database } = require('../db/mongodb');
const uuid = require('uuid')
const utils = require('../utils');
const errors = require('../errors');
module.exports = async function (context, req) {
    try {
        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You\'ve requested to create a new access-log but the request body seems to be empty. Kindly pass the access-log to be created using request body in application/json format',
                    400
                )
            );
            return Promise.resolve();
        }
        if (!uuid.validate(req.body._id)){
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The _id field specified in the request body does not match the UUID v4 format.',
                    400
                )
            )
            return Promise.resolve()
        }
            const collection = await database.collection('accesslogs');
        const response = await collection.insertOne(req.body);
        if (response && response.ops) {
            context.res = {
                body: response.ops[0]
            };
        }
        return Promise.resolve();
    } catch (error) {
        utils.handleError(context, error);
    }
}