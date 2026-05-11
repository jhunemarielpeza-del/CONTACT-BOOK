const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require('../Controllers/contactControllers');

// All contact routes require authentication
router.use(authMiddleware);

router.get('/', getContacts);
router.post('/', createContact);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;