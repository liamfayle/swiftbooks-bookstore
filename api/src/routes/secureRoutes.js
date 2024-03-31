const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const secureController = require('../controllers/secureController');


//booklist operations
router.post('/create-booklist', verifyToken, secureController.create_booklist);
router.get('/get-user-booklists', verifyToken, secureController.get_user_booklists);
router.delete('/delete-user-booklist', verifyToken, secureController.delete_user_booklist); 
router.post('/add-book-to-list', verifyToken, secureController.add_book_to_booklist);
router.delete('/delete-book-from-list', verifyToken, secureController.delete_book_from_booklist); 
router.get('/get-booklist-books', verifyToken, secureController.get_book_ids_from_list); 
router.put('/update-booklist', verifyToken, secureController.update_booklist); 
router.post('/add-review', verifyToken, secureController.add_review_to_list); 
router.get('/get-public-booklists', verifyToken, secureController.get_public_booklists); 

//auth user info
router.get('/get-user-details', verifyToken, secureController.get_user_details); 

//manage / admin review hiding
router.put('/toggle-hide-review', verifyToken, secureController.toggle_hide_review); 


//cart and checkout
router.post('/add-book-to-cart', verifyToken, secureController.add_book_to_cart); 
router.delete('/delete-book-from-cart', verifyToken, secureController.delete_book_from_cart); 
router.delete('/clear-cart', verifyToken, secureController.clear_cart); 
router.get('/get-cart', verifyToken, secureController.get_cart); 
router.post('/checkout', verifyToken, secureController.checkout); 


module.exports = router;
