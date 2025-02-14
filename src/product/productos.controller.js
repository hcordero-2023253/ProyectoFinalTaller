import Product from './productos.model.js'
import User from '../user/user.model.js'
import { checkPassword, encrypt} from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import { registerValidatorUser } from '../../middlewares/validators.js'


export const addProduct = async (req, res) => {
    const data = req.body
    try {
        const user = await User.fingOner({
            _id: data.employee,
            role: 'ADMIN'
        })

        if (!user) return res.status(403).send(
            {
                success: false,
                message: 'keeper not found or access denied'
            }
        )

        const product = new Product(data)
        await product.save()
        res.status(201).send({
            success: true,
            message: `${product.name} saved successfully`,
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Cannot add product '
        });
    }
}
    
