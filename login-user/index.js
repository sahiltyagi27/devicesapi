const utils = require('../utils');
const errors = require('../errors');
const { database } = require('../db/mongodb');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
module.exports = async function (context, req) {
    try {
        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You have requested to authenticate a user but the request body seems to be empty. Kindly pass the user to be authenticated using request body in application/json format',
                    400
                )
            )
            return Promise.resolve();
        }
        const collection = database.collection('users');
        const user = await collection.findOne({ email: req.body.email })
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            context.res = {
                body: {
                    accesstoken: token
                }
            }
        }
        return Promise.resolve();

    } catch (error) {
        utils.handleError(context, error);
    }
}