import {body} from 'express-validator';
import { validateErrors, validateErrorsFiles } from './validate.errors.js';
import {existProductName,existProductBrand} from '../utils/db.validator.js'
import {existCategoryName} from '../utils/db.validator.js'
import {existUsername, existEmail} from '../utils/db.validator.js'


/*Product validation */
export const registerValidatorProducto = [
    body('name', 'Name cannot be empty').notEmpty().custom(existProductName),
    body('description', 'Description cannot be empty').notEmpty(),
    body('brand', 'Brand cannot be empty').notEmpty().isLength({max:10}).withMessage('The mark is too long'),
    body('price', 'Price cannot be empty').notEmpty().isDecimal().custom(existProductBrand),
    body('stock', 'Stock cannot be empty').notEmpty().isInt(),
    validateErrors
]

/*Category validation */
export const registerValidatorCategory = [
    body('name', 'Name cannot be empty').notEmpty().custom(existCategoryName),
    body('description', 'Description cannot be empty').notEmpty().isLength({max:1000}).withMessage('The description is too long'),
    body('creation', 'Creation cannot be empty').notEmpty().isDate(),
    validateErrors
]

/*User validation */
export const registerValidatorUser = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('lastname', 'Lastname cannot be empty').notEmpty(),
    body('username','Username cannot be empty').notEmpty().toLowerCase().custom(existUsername),
    body('email', 'Email cannot be empty').notEmpty().isEmail().custom(existEmail),
    body('password','Password cannot be empty').notEmpty().isStrongPassword().withMessage('The Passsword must be strong').isLength({min:8}),
]
