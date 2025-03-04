import Cart from './cart.model.js'
import Product from '../product/productos.model.js'
import User from '../user/user.model.js'


export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        const userId = req.user._id || req.user.id || req.user.uid; 

        if(!productId || !quantity ) {
            return res.status(400).send({
                success: false,
                message: 'Product ID and quantity are required'
            });
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).send({
                success: false,
                message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
            });
        }

        let cart = await Cart.findOne({ user: userId });
        if(cart){
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if(itemIndex != -1){
                const newQuantity = cart.items[itemIndex].quantity + quantity;
                if(product.stock < newQuantity){
                    return res.status(400).send({
                        success: false,
                        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                    });
                }
                cart.items[itemIndex].quantity = newQuantity;
            }else{
                if(product.stock < quantity){
                    return res.status(400).send({
                        success: false,
                        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                    });
                }
                cart.items.push({ product: productId, quantity: quantity });
            }
        }else{
            cart = new Cart({
                user: userId,
                items: [{product: productId, quantity}]
            });
            
        }
        
        product.stock -= quantity;
        await product.save();

        await cart.save();
        await cart.populate('items.product', 'name price');

        return res.status(200).send({
            success: true,
            message: 'Product added to cart',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error adding product to cart',
            error: error.message
        });
    }
}

export const viewCart = async (req, res) => {
    try {
        const userId = req.user.uid;
        const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price');
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found'
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Cart retrieved successfully',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error retrieving cart',
            error: error.message
        });
    }
}

export const updateCart = async (req, res) => {
    try {
        console.log('Headers recibidos:', JSON.stringify(req.headers, null, 2));
        console.log('Parsed request body:', JSON.stringify(req.body, null, 2));

        const userId = req.user._id || req.user.id || req.user.uid;

        if (!userId) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized'
            });
        }

        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Invalid request: items must be a non-empty array'
            });
        }

        const parsedItems = items.map(item => ({
            productId: item.productId,
            quantity: Number(item.quantity)
        }));

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found'
            });
        }

        for (const item of parsedItems) {
            const { productId, quantity } = item;

            if (!productId || typeof quantity !== 'number' || isNaN(quantity)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid request: productId and quantity are required, and quantity must be a number'
                });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: `Product ${productId} not found`
                });
            }

            if (quantity < 0) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid quantity: must be 0 or more'
                });
            }

            const cartItemIndex = cart.items.findIndex(cartItem => 
                cartItem.product.toString() === productId.toString()
            );

            if (cartItemIndex === -1 && quantity > 0) {
                if (product.stock < quantity) {
                    return res.status(400).send({
                        success: false,
                        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                    });
                }
                cart.items.push({ product: productId, quantity });
            } else if (cartItemIndex !== -1) {
                const currentQuantity = cart.items[cartItemIndex].quantity;

                if (quantity === 0) {
                    cart.items.splice(cartItemIndex, 1);
                    product.stock += currentQuantity;
                } else if (quantity > currentQuantity) {
                    const increase = quantity - currentQuantity;

                    if (product.stock < increase) {
                        return res.status(400).send({
                            success: false,
                            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                        });
                    }

                    product.stock -= increase;
                    cart.items[cartItemIndex].quantity = quantity;
                } else if (quantity < currentQuantity) {
                    const decrease = currentQuantity - quantity;
                    product.stock += decrease;
                    cart.items[cartItemIndex].quantity = quantity;
                }
            }

            await product.save();
        }

        await cart.save();
        await cart.populate('items.product', 'name price stock');

        return res.status(200).send({
            success: true,
            message: 'Cart updated successfully',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error updating cart',
            error: error.message
        });
    }
};

export const cancelCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id || req.user.uid;

        if (!userId) {
            return res.status(401).send({
                success: false,
                message: 'User not authenticated or invalid token'
            });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({
                success: false,
                message: 'Cart not found'
            });
        }

        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        cart.items = [];
        await cart.save();

        return res.status(200).send({
            success: true,
            message: 'Cart canceled successfully',
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error canceling cart',
            error: error.message
        });
    }
};