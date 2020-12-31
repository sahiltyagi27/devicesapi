const utils = require('../utils');
const errors = require('../errors');
const { database } = require('../db/mongodb');
const uuid = require('uuid');
module.exports = async function (context, req) {
    try {
        if (!uuid.validate(req.params.userID)) {
            utils.setContextResError(
                context,
                new errors.InvalidUUIDError(
                    'The userID specified in the URL does not match the UUID v4 format.',
                    400
                )
            )
            return Promise.resolve();
        }
        const collection = database.collection('users');
        let data = await collection.deleteOne({ _id: req.params.userID })
        context.res = {
            body: data
        }
    } catch (error) {
        utils.handleError(context, error)
    }

}