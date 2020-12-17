const { database } = require('../db/mongodb')
const utils = require('../utils');
const errors = require('../errors');
module.exports = async function (context, req) {
    try {
       
        await utils.validateUUIDField(context, req.params.accessLogID, 'The accessLogID specified in the URL does not match the UUID v4 format.');
       



        const collection = database.collection('accesslogs');
        let docs

        if (req.query.filter == 'posMerchantID') {
            docs = await collection.find({ posMerchantID: { $eq: req.query.filterValue } }).toArray()
        } else if (req.query.filter == 'tokenMerchantID') {
            docs = await collection.find({ tokenMerchantID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'findSiteDocuments') {
            docs = await collection.find({ siteID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'zoneID') {
            docs = await collection.find({ zoneID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'pointofServiceID') {
            docs = await collection.find({ pointOfServiceID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'accessTokenID') {
            docs = await collection.find({ accessTokenID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'walletID') {
            docs = await collection.find({ walletID: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'accessTokenType') {
            docs = await collection.find({ accessTokenType: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'accessRoleCode') {
            docs = await collection.find({ accessRoleCode: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'eventCode') {
            docs = await collection.find({ eventCode: { $eq: req.query.filterValue } }).toArray();
        } else if (req.query.filter == 'statusCode') {
            docs = collection.find({ statusCode: { $eq: req.query.filterValue } }).toArray();
        } else {
            docs = await collection.find({}).sort({ "createdDate": -1 }).limit(200).toArray()
        }

        if (docs) {
            context.res = {
                body: docs
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
        return Promise.resolve()

    } catch (err) {

    }
}