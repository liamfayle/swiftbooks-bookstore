const booklistModel = require('../models/booklistModel');
const userModel = require('../models/userModel');
const openController = require('./openController');
const { schema: booklist_schema } = require("../../../shared/validation/book-list");
const { schema: review_schema } = require("../../../shared/validation/review");
const { schema: checkout_schema } = require("../../../shared/validation/checkout");


//BOOKLIST STUFF

/**
 * Creates a new booklist for a user.
 * 
 * This asynchronous function handles a request to create a new booklist. It first
 * extracts the user's token from the request headers and retrieves the user's ID from it.
 * It then checks if the user has already created the maximum allowed number of booklists (20).
 * If not, it proceeds to create a new booklist with the given name and privacy status.
 * 
 * @param {object} req - The HTTP request object, containing the user's token in headers
 *                          and booklist details (name and privacy status) in the body.
 * @param {object} res - The HTTP response object used to send back the status and messages.
 * 
 * The function performs the following steps:
 * 1. Extracts the authorization token from the request headers.
 * 2. Retrieves the user's ID from the token.
 * 3. Checks the number of booklists already created by the user. If 20 or more, it sends
 *    a 403 (Forbidden) response.
 * 4. Extracts the new booklist's name and privacy status from the request body.
 * 5. Retrieves the username associated with the user ID.
 * 6. Creates a new booklist in the database with the provided details.
 * 7. Sends a 200 (OK) response upon successful creation of the booklist.
 * 8. Catches and handles any errors that occur during the process, sending a 500 (Internal Server Error) response.
 * 
 * @returns {Promise} - The promise resulting from the asynchronous operation.
 */
exports.create_booklist = async (req, res) => { //currently allows for multiple lists with same name can be changed
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = await userModel.getUserIdFromToken(token);
        let num_lists = await booklistModel.num_booklists_by_user(user_id);

        if (num_lists >= 20) {
            return res.status(403).json({message: 'Too many lists already. Maximum number of lists already exist.'})
        }

        const { list_name, description = "", is_public = false } = req.body;

        if (!list_name) {
            return res.status(400).json({message: 'missing list name'})
        }

        //perform validation
        const booklist_test = {name: list_name, description: description, isPublic: is_public}
        const is_valid = await booklist_schema.validate(booklist_test)
            .then(function() {
                return true;
            })
            .catch(function() {
                return false;
            });

        if (!is_valid) {
            return res.status(400).json({message: 'schema not valid'});
        }

        let username = await userModel.getUsernameFromId(user_id);
        const new_booklist_id = await booklistModel.create_booklist_db(user_id, username, list_name, is_public, description);
        
        return res.status(200).json(new_booklist_id);
    } catch (error) {
        return res.status(500).json({message: 'Failed to create booklist'});
    }
};


/**
 * Retrieves a user's booklists.
 * 
 * This asynchronous function is responsible for fetching booklists associated with a specific user. 
 * It first extracts the user's token from the request headers. Then, it decodes the token to retrieve 
 * the user's ID. With the user ID, it calls the `booklistModel.get_booklists` function to fetch all 
 * booklists associated with this user. If successful, it returns these booklists with a 200 status code.
 * In case of an error, such as an invalid token or a failure in fetching the booklists, it catches 
 * the error and returns a 500 status code with an error message.
 * 
 * @param {Object} req - The request object containing the user's authorization token.
 * @param {Object} res - The response object used to return the status and data (or error message).
 * @returns {Promise} A promise that resolves with the HTTP response containing the user's booklists or an error message.
 */
exports.get_user_booklists = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = await userModel.getUserIdFromToken(token);

        let my_lists = await booklistModel.get_booklists(user_id);

        return res.status(200).json(my_lists);
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to find booklists'});
    }
};


/**
 * Deletes a user's booklist.
 *
 * This asynchronous function handles the request to delete a specific booklist
 * associated with a user. It first retrieves the authorization token from the
 * request headers to identify the user. Using this token, it extracts the user's
 * ID. Then, it gets the 'list_id' from the request body, which specifies the
 * booklist to be deleted. The function calls 'delete_booklist' method from the
 * 'booklistModel' to perform the deletion in the database. If successful, it
 * sends a 200 HTTP status response with a success message. In case of any error
 * (e.g., invalid token, database issues), it catches the exception and sends a
 * 500 HTTP status response with an error message.
 *
 * @param {Object} req - The HTTP request object, containing the authorization
 *                       token in headers and the 'list_id' in the body.
 * @param {Object} res - The HTTP response object used to send back the status
 *                       and message.
 */
exports.delete_user_booklist = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = await userModel.getUserIdFromToken(token);

        const { list_id } = req.body;

        if (!list_id) {
            return res.status(400).json({message: 'missing list id'})
        }

        await booklistModel.delete_booklist(user_id, list_id);

        return res.status(200).json({message: 'Booklist deleted.'});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to delete booklist'});
    }
};


/**
 * Adds a book to a specific booklist.
 * 
 * This asynchronous function handles a request to add a book to a user's booklist.
 * It first extracts the authorization token from the request headers to identify the user.
 * Then, it retrieves the list ID and book object from the request body. The book object is 
 * expected to be obtained from open endpoints, either by book ID or book search utilizing the Google books api.
 * 
 * The function checks if the user owns the specified booklist. If not, it responds with a 401 
 * unauthorized error. Next, it checks if the book already exists in the database; if not, it adds the book.
 * Finally, it adds the book to the specified booklist and returns a success message. 
 * 
 * If any error occurs during the process, it catches the error and returns a 500 internal server error.
 * 
 * @param {Object} req - The request object, containing the list ID, book object, and user's authorization token.
 * @param {Object} res - The response object used to send back the HTTP response.
 */
exports.add_book_to_booklist = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = await userModel.getUserIdFromToken(token);

        const { list_id, book_id } = req.body; //expect google book id

        if (!list_id) {
            return res.status(400).json({message: 'missing list id'})
        }

        if (!book_id) {
            return res.status(400).json({message: 'missing book id'})
        }

        let is_user_list = await booklistModel.does_user_own_list(user_id, list_id);
        if (!is_user_list) {
            return res.status(401).json({message: 'Tried adding book to list that user does not own.'});
        }

        let book_exists = await booklistModel.does_book_exist(book_id);
        if (!book_exists) {
            await booklistModel.add_book(book_id);
        }

        let book_in_booklist = await booklistModel.is_book_in_list(list_id, book_id);
        if (book_in_booklist) {
            return res.status(403).json({message: 'book already exists in list.'})
        }

        await booklistModel.add_book_to_booklist(list_id, book_id);

        return res.status(200).json({message: 'Added book to list.'});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to add book to booklist'});
    }
};


/**
 * Deletes a book from a user's booklist.
 * 
 * This asynchronous function handles a request to remove a book from a user's booklist.
 * It first retrieves the user's ID from the token provided in the request's authorization header.
 * It then extracts the list ID and book object (expected from open endpoints) from the request body.
 * The function checks if the user owns the list in question; if not, it responds with a 401 unauthorized status.
 * If the user owns the list, it proceeds to delete the specified book from the booklist and responds with a 200 status,
 * indicating successful deletion. In case of any errors, it catches them and responds with a 500 server error status.
 *
 * @param {object} req - The request object, containing the user's token, list ID, and book id.
 * @param {object} res - The response object used to send back the HTTP response.
 */
exports.delete_book_from_booklist = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = await userModel.getUserIdFromToken(token);

        const { list_id, book_id } = req.body; //expect the list_id and the book_object returned from open endpoints book from id or book search

        if (!list_id) {
            return res.status(400).json({message: 'missing list id'});
        }

        if (!book_id) {
            return res.status(400).json({message: 'missing book id'});
        }

        let is_user_list = await booklistModel.does_user_own_list(user_id, list_id);
        if (!is_user_list) {
            return res.status(401).json({message: 'Tried removing book from list that user does not own.'});
        }

        let book_in_booklist = await booklistModel.is_book_in_list(list_id, book_id);
        if (!book_in_booklist) {
            return res.status(403).json({message: 'book is not in list'})
        }

        await booklistModel.delete_book_from_booklist(list_id, book_id);

        return res.status(200).json({message: 'book removed'});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to remove book from booklist'});
    }
};


/**
 * Retrieves book information from a specified list.
 * 
 * The function first extracts the authorization token from the request headers to identify
 * the user. It then retrieves the list ID from the request body. The function checks if
 * the list is public; if not, it verifies whether the requesting user owns the list.
 * If the list is private and not owned by the user, a 401 Unauthorized response is sent.
 * Otherwise, it fetches the data of the list and returns it in the response.
 * 
 * If any errors occur during the process, a 500 Internal Server Error response is sent.
 * 
 * @param {object} req - The request object, containing the request headers
 *                        and body with the user's token and the list ID.
 * @param {object} res - The response object used for sending back the
 *                        retrieved list data or error messages.
 * @returns {Promise<void>} A promise that resolves to sending a response to the client.
 */
exports.get_book_ids_from_list = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = await userModel.getUserIdFromToken(token);

        const { list_id } = req.query;

        if (!list_id) {
            return res.status(400).json({message: 'list id not provided'});  
        }

        let is_list_public = await booklistModel.is_list_public(list_id);
        if (!is_list_public) {
            let is_user_list = await booklistModel.does_user_own_list(user_id, list_id);
            if (!is_user_list) {
                return res.status(401).json({message: 'Tried accessing private list that isnt owned by user.'});  
            }
        }

        const list_data = await booklistModel.get_list_data(list_id);
        return res.status(200).json(list_data);       
    } catch (error) {
        return res.status(500).json({message: 'Failed to open list.'});   
    }
};



/**
 * Updates a booklist.
 * 
 * This function allows a user to update the name, publicity and description of their book list. It verifies the user's
 * identity and checks if the user owns the book list before updating the details.
 *
 * @param {Object} req - The request object containing headers (authorization token) and body (list_id, name).
 * @param {Object} res - The response object used to send back a JSON response.
 */
 exports.update_booklist = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = await userModel.getUserIdFromToken(token);

        const { list_id, name = null, publicity = null, description = null } = req.body;

        if (!list_id) {
            return res.status(400).json({message: 'list id not provided'})
        }

        if (!(name != null || publicity != null || description != null)) {
            return res.status(400).json({message: 'atleast one param has to be provided'})
        }

        let is_user_list = await booklistModel.does_user_own_list(user_id, list_id);
        if (!is_user_list) {
            return res.status(401).json({message: 'Tried adding book to list that user does not own.'});
        }

        if (name) await booklistModel.update_booklist_name(list_id, name);
        if (publicity != null) await booklistModel.update_booklist_publicity(list_id, publicity);
        if (description != null) await booklistModel.update_booklist_description(list_id, description);
        
        return res.status(200).json({message: 'updated booklist.'});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to update booklist'});
    }
};





/**
 * Adds a review to a book list.
 * 
 * This function allows a user to add a review to a book list. It first verifies the user's
 * identity through a token, checks if the targeted list is public, and then adds the review.
 *
 * @param {Object} req - The request object containing headers (authorization token) and body (list_id, stars, text_content).
 * @param {Object} res - The response object used to send back a JSON response.
 */
 exports.add_review_to_list = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = await userModel.getUserIdFromToken(token);
        let username = await userModel.getUsernameFromId(user_id)

        const { list_id, stars, text_content = "" } = req.body;

        if (!list_id) {
            return res.status(400).json({message: 'list id not provided'});
        }

        if (!stars) {
            return res.status(400).json({message: 'stars not provided'});
        }

        let is_list_public = await booklistModel.is_list_public(list_id);
        if (!is_list_public) {
            return res.status(401).json({message: 'Tried adding comment to private list.'});  
        }

        //perform validation
        const review_test = {content: text_content, rating: stars}
        const is_valid = await review_schema.validate(review_test)
            .then(function() {
                return true;
            })
            .catch(function() {
                return false;
            });

        if (!is_valid) {
            return res.status(400).json({message: 'schema not valid'});
        }

        await booklistModel.add_review(user_id, list_id, stars, text_content, username);

        return res.status(200).json({message: 'added review'})
    } catch (error) {
        return res.status(500).json({message: 'Failed to open list.'});   
    }
};



//AUTH USER INFO FETCH

/**
 * Retrieves user details.
 * 
 * This function fetches details of the user. It extracts the user's identity from the provided
 * token and retrieves their details from the database.
 *
 * @param {Object} req - The request object containing headers (authorization token).
 * @param {Object} res - The response object used to send back the user details in JSON format.
 */
exports.get_user_details = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = userModel.getUserIdFromToken(token);

        const user_details = await userModel.getUserDetails(user_id);

        return res.status(200).json(user_details);
    } catch (error) {
        return res.status(500).json();
    }
}



//MANAGER / ADMIN REVIEW HIDING

/**
 * Toggles the hidden status of a review.
 * 
 * This function is used by admins or managers to hide or unhide a review. It checks if the user
 * has admin or manager privileges before toggling the hidden status of the specified review.
 *
 * @param {Object} req - The request object containing headers (authorization token) and body (review_id).
 * @param {Object} res - The response object used to send back a JSON response.
 */
exports.toggle_hide_review = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = userModel.getUserIdFromToken(token);

        let is_admin = await userModel.isAdmin(user_id);
        let is_manager = await userModel.isManager(user_id);

        if (!is_admin && !is_manager) {
            return res.status(401).json({message: 'Only manager or admin can do this.'});
        }

        const { review_id } = req.body; 

        if (!review_id) {
            return res.status(400).json({message: 'review id not provided'});
        }

        await booklistModel.toggle_hide_review(review_id);

        return res.status(200).json({message: 'Changed review hidden status.'});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to update review status'});
    }
};



//CART AND CHECKOUT

/**
 * Adds a book to the user's cart or updates the quantity if the book already exists in the cart.
 * 
 * This function allows users to add a new book to their cart or update the quantity of an existing book.
 * It verifies the user's identity through a token, checks if the book is already in the cart, and then
 * performs the appropriate action based on that check.
 *
 * @param {Object} req - The request object containing headers (authorization token) and body (book_id, quantity).
 * @param {Object} res - The response object used to send back a JSON response.
 */
exports.add_book_to_cart = async (req, res) => { //endpoint can be used for adding book initially or updating quantity in cart
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = userModel.getUserIdFromToken(token);

        const { book_id, quantity } = req.body; 

        if (!book_id) {
            return res.status(400).json({message: 'book id not provided'});
        }

        if (!quantity) {
            return res.status(400).json({message: 'quantity not provided'});
        }

        let book_exists = await booklistModel.does_book_exist(book_id);
        if (!book_exists) {
            await booklistModel.add_book(book_id);
        }

        if (await booklistModel.is_book_in_cart(user_id, book_id)) {
            await booklistModel.update_book_quantity(user_id, book_id, quantity);
        } else {
            await booklistModel.add_book_to_cart(user_id, book_id, quantity);
        }

        return res.status(200).json({message: 'updated cart'});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to update cart'});
    }
};


/**
 * Deletes a book from the user's cart.
 * 
 * This function removes a specific book from the user's cart. It verifies the user's
 * identity through a token and then deletes the specified book from the cart.
 *
 * @param {Object} req - The request object containing headers (authorization token) and body (book_id).
 * @param {Object} res - The response object used to send back a JSON response.
 */
exports.delete_book_from_cart = async (req, res) => { 
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = userModel.getUserIdFromToken(token);

        const { book_id } = req.body; 

        if (!book_id) {
            return res.status(400).json({message: 'book id not provided'})
        }

        await booklistModel.delete_book_from_cart(user_id, book_id);

        return res.status(200).json({message: 'deleted book from cart'});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to delete book from cart'});
    }
};


/**
 * Clears all items from the user's cart.
 * 
 * This function empties the user's cart. It verifies the user's identity through a token
 * and then removes all items from their cart.
 *
 * @param {Object} req - The request object containing headers (authorization token).
 * @param {Object} res - The response object used to send back a JSON response.
 */
exports.clear_cart = async (req, res) => { 
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = userModel.getUserIdFromToken(token);

        await booklistModel.clear_cart(user_id);

        return res.status(200).json({message: 'cleared cart'});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to clear cart'});
    }
};


/**
 * Retrieves the contents of the user's cart.
 * 
 * This function fetches the details of all items in the user's cart. It verifies the user's
 * identity through a token and retrieves the cart details.
 *
 * @param {Object} req - The request object containing headers (authorization token).
 * @param {Object} res - The response object used to send back the cart details in JSON format.
 */
exports.get_cart = async (req, res) => { 
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = userModel.getUserIdFromToken(token);

        const cart_details = await booklistModel.get_cart(user_id);

        return res.status(200).json(cart_details);
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to get cart'});
    }
};


/**
 * Processes the checkout of the user's cart.
 * 
 * This function handles the checkout process for the items in the user's cart. It verifies the user's
 * identity, creates an order, adds all items from the cart to the order, and then clears the cart.
 * It requires detailed information about the order and cart items to process the checkout.
 * Cart details should be sent from front end in format [{book_id: 1, quantity: 5, price: 53.2}, ...]
 *
 * @param {Object} req - The request object containing headers (authorization token) and body (cart_details, total_price, personal and address information).
 * @param {Object} res - The response object used to send back the order ID in a JSON response.
 */
exports.checkout = async (req, res) => { 
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = userModel.getUserIdFromToken(token);

        const requiredFields = ['total_price', 'first_name', 'last_name', 'email', 'phone', 'address', 'country', 'province', 'city', 'postal_code'];
        let missingFields = "";

        //missing fields except cart_details
        requiredFields.forEach(field => {
            if (!req.body[field]) {
                missingFields += field + ", ";
            }
        });

        //check if cart_details is present and not empty
        if (!req.body.cart_details || req.body.cart_details.length === 0) {
            missingFields += "cart_details, ";
        }

        // If there are missing fields, return 401 status with the list of missing fields
        if (missingFields.length > 0) {
            return res.status(400).json({ error: "Missing fields", missingFields: missingFields });
        }

        //cart details expect list of object containing cart info ie [{book_id: 1, quantity: 5, price: 53.2}, ...]
        //I would store price in cart db table but it can change so makes sense to send front frontend
        const { cart_details, total_price, first_name, last_name, email, phone, address, country, province, city, postal_code } = req.body; 


        //perform validation
        const checkout_test = {
            firstName: first_name, lastName: last_name, email: email, phone: phone, address1: address, address2: address, 
            country: country, province: province, city: city, postalCode: postal_code
        }

        const subset_schema = checkout_schema.omit(['cardName', 'cardNumber', 'cardExpiry', 'cardCvc']);

        const is_valid = await subset_schema.validate(checkout_test)
            .then(function() {
                return true;
            })
            .catch(function(err) {
                console.log(err)
                return false;
            });

        if (!is_valid) {
            return res.status(400).json({message: 'schema not valid'});
        }


        const order = await booklistModel.create_order(user_id, total_price, first_name, last_name, email, phone, address, country, province, city, postal_code);
        const order_id = order.id;

        cart_details.forEach(async function(item, index) {
            await booklistModel.add_book_to_order(order_id, item.book_id, item.quantity, item.price);
        });

        await booklistModel.clear_cart(user_id); //empty cart on successful checkout

        return res.status(200).json({order_id: order_id});
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to get cart'});
    }
};



/**
 * Handles the retrieval of all public booklists from the database.
 * 
 * It first extracts the user ID from the authorization token in the request headers.
 * It then validates the query parameters 'sort', 'sort_type', and 'limit' provided in the request. 
 * The 'sort' parameter can be one of 'updated_at', 'created_at', 'id', 'list_name', or 'created_by_username', 
 * and is used to determine the sorting field of the booklists.
 * The 'sort_type' parameter dictates the order of sorting and can be either 'asc' (ascending) or 'desc' (descending).
 * The 'limit' parameter is an optional integer that limits the number of booklists returned.
 * If any of these parameters are invalid, the function responds with a 400 status code and an error message.
 *
 * Upon successful validation, it calls the `booklistModel.get_public_booklists` method with these parameters 
 * to fetch the booklists. The retrieved list data is then sent back in the response with a 200 status code.
 * If an error occurs during this process, a 500 status code is returned with an error message.
 *
 * @param {Object} req - The request object, containing headers (including the authorization token) and query parameters.
 * @param {Object} res - The response object, used to send back the booklist data in JSON format or an error message.
 */
 exports.get_public_booklists = async (req, res) => { 
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user_id = userModel.getUserIdFromToken(token);

        // sort can be a string of either updated_at, created_at, id, list_name, created_by_username
        // sort_type expects either 'asc' or 'desc'
        const { sort = 'updated_at', sort_type = 'desc', limit = null } = req.query      


        const validSorts = ['updated_at', 'created_at', 'id', 'list_name', 'created_by_username'];
        if (!sort || !validSorts.includes(sort)) {
            return res.status(400).json({ message: "Invalid or missing 'sort' parameter." });
        }

        // Validate 'sort_type'
        if (!sort_type || !['asc', 'desc'].includes(sort_type)) {
            return res.status(400).json({ message: "Invalid or missing 'sort_type' parameter." });
        }

        if (limit && limit <= 0) {
            return res.status(400).json({ message: "Provide positive limit." });
        }

        const list_data = await booklistModel.get_public_booklists(sort, sort_type, limit);

        return res.status(200).json(list_data);
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to get cart'});
    }
};