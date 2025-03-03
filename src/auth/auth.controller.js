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

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Invalida user o password'
            });
        }

        const isPasswordValid = await checkPassword(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).send({
                success: false,
                message: 'Invalida user o password'
            });
        }

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

        let id = req.params.id;

        const {newRole} = req.body;
        if(!newRole){
            return res.status(400).send({
                success: false,
                message: "New role is required"
            });
        }
        
        const originalUser = await User.findById(id);
        
        if(!originalUser){
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        
        if(originalUser === newRole){
            return res.status(400).send({
                success: false,
                message: "User already has this role"
            })                
        }

        const user = await User.findByIdAndUpdate(id, {role: newRole}, {new: true, runValidators: true});
        if(!user) return res.status(404).send({
            success: false,
            message: "User not foud" 
        });

        return res.status(200).send({
            success: true,
            message: "Role updated successfully",
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message:'Generar error with update role',
            error: error.message
        })
    }
}

/*Create admin default */
export const createAdminDefault = async () => {
    try {
        let adminExist = await User.findOne({name: process.env.NAME})

        if(adminExist){
            return console.log("Admin already exist");   
        }

        if(!adminExist){
            let admin = new User({
                name: process.env.NAME,
                lastname: process.env.LASTNAME,
                email: process.env.EMAIL,
                username: process.env.BD_USERNAME,
                password: process.env.PASSWORD,
                role: process.env.ROLE
            })
            admin.password = await encrypt(admin.password);
            await admin.save();
            console.log("Admin created")
        }
    } catch (error) {
        console.error(error);
    }
}