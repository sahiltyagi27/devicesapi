'use strict'

const expect = require('chai').expect;
const request = require('request-promise');
const uuid = require('uuid');
const crypto = require('crypto');
const randomString = crypto.randomBytes(3).toString('hex');
const email = `test.${randomString}@testmail.com`;
const sampleUser = { ...require('../spec/sample-docs/Users'), _id: uuid.v4(), email }

describe('Sign Up user', () => {
    it('It should throw error when req.body is empty', async () => {
        try {
            await request.post(`http://localhost:7071/api/signup`, {
                json: true,
            });
        } catch (error) {
            const response = {
                code: 400,
                description: 'You\'ve requested to create a new user but the request body seems to be empty. Kindly pass the user to be created using request body in application/json format',
                reasonPhrase: 'EmptyRequestBodyError'
            }
            expect(error.statusCode).to.equal(400)
            expect(error.error).to.eql(response);
        }
    });

    it('It should create and store user when all test cases pass', async () => {

        const result = await request.post(`http://localhost:7071/api/signup`, {
            json: true,
            body: sampleUser
        });
        expect(result).not.to.be.null;
        expect(result._id).to.be.equal(sampleUser._id);
    });

    after(async () => {
        await request.delete(`http://localhost:7071/api/delete-user/${sampleUser._id}`)
    });
});