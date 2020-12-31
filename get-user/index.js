const errors = require('../errors')
const utils = require('../utils')
const { database } = require('../db/mongodb')
module.exports = async function (context, req) {
    try {
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