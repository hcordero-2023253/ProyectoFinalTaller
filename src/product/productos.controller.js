import Product from './productos.model.js'
import Category from '../category/categorias.model.js'
import User from '../user/user.model.js'

export const addProduct = async (req, res) => {
    try {
        let data = req.body;
        

        if (!data.name || !data.price || !data.category ) {
            return res.status(400).send({
                success: false,
                message: 'Name, price, category are required'
            });
        }

        let existingProduct = await Product.findOne({ name: data.name }).populate('category');
        if (existingProduct) {
            existingProduct.stock += 1;
            await existingProduct.save();
            return res.status(200).send({
                success: true,
                message: `Stock increased for ${existingProduct.name}`,
                product: existingProduct
            });
        }

        let category = await Category.findById(data.category);
        if (!category) {
            return res.status(404).send({ 
                success: false, 
                message: 'Category not found' 
            });
        }

        let product = new Product({...data, stock: 1});
        await product.save();

        return res.status(201).send({
            success: true,
            message: `${product.name} created successfully`,
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false, 
            message: 'Cannot add product',
            error: error.message
        });
    }
}

export const viewProduct = async (req, res) => {
    const { limit, skip, stockLevel, category, name, minPrice, maxPrice, saleSort } = req.query;
    try {

        let query = {}

        /*Filtrado por stock si es menor a 5 es que esta bajo y si 
        es 0 es que esta agotado */
        if(stockLevel){
            const lowStock = 5;
            const outStock = 0;
            if(stockLevel.toLoweCase() === 'low'){
                query.stock = { $lte: lowStock };
            }else if(stockLevel.toLoweCase() === 'out'){
                query.stock = { $lte: outStock };
            }
        }

        if( category ){
            query.category = category;
        }

        if(name){      //Busqueda principal  |   insensible a mayusculas/minusculas
            query.name = { $regex: name, $options: 'i' };
        }

        /*Filtrado por medio del rango de precio mayor o menor */
        if(minPrice && maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = parseFloat(minPrice);
            if(maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        let sort = {}
        if(saleSort && saleSort.toLoweCase() === 'desc'){
            sort.sales = -1;
        }else if (saleSort && saleSort.toLoweCase() === 'asc'){
            sort.sales = 1;
        }

        const products = await Product.find().skip(skip).limit(limit).populate({path: 'category', select: 'name'}).sort(sort);

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
            message: 'Cannot add product ',
            error: error.message
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

        if(data.stock !== undefined && data.stock < 0) {
            return res.status(400).send({
                success: false,
                message: 'Stock cannot be negative'
            });
        }

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

        if(!product){
            return res.status(404).send({
                success: false,
                message: 'The product has already been removed'
            });
        }

        await Product.findByIdAndDelete(id);

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