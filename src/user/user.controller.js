import User from '../user/user.model.js';
import { checkPassword, encrypt } from '../../utils/encrypt.js';
import { generateJwt } from '../../utils/jwt.js';

/**Register */
export const registerClient = async (req, res) => {
    try {
        let data = req.body;
        let user = new User(data);
        user.password = await encrypt(user.password);
        user.role = 'CLIENT'
        await user.save();
        return res.send({
            success: true,
            message: `${user.username} created successfully`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error al registrar client',error
        });
    }
}

export const registerAdmin = async (req, res) => {
    try {
        let data = req.body;
        let user = new User(data);
        user.password = await encrypt(user.password);
        await user.save();
        return res.send({
            success: true,
            message: `${user.username} created successfully`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error al registrar usuario',error
        });
    }
}

/**Login */
export const login = async (req, res) => {
    try {
        let {userLoggin, password} = req.body;
        let user = await User.findOne({
            $or:[
                {username: userLoggin},
                {email: userLoggin}
            ]    
        });

        if(user && await checkPassword(user.password, password)){
            let loggerUser={
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
            let token = await generateJwt(loggerUser);
            return res.send({
                success: true,
                message: `Welcome ${user.name} you are logged in`,
                loggerUser,
                token
            })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message:'Generar error with login',error
        })
    }
}

/**Update role */

export const updateRole = async (req, res) => {
    try {
        const {_id, newRole} = req.body;
        const user = await User.findById({_id})
        
        if(!user) return res.status(404).send({
            success: false,
            message: "User not foud" 
        });

        if(user.role !== 'Admin') return res.status(404).send({
            success: false,
            message: "Unauthorized" 
        });

        user.role = newRole;
        await user.save();
        return res.status(200).send({
            success: true,
            message: "Role updated successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message:'Generar error with update role',error
        })
    }
}

/*Create admin default */
export const createAdminDefault = async() => {
    try {
        let adminExist = await User.findOne({name: 'Admin'});

        if(!adminExist){
            let admin = new User({
                name: 'Admin',
                lastname: 'Primero',
                email: 'admin@gmail.com',
                username: 'admin',
                password: 'Admin123',
                role: 'ADMIN'
            })
            admin.password = await encrypt(admin.password);
            await admin.save();
        }
    } catch (error) {
        console.error(error);
    }
}