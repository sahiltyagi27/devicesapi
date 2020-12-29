const { database } = require('../db/mongodb')
const utils = require('../utils');
const errors = require('../errors');
const uuid = require('uuid');
module.exports = async function (context, req) {
    try {

       if(!uuid.validate(req.params.merchantID)){
           utils.setContextResError(
               context,
               new errors.InvalidUUIDError(
                   'The MerchantID specified in the URL does not match the UUID v4 format.',
                   400
               )
           )
       }
        const collection = await database.collection('accesslogs');
        let docs
        console.log(req.params.filter,req.params.filterValue)
        if (req.params.filter == 'posMerchantID') {
            docs = await collection.find({ posMerchantID: { $eq: req.params.filterValue } }).toArray()
        } else if (req.params.filter == 'tokenMerchantID') {
            docs = await collection.find({ tokenMerchantID: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'findSiteDocuments') {
            docs = await collection.find({ siteID: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'zoneID') {
            docs = await collection.find({ zoneID: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'pointofServiceID') {
            docs = await collection.find({ pointOfServiceID: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'accessTokenID') {
            docs = await collection.find({ accessTokenID: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'walletID') {
            docs = await collection.find({ walletID: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'accessTokenType') {
            docs = await collection.find({ accessTokenType: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'accessRoleCode') {
            docs = await collection.find({ accessRoleCode: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'eventCode') {
            docs = await collection.find({ eventCode: { $eq: req.params.filterValue } }).toArray();
        } else if (req.params.filter == 'statusCode') {
            docs = collection.find({ statusCode: { $eq: req.params.filterValue } }).toArray();
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

    } catch (error) {
        utils.handleError(context, error);
    }
}    
