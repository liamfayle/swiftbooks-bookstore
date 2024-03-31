/**
 * These tests are designed to be run against a database with valid data.
 * To set up a valid data environment, run app.js with the following flags:
 * --reset-db --init-db --fill-tables. 
 * 
 * ###################################################################
 * ENSURE YOU DONT RUN THIS WITH PRODUCTION DB SINCE IT DELETES TABLES!
 * ###################################################################
 * 
 * This will reset the database, initialize it with the required schema, 
 * and fill the tables with necessary data for testing.
 */



const request = require('supertest');
const app = require('../src/app'); 
const userModel = require('../src/models/userModel');
const bcrypt = require('bcrypt');


describe('User Register', () => {

    //test successful register
    it('register and return key', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Bob',
                username: 'validuser',
                email: 'validuser@example.com',
                password: 'validpassword'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.token).toBeDefined();
    });


    //test failed register missing param
    it('fail register missing parameters', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/register');

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing required/i));
    });


    //test fail register username already exists
    it('fail register username already exists (in different case)', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Bob',
                username: 'ACTIVE_USER',
                email: 'active_user@example.com',
                password: 'validpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/username/i));
    });


    //test fail register email already exists
    it('fail register username already exists (in different case)', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Bob',
                username: 'new_username',
                email: 'USER1@ExamPle.cOm',
                password: 'validpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/email/i));
    });

});




describe('User Login', () => {

    // Test for successful login
    it('should login successfully and return a token', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'validuser@example.com',
                password: 'validpassword'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });


    //test for fail due to missing email param
    it('should fail due to missing email', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                password: 'validpassword'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing email/i));
    });


    //test for fail due to missing password param
    it('should fail due to missing password', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'validuser@example.com'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing password/i));
    });


    //test for fail due to wrong email
    it('should fail wrong email', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'invaliduser@example.com',
                password: 'validpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/doesn't exist/i));
    });


    //test for fail due to wrong passwrod
    it('should fail wrong password', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'validuser@example.com',
                password: 'invalidpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/invalid/i));
    });


    //test for fail due to deactive acc
    it('should fail deactivated account', async () => {  

        // test
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user4@example.com',
                password: 'password'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/not active/i));
    });


});
