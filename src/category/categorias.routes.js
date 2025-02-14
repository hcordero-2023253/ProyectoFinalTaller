import {Router} from 'express';
import {addCategory, viewCategory, viewCategoryById, updateCategory, deleteCategory} from '../category/categorias.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';

const category = Router();

category.get('/',validateJwt, isAdmin, viewCategory);
category.get('/:id',validateJwt, isAdmin, viewCategoryById);
category.post('/addCategory',validateJwt, isAdmin, addCategory);
category.put('/updateCategory/:id',validateJwt, isAdmin, updateCategory);
category.delete('/deleteCategory/:id', validateJwt, isAdmin, deleteCategory);

export default category;