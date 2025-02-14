import Category from './categorias.model.js'

export const addCategory = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.status(201).send({ 
            success:true,
            message: `${category.name} created successfully`, category 
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Cannot add category ', error
        });
    }
}

export const viewCategory = async (req, res) => {
    const { limit, skip } = req.query
    try {
        const categories = await Category.find().limit(limit).skip(skip)

        if(categories.length === 0) return res.status(404).send({
            success: false,
            message: 'No categories found',animal
        })

        return res.send({
            success: true,
            message: 'Categories found',
            total: categories.length,
            categories
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Not found category ', error
        });
    }
}

export const viewCategoryById = async (req, res) => {
    try {
        let id = req.params.id
        let category = await Category.findById(id)
        if(!category) return res.status(404).send({
            success: false,
            message: 'Category not found', category 
        })
        return res.send({
            success: true,
            message: 'Category found', category
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Not found category ', error
        });
    }
}

export const updateCategory = async (req, res) => {
    try {
        let id = req.params.id
        let data = req.body;
        let category = await Category.findByIdAndUpdate(id, data, {new: true})
        return res.send({
            success: true,
            message: `${category.name} updated successfully`, category
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Not found category ', error
        });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        let id = req.params.id
        let category = await Category.findByIdAndDelete(id)
        if(category._id ===  category)
        return res.send({
            success: true,
            message: `${category.name} deleted successfully`, category
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Not found category ', error
        });
    }
}

/*Agregar una categoria por defecto */
export const addDefaultCategory = async() => {
    try {
        const categoryExist = await Category.findOne({name: 'Default Category'})

        if (!categoryExist) {
            let category = new Category({
                name: 'Default',
                description: 'Default category',
            });
            await category.save()
        }
    } catch (error) {
        console.error(error);
    }
}