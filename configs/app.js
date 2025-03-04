'use strict'

import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import { limiter } from "../middlewares/rate.limit.js"
import authRoutes from "../src/auth/auth.routes.js"
import productRoutes from "../src/product/productos.routes.js"
import categoryRoutes from "../src/category/categorias.routes.js"
import userRoutes from "../src/user/user.routes.js"
import cartRoutes from "../src/cart/cart.routes.js"
import billRoutes from "../src/factura/bill.routes.js"


const configs = (app)=>{
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(helmet())
    app.use(morgan('dev'));
    app.use(limiter)
}

const routes = (app) => {
    app.use('/v1/user', authRoutes);
    app.use('/v1/product', productRoutes);
    app.use('/v1/category', categoryRoutes);
    app.use('/v1/users', userRoutes);
    app.use('/v1/cart', cartRoutes);
    app.use('/v1/bill', billRoutes);
}


export const initServer = ()=>{
    const app = express();
    try {
        configs(app);
        routes(app);
        app.listen(process.env.PORT)
        console.log(`Servidor iniciado en el puerto ${process.env.PORT}`)
    } catch (error) {
        console.log('Server init failed', error);
        
    }
}