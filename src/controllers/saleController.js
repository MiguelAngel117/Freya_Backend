const Sale = require('../models/sale');
const User = require('../models/user')
const Article = require('../models/article');

const createSale = async (req, res) => {
    try {
        const { user_id, articles, address_id } = req.body;
        let totalSale = 0;
        if (articles.length == 0) {
            return res.status(400).send("No hay articulos en el Carrito");
        }

        if (user_id.length !== 24) {
            return res.status(400).send("Invalid user ID length");
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const address = user.shiping_address.id(address_id);
        if (!address) {
            return res.status(404).send("Address not found");
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
                return res.status(400).send(`Insufficient stock for article ${article.name_article} in size ${item.size}`);
            }

            if(item.quantity < 6){
                item.total = item.quantity * article.retail_price;
            }else if(item.quantity < 20){
                item.total += (item.quantity * article.medium_price);
            }else{
                item.total += (item.quantity * article.wholesale_price);
            }
            totalSale += item.total;
            article.stock[sizeIndex].quantity = updatedQuantity;
            await article.save();
        }
        const statusSale = 'CONFIRMADA';
        const newSale = await Sale.create({ user_id, articles, totalSale, statusSale, address_id });
        res.status(201).send({newSale, address});
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

        const salesWithAddresses = await Promise.all(listSales.map(async (sale) => {
            const user = await User.findById(sale.user_id);
            const address = user ? user.shiping_address.id(sale.address_id) : null;
            return { ...sale.toObject(), address };
        }));

        res.status(200).send(salesWithAddresses);
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

        const user = await User.findById(sale.user_id);
        const address = user ? user.shiping_address.id(sale.address_id) : null;
        const saleWithAddress = { ...sale.toObject(), address };

        res.status(200).send(saleWithAddress);
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

        const salesWithAddresses = await Promise.all(sales.map(async (sale) => {
            const user = await User.findById(user_id);
            const address = user ? user.shiping_address.id(sale.address_id) : null;
            return { ...sale.toObject(), address };
        }));

        res.status(200).send(salesWithAddresses);
    } catch (error) {
        console.error("Error finding sales by user ID:", error);
        res.status(500).send("Error finding sales by user ID - Internal Server Error");
    }
}


const updateSaleById = async (req, res) => {
    const { id } = req.params;
    const statusSale = req.body.statusSale;
    statusSale = statusSale.toUpperCase();

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
        }else if(statusSale === 'COMPLETADA'){
            sale.statusSale = statusSale;
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

const salesToDay = async (req, res)=>{
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const ventasDia = await Sale.aggregate([
            {
                $match: {
                    $and: [
                        { createdAt: { $gte: startOfDay, $lt: endOfDay } },
                        { statusSale: { $ne: 'CANCELADA' } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    totalSale: 1,
                    createdAt: 1,
                    articles:1
                }
            },
            {
                $group: {
                    _id: null,
                    quantitySales: { $sum: 1 },
                    totalVentasValor: { $sum: { $toDouble: '$totalSale' } },
                    sales: { $push: '$$ROOT' }
                }
            }
        ]);

        return res.status(200).json({ ventasDia });
    } catch (error) {
        console.error('Error al obtener las ventas del día:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const salesToWeek = async (req, res)=>{
    try {
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);

        const ventasSemana = await Sale.aggregate([
            {
                $match: {
                    $and: [
                        { createdAt: { $gte: startOfWeek, $lt: endOfWeek } },
                        { statusSale: { $ne: 'CANCELADA' } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    totalSale: 1,
                    createdAt: 1,
                    articles: 1,
                    statusSale: 1
                }
            },
            {
                $group: {
                    _id: null,
                    quantitySales: { $sum: 1 },
                    totalValue: { $sum: { $toDouble: '$totalSale' } },
                    sales: { $push: '$$ROOT' }
                }
            }
        ]);

        return res.status(200).json({ ventasSemana });
    } catch (error) {
        console.error('Error al obtener las ventas de la semana:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const salesToMonth = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const ventasMes = await Sale.aggregate([
            {
                $match: {
                    $and: [
                        { createdAt: { $gte: startOfMonth, $lt: endOfMonth } },
                        { statusSale: { $ne: 'CANCELADA' } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    totalSale: 1,
                    createdAt: 1,
                    articles:1,
                    statusSale: 1
                }
            },
            {
                $group: {
                    _id: null,
                    quantitySales: { $sum: 1 },
                    totalValue: { $sum: { $toDouble: '$totalSale' } },
                    sales: { $push: '$$ROOT' }
                }
            }
        ]);

        return res.status(200).json({ ventasMes });
    } catch (error) {
        console.error('Error al obtener las ventas del mes:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { createSale, getSales, getSaleById, updateSaleById, deleteSaleById, getSaleByUserId, salesToDay, salesToWeek, salesToMonth};