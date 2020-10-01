const mongoose = require('mongoose');

const foodRecordSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    calories: {
        type: String,
        required: true
    },
    tags: [{type:String}]
});

const FoodModel = mongoose.model('FoodRecord', foodRecordSchema);

module.exports = FoodModel;