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
const booklistModel = require('../src/models/booklistModel');



// Log in before running the tests
let token;
beforeAll(async () => {
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'user3@example.com',
            password: 'password'
        });

    token = loginResponse.body.token; // Store the token from the login response
});

let manager_token;
beforeAll(async () => {
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'user2@example.com',
            password: 'password'
        });

    manager_token = loginResponse.body.token; // Store the token from the login response
});

let admin_token;
beforeAll(async () => {
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'user1@example.com',
            password: 'password'
        });

    admin_token = loginResponse.body.token; // Store the token from the login response
});


/*
describe('Create Booklist', () => {

    //test successful booklist create
    it('create new booklist with description', async () => {  

        // test
        const response = await request(app)
            .post('/api/secure/create-booklist')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_name: 'My new list with description and is_public!',
                is_public: true,
                description: "MY NEW DESCRIPTION!"
            });

        expect(response.statusCode).toBe(200);
    });


    it('create new booklist without description and without is_public', async () => {  

        // test
        const response = await request(app)
            .post('/api/secure/create-booklist')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_name: 'My new list!',
            });

        expect(response.statusCode).toBe(200);
    });


    //test fail create missing list name
    it('fail to create booklist missing name', async () => {  

        // test
        const response = await request(app)
            .post('/api/secure/create-booklist')
            .set('Authorization', `Bearer ${token}`)
            .send({
                is_public: true
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing/i));
    });


});



describe('Get User Booklists', () => {

    //test successful get
    it('gets user booklists', async () => {  

        // test
        const response = await request(app)
            .get('/api/secure/get-user-booklists')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
    });

});



describe('Delete a booklist', () => {

    //test successful booklist delete
    it('delete booklist a booklist successfully', async () => {  

        // test
        const response = await request(app)
            .delete('/api/secure/delete-user-booklist')
            .set('Authorization', `Bearer ${token}`)
            .send({
                list_id: 5
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/deleted/i));
    });


    it('fail to delete missing list id', async () => {  

        // test
        const response = await request(app)
            .delete('/api/secure/delete-user-booklist')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing/i));
    });


});



describe('Add book to booklist', () => {


    it('Successfully add existing book to list', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 3,
                book_id: 've0BAAAAQAAJ' //existing book in db but not in list
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/added book/i));
    });


    it('Fail to add (already book in list)', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 3,
                book_id: 've0BAAAAQAAJ' //existing book in db but not in list
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(expect.stringMatching(/already exists/i));
    });


    it('Sucessfully add book to list (and also book to db since new book id)', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 3,
                book_id: 'XSY_AAAAYAAJ' //new book
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/added book/i));
    });


    it('Fail to add (Try adding to list not owned by user)', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 4,
                book_id: 'XSY_AAAAYAAJ' 
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/does not own/i));
    });


    it('Fail to add (missing book_id)', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 4,
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing book id/i));
    });


    it('Fail to add (missing list_id)', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                book_id: 'doesntmatter',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing list id/i));
    });


});


describe('Delete book from booklist', () => {

    it('Fail due to missing list_id param', async () => {  

        const response = await request(app)
            .delete('/api/secure/delete-book-from-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                book_id: 've0BAAAAQAAJ'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing list/i));
    });

    it('Fail due to missing book_id param', async () => {  

        const response = await request(app)
            .delete('/api/secure/delete-book-from-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 3
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/missing book/i));
    });


    it('Fail due to not owning list', async () => {  

        const response = await request(app)
            .delete('/api/secure/delete-book-from-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 4,
                book_id: 've0BAAAAQAAJ'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/does not own/i));
    });


    it('Fail due to book id not being in the list', async () => {  

        const response = await request(app)
            .delete('/api/secure/delete-book-from-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 3,
                book_id: 'fakeid'
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toEqual(expect.stringMatching(/not in list/i));
    });


    it('Succcessfully remove book', async () => {  

        const response = await request(app)
            .delete('/api/secure/delete-book-from-list')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                list_id: 3,
                book_id: 've0BAAAAQAAJ'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/book removed/i));
    });

});



describe('Get booklist books', () => {

    it('Fail due to missing list_id param', async () => {  

        const response = await request(app)
            .get('/api/secure/get-booklist-books')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/list id not/i));
    });


    it('Fail due to accessing private list user does not own', async () => {  

        const response = await request(app)
            .get('/api/secure/get-booklist-books')
            .set('Authorization', `Bearer ${token}`)
            .query({
                list_id: 5
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/private list that isnt owned by user/i));
    });

    it('Successfully get public list not owned by use', async () => {  

        const response = await request(app)
            .get('/api/secure/get-booklist-books')
            .set('Authorization', `Bearer ${token}`)
            .query({
                list_id: 4
            });

        expect(response.statusCode).toBe(200);
    });

    it('Successfully get private list owned by use', async () => {  

        const response = await request(app)
            .get('/api/secure/get-booklist-books')
            .set('Authorization', `Bearer ${token}`)
            .query({
                list_id: 1
            });

        expect(response.statusCode).toBe(200);
    });

});



describe('Update booklist', () => {

    it('Fail due to missing list_id param', async () => {  

        const response = await request(app)
            .put('/api/secure/update-booklist')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "NEW NAME!"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/list id not/i));
    });


    it('Fail due to missing change param', async () => {  

        const response = await request(app)
            .put('/api/secure/update-booklist')
            .set('Authorization', `Bearer ${token}`)
            .send({
                list_id: 3
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/atleast one param has to be provided/i));
    });


    it('Fail due to user not owning list', async () => {  

        const response = await request(app)
            .put('/api/secure/update-booklist')
            .set('Authorization', `Bearer ${token}`)
            .send({
                list_id: 4,
                name: "NEW NAME!"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/user does not own/i));
    });


    it('Fail due to id does not exist (Expects same error as not owning)', async () => {  

        const response = await request(app)
            .put('/api/secure/update-booklist')
            .set('Authorization', `Bearer ${token}`)
            .send({
                list_id: 999999,
                name: "NEW NAME!"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/user does not own/i));
    });


    it('Successfully update list name', async () => {  

        const response = await request(app)
            .put('/api/secure/update-booklist')
            .set('Authorization', `Bearer ${token}`)
            .send({
                list_id: 3,
                name: "NEW NAME!",
                publicity: true,
                description: 'new description :)'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/updated/i));
    });


});



describe('Add review to list', () => {

    it('Fail due to missing list_id param', async () => {  

        const response = await request(app)
            .post('/api/secure/add-review')
            .set('Authorization', `Bearer ${token}`)
            .send({
                stars: 4
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/list id not/i));
    });


    it('Fail due to missing stars param', async () => {  

        const response = await request(app)
            .post('/api/secure/add-review')
            .set('Authorization', `Bearer ${token}`)
            .send({
                list_id: 4
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/stars not/i));
    });


    it('Fail due to list being private / not exists', async () => {  

        const response = await request(app)
            .post('/api/secure/add-review')
            .set('Authorization', `Bearer ${token}`)
            .send({
                list_id: 5,
                stars: 5
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/private list/i));
    });


    it('Successfully add review', async () => {  

        const response = await request(app)
            .post('/api/secure/add-review')
            .set('Authorization', `Bearer ${token}`)
            .send({
                list_id: 4,
                stars: 5,
                text_content: 'very cool list'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/added review/i));
    });


});



describe('Get user details', () => {

    it('Succeesfully return details for logged in user', async () => {  

        const response = await request(app)
            .get('/api/secure/get-user-details')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
    });


});



//MANAGER / ADMIN ROUTES


describe('Toggle hide review', () => {

    it('Fail user not admin / manager', async () => {  

        const response = await request(app)
            .put('/api/secure/toggle-hide-review')
            .set('Authorization', `Bearer ${token}`)
            .send({
                review_id: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual(expect.stringMatching(/only manager or admin/i));
    });


    it('Fail review_id not provided', async () => {  

        const response = await request(app)
            .put('/api/secure/toggle-hide-review')
            .set('Authorization', `Bearer ${manager_token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/review id not/i));
    });


    it('Success manager hides', async () => {  

        const response = await request(app)
            .put('/api/secure/toggle-hide-review')
            .set('Authorization', `Bearer ${manager_token}`)
            .send({
                review_id: 1
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/changed review hidden status/i));
    });


    it('Success admin hides', async () => {  

        const response = await request(app)
            .put('/api/secure/toggle-hide-review')
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
                review_id: 1
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/changed review hidden status/i));
    });


});



//CART AND CHECKOUT


describe('Add book to cart.', () => {

    it('Fail book id not provided', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantity: 5
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/book id not/i));
    });


    it('Fail quantity not provided', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
                book_id: 'ggsgsdgsd'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/quantity not/i));
    });


    it('Success update cart quantity', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
                book_id: 'vtMyAQAAMAAJ',
                quantity: 10
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/updated cart/i));
    });


    it('Success add new item to cart', async () => {  

        const response = await request(app)
            .post('/api/secure/add-book-to-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
                book_id: 'kMdaAAAAMAAJ',
                quantity: 3
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/updated cart/i));
    });


});



describe('Delete book from cart', () => {

    it('Fail no book id provided', async () => {  

        const response = await request(app)
            .delete('/api/secure/delete-book-from-cart')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/book id not/i));
    });


    it('Try deleting book not in cart (nothing happens expect status 200)', async () => {  

        const response = await request(app)
            .delete('/api/secure/delete-book-from-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
                book_id: 'fake_id'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/deleted book/i));
    });


    it('Successfully delete book in cart', async () => {  

        const response = await request(app)
            .delete('/api/secure/delete-book-from-cart')
            .set('Authorization', `Bearer ${token}`)
            .send({
                book_id: 'A29JAAAAMAAJ'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/deleted book/i));
    });


});



describe('Clear cart', () => {

    it('Clear logged in users cart', async () => {  

        const response = await request(app)
            .delete('/api/secure/clear-cart')
            .set('Authorization', `Bearer ${manager_token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual(expect.stringMatching(/cleared cart/i));
    });


});



describe('Get users cart', () => {

    it('Return logged in users cart items', async () => {  

        const response = await request(app)
            .get('/api/secure/get-cart')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
    });


});
*/

describe('Checkout Process', () => {

    it('Fail cart details array is empty', async () => {  

        const response = await request(app)
            .post('/api/secure/checkout')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cart_details: [],
                total_price: 500,
                first_name: 'test',
                last_name: 'last',
                email: 'email@email.com',
                phone: '5190001111',
                address: '555 western road floor 5 unit 6',
                country: 'Canada',
                province: 'Ontario',
                city: 'London',
                postal_code: 'G5G6H3'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.missingFields).toEqual(expect.stringMatching(/cart_details/i));
    });

    it('Fail all data missing', async () => {  

        const response = await request(app)
            .post('/api/secure/checkout')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.missingFields).toEqual(expect.stringMatching(/total_price, first_name, last_name, email, phone, address, country, province, city, postal_code, cart_details/i));
    });


    it('Successful checkout', async () => {  

        const response = await request(app)
            .post('/api/secure/checkout')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cart_details: [
                    {book_id: 'A29JAAAAMAAJ', quantity: 1, price: 50.0},
                    {book_id: 'Yz8Fnw0PlEQC', quantity: 1, price: 50.0},
                    {book_id: 'f280CwAAQBAJ', quantity: 1, price: 200.0},
                    {book_id: 'fFIXAAAAYAAJ', quantity: 4, price: 175.0},
                    {book_id: 'vtMyAQAAMAAJ', quantity: 1, price: 25.0},
                ],
                total_price: 500,
                first_name: 'test',
                last_name: 'last',
                email: 'email@email.com',
                phone: '5190001111',
                address: '555 western road floor 5 unit 6',
                country: 'Canada',
                province: 'Ontario',
                city: 'London',
                postal_code: 'G5G6H3'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.order_id).toEqual(3);
    });


});


/*
describe('Get public booklists.', () => {

    it('Success no params means default sort by updated_at descending', async () => {  

        const response = await request(app)
            .get('/api/secure/get-public-booklists')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
    });

    it('Fail since limit is less than 1', async () => {  

        const response = await request(app)
            .get('/api/secure/get-public-booklists')
            .set('Authorization', `Bearer ${token}`)
            .query({
                limit: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/provide positive limit/i));
    });


    it('Fail since invalid sort', async () => {  

        const response = await request(app)
            .get('/api/secure/get-public-booklists')
            .set('Authorization', `Bearer ${token}`)
            .query({
                sort: 'invalid'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/invalid or missing 'sort' param/i));
    });


    it('Fail since invalid sort type', async () => {  

        const response = await request(app)
            .get('/api/secure/get-public-booklists')
            .set('Authorization', `Bearer ${token}`)
            .query({
                sort_type: 'invalid'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.stringMatching(/invalid or missing 'sort_type' param/i));
    });


    it('Success limit = 1', async () => {  

        const response = await request(app)
            .get('/api/secure/get-public-booklists')
            .set('Authorization', `Bearer ${token}`)
            .query({
                limit: 1
            });

        expect(response.statusCode).toBe(200);
    });


    it('Success sort by updated_at asc', async () => {  

        const response = await request(app)
            .get('/api/secure/get-public-booklists')
            .set('Authorization', `Bearer ${token}`)
            .query({
                sort_type: 'asc'
            });

        expect(response.statusCode).toBe(200);
    });


    it('Success sort by list_name asc', async () => {  

        const response = await request(app)
            .get('/api/secure/get-public-booklists')
            .set('Authorization', `Bearer ${token}`)
            .query({
                sort: 'list_name',
                sort_type: 'asc'
            });

        expect(response.statusCode).toBe(200);
    });

});
*/