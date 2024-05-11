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
    const { id } = req.params;
    const { statusSale } = req.body;

    try {
        if (id.length !== 24) {
            return res.status(400).send("Invalid user ID length");
        }

        
        const sale = await Sale.findById(id);

        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        if (statusSale === 'CANCELADA' && sale.statusSale !== 'CANCELADA') {
            for (const article of sale.articles) {
                const { article_id, size, quantity } = article;
                await Article.updateOne(
                    { _id: article_id, 'stock.size': size },
                    { $inc: { 'stock.$.quantity': quantity } }
                );
            }
            sale.statusSale = statusSale;
        }else if(statusSale === 'COMPLETA'){
            sale.statusSale = statusSale;
            return res.status(200).json({ message: 'Venta Completa' });
        }else{
            return res.status(400).json({ error: 'La Venta ya está Cancelada' });
        }
        await sale.save();
        return res.status(200).json({ message: 'Venta actualizada correctamente', sale });
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

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