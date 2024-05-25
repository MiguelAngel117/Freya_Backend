const Article  = require('../models/article');
const Category = require('../models/category');
const cloudinary = require('../helpers/cloudDinary');
const Sale = require('../models/sale');

const getArticles = async (req, res) => {
    try {
        const articleList = await Article.find();
        res.send(articleList);
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).send("Internal server error");
    }
};

const uploadImage = async (req, res) => {
    try {
      if (!req.body.image) {
        return res.status(400).send('No se proporcionó ninguna imagen en base64');
      }
      const base64Image = req.body.image;
  
      const result = await cloudinary.uploader.upload(base64Image, {
        public_id: Date.now(),
        folder: 'articles',
        width: 500,
        height: 500,
        crop: 'fill'
      });
  
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send("ERROR AL SUBIR LA IMAGEN A CLOUDINARY");
      console.log(error);
    }
  };
  

const uploadImageN = async (req, res)=>{
    try {
        console.log(req.file);
        const result = await cloudinary.uploader.upload(req.file.path, {
          public_id: `${req.file.filename}`,
          folder: 'articles',
          with: 500,
          height: 500,
          crop: 'fill'
        });
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send("ERRROR UPLOAD IMAGE");
    }
}

const createArticle = async (req, res) => {
    try {
        const { code_article, name_article, retail_price, medium_price, wholesale_price, description_article, images, stock, category, available, gender, color } = req.body;

        if(category.length === 24){
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).send("Category not found");
            }

            let formattedStock;
            if(stock != undefined){
                formattedStock = stock.map(([size, quantity]) => ({ size, quantity }));
            }else{
                formattedStock = undefined;
            }
            
            const article = new Article({
                code_article,
                name_article,
                retail_price,
                medium_price,
                wholesale_price,
                description_article,
                images,
                stock: formattedStock,
                category,
                available,
                gender, 
                color
            });
            const savedArticle = await article.save();
            res.status(201).send(savedArticle);
        }else{
            res.status(400).send("INCOMPLETE ID");
        }
    } catch (error) {
        console.error("Error creating article:", error);
        res.status(500).send("Internal server error");
    }
}


const deleteArticleById = async (req, res) => {
    try {
        const id = req.params.id;
        if (id.length !== 24) {
            res.status(400).send("INCOMPLETE ID");
            return;
        }

        const isArticleInSale = await Sale.exists({ 'articles.article_id': id });
        if (isArticleInSale) {
            res.status(400).send("Article is associated with a sale and cannot be deleted");
            return;
        }

        const deletedArticle = await Article.findByIdAndDelete(id);
        if (!deletedArticle) {
            res.status(404).send("Article not found to delete");
            return;
        }
        
        res.status(200).send("Article deleted successfully");
    } catch (error) {
        console.error("Error deleting Article by ID:", error);
        res.status(500).send("Error deleting Article by ID - Internal Server Error");
    }
}  

const getArticle = async (req, res) => {
    try {
        const { id } = req.params;
        if(id.length === 24){
            const article = await Article.findById(id);
            if (!article) {
                return res.status(404).send("Article not found");
            }
            res.send(article);
        }else{
            return res.status(400).send("Invalid article ID format");
        }
    } catch (error) {
        console.error("Error searching article by ID:", error);
        res.status(500).send("Internal server error");
    }
};

const setArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const {code_article, name_article, retail_price, medium_price, wholesale_price, description_article, images, stock, size_guide, category, available, gender } = req.body;

        if(id.length === 24){
            if(category != undefined){
                if(category.length == 24){
                    const existingCategory = await Category.findById(category);
                    if (!existingCategory) {
                        return res.status(404).send("Category not found");
                    }
                }else{
                    return res.status(400).send("Invalid CATEGORY_ID");
                }
            }
            let formattedStock;
            if(stock != undefined){
                formattedStock = stock.map(([size, quantity]) => ({ size, quantity }));
            }else{
                formattedStock = undefined;
            }
            const updatedArticle = await Article.findByIdAndUpdate(
                id,
                {
                    code_article,
                    name_article,
                    retail_price,
                    medium_price,
                    wholesale_price,
                    description_article,
                    images,
                    stock: formattedStock,
                    category,
                    available,
                    gender,
                    size_guide
                },
                { new: true }
            );
    
            if (!updatedArticle) {
                return res.status(404).send("Article not found");
            }
    
            res.send(updatedArticle);            
        }else{
            return res.status(400).send("Invalid article ID");
        }
    } catch (error) {
        console.error("Error updating article:", error);
        res.status(500).send("Internal server error");
    }
};

const searchArticlesByName = async (req, res) => {
    try {
        const searchTerm = req.query.name_article;
        if (!searchTerm) {
            return res.status(400).send("Se requiere un término de búsqueda");
        }

        const matchedArticles = await Article.find({ name_article: { $regex: searchTerm, $options: 'i' } });

        if (matchedArticles.length === 0) {
            return res.status(404).send("No se encontraron artículos que coincidan con la búsqueda");
        }

        res.status(200).send(matchedArticles);
    } catch (error) {
        console.error("Error al buscar artículos por nombre:", error);
        res.status(500).send("Error al buscar artículos por nombre - Error interno del servidor");
    }
}

const searchArticlesByNameAndCategory = async (req, res) => {
    try {
        const searchTerm = req.query.name_article;
        const categoryId = req.query.category;

        if (!searchTerm && !categoryId) {
            return res.status(400).send("Se requiere al menos un término de búsqueda");
        }

        const searchCriteria = {};
        if (searchTerm) {
            searchCriteria.name_article = { $regex: searchTerm, $options: 'i' };
        }
        if (categoryId) {
            searchCriteria.category = categoryId;
        }
        const matchedArticles = await Article.find(searchCriteria);

        if (matchedArticles.length === 0) {
            return res.status(404).send("No se encontraron artículos que coincidan con la búsqueda");
        }
        res.status(200).send(matchedArticles);
    } catch (error) {
        console.error("Error al buscar artículos por nombre y/o categoría:", error);
        res.status(500).send("Error al buscar artículos por nombre y/o categoría - Error interno del servidor");
    }
}

const getArticleByGender = async (req, res)=>{
    try {
        const searchTerm = req.query.gender;
        
        if (!searchTerm) {
            return res.status(400).send("Se requiere un término de búsqueda");
        }
        const term = (searchTerm == "F") ? "FEMALE" : "MALE";
        const filterArticles = await Article.find({gender: term});

        if (filterArticles.length === 0) {
            return res.status(404).send("No se encontraron artículos que coincidan con la búsqueda");
        }

        res.status(200).send(filterArticles);
    } catch (error) {
        console.error("Error al buscar artículos por nombre:", error);
        res.status(500).send("Error al buscar artículos por nombre - Error interno del servidor");
    }
}

const searchArticlesByPriceRange = async (req, res) => {
    try {
        const minPrice = parseFloat(req.query.min_price);
        const maxPrice = parseFloat(req.query.max_price);

        if (!minPrice || !maxPrice || minPrice >= maxPrice) {
            return res.status(400).send("Se requieren un rango de precios válido (min_price < max_price)");
        }

        const matchedArticles = await Article.find({
            retail_price: { $gte: minPrice, $lte: maxPrice }
        });

        if (matchedArticles.length === 0) {
            return res.status(404).send("No se encontraron artículos en el rango de precios especificado");
        }

        res.status(200).send(matchedArticles);
    } catch (error) {
        console.error("Error al buscar artículos por rango de precios:", error);
        res.status(500).send("Error al buscar artículos por rango de precios - Error interno del servidor");
    }
}

const searchArticlesByCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Se requiere el ID de la categoría para la búsqueda");
        }

        const matchedArticles = await Article.find({ category: id });

        if (matchedArticles.length === 0) {
            return res.status(404).send("No se encontraron artículos en esta categoría");
        }

        res.status(200).send(matchedArticles);
    } catch (error) {
        console.error("Error al buscar artículos por categoría:", error);
        res.status(500).send("Error al buscar artículos por categoría - Error interno del servidor");
    }
}

const searchArticlesByCategoryName = async (req, res) => {
    try {
        const categoryName = req.query.category;

        if (!categoryName) {
            return res.status(400).send("Se requiere el nombre de la categoría para la búsqueda");
        }
        const matchedCategories = await Category.find({ name_category: new RegExp(categoryName, 'i') });
        if (matchedCategories.length === 0) {
            return res.status(404).send("No se encontraron categorías que coincidan con el nombre proporcionado");
        }

        const categoryIds = matchedCategories.map(category => category._id);
        const matchedArticles = await Article.find({ category: { $in: categoryIds } });

        if (matchedArticles.length === 0) {
            return res.status(404).send("No se encontraron artículos en las categorías coincidentes");
        }

        res.status(200).send(matchedArticles);
    } catch (error) {
        console.error("Error al buscar artículos por categoría:", error);
        res.status(500).send("Error al buscar artículos por categoría - Error interno del servidor");
    }
}

const getArticleByGenderAndCategory = async (req, res)=>{
    try {
        const gender = req.query.gender;
        const category = req.query.category;

        if (!gender && !category) {
            return res.status(400).send("Se requieren dos terminos de búsqueda");
        }
        const articlesFind = await Article.find({gender, category});

        if (articlesFind.length === 0) {
            return res.status(404).send("No se encontraron artículos que coincidan con la búsqueda");
        }
        res.status(200).send(articlesFind);
    } catch (error) {
        console.error("Error al buscar artículos por nombre y/o categoría:", error);
        res.status(500).send("Error al buscar artículos por nombre y/o categoría - Error interno del servidor");
    }
}

module.exports = {getArticles, getArticle, createArticle, deleteArticleById, setArticle, searchArticlesByName, searchArticlesByNameAndCategory, searchArticlesByCategory, searchArticlesByPriceRange, uploadImage, getArticleByGender, getArticleByGenderAndCategory, uploadImageN, searchArticlesByCategoryName};