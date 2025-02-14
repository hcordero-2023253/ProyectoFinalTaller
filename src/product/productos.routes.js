import { Router } from "express";
import {addProduct,viewProduct, updateProduct,deleteProduct, viewProductById} from '../product/productos.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'

const product = Router();

product.get('/',validateJwt, isAdmin, viewProduct)
product.get('/:id',validateJwt, isAdmin, viewProductById)
product.post('/addProdcut',validateJwt, isAdmin, addProduct);
product.put('/updateProduct/:id', validateJwt, isAdmin, updateProduct);
product.delete('/deleteProduct/:id', validateJwt, isAdmin, deleteProduct);

export default product;