const categoryModel = require('../models/category');

const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name_category, url_icon, url_image } = req.body;
        const newCategory = new categoryModel({ name_category, url_icon, url_image });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if(id.length === 24){
            const category = await categoryModel.findById(req.params.id);
            if (!category) {
                res.status(404).send("Category not found");
                return;
            }
            res.status(200).send(category);
        }else{
            res.status(400).send("INCOMPLETE ID");
        }
    } catch (error) {
        console.error("Error getting store by ID:", error);
        res.status(500).send("Error getting store by ID - Internal Server Error");
    }
};

const updateCategory = async(req, res) =>{
    try {
        const { id } = req.params;
        const { name_category, url_icon, url_image } = req.body;
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, { name_category, url_icon, url_image }, { new: true });
        if(!updatedCategory){
            return res.status(404).send("CATEGORY NOT FOUND");
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteCategory = async(req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const sortCategories =  async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({ name_category: 1 }); // Orden ascendente
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const searchCategoriesByName = async (req, res) => {
    try {
        const searchTerm = req.query.name_category;
        if (!searchTerm) {
            res.status(400).send("A search term is required");
            return;
        }
        const matchedCategory = await categoryModel.find({ name_category: { $regex: searchTerm, $options: 'i' } });
        if (matchedCategory.length === 0) {
            return res.status(404).send("No categories found matching the search");
        }
        res.status(200).send(matchedCategory);
    } catch (error) {
        console.error("Error searching caegories by name:", error);
        res.status(500).send("Error searching stores by name - Internal Server Error");
    }
}
module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory, searchCategoriesByName, sortCategories };