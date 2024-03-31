const express = require('express');
const { verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/get-users', verifyAdmin, adminController.get_users); 
router.put('/change-user-status', verifyAdmin, adminController.change_user_status); 
router.put('/change-user-active', verifyAdmin, adminController.change_user_active); 


module.exports = router;