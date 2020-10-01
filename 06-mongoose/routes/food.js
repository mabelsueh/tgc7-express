const express = require('express');
const router = express.Router();
const {models} = require('../models')

router.get('/', async (req,res)=>{
    let allFood = await models.FoodRecordModel.find({});
    console.log(allFood)
    res.render('food/all', {
        allFood
    });
})

router.get('/create', (req,res)=>{
    res.render('food/create');
});

router.post('/create', (req, res) => {
    let { foodName, calories, tags} = req.body;
    if (!Array.isArray(tags)) {
        tags = [tags]
    }
    let food = new models.FoodRecordModel({
        foodName, calories, tags
    })
    food.save();
    res.redirect('/food/');
})

module.exports = router;