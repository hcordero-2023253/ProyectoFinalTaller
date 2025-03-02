export const deletCount = async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message:'Generar error with delete',error
        })
    }
}