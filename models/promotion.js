const mongoose= require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Schema = mongoose.Schema;
const Currency =mongoose.Types.Currency;

const promotionSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    image:{
        type: String,
        required: true
    },
    label:{
        type: String,
        default: ''
    },
    price:{
        type: Currency,
    },
    description:{
        type: String,
        required: true
    },
    featured: {
        type :Boolean,
        default: false
    }
});

var Promotions =mongoose.model('Promotion',promotionSchema);

module.exports = Promotions;