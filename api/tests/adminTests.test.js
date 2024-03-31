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



let manager_token;
beforeAll(async () => {
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'user2@example.com', //managaer
            password: 'password'
        });

    manager_token = loginResponse.body.token; 
});


let admin_token;
beforeAll(async () => {
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'user1@example.com', //admin
            password: 'password'
        });

    admin_token = loginResponse.body.token; 
});


let token;
beforeAll(async () => {
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'user3@example.com', //user
            password: 'password'
        });

    token = loginResponse.body.token; 
});



describe('Get list of all users', () => {

    it('Fail not admin (user)', async () => {  

        const response = await request(app)
            .get('/api/admin/get-users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/not admin/i));
    });


    it('Fail not admin (manager)', async () => {  

        const response = await request(app)
            .get('/api/admin/get-users')
            .set('Authorization', `Bearer ${manager_token}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/not admin/i));
    });


    it('Successfully get users', async () => {  

        const response = await request(app)
            .get('/api/admin/get-users')
            .set('Authorization', `Bearer ${admin_token}`);

        expect(response.statusCode).toBe(200);
    });


});



describe('Change user status', () => {

    it('fail no user id provided', async () => {  

        const response = await request(app)
            .put('/api/admin/change-user-status')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                status_string: 'manager'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/user id not provided/i));
    });


    it('fail no status provided', async () => {  

        const response = await request(app)
            .put('/api/admin/change-user-status')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                user_id: 3
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/status string not provided/i));
    });


    it('Make user admin', async () => {  

        const response = await request(app)
            .put('/api/admin/change-user-status')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                user_id: 3,
                status_string: 'admin'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/Successfully updated user status/i));
    });


    it('Make user manager', async () => {  

        const response = await request(app)
            .put('/api/admin/change-user-status')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                user_id: 3,
                status_string: 'manager'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/Successfully updated user status/i));
    });



    it('Make user user', async () => {  

        const response = await request(app)
            .put('/api/admin/change-user-status')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                user_id: 3,
                status_string: 'user'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/Successfully updated user status/i));
    });


});


describe('Change user status', () => {

    it('fail no user id provided', async () => {  

        const response = await request(app)
            .put('/api/admin/change-user-active')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                active: true
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/user id not provided/i));
    });


    it('fail no active provided', async () => {  

        const response = await request(app)
            .put('/api/admin/change-user-active')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                user_id: 3
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/active not provided/i));
    });


    it('succesfuly change user active status', async () => {  

        const response = await request(app)
            .put('/api/admin/change-user-active')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                user_id: 3,
                active: true
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/Successfully updated user activity/i));
    });


});