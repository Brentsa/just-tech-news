const router = require('express').Router();
const { User } = require('../../models');

//Get /api/users
router.get('/', (req, res) => {
    User.findAll()
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(error);
        res.status(500).json(err);
    });
});

//Get /api/users/1
router.get('/:id', (req, res) => {});

//Post /api/users
router.get('/', (req, res) => {});

//Put /api/users/1
router.get('/:id', (req, res) => {});

//Delete /api/users/1
router.get('/:id', (req, res) => {});

module.exports = router;