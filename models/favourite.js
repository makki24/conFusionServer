const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema(
    {
        dish :
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Dish'
            }
    }
);

const faviourateSchema =new Schema(
    {
        user:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
        dishes:[{ type: mongoose.Schema.Types.ObjectId, unique:true, ref: 'Dish' }]
    },
    {
        timestamps: true
    }
)

module.exports =mongoose.model('favourite',faviourateSchema);