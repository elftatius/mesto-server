const router = require('express').Router();
const {
  createUser, getUser, getUsers, updateAvatar, updateProfile,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.patch('/users/me/avatar', updateAvatar);
router.patch('/users/me', updateProfile);

module.exports = router;
