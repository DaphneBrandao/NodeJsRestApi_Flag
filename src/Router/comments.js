const express = require('express'); //call express Js

const router = express.Router();

//IMPORTS
const Comment = require('../models/comments')


//READ ALL COMMENT
router.get('/', async(req, res) => {
  try {
    //populate - permite apresentar o nome em cada comentario
    const comments = await Comment.find().populate('belongsTo');
    return res.send({ comments });

    } catch (e) {
    return res.status(400).send('Error loading comment');
  }
});

//READ ONE COMMENT
router.get('/:commentId', async (req, res) => {
  try {
    //populate - permite apresentar o nome em cada comentario
    const comment = await Comment.findById(req.params.commentId).populate('belongsTo');
    return res.send({ comment });

    } catch (e) {
    return res.status(400).send('Error loading comment');
  }
});

//CREATE COMMENT
router.post('/newcoment', async (req, res) => {
 
  try {
    
    const comment = await Comment.create({ ...req.body, User: req.commentId });
    return res.send({ comment });

    } catch (e) {
    return res.status(400).send('Error Sending comment');
  }
});

//UPDATE COMMENT
router.patch('/:commentId', async (req, res) => {
  const bodyKeys = Object.keys(req.body) 
    
    const allowedKeys = ['description']
    //allowed keys
    const isValidUpdate = bodyKeys.every((bodyKey)=> allowedKeys.includes(bodyKey))  
    
    if(!isValidUpdate) {
        return res.status(400).send()
    }
    try {
      const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {
        new:true, 
        runValidators: true})
      //1- await before update
      if(!comment) {
          return res.status(404).send()
      }

      res.send(comment)

      } catch (e) {
      res.status(400).send(e)
    }

});

//DELETE A COMMENT
router.delete('/:commentId', async (req, res) => {
  try {
    //populate - permite apresentar o nome em cada comentario
    const comment = await Comment.findByIdAndRemove(req.params.commentId).populate('belongsTo');
    return res.send({ comment });

    } catch (e) {
    return res.status(400).send('Error Deleting comment');
  }
});

module.exports = router;