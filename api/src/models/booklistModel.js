const pool = require('../config/db');


/**
 * Asynchronously retrieves the ten most recent public booklists from the database.
 * It queries the booklists table, filtering by public lists and ordering by the most recently updated.
 * Returns an array of booklist objects.
 *
 * @return {Promise<Array>} A promise that resolves to an array of booklist objects.
 */
const ten_most_recent_public_lists = async () => {
    const query = `
        SELECT * FROM booklists 
        WHERE is_public = TRUE 
        ORDER BY updated_at DESC 
        LIMIT 10
    `;
    const result = await pool.query(query);
    return result.rows;
};


/**
 * Asynchronously counts the number of booklists created by a specific user.
 * It queries the booklists table, filtering by the user ID.
 * Returns the count of booklists.
 *
 * @param {number} user_id - The ID of the user.
 * @return {Promise<number>} A promise that resolves to the count of booklists by the user.
 */
const num_booklists_by_user = async (user_id) => {
    const query = `
        SELECT * FROM booklists
        WHERE created_by_id = $1
    `;
    const result = await pool.query(query, [user_id]);

    return result.rows.length;
}


/**
 * Asynchronously creates a new booklist in the database.
 * Inserts a new booklist with provided details and returns the created booklist's ID.
 *
 * @param {number} user_id - The ID of the user creating the booklist.
 * @param {string} username - The username of the user creating the booklist.
 * @param {string} list_name - The name of the booklist.
 * @param {boolean} is_public - Indicates if the booklist is public or private.
 * @return {Promise<object>} A promise that resolves to the created booklist object.
 */
const create_booklist_db = async (user_id, username, list_name, is_public, description) => {
    const result = await pool.query(
        'INSERT INTO booklists (list_name, is_public, created_by_id, created_by_username, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id', 
        [list_name, is_public, user_id, username, description]
    );
    return result.rows[0];
};


/**
 * Asynchronously retrieves all booklists created by a specific user.
 * Queries the booklists table, filtering by the user ID.
 * Returns an array of booklist objects.
 *
 * @param {number} user_id - The ID of the user.
 * @return {Promise<Array>} A promise that resolves to an array of booklist objects.
 */
const get_booklists = async (user_id) => {
    const query = `
        SELECT * FROM booklists
        WHERE created_by_id = $1
    `;
    const result = await pool.query(query, [user_id]);

    return result.rows;
}


/**
 * Checks if book already in a booklist
 * Return true if it is and false otherwise
 *
 * @param {number} list_id - The ID of the booklist.
 * @param {number} book_id - The ID of the book.
 * @return {Promise<Array>} A promise that resolves to true or false
 */
const is_book_in_list = async (list_id, book_id) => {
    const query = `
        SELECT 1 FROM booklists_books
        WHERE booklist_id = $1 AND book_id = $2
    `;
    const result = await pool.query(query, [list_id, book_id]);
    return result.rows.length > 0;
}


/**
 * Asynchronously deletes a booklist from the database.
 * Deletes the booklist based on the provided user ID and booklist ID.
 * Returns the deleted booklist object.
 *
 * @param {number} user_id - The ID of the user.
 * @param {number} booklist_id - The ID of the booklist to be deleted.
 * @return {Promise<object>} A promise that resolves to the deleted booklist object.
 */
const delete_booklist = async (user_id, booklist_id) => {
    const query = `
        DELETE FROM booklists
        WHERE created_by_id = $1 AND id = $2
        RETURNING *; 
    `;
    const result = await pool.query(query, [user_id, booklist_id]);

    return result.rows; // Contains the rows that were deleted
}


/**
 * Asynchronously checks if a specific user owns a specific booklist.
 * Queries the booklists table, filtering by user ID and booklist ID.
 * Returns true if the user owns the list, otherwise false.
 *
 * @param {number} user_id - The ID of the user.
 * @param {number} booklist_id - The ID of the booklist.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating ownership.
 */
const does_user_own_list = async (user_id, booklist_id) => {
    const query = `
        SELECT * FROM booklists
        WHERE created_by_id = $1 AND id = $2
    `;
    const result = await pool.query(query, [user_id, booklist_id]);

    return result.rows.length > 0;
}


/**
 * Asynchronously checks if a specific book exists in the database.
 * Queries the books table, filtering by book ID.
 * Returns true if the book exists, otherwise false.
 *
 * @param {number} book_id - The ID of the book.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the book exists.
 */
const does_book_exist = async (book_id) => {
    const query = `
        SELECT * FROM books
        WHERE id = $1
    `;
    const result = await pool.query(query, [book_id]);

    return result.rows.length > 0;
}


/**
 * Asynchronously adds a book to the database.
 * Inserts a new book with the provided book ID.
 * Returns the added book's ID.
 *
 * @param {number} book_id - The ID of the book to be added.
 * @return {Promise<number>} A promise that resolves to the ID of the added book.
 */
const add_book = async (book_id) => {
    const result = await pool.query(
        `INSERT INTO books 
            (id) 
            VALUES ($1) 
            RETURNING id`, 
        [book_id]
    );
    return result.rows[0];
};


/**
 * Asynchronously adds a book to a booklist.
 * Inserts a relation between a booklist and a book, and updates the booklist's last updated timestamp.
 * Returns the ID of the created booklist-book relation.
 *
 * @param {number} list_id - The ID of the booklist.
 * @param {number} book_id - The ID of the book to be added to the booklist.
 * @return {Promise<number>} A promise that resolves to the ID of the added booklist-book relation.
 */
const add_book_to_booklist = async (list_id, book_id) => {
    const result = await pool.query(
        `INSERT INTO booklists_books 
            (booklist_id, book_id, added_at) 
            VALUES ($1, $2, NOW())`, 
        [list_id, book_id]
    );
    await pool.query( 
        `UPDATE booklists 
            SET updated_at = NOW() 
            WHERE id = $1`,
        [list_id]
    );
    return result.rows[0];
};


/**
 * Asynchronously removes a book from a booklist.
 * Deletes the relation between a booklist and a book, and updates the booklist's last updated timestamp.
 * Returns the deleted booklist-book relation object.
 *
 * @param {number} list_id - The ID of the booklist.
 * @param {number} book_id - The ID of the book to be removed from the booklist.
 * @return {Promise<object>} A promise that resolves to the object of the deleted booklist-book relation.
 */
const delete_book_from_booklist = async (list_id, book_id) => {
    const result = await pool.query(
        `DELETE FROM booklists_books 
            WHERE booklist_id = $1 and book_id = $2
            RETURNING *`, 
        [list_id, book_id]
    );
    await pool.query( //update updated time for list
        `UPDATE booklists 
            SET updated_at = NOW() 
            WHERE id = $1`,
        [list_id]
    );
    return result.rows[0];
};


/**
 * Asynchronously checks if a booklist is public.
 * Queries the booklists table, filtering by list ID and checking if the list is public.
 * Returns true if the list is public, otherwise false.
 *
 * @param {number} list_id - The ID of the booklist.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the list is public.
 */
const is_list_public = async (list_id) => {
    const query = `
        SELECT * FROM booklists
        WHERE id = $1 and is_public = $2
    `;
    const result = await pool.query(query, [list_id, true]);

    return result.rows.length > 0;
}


/**
 * Queries the booklists table, filtering by list ID 
 * Returns booklist object if found and null otherwise
 *
 * @param {number} list_id - The ID of the booklist.
 * @return {Promise<boolean>} A promise that resolves to an object containing list info
 */
 const get_list_info = async (list_id) => {
    const query = `
        SELECT * FROM booklists
        WHERE id = $1
    `;
    const result = await pool.query(query, [list_id]);

    return result.rows[0];
}



/**
 * Asynchronously retrieves all books in a specific booklist.
 * Performs a join between the books and booklists_books tables, filtering by the booklist ID.
 * Returns an array of book objects.
 *
 * @param {number} list_id - The ID of the booklist.
 * @return {Promise<Array>} A promise that resolves to an array of book objects.
 */
const get_list_data = async (list_id) => {
    const query = `
        SELECT b.* FROM books b
        INNER JOIN booklists_books bb ON b.id = bb.book_id
        WHERE bb.booklist_id = $1
    `;
    const result = await pool.query(query, [list_id]);

    return result.rows; 
};


/**
 * Asynchronously adds a review to a booklist.
 * Inserts a new review with the provided details into the booklist_reviews table.
 * Returns the added review object.
 *
 * @param {number} user_id - The ID of the user adding the review.
 * @param {number} list_id - The ID of the booklist being reviewed.
 * @param {number} stars - The star rating of the review.
 * @param {string} text_content - The text content of the review.
 * @return {Promise<object>} A promise that resolves to the added review object.
 */
const add_review = async (user_id, list_id, stars, text_content, username) => {
    const result = await pool.query(
        `INSERT INTO booklists_reviews 
            (booklist_id, user_id, added_at, updated_at, content, stars, hidden, username) 
            VALUES ($1, $2, NOW(), NOW(), $3, $4, $5, $6) 
            RETURNING id`, 
        [list_id, user_id, text_content, stars, false, username]
    );

    return result.rows; 
};


/**
 * Asynchronously updates the name of a booklist.
 * Updates the list_name of a specific booklist and its last updated timestamp.
 * Returns the updated booklist object.
 *
 * @param {number} list_id - The ID of the booklist to be updated.
 * @param {string} name - The new name for the booklist.
 * @return {Promise<object>} A promise that resolves to the updated booklist object.
 */
const update_booklist_name = async (list_id, name) => {
    const result = await pool.query( 
        `UPDATE booklists 
            SET updated_at = NOW(),
                list_name = $2
            WHERE id = $1`,
        [list_id, name]
    );
    return result.rows[0];
};


/**
 * Asynchronously updates the description of a booklist.
 * Updates the description of a specific booklist and its last updated timestamp.
 * Returns the updated booklist object.
 *
 * @param {number} list_id - The ID of the booklist to be updated.
 * @param {string} description - The new description for the booklist.
 * @return {Promise<object>} A promise that resolves to the updated booklist object.
 */
 const update_booklist_description = async (list_id, description) => {
    const result = await pool.query( 
        `UPDATE booklists 
            SET updated_at = NOW(),
                description = $2
            WHERE id = $1`,
        [list_id, description]
    );
    return result.rows[0];
};


/**
 * Toggles the publicity status of a specific booklist in the database.
 * 
 * This function updates the 'is_public' field of a booklist by setting it to its opposite value.
 * It also updates the 'updated_at' field to the current timestamp. 
 *
 * @param {number} list_id - The ID of the booklist to update.
 * @returns {Promise<Object>} A promise that resolves to the updated row from the 'booklists' table.
 */
const update_booklist_publicity = async (list_id, publicity) => {
    const result = await pool.query( 
        `UPDATE booklists
            SET updated_at = NOW(),
                is_public = $2
            WHERE id = $1`,
        [list_id, publicity]
    );
    return result.rows[0];
};


/**
 * Retrieves reviews for a specific book list from the database.
 * 
 * This function queries the `booklists_reviews` table to find all reviews
 * associated with a given booklist ID. It uses an asynchronous approach
 * with a SQL query to fetch the data from the database.
 *
 * @param {number} list_id - The ID of the book list for which reviews are to be fetched.
 * @returns {Promise<Array>} A promise that resolves to an array of review objects.
 */
const get_reviews = async (list_id) => {
    const query = `
        SELECT * FROM booklists_reviews
        WHERE booklist_id = $1
    `;
    const result = await pool.query(query, [list_id]);

    return result.rows; 
};


/**
 * Asynchronously toggles the hidden status of a review.
 * Updates the hidden field of a specific review in the booklist_reviews table.
 * Returns the updated review object.
 *
 * @param {number} review_id - The ID of the review to be toggled.
 * @return {Promise<object>} A promise that resolves to the updated review object.
 */
const toggle_hide_review = async (review_id) => {
    const result = await pool.query( 
        `UPDATE booklists_reviews 
            SET updated_at = NOW(),
                hidden = NOT hidden
            WHERE id = $1`,
        [review_id]
    );
    return result.rows[0];
};


/**
 * Asynchronously checks if a book is in a user's cart.
 * Queries the carts table, filtering by user ID and book ID.
 * Returns true if the book is in the cart, otherwise false.
 *
 * @param {number} user_id - The ID of the user.
 * @param {number} book_id - The ID of the book.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the book is in the cart.
 */
const is_book_in_cart = async (user_id, book_id) => {
    const result = await pool.query( 
        `SELECT * FROM carts
        WHERE user_id = $1 and book_id = $2`,
        [user_id, book_id]
    );
    return result.rows.length > 0;
};


/**
 * Updates the quantity of a specific book in a user's cart.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {number} book_id - The ID of the book to update.
 * @param {number} quantity - The new quantity of the book.
 * @returns {Promise<object>} - A promise that resolves to the updated row.
 */
const update_book_quantity = async (user_id, book_id, quantity) => {
    const result = await pool.query( 
        `UPDATE carts 
            SET updated_at = NOW(),
                quantity = $3
            WHERE user_id = $1 and book_id = $2`,
        [user_id, book_id, quantity]
    );
    return result.rows[0];
};


/**
 * Adds a book to a user's cart.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {number} book_id - The ID of the book to add.
 * @param {number} quantity - The quantity of the book to add.
 * @returns {Promise<object>} - A promise that resolves to the newly added row.
 */
const add_book_to_cart = async (user_id, book_id, quantity) => {
    const result = await pool.query(
        `INSERT INTO carts 
        (user_id, book_id, quantity, added_at, updated_at) 
        VALUES ($1, $2, $3, NOW(), NOW())`,
        [user_id, book_id, quantity]
    );
    return result.rows[0];
};


/**
 * Deletes a book from a user's cart.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {number} book_id - The ID of the book to delete.
 * @returns {Promise<Array>} - A promise that resolves to the array of deleted rows.
 */
const delete_book_from_cart = async (user_id, book_id) => {
    const query = `
        DELETE FROM carts
        WHERE user_id = $1 AND book_id = $2
        RETURNING *;
    `;
    const result = await pool.query(query, [user_id, book_id]);

    return result.rows; // Contains the rows that were deleted
}


/**
 * Clears all items from a user's cart.
 * 
 * @param {number} user_id - The ID of the user whose cart is to be cleared.
 * @returns {Promise<Array>} - A promise that resolves to the array of deleted rows.
 */
const clear_cart = async (user_id) => {
    const query = `
        DELETE FROM carts
        WHERE user_id = $1
        RETURNING *;
    `;
    const result = await pool.query(query, [user_id]);

    return result.rows; // Contains the rows that were deleted
}


/**
 * Retrieves the contents of a user's cart.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to the array of cart items.
 */
const get_cart = async (user_id) => {
    const result = await pool.query( 
        `SELECT * FROM carts
        WHERE user_id = $1`,
        [user_id]
    );
    return result.rows;
};


/**
 * Creates a new order for a user with the provided details.
 * 
 * @param {number} user_id - The ID of the user placing the order.
 * @param {number} total_price - The total price of the order.
 * @param {string} first_name - The first name of the user.
 * @param {string} last_name - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} phone - The phone number of the user.
 * @param {string} address - The delivery address.
 * @param {string} country - The country of the delivery address.
 * @param {string} province - The province of the delivery address.
 * @param {string} city - The city of the delivery address.
 * @param {string} postal_code - The postal code of the delivery address.
 * @returns {Promise<object>} - A promise that resolves to the newly created order.
 */
const create_order = async (user_id, total_price, first_name, last_name, email, phone, address, country, province, city, postal_code) => {
    const result = await pool.query(
        `INSERT INTO orders 
        (user_id, price, first_name, last_name, email, phone, address, country, province, city, postal_code, added_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
        RETURNING id`,
        [user_id, total_price, first_name, last_name, email, phone, address, country, province, city, postal_code]
    );
    return result.rows[0];
};


/**
 * Adds a book to an order.
 * 
 * @param {number} order_id - The ID of the order.
 * @param {number} book_id - The ID of the book to add.
 * @param {number} quantity - The quantity of the book.
 * @param {number} price - The unit price of the book.
 * @returns {Promise<number>} - A promise that resolves to the ID of the newly added item.
 */
const add_book_to_order = async (order_id, book_id, quantity, price) => {
    const result = await pool.query(
        `INSERT INTO order_items 
        (order_id, book_id, quantity, unit_price) 
        VALUES ($1, $2, $3, $4)`,
        [order_id, book_id, quantity, price]
    );
    return;
};



/**
 * Retrieves public booklists based on conditions
 * 
 * @param {string} sort - the column to sort by
 * @param {string} sort_type - 'asc' or 'desc'
 * @param {number|null} limit - number of booklists to return (or null for all)
 * @returns {Promise<number>} - A promise that resolves to the ID of the newly added item.
 */
const get_public_booklists = async (sort, sort_type, limit) => {
    let query = `SELECT * FROM booklists WHERE is_public = TRUE`;

    //Append ORDER BY clause with sort and sort_type
    query += ` ORDER BY ${sort} ${sort_type}`;

    //if limit is provided and valid
    if (limit) {
        query += ` LIMIT ${limit}`;
    }

    const result = await pool.query(query);
    return result.rows;
}


module.exports = { 
    toggle_hide_review, update_booklist_name, add_review, get_list_data, is_list_public, delete_book_from_booklist, add_book_to_booklist, add_book, does_book_exist, 
    does_user_own_list, ten_most_recent_public_lists, num_booklists_by_user, create_booklist_db, get_booklists, delete_booklist, is_book_in_cart, update_book_quantity,
    add_book_to_cart, delete_book_from_cart, clear_cart, get_cart, create_order, add_book_to_order, update_booklist_publicity, get_reviews, is_book_in_list, get_list_info,
    get_public_booklists, update_booklist_description
};