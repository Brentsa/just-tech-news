const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

//Get /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['password']
        }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {
            exclude: ['password']
        },
        where:{
            id: req.params.id
        },
        include:[
            //All posts the user has created
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            //All posts the user has voted on
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUser => {
        if(!dbUser){
            res.status(404).json({message: "No user found with this id."});
            return;
        }
        else{
            res.json(dbUser);
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

//Post /api/users
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    //expects {email: 'test@test.com, password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: "Email is not associated to a user."});
            return;
        }
        
        if(dbUserData.checkPassword(req.body.password)){
            res.json({user: dbUserData, message: "You are now logged in!"});
        }
        else{
            res.status(400).json({message: "Please enter a valid password."});
        }
    });
});

//Put /api/users/1
router.put('/:id', (req, res) => {
    User.update( req.body, {
        individualHooks: true,
        where:{
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]){
            res.status(404).json({message: "No user found with this id."});
            return;
        }
        else{
            res.json(dbUserData);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Delete /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where:{
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: "No user found with this id."});
            return;
        }
        else{
            res.json(dbUserData);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;