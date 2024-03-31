const pool = require('../config/db');
const jwt = require('jsonwebtoken');


/**
 * Creates a new user in the database.
 * @param {string} name - The name for the new user.
 * @param {string} username - The username for the new user.
 * @param {string} email - The email address for the new user.
 * @param {string} hashedPassword - The hashed password for the new user.
 * @returns {Object} The new user's information including the user ID.
 */
const createUser = async (name, username, email, hashedPassword) => {
    const result = await pool.query(
        'INSERT INTO users (name, username, email, password, active, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id',
        [name, username, email, hashedPassword, true, 'user']
    );
    return result.rows[0];
};

/**
 * Creates an external user in the database.
 * @param {string} name - The name for the new user.
 * @param {string} username - The username for the new user.
 * @param {string} email - The email address for the new user.
 * @param {string} externalId - The user's external ID.
 * @returns {Object} The new user's information including the user ID.
 */
const createExternalUser = async (name, username, email, externalId) => {
    const result = await pool.query(
        "INSERT INTO users (name, username, email, password, external, active, status, created_at, updated_at) VALUES ($1, $2, $3, '', $4, $5, $6, NOW(), NOW()) RETURNING id",
        [name, username, email, externalId, true, 'user']
    );
    return result.rows[0];
};

/**
 * Finds a user in the database by their email.
 * @param {string} email - The email address to search for.
 * @returns {Object} The found user's information.
 */
const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1', 
        [email]
    );
    return result.rows[0];
};


/**
 * Retrieves a username from the database based on user ID.
 * @param {string} id - The ID of the user.
 * @returns {string} The username of the user.
 */
const getUsernameFromId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE id = $1', 
        [id]
    );
    return result.rows[0].username;
};


/**
 * Decodes a JWT token to extract the user ID.
 * @param {string} token - The JWT token to decode.
 * @returns {string|null} The user ID if the token is valid, null otherwise.
 */
const getUserIdFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id;

        return userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};


/**
 * Retrieves user details from the database based on user ID.
 * @param {string} id - The ID of the user.
 * @returns {Object} The user details excluding the password.
 */
const getUserDetails = async (id) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE id = $1', 
        [id]
    );
    const { password, ...userDetails } = result.rows[0]; //destruct password before returning details
    return userDetails;
};


/**
 * Checks if a user is an admin.
 * @param {string} id - The ID of the user.
 * @returns {boolean} True if the user is an admin, false otherwise.
 */
const isAdmin = async (id) => {
    const query = `
        SELECT * FROM users
        WHERE id = $1 and status = $2
    `;
    const result = await pool.query(query, [id, 'admin']);

    return result.rows.length > 0;
}


/**
 * Checks if a user is a manager.
 * @param {string} id - The ID of the user.
 * @returns {boolean} True if the user is a manager, false otherwise.
 */
const isManager = async (id) => {
    const query = `
        SELECT * FROM users
        WHERE id = $1 and status = $2
    `;
    const result = await pool.query(query, [id, 'manager']);

    return result.rows.length > 0;
}


/**
 * Checks if a username already exists in the database.
 * @param {string} username - The username to check.
 * @returns {boolean} True if the username exists, false otherwise.
 */
const userExists = async (username) => {
    const query = `
        SELECT * FROM users
        WHERE LOWER(username) = LOWER($1)
    `;
    const result = await pool.query(query, [username]);

    return result.rows.length > 0;
}


/**
 * Check if email already exists.
 * @param {string} email - The email address to search for.
 * @returns {boolean} True if email exists and false otherwise
 */
 const emailExists = async (email) => {
    const query = `
        SELECT * FROM users
        WHERE LOWER(email) = LOWER($1)
    `;
    const result = await pool.query(query, [email]);

    return result.rows.length > 0;
};



/**
 * Retrieves a list of all users from the database.
 * @returns {Array} An array of user objects.
 */
const getUsers = async () => {
    const query = `
        SELECT * FROM users
        ORDER BY username
    `;
    const result = await pool.query(query);

    return result.rows;
}


/**
 * Changes the status of a user in the database.
 * @param {string} user_id - The ID of the user.
 * @param {string} status_string - The new status to set.
 * @returns {Object} The updated user information.
 */
const changeUserStatus = async (user_id, status_string) => {
    const query = `
        UPDATE users
        SET status = $2
        WHERE id = $1
        RETURNING *;  
    `;
    const result = await pool.query(query, [user_id, status_string]);

    return result.rows;
};


/**
 * Changes the active state of a user in the database.
 * @param {string} user_id - The ID of the user.
 * @param {boolean} active - The new active state to set.
 * @returns {Object} The updated user information.
 */
const changeUserActive = async (user_id, active) => {
    const query = `
        UPDATE users
        SET active = $2
        WHERE id = $1
        RETURNING *;  
    `;
    const result = await pool.query(query, [user_id, active]);

    return result.rows;
};


module.exports = { emailExists, createUser, createExternalUser, findUserByEmail, getUserIdFromToken, getUsernameFromId, getUserDetails, isAdmin, isManager, userExists, getUsers, changeUserStatus, changeUserActive };
