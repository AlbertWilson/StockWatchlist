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
function getFullStockDataDailyChange(watchlist) {
    const stockSymbols = watchlist.map((stock) => { return stock.symbol; });
    const stockData = yahooFinance.quote({
        symbols: stockSymbols,
        modules: ['price']
    }).then((quotes) => {
        return Object.keys(quotes).map((symbol) => {
            const fullStockInfo = {
                companyName: quotes[symbol].price.longName,
                symbol: quotes[symbol].price.symbol,
                price: quotes[symbol].price.regularMarketPrice,
                priceChange: quotes[symbol].price.regularMarketChange,
                pricePercentChange: quotes[symbol].price.regularMarketChangePercent
            };
            return fullStockInfo;
        });
    });
    return stockData;
}
function getSingleStock(symbol) {
    const stockData = yahooFinance.quote({
        symbol: symbol,
        modules: ['price']
    }).then((quote) => {
        const fullStockInfo = {
            companyName: quote.price.longName,
            symbol: quote.price.symbol,
            price: quote.price.regularMarketPrice,
            priceChange: quote.price.regularMarketChange,
            pricePercentChange: quote.price.regularMarketChangePercent
        };
        return fullStockInfo;
    });
    return stockData;
}
controller.route('/stocks').get(function (req, res) {
    const stocks = Stock_1.default.find((err, stocks) => {
        if (err) {
            res.send(err);
        }
        else {
            const watchlist = () => __awaiter(this, void 0, void 0, function* () {
                return yield getFullStockDataDailyChange(stocks).then((watchlist) => {
                    res.send(watchlist);
                });
            });
            watchlist();
        }
    });
});
controller.route('/addStock').post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const symbol = req.body.symbol;
        const stock = new Stock_1.default({
            symbol: symbol
        });
        stock.save((err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Successfully wrote to db');
            }
        });
        const getStock = () => __awaiter(this, void 0, void 0, function* () {
            return yield getSingleStock(symbol).then((singleStock) => {
                res.send(singleStock);
            });
        });
        getStock();
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