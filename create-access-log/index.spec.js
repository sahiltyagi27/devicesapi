'use strict';

const expect = require('chai').expect;
const request = require('request-promise');
const uuid = require('uuid');
const { database } = require('../db/mongodb');
const sampleAccessLog = { ...require('../spec/sample-docs/AccessLog'), _id: uuid.v4(), merchantID: uuid.v4() };
sampleAccessLog.partitionKey = sampleAccessLog._id;

describe('Create AccessLog', () => {

    it('should return status code 400 when request body is null', async () => {
        try {
            await request.post('http://localhost:7071/api/access-log', {
                json: true
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'You\'ve requested to create a new access-log but the request body seems to be empty. Kindly pass the access-log to be created using request body in application/json format',
                reasonPhrase: 'EmptyRequestBodyError'
            };

            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }

    });

    it('should throw error on incorrect _id field', async () => {
        try {
            await request.post('http://localhost:7071/api/access-log', {
                json: true,
                body: {
                    _id: 123
                }
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'The _id field specified in the request body does not match the UUID v4 format.',
                reasonPhrase: 'InvalidUUIDError'
            };

            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }

    });

    it('should throw error if the document already exists', async () => {
        try {
            const collection = await database.collection('accesslogs');
            await collection.insertOne(sampleAccessLog);
            await request.post('http://localhost:7071/api/access-log', {
                body: sampleAccessLog,
                json: true
            });
        } catch (error) {
            const collection = await database.collection('accesslogs');
            await collection.deleteOne({ _id: sampleAccessLog._id, partitionKey: sampleAccessLog._id, docType: 'accessLog' });
            const response = {
                code: 409,
                description: 'You\'ve requested to create a new accessLog but a accessLog with the specified _id field already exists.',
                reasonPhrase: 'DuplicateAccessLogError'
            };
            expect(error.statusCode).to.equal(409);
            expect(error.error).to.eql(response);
        }
    });

    it('should create device when all validation passes', async () => {

        const device = await request.post('http://localhost:7071/api/access-log', {
            body: sampleAccessLog,
            json: true
        });
        expect(device).not.to.be.null;
        expect(device._id).to.equal(sampleAccessLog._id);
        expect(device.docType).to.equal('accessLog');
        const collection = await database.collection('accesslogs');
        await collection.deleteOne({ _id: sampleAccessLog._id });
    });

});