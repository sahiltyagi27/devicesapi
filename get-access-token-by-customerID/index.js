'use strict';

const { getMongodbCollection } = require('../db/mongodb');
const utils = require('../utils');
const errors = require('../errors');

module.exports = async (context, req) => {
    try {

        const collection = await getMongodbCollection('Devices');

        await utils.validateUUIDField(context, req.params.id, 'The id specified in the URL does not match the UUID v4 format.');

        const accessToken = await collection.find({
            docType: 'accessToken',
            customerID: req.params.id,
            isLocked: false,
            isEnabled: true
        }).sort({ accessTokenName: 1 }).toArray();

        if (accessToken && accessToken.length && accessToken[0]) {
            context.res = {
                body: accessToken[0]
            };
        } else {
            utils.setContextResError(
                context,
                new errors.AccessTokenNotFoundError(
                    'The access token of specified details doesn\'t exist.',
                    404
                )
            );
        }

    } catch (error) {
        utils.handleError(context, error);
    }
};
