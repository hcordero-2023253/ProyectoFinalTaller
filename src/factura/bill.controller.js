import Bill from "./bill.model.js"
import Cart from "../cart/cart.model.js"
import Product from "../product/productos.model.js"
import User from "../user/user.model.js"

export const buyProduct = async (req, res) => {
    try {
        const userId = req.user.id || req.user.id || req.user.uid;

        if(!userId){
            return res.status(401).send({
                success: false,
                message: 'User not authenticated or invalid token'
            });   
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price stock');
        if (!cart || cart.items.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Cart is empty or not found'
            });
        }

        let total = 0;
        const billItems = [];

        for (const item of cart.items) {
            const product = item.product;
            if (product.stock < item.quantity) {
                return res.status(400).send({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                });
            }

            product.stock -= item.quantity;
            await product.save();

            billItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
            total += product.price * item.quantity;
        }

        const bill = new Bill({
            user: userId,
            items: billItems,
            total
        });

        await bill.save();

        cart.items = [];
        await cart.save();

        await bill.populate('items.product', 'name price');

        return res.status(200).send({
            success: true,
            message: 'Purchase completed successfully',
            bill
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error completing purchase',
            error: error.message
        });
    }
}

export const updatebill = async (req, res) => {
        console.log('Request params:', JSON.stringify(req.params, null, 2));
        console.log('Parsed request body:', JSON.stringify(req.body, null, 2));
    try {
        const userId = req.user._id || req.user.id || req.user.uid;
        const { id: billId } = req.params;
        const { items } = req.body;

        if (!userId) {
            return res.status(401).send({
                success: false,
                message: 'User not authenticated or invalid token'
            });
        }

        if (!billId || !items || !Array.isArray(items)) {
            return res.status(400).send({
                success: false,
                message: 'bill ID and items are required, and items must be an array'
            });
        }
        
        const bill = await Bill.findOne({ _id: billId, user: userId });
        if (!bill) {
            return res.status(404).send({
                success: false,
                message: 'bill not found or unauthorized'
            });
        }
        
        const currentItems = new Map(bill.items.map(item => [item.product.toString(), item.quantity]));
        let newTotal = 0;

        for (const item of items) {
            const { productId, quantity } = item;
            if (!productId || typeof quantity !== 'number' || quantity < 0) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid product ID or quantity'
                });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: `Product ${productId} not found`
                });
            }

            const currentQuantity = currentItems.get(productId.toString()) || 0;

            if (quantity > currentQuantity) {
                const increase = quantity - currentQuantity;
                if (product.stock < increase) {
                    return res.status(400).send({
                        success: false,
                        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                    });
                }
                product.stock -= increase;
            } else if (quantity < currentQuantity) {
                const decrease = currentQuantity - quantity;
                product.stock += decrease;
            }

            await product.save();
            newTotal += product.price * quantity;
        }

        bill.items = await Promise.all(items.map(async (item) => ({
            product: item.productId,
            quantity: item.quantity,
            price: (await Product.findById(item.productId)).price
        })));
        bill.total = newTotal;
        await bill.save();

        await bill.populate('items.product', 'name price');

        return res.status(200).send({
            success: true,
            message: 'bill updated successfully',
            bill
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error updating bill',
            error: error.message
        });
    }
};

// Visualizar facturas de un usuario
export const viewBills = async (req, res) => {
    const { userId } = req.query;
    try {
        if(!userId) {
            return res.status(400).send({
                success: false,
                message: 'bill is required'
            });
        }

        const bill =  await Bill.find({user: userId}).populate('items.product','name price').populate('user');
        if(bill.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No bills found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Bills retrieved successfully',
            total: bill.length,
            bill
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error view bill',
            error: error.message
        });
    }

}