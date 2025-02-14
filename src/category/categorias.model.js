import { Schema , model } from "mongoose";

const categorySchema = Schema({
    name: {
        type : String,
        required : [true, 'It is necessary to know what category it is'],
        unique: [true, 'Name already exists'],
    },
    description: {
        type: String,
        required: true,
        maxLength: [1000, 'Description must be less than 1000 characters']
    }
});

export default model('Category', categorySchema);