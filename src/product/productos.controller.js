import Product from './productos.model.js'
import Category from '../category/categorias.model.js'

export const addProduct = async (req, res) => {
    try{
        let data = req.body;
        let product = new Product(data);
        await product.save();
        return res.status(201).send({
            success: true,
            message: `${product.name} created successfully`, product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Cannot add product' , error
        });
    }
}

export const viewProduct = async (req, res) => {
    const { limit, skip } = req.query;
    try {
        const products = await Product.find().skip(skip).limit(limit);

        if(products.length === 0) return res.status(404).send({
            success: false,
            message: 'No products found'
        })

        return res.status(200).send({
            success: true,
            message: 'Products found',
            total: products.length,
            products
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Cannot add product ',error
        });
    }
}

export const viewProductById = async (req, res) => {
    try {
        let id = req.params.id;
        let product = await Product.findById(id);
        if(!product) return res.status(404).send({
            success: false,
            message: 'Product not found'
        });
        return res.status(200).send({
            success: true,
            message: 'Product found',
            product
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Cannot add product ',error
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        let product = await Product.findByIdAndUpdate(id, data, { new: true });
        return res.status(200).send({
            success: true,
            message: `${product.name} updated successfully`, product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Cannot add product ', error
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        let id = req.params.id;
        let product = await Product.findByIdAndDelete(id);
        return res.status(200).send({
            success: true,
            message: `${product.name} deleted successfully`, product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Cannot add product ', error
        });
    }
}