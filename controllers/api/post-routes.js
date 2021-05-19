const router = require('express').Router();
const {Post, User, Vote, Comment} = require('../../models');
const sequelize = require('../../config/connection');

//Get All Posts
router.get('/', (req, res) => {
    Post.findAll({ 
        attributes: [
            'id', 
            'title', 
            'post_url', 
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
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
        attributes: [
            'id', 
            'title', 
            'post_url',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
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
    // make sure the session exists first

    console.log({ ...req.body, user_id: req.session.user_id });

    if (req.session) {
        // pass session id along with all destructured properties on req.body
        Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
            .then(updatedVoteData => res.json(updatedVoteData))
            .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
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