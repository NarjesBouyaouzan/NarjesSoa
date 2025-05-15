const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/UserController'); // adapte le chemin si besoin

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
router.get('/:id', async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/users
// @desc    Create new user
router.post('/', async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
router.put('/:id', async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
