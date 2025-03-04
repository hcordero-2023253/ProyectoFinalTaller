import { Schema, model } from "mongoose";

const cartSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: [true, 'Each user can only have one cart'] // Un carrito por usuario
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Actualizar el campo updatedAt antes de cada guardado
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default model('Cart', cartSchema);