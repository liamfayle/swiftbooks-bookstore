const axios = require('axios');
const booklistModel = require('../models/booklistModel');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');


/**
 * Searches for books using the Google Books API based on provided query parameters.
 * This asynchronous function handles a request to search for books by title, author, or genre (field).
 * It supports pagination through an offset value, which dictates the starting point of search results.
 *
 * @param {Object} req - The request object containing search parameters.
 * @param {Object} res - The response object used for sending back the search results or error message.
 *
 * The request body should include:
 *  - author: String (optional) - the author of the book.
 *  - field: String (optional) - the genre or subject of the book.
 *  - title: String (optional) - the title of the book.
 *  - offset: Number (optional) - the number of times the user has pressed 'load more', used for pagination.
 *
 * The function constructs a query string based on these parameters and calls the Google Books API.
 * It then processes the API response, filtering and mapping the results to a summarized format, 
 * and sends this list back in the response. If an error occurs, it sends a 500 status code with an error message.
 */
exports.search = async (req, res) => {
    try {
        const { author, field, title, offset = 0, limit = 40 } = req.query; //i am assuming field means genre of book

        let query = '';
        if (title) query += `${title}+intitle:${title}`;
        if (author) query += `+inauthor:${author}`;

        if (field) query += `+subject:${field}`; 
        query = query.trim();

        let page_offset = offset * limit;

        // Default query for fiction books if no parameters are provided
        if (query === '') {
            query = '+subject:fiction';
        }

        // Fetch data from Google Books API
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=en&maxResults=${limit}&startIndex=${page_offset}&filter=ebooks&key=${process.env.GOOGLE_API_KEY}`); //remove filter if we want later (suipposed to find only books that are for sale or free)
        
        if (response.data.totalItems == 0) return res.status(200).json([]);

        const books = response.data.items;

        //track unique IDs
        const seenIds = new Map();
        const summarizedBooks = books
            .filter(book => {

                if (book.volumeInfo.language !== 'en') return false;

                //duplicate id
                if (seenIds.has(book.id)) return false;

                seenIds.set(book.id, true);
                return true;
            })
            .map((book, index) => {
                return {
                    id: book.id,
                    index: index,
                    title: book.volumeInfo.title || null,
                    subtitle: book.volumeInfo.subtitle || null,
                    authors: book.volumeInfo.authors || null,
                    publisher: book.volumeInfo.publisher || null,
                    published_date: book.volumeInfo.publishedDate || null,
                    description: book.volumeInfo.description || null,
                    numPages: book.volumeInfo.pageCount || null,
                    categories: book.volumeInfo.categories || null,
                    averageStars: book.volumeInfo.averageRating || null, //average number starts out of 5
                    mature: book.volumeInfo.maturityRating || null, //is 17+ age recommended (NOT_MATURE OR MATURE)
                    thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : null, //link to image
                    saleability: book.saleInfo.sale_price || null, //Is book for sale (FOR_SALE OR NOT_FOR_SALE)
                    price: book.saleInfo.listPrice ? book.saleInfo.listPrice.amount : null, //recommended price
                    sale_price: book.saleInfo.retailPrice ? book.saleInfo.retailPrice.amount : null, //current best available price (same as price above or lower if on sale)
                };
            });

        return res.status(200).json(summarizedBooks);
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to search for book.'});
    }
};


/**
 * Retrieves detailed information for a book based on its Google Books API ID.
 * 
 * This function takes the Google Books ID from the request body, uses it to fetch 
 * book details from the Google Books API, and then returns a summarized version of 
 * these details in the response. It handles any errors by returning a 500 status code 
 * with an error message. 
 * It extracts essential information such as title, authors, publisher, publication date, description,
 * page count, categories, ratings, maturity rating, image links, and sales information.
 * If the specific detail is not available, it defaults to null.
 * 
 * @param {Object} req - The HTTP request object, containing the book's Google ID in its body.
 * @param {Object} res - The HTTP response object used to send back the requested book information.
 * @returns {Object} A response object containing the book's details if successful, 
 *                   or an error message if the operation fails.
 * 
 * The function asynchronously fetches book data using the provided Google ID.  The function also 
 * handles exceptions, ensuring the server responds appropriately in case of failures.
 */
exports.book_info_from_id = async (req, res) => {
    try {
        const { id } = req.query; 

        if (!id) {
            return res.status(400).json({message: 'no id provided in query'})
        }

        // Fetch data from Google Books API
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`).catch(error => {
            return null
        });

        if (!response) {
            return res.status(404).json({ message: 'Book ID not found' });
        }

        const book = response.data;

        // Send back a summarized list of books
        const summarizedBook =  {
            id: book.id,
            title: book.volumeInfo.title || null,
            subtitle: book.volumeInfo.subtitle || null,
            authors: book.volumeInfo.authors || null,
            publisher: book.volumeInfo.publisher || null,
            published_date: book.volumeInfo.publishedDate || null,
            description: book.volumeInfo.description || null,
            numPages: book.volumeInfo.pageCount || null,
            categories: book.volumeInfo.categories || null,
            averageStars: book.volumeInfo.averageRating || null, //average number starts out of 5
            mature: book.volumeInfo.maturityRating || null, //is 17+ age recommended (NOT_MATURE OR MATURE)
            thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : null, //link to image thumbnail
            fullImage: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.large : null, //link to full size image
            saleability: book.saleInfo.sale_price || null, //Is book for sale (FOR_SALE OR NOT_FOR_SALE)
            price: book.saleInfo.listPrice ? book.saleInfo.listPrice.amount : null, //recommended price
            sale_price: book.saleInfo.retailPrice ? book.saleInfo.retailPrice.amount : null, //current best avaialbe price (same as price above or lower if on sale)
        };

        return res.status(200).json(summarizedBook);
        
    } catch (error) {
        return res.status(500).json({message: 'Failed to find book.'});
    }
};


/**
 * This function is an asynchronous API endpoint for retrieving the ten most recently modified public booklists.
 * It uses the 'booklistModel' to query the database and fetch the required lists. 
 *
 * @param {Request} req - The request object, not used in this function but required by convention.
 * @param {Response} res - The response object used to send back the HTTP response.
 * @returns {Promise<Response>} - The function sends a JSON response with the status code 200 and the data of the 
 * recently modified public booklists if successful. In case of an error, it sends a status code 500 with an error message.
 */
exports.recent_public_booklists = async (req, res) => {
    try {
        const recent_lists = await booklistModel.ten_most_recent_public_lists();
        return res.status(200).json(recent_lists);       
    } catch (error) {
        return res.status(500).json({message: 'Failed to get ten most recent lists.'});   
    }
};


/**
 * This function handles an HTTP request to retrieve book information from a specified list. 
 * It's an asynchronous function that expects a request (`req`) and provides a response (`res`).
 *
 * @param {Object} req - The HTTP request object. This should contain a body with the 'list_id' 
 *                       property, which is used to identify the specific book list.
 * @param {Object} res - The HTTP response object. This is used to send back the retrieved data 
 *                       or error messages.
 * 
 * The function performs the following steps:
 * 1. Extracts the 'list_id' from the request body.
 * 2. Checks if the list with the given 'list_id' is public by calling the 'is_list_public' 
 *    method of the 'booklistModel'.
 * 3. If the list is not public, it sends a 401 (Unauthorized) response with a message indicating 
 *    that the user tried to access a private list they don't own.
 * 4. If the list is public, it retrieves the list data using the 'get_list_data' method of the 
 *    'booklistModel' and sends this data back in a 200 (OK) response.
 * 5. Catches any errors during the process and sends a 500 (Internal Server Error) response 
 *    with an appropriate error message.
 *
 * @returns A promise resolved with an HTTP response containing the list data or an error message.
 */
exports.get_book_ids_from_list = async (req, res) => {
    try {
        const { list_id } = req.query;

        if (!list_id) {
            return res.status(400).json({message: 'no list id provided'}); 
        }

        const list_data = await booklistModel.get_list_data(list_id);
        const list_info = await booklistModel.get_list_info(list_id);
        const list_owner_id = list_info.created_by_id;
        const list_status = list_info.is_public;

        if (list_status) { //return public list data no matter what
            return res.status(200).json(list_data)
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                let user_id = await userModel.getUserIdFromToken(token);
                let user_details = await userModel.getUserDetails(user_id);

                if (user_details.status === 'manager' || user_details.status === 'admin' || user_id === list_owner_id) {
                    return res.status(200).json(list_data); //return if user owns list or if user is admin / manager
                }
            } catch (error) {} //user not logged in 
        }


        return res.status(401).json({message: 'cant access list'});        
    } catch (error) {
        return res.status(500).json({message: 'Failed to open list.'});   
    }
};


//get booklist by id
    //return llist info if public
    //return if belongs to user
    //return if manager / admin

exports.booklist_info_from_id = async (req, res) => {
    try {
        const { list_id } = req.query;
        
        if (!list_id) {
            return res.status(400).json({message: 'list id not provided'}); 
        }

        const list_info = await booklistModel.get_list_info(list_id); 
        const list_owner_id = list_info.created_by_id;
        const list_status = list_info.is_public;

        if (list_status) { //return public list data no matter what
            return res.status(200).json(list_info)
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                let user_id = await userModel.getUserIdFromToken(token);
                let user_details = await userModel.getUserDetails(user_id);

                if (user_details.status === 'manager' || user_details.status === 'admin' || user_id === list_owner_id) {
                    return res.status(200).json(list_info); //return if user owns list or if user is admin / manager
                }
            } catch (error) {} //user not logged in
        }


        return res.status(401).json({message: 'cant access list'});       
    } catch (error) {
        return res.status(500).json({message: 'Failed to open list.'});   
    }
};
    



/** 
 * This async function acts as a route handler. It extracts the
 * `list_id` from the request body, uses it to fetch reviews by calling `get_reviews`, and
 * sends the results back in the HTTP response. If an error occurs, it sends a 500 status code
 * with an error message.
 *
 * @param {Request} req - The request object, expected to contain `list_id` in the body.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} A promise that resolves to the response object.
 */
exports.get_reviews_for_list = async (req, res) => {
    try {
        let return_hidden = false;

        const { list_id } = req.query;
        
        if (!list_id) {
            return res.status(400).json({message: 'list id not provided'}); 
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                let user_id = await userModel.getUserIdFromToken(token);
                let user_details = await userModel.getUserDetails(user_id);

                if (user_details.status === 'manager' || user_details.status === 'admin') {
                    return_hidden = true;
                }
            } catch (error) {} //user not logged in
        }

        let reviews = await booklistModel.get_reviews(list_id);

        // Filter out hidden reviews if return_hidden is false
        if (!return_hidden) {
            reviews = reviews.filter(review => !review.hidden);
        }


        return res.status(200).json(reviews);       
    } catch (error) {
        return res.status(500).json({message: 'Failed to open list.'});   
    }
};
