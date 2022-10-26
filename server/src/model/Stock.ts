const mongoose = require('mongoose');

const StockSchema = mongoose.Schema({
    symbol: {
        type: String,
        required: true
    }
})

const Stock = mongoose.model('Stock', StockSchema);
export default Stock;