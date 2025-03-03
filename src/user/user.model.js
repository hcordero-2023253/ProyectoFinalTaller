import { Schema, model } from "mongoose";
import { encrypt, checkPassword } from "../../utils/encrypt.js";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [50, 'Name is too long'],
        unique: [true, 'Name is already taken']
    },
    lastname:{
        type: String,
        required: [true, 'Last name is required'],
        maxLength: [50, 'Last name is too long'],
        unique: [true, 'Last name is already taken']
    },
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username is already in use'],
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is already in use']
    },
    password:{
        type: String,
        required: [true,'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long'],
    },
    role:{
        type: String,
        required: [true,'Role is required'],
        uppercase: true,
        enum: ['ADMIN', 'CLIENT'],
    },
    
})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next()
        try {
            this.password = await encrypt(this.password)
        } catch (error) {
            console.error('Error hashing password:', error);
            return next(error);
        }
})

userSchema.methods.toJSON = function(){
    const {__v, password, ...user} = this.toObject();
    return user;
}

userSchema.methods.comparePassword = async function(candidatePassword)  {
    try {
        return await checkPassword(this.password, candidatePassword );
    } catch (error) {
        console.error('Error comparing password:', error);
        return false
    }
}

export default model('User', userSchema);