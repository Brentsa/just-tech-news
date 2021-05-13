const router = require('express').Router();
const {Post, User} = require('../../models');

//Get All Posts
router.get('/', (req, res) => {
    Post.findAll({ 
        attributes: ['id', 'title', 'post_url', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get Single Post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'post_url','created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({message: 'Post with specified id not found.'})
            return;
        }

        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Create a New Post
router.post('/', (req, res) => {
    const {title, post_url, user_id} = req.body;
    Post.create({
        title,
        post_url,
        user_id,
    })
    .then(newPost => res.json(newPost))
    .catch(err => {
        console.log(err);
        res.status(500).json(newPost);
    })
});

//Update a Post's Title
router.put('/:id', (req, res) => {
    const {title} = req.body;
    Post.update(
        {
            title
        },
        {
            where:{
                id: req.params.id
            }
        }
    )
    .then(dbUpdatedData => {
        if(!dbUpdatedData){
            res.status(404).json({message: 'Post with specified id not found.'})
            return;
        }

        res.json(dbUpdatedData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

//Delete a Post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where:{
            id: req.params.id
        }
    })
    .then(dbUpdatedData => {
        if(!dbUpdatedData){
            res.status(404).json({message: 'Post with specified id not found.'})
            return;
        }

        res.json(dbUpdatedData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;