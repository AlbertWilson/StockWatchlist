"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const controller = express.Router();
const Stock_1 = __importDefault(require("../model/Stock"));
const app = express();
var yahooFinance = require('yahoo-finance');
function getFullStockData(stockSymbol) {
    const stockData = yahooFinance.quote({
        symbol: stockSymbol,
        modules: ['price']
    }).then((quotes) => {
        const fullStock = {
            symbol: stockSymbol,
            price: quotes.price.regularMarketPrice
        };
        return fullStock;
    });
    return stockData;
}
exports.default = getFullStockData;
controller.route('/stocks').get(function (req, res) {
    const stocks = Stock_1.default.find((err, stocks) => {
        if (err) {
            res.send(err);
        }
        else {
            const watchlist = stocks.map((stock) => __awaiter(this, void 0, void 0, function* () {
                return yield getFullStockData(stock.symbol);
            }));
            Promise.all(watchlist).then((watchlist) => (res.send(watchlist)));
        }
    });
});
controller.route('/addStock').post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const stock = new Stock_1.default({
            symbol: req.body.symbol
        });
        // maybe ensure that we don't add a stock that is already there
        stock.save((err) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send('Successfully wrote to db');
            }
        });
    });
});
controller.route('/deleteStock').post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // seems to be a bug if I try to delete a stock that isn't there
        Stock_1.default.deleteMany({ symbol: req.body.symbol }, function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send('Successfull deletion');
            }
        });
    });
});
module.exports = controller;
//# sourceMappingURL=controller.js.map