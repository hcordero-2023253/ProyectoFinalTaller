import { Router } from "express";
import { addToCart,viewCart, updateCart, cancelCart} from "./cart.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const cart = Router();

cart.get('/viewCart', validateJwt, viewCart);
cart.post('/addCart', validateJwt, addToCart);
cart.put('/updateCart/:id', validateJwt, updateCart);
cart.delete('/deleteCart/:id', validateJwt, cancelCart);

export default cart;