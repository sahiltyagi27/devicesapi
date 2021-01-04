const errors = require('../errors')
const utils = require('../utils')
const uuid = require('uuid');
const { database } = require('../db/mongodb')
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
        const collection = await database.collection('users')
        const user = await collection.findOne({ _id: { $eq: req.params.userID } });
        if (user) {
            context.res = {
                body: user
            }
        }
        return Promise.resolve()
    } catch (error) {
        utils.handleError(context, error)
    }
}