"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Loads the configuration from config.env to process.env
// require('dotenv').config({ path: './config.env' });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 9000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(bodyParser.json());
app.use(require('./routes/controller'));
// Global error handling
app.use(function (err, _req, res) {
});
// perform a database connection when the server starts
mongoose.connect('mongodb+srv://admin:hello@cluster0.blihqrn.mongodb.net/?retryWrites=true&w=majority/stock_watchlist.stocks', { useNewUrlParser: true }, () => {
    console.log("Connected to DB!");
});
// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
//# sourceMappingURL=app.js.map