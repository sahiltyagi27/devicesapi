const utils = require('../utils');
const errors = require('../errors');
const { database } = require('../db/mongodb');
const bcrypt = require('bcrypt');
module.exports = async function (context, req) {
    try {
        if (!req.body) {
            utils.setContextResError(
                context,
                new errors.EmptyRequestBodyError(
                    'You\'ve requested to create a new user but the request body seems to be empty. Kindly pass the user to be created using request body in application/json format',
                    400
                )
            )
            return Promise.resolve();
        }

        const users = await database.collection('users');
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const data = {
            email: req.body.email,
            password: hashedPassword
        }

        const result = await users.insertOne(data);
        if (result && result.ops) {
            context.res = {
                body: result.ops[0]
            }
        }
        return Promise.resolve();

    } catch (error) {
        utils.handleError(context, error);
    }
}