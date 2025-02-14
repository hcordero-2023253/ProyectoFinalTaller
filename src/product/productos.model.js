import { Schema, model } from "mongoose";

const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'Is required'],
        maxLength: [20, 'Max length is 20'],
    },
    description:{
        type:String,
        required:[true,'Is required'],
        maxLength:[25,'Max length is 25'],
    },
    brand:{
        type: String,
        required: [true, 'Is required'],
        maxLength: [10, 'Max length is 10'],
    },
    price:{
        type:Number,
        required:[true,'Is required'],
    },
    stock:{
        type:Number,
        required:[true,'Is required'],
    },
    employee:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Employee is required'],
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    }
})

export default model('Product', productSchema);