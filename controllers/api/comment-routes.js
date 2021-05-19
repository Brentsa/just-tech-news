const router = require('express').Router();
const {Comment} = require('../../models');

//Get all comments
router.get('/', (req, res) => {
    Comment.findAll({})
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//Create a new comment
router.post('/', (req, res) => {
    //Check for a session

    console.log({comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.session.user_id
    })

    if(req.session){
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    }
});

//Delete a comment 
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData){
            return res.status(404).json({message: 'Comment not found'});
        }

        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;