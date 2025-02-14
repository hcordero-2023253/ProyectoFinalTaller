import { Schema , model } from "mongoose";

const categorySchema = Schema({
    name: {
        type : String,
        required : [true, 'It is necessary to know what category it is']
    },
    description: {
        type: String,
        required: true,
        maxLength: [15, 'Description must be less than 15 characters']
    },
    creation: {
        type: Date,
        default: 'Undated'
    },
})

export default model('Category', categorySchema);