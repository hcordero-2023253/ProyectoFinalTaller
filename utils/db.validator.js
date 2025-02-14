import { isValidObjectId } from "mongoose";
import Category from "../src/category/categorias.model.js";
import Product from "../src/product/productos.model.js";
import User from "../src/user/user.model.js";

/*Validate product */
export const existProductName = async (name , product) => {
    const productExist = await Product.findOne({name: name})
    if(productExist && productExist._id != product.uid){
        console.error(`Product ${name} is already token`);
        throw new Error(`Product ${name} is already token`);
    }
}

export const existProductBrand = async (brand , product) => {
    const productExist = await Product.findOne({brand: brand})
    if(productExist && productExist._id != product.uid){
        console.error(`Product ${brand} is already token`);
        throw new Error(`Product ${brand} is already token`);
    }
}

/*Validate category */
export const existCategoryName = async (name , category) => {
    const categoryExist = await Category.findOne({name: name})
    if(categoryExist && categoryExist._id != category.uid){
        console.error(`Category ${name} is already token`);
        throw new Error(`Category ${name} is already token`);
    }
}

/*Validate user*/
export const existUsername = async (username, user) => {
    const alreadyUser = await User.findOne({ username});
    if (alreadyUser && alreadyUser._id != user.uid) {
        console.error(`Username${username} is already taken`);
        throw new Error(`Username${username} is already taken`);
    }
}

export const existEmail = async (email, user) => {
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser && alreadyUser._id != user.uid) {
        console.error(`Email${email} is already taken`);
        throw new Error(`Email${email} is already taken`);
    }
}

export const notRequiredFiell = async (field) => {
    if(!field) {
        throw new Error(`${field} is not required`);
        
    }
}