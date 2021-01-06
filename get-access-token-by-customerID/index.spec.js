'use strict';

const expect = require('chai').expect;
const helpers = require('../spec/helpers');
const request = require('request-promise');
const uuid = require('uuid');
const merchantID = uuid.v4();
const customerID = uuid.v4();
const { getMongodbCollection } = require('../db/mongodb');
const sampleAccessToken = { ...require('../spec/sample-docs/AccessToken'), _id: uuid.v4() };


describe('Get accessToken by id', () => {

    before(async () => {
        sampleAccessToken.partitionKey = sampleAccessToken._id;
        sampleAccessToken.customerID = customerID
        const collection = await getMongodbCollection('Devices');
        await collection.insertOne(sampleAccessToken);
    });


    it('should throw error on incorrect id field', async () => {
        try {
            await request.get(`${helpers.API_URL}/api/v1/customers/123/access-token`, {
                json: true,
                headers: {
                    'x-functions-key': process.env.X_FUNCTIONS_KEY
                }
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The id specified in the URL does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };

            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });
    it('should throw error on data not exist', async () => {
        try {
            await request.get(`${helpers.API_URL}/api/v1/customers/${uuid.v4()}/access-token`, {
                json: true,
                headers: {
                    'x-functions-key': process.env.X_FUNCTIONS_KEY
                },
                body: {
                    userMerchants: [merchantID]
                }
            });
        } catch (error) {
            const response = {
                code: 404,
                description: 'The access token of specified details doesn\'t exist.',
                reasonPhrase: 'AccessTokenNotFoundError'
            };

            expect(error.statusCode).to.equal(404);
            expect(error.error).to.eql(response);
        }
    });


    it('should return the document when all validation passes', async () => {

        const result = await request.get(`${helpers.API_URL}/api/v1/customers/${sampleAccessToken.customerID}/access-token`, {
            json: true,
            headers: {
                'x-functions-key': process.env.X_FUNCTIONS_KEY
            }
        });

        expect(result).not.to.be.null;
        expect(result._id).to.equal(sampleAccessToken._id);

    });

    after(async () => {
        const collection = await getMongodbCollection('Devices');
        await collection.deleteOne({ _id: sampleAccessToken._id, partitionKey: sampleAccessToken.partitionKey, docType: 'accessToken' });
    });
});