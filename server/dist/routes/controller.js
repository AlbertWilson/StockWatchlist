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
    if (watchlist === undefined || watchlist.length == 0) {
        return new Promise(function (resolve, reject) { resolve([]); });
    }
    const stockSymbols = watchlist.map((stock) => { return stock.symbol; });
    const stockData = yahooFinance.quote({
        symbols: stockSymbols,
        modules: ['price']
    }).then((quotes) => {
        return Object.keys(quotes).map((symbol) => {
            const fullStockInfo = {
                companyName: quotes[symbol].price.longName,
                symbol: quotes[symbol].price.symbol,
                todayPrice: quotes[symbol].price.regularMarketPrice,
                todayPriceChange: quotes[symbol].price.regularMarketChange,
                todayPricePercentChange: quotes[symbol].price.regularMarketChangePercent
            };
            return fullStockInfo;
        });
    }).catch((err) => {
        throw err;
    });
    return stockData;
}
function getFullStockDataWeeklyChange(watchlist) {
    const stockSymbols = watchlist.map((stock) => { return stock.symbol; });
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const stockData = yahooFinance.historical({
        symbols: stockSymbols,
        from: oneWeekAgo,
        to: oneWeekAgo,
    }).then((quotes) => {
        const fullStockInfo = {};
        Object.keys(quotes).forEach((symbol) => {
            if (quotes[symbol][0] != undefined) {
                fullStockInfo[symbol] = { price7DaysAgo: quotes[symbol][0].close };
            }
            else {
                fullStockInfo[symbol] = { price7DaysAgo: 'unavailable' };
            }
        });
        return fullStockInfo;
    });
    return stockData;
}
function getFullStockDataMonthlyChange(watchlist) {
    const stockSymbols = watchlist.map((stock) => { return stock.symbol; });
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const stockData = yahooFinance.historical({
        symbols: stockSymbols,
        from: oneMonthAgo,
        to: oneMonthAgo,
    }).then((quotes) => {
        const fullStockInfo = {};
        Object.keys(quotes).forEach((symbol) => {
            if (quotes[symbol][0] != undefined) {
                fullStockInfo[symbol] = { price30DaysAgo: quotes[symbol][0].close };
            }
            else {
                fullStockInfo[symbol] = { price30DaysAgo: 'unavailable' };
            }
        });
        return fullStockInfo;
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
            todayPrice: quote.price.regularMarketPrice,
            todayPriceChange: quote.price.regularMarketChange,
            todayPricePercentChange: quote.price.regularMarketChangePercent
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
controller.route('/stocksFrom7DaysAgo').post(function (req, res) {
    const stocks = Stock_1.default.find((err, stocks) => {
        if (err) {
            res.send(err);
        }
        else {
            const watchlist = () => __awaiter(this, void 0, void 0, function* () {
                return yield getFullStockDataWeeklyChange(stocks).then((watchlist) => {
                    res.send(watchlist);
                });
            });
            watchlist();
        }
    });
});
controller.route('/stocksFrom30DaysAgo').post(function (req, res) {
    const stocks = Stock_1.default.find((err, stocks) => {
        if (err) {
            res.send(err);
        }
        else {
            const watchlist = () => __awaiter(this, void 0, void 0, function* () {
                return yield getFullStockDataMonthlyChange(stocks).then((watchlist) => {
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
        const getStock = () => __awaiter(this, void 0, void 0, function* () { return yield getSingleStock(symbol); });
        try {
            const singleStock = yield getStock();
            stock.save((err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Successfully wrote to db');
                }
            });
            res.send(singleStock);
        }
        catch (err) {
            console.error(err);
            res.status(404).send("error");
        }
    });
});
controller.route('/deleteStock').post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        Stock_1.default.deleteMany({ symbol: req.body.symbol }, function (err) {
            if (err) {
                res.send(err);
            }
            else {
                console.log('Successful deletion');
                res.send('Successfull deletion');
            }
        });
    });
});
module.exports = controller;
//# sourceMappingURL=controller.js.map