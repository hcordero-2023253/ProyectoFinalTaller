import Product from './productos.model.js'
import { checkPassword, encrypt} from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const addProduct = async (req, res) => {
    const data = req.body
    try {
        const user = await User.findOne({
            _id: data.User
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Cannot edit student'
        });
    }
}
    
}