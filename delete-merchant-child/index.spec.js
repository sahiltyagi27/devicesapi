'use strict';

const expect = require('chai').expect;
const request = require('request-promise');
const uuid = require('uuid');
const { database } = require('../db/mongodb');
const parentMerchantID = uuid.v4();
const childID = uuid.v4();
describe('Delete Merchant-child', () => {

    it('should throw error on incorrect parentMerchantID field', async () => {
        try {
            await request.delete(`http://localhost:7071/api/delete-merchant-child/123/child/${childID}`, {
                json: true
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The parentMerchantID field specified in the request params does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };

            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }

    });

    it('should throw error on incorrect _id field', async () => {
        try {
            await request.delete(`http://localhost:7071/api/delete-merchant-child/${parentMerchantID}/child/123`, {
                json: true
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The childID field specified in the request params does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };

            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }

    });
});