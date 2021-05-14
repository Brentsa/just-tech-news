const router = require('express').Router();
const {Post, User, Vote} = require('../../models');
const sequelize = require('../../config/connection');

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

//Update a post with an upvote
router.put('/upvote', (req, res) => {
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
    .then(() => {
        // then find the post we just voted on
        return Post.findOne({
            where: {
                id: req.body.post_id
            },
            attributes: [
                'id',
                'post_url',
                'title',
                'created_at',
                // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
                [
                    sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                    'vote_count'
                ]
            ]
        });
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
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