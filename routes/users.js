const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createUser, getUser, getUsers, updateAvatar, updateProfile, login,
} = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/me/avatar', updateAvatar);
router.patch('/users/me', updateProfile);

module.exports = router;
