import User from './user.model.js';

export const deleteAccount = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ 
                success: false,
                message: 'User not found' 
            });
        }

        console.log(user);
        console.log(user.password);
        const {confirmation, password} = req.body
        if (!confirmation || !password) {
            return res.status(400).send({
                success: false,
                message: 'Confirmation and password are required'
            });
        }
        
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(400).send({
                success: false,
                message: 'Invalid password'
            });
        }

        await User.findByIdAndDelete(id)
        
        res.status(200).send({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message:'Generar error with delete',
            error: error.message
        })
    }
}