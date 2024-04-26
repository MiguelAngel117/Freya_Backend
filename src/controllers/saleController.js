const Sale = require('../models/sale');
const User = require('../models/user')
const Article = require('../models/article');

const createSale = async (req, res) => {
    try {
        const { user_id, articles, totalSale, statusSale } = req.body;
        if (user_id.length !== 24) {
            return res.status(400).send("Invalid user ID length");
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        for (const item of articles) {
            if (item.article_id.length !== 24) {
                return res.status(400).send("Invalid article ID length");
            }

            const article = await Article.findById(item.article_id);
            if (!article) {
                return res.status(404).send("Article not found");
            }

            const sizeIndex = article.stock.findIndex(stockItem => stockItem.size === item.size);
            if (sizeIndex === -1) {
                return res.status(400).send(`Size ${item.size} not found for article ${item.article_id}`);
            }

            const updatedQuantity = article.stock[sizeIndex].quantity - item.quantity;
            if (updatedQuantity < 0) {
                return res.status(400).send(`Insufficient stock for article ${item.article_id} in size ${item.size}`);
            }

            article.stock[sizeIndex].quantity = updatedQuantity;
            await article.save();
        }

        const newSale = await Sale.create({ user_id, articles, totalSale, statusSale });
        res.status(201).send(newSale);
    } catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).send("Error creating sale - Internal Server Error");
    }
}

const getSales = async (req, res) => {
    try {
        const listSales = await Sale.find();
        if (listSales.length === 0) {
            res.status(200).send("NO SALES REGISTERED");
            return;
        }
        res.status(200).send(listSales);
    } catch (error) {
        console.error("Error getting sales:", error);
        res.status(500).send("Error getting sales - Internal Server Error");
    }
}

const getSaleById = async (req, res) => {
    try {
        const id = req.params.id;
        if (id.length !== 24) {
            res.status(400).send("Invalid ID length");
            return;
        }
        const sale = await Sale.findById(id);
        if (!sale) {
            res.status(404).send("Sale not found");
            return;
        }
        res.status(200).send(sale);
    } catch (error) {
        console.error("Error getting sale by ID:", error);
        res.status(500).send("Error getting sale by ID - Internal Server Error");
    }
}

const getSaleByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (user_id.length !== 24) {
            return res.status(400).send("Invalid user ID length");
        }
    
        const sales = await Sale.find({ user_id });

        if (!sales || sales.length === 0) {
            return res.status(404).send("No sales found for this user ID");
        }

        res.status(200).send(sales);
    } catch (error) {
        console.error("Error finding sales by user ID:", error);
        res.status(500).send("Error finding sales by user ID - Internal Server Error");
    }
};


const updateSaleById = async (req, res) => {
    try {
        const {articles } = req.body;
        const {id} = req.params;
        if (id.length !== 24) {
            return res.status(400).send("Invalid sale ID length");
        }

        const sale = await Sale.findById(id);
        if (!sale) {
            return res.status(404).send("Sale not found");
        }

        for (const item of articles) {
            if (item.article_id.length !== 24) {
                return res.status(400).send("Invalid article ID length");
            }

            const article = await Article.findById(item.article_id);
            if (!article) {
                return res.status(404).send("Article not found");
            }

            const sizeIndex = article.stock.findIndex(stockItem => stockItem.size === item.size);
            if (sizeIndex === -1) {
                return res.status(400).send(`Size ${item.size} not found for article ${item.article_id}`);
            }

            // Calculate the difference in quantity to update stock
            const currentQuantity = article.stock[sizeIndex].quantity;
            const quantityDifference = item.quantity - currentQuantity;

            // Update article stock
            article.stock[sizeIndex].quantity = item.quantity;
            await article.save();

            // Update total sale based on quantity difference
            sale.totalSale += quantityDifference * article.price;
        }

        // Update sale status if provided
        if (req.body.statusSale) {
            sale.statusSale = req.body.statusSale;
        }

        // Save updated sale
        await sale.save();

        res.status(200).send(sale);
    } catch (error) {
        console.error("Error updating sale:", error);
        res.status(500).send("Error updating sale - Internal Server Error");
    }
}



const deleteSaleById = async (req, res) => {
    try {
        const id = req.params.id;
        if (id.length !== 24) {
            res.status(400).send("Invalid ID length");
            return;
        }
        const deletedSale = await Sale.findByIdAndDelete(id);
        if (!deletedSale) {
            res.status(404).send("Sale not found to delete");
            return;
        }
        res.status(200).send("Sale deleted successfully");
    } catch (error) {
        console.error("Error deleting sale by ID:", error);
        res.status(500).send("Error deleting sale by ID - Internal Server Error");
    }
}

module.exports = { createSale, getSales, getSaleById, updateSaleById, deleteSaleById, getSaleByUserId };