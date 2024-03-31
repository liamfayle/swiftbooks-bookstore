const userModel = require('../models/userModel');



/**
 * Handles the retrieval of all user details from the database.
 * 
 * This asynchronous function tries to fetch user details by invoking the
 * `getUsers` method of the userModel. On successful retrieval, it sends back
 * the user details with a 200 HTTP status code. In case of any error, it 
 * catches the exception and sends back a 500 HTTP status code with an error message.
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @returns {Promise<Response>} A promise that resolves to an Express response object.
 */
exports.get_users = async (req, res) => {
    try {
        const user_details = await userModel.getUsers();

        return res.status(200).json(user_details);
    } catch (error) {
        return res.status(500).json({message: 'Failed to get user details.'});
    }
}


/**
 * Handles updating the status of a user in the database.
 * 
 * This asynchronous function takes a user ID and a status string ('user' or 'manager')
 * from the request body. It then calls the `changeUserStatus` method of userModel
 * to update the user's status. On success, it returns a 200 HTTP status code with
 * a success message. In case of an error, it sends back a 500 HTTP status code
 * with an error message.
 * 
 * @param {Object} req - The request object from Express, containing the user_id and status_string.
 * @param {Object} res - The response object from Express.
 * @returns {Promise<Response>} A promise that resolves to an Express response object.
 */
exports.change_user_status = async (req, res) => {
    try {
        const { user_id, status_string } = req.body; //expects status string of either 'user' (change back to regular user) or 'manager' to set as manager status

        if (!user_id) {
            return res.status(400).json({message: 'user id not provided'})
        }

        if (!status_string) {
            return res.status(400).json({message: 'status string not provided'})
        }

        await userModel.changeUserStatus(user_id, status_string);
        
        return res.status(200).json({message: 'Successfully updated user status'});
    } catch (error) {
        return res.status(500).json({message: 'Failed to update user status.'});
    }
}


/**
 * Manages the activation or deactivation of a user in the database.
 * 
 * This asynchronous function extracts a user ID and a boolean 'active' status
 * from the request body. It calls the `changeUserActive` method of userModel
 * to update the user's active status. On successful update, it returns a 200
 * HTTP status code with a success message. If an error occurs, it responds with
 * a 500 HTTP status code and an error message.
 * 
 * @param {Object} req - The request object from Express, containing the user_id and active status.
 * @param {Object} res - The response object from Express.
 * @returns {Promise<Response>} A promise that resolves to an Express response object.
 */
exports.change_user_active = async (req, res) => {
    try {
        const { user_id, active } = req.body; // active expects bool 

        if (!user_id) {
            return res.status(400).json({message: 'user id not provided'})
        }

        if (active == null) {
            return res.status(400).json({message: 'active not provided'})
        }

        await userModel.changeUserActive(user_id, active);
        
        return res.status(200).json({message: 'Successfully updated user activity'});
    } catch (error) {
        return res.status(500).json({message: 'Failed to update user activity.'});
    }
}