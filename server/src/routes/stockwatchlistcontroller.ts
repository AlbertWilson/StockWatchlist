const express = require('express');
const stockwatchlistcontroller = express.Router();
import User from '../model/UserSchema';
import FullStockData from '../model/FullStockData';
import verifyJWT from '../util/verifyJWT';
import { ObjectId } from 'mongodb';
const app = express();
const jwt = require("jsonwebtoken");

var yahooFinance = require('yahoo-finance');

function getFullStockDataDailyChange(watchlist:String[]): Promise<FullStockData[]> {
  if (watchlist === undefined || watchlist.length == 0){
    return new Promise<any>(function(resolve, reject){resolve([]);});
  }

  const stockData:Promise<FullStockData[]> = yahooFinance.quote({
      symbols: watchlist,
      modules: ['price']
    }).then((quotes) => {
      return Object.keys(quotes).map((symbol:any) => {
        const fullStockInfo:FullStockData = {
          companyName: quotes[symbol].price.longName,
          symbol: quotes[symbol].price.symbol,
          todayPrice: quotes[symbol].price.regularMarketPrice,
          todayPriceChange: quotes[symbol].price.regularMarketChange,
          todayPricePercentChange: quotes[symbol].price.regularMarketChangePercent
        }
        return fullStockInfo;
      })
    }).catch((err:Error) => {
      throw err;
    });
  return stockData;
}

function getFullStockDataWeeklyChange(watchlist:FullStockData[]): Promise<FullStockData[]> {
  if (watchlist === undefined || watchlist.length == 0){
    return new Promise<any>(function(resolve, reject){resolve([]);});
  }
  const stockSymbols = watchlist.map((stock) => {return stock.symbol});
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const stockData:Promise<FullStockData[]> = yahooFinance.historical({
      symbols: stockSymbols,
      from: oneWeekAgo,
      to: oneWeekAgo,
    }).then((quotes) => {
      return watchlist.map((stock) => {
        if (quotes[stock.symbol][0] != undefined){
          stock.price7DaysAgo = quotes[stock.symbol][0].close;
        } else {
          stock.price7DaysAgo = 'unavailable';
        }
        return stock;
      })
    });
  return stockData;
}

function getFullStockDataMonthlyChange(watchlist:FullStockData[]): Promise<FullStockData[]> {
  if (watchlist === undefined || watchlist.length == 0){
    return new Promise<any>(function(resolve, reject){resolve([]);});
  }
  const stockSymbols = watchlist.map((stock) => {return stock.symbol});
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  const stockData:Promise<FullStockData[]> = yahooFinance.historical({
    symbols: stockSymbols,
    from: oneMonthAgo,
    to: oneMonthAgo,
  }).then((quotes) => {
    return watchlist.map((stock) => {
      if (quotes[stock.symbol][0] != undefined){
        stock.price30DaysAgo = quotes[stock.symbol][0].close;
      } else {
        stock.price30DaysAgo = 'unavailable';
      }
      return stock;
    })
  });
return stockData;
}

stockwatchlistcontroller.route('/stocks').get(verifyJWT, async function (req, res){
  const userId:ObjectId = new ObjectId(req.user.id);

  User.findOne({_id: userId}, function (err, doc){
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      getFullStockDataDailyChange(doc.watchlist).then((watchlist) => {

        getFullStockDataWeeklyChange(watchlist).then((stocklist) => {

          getFullStockDataMonthlyChange(stocklist).then((list) => {

            res.send(list)
          })
        })
      });
    }
  })
});

stockwatchlistcontroller.route('/addStock').post(verifyJWT, async function (req, res) {

    const singleStockList = [req.body.symbol];
    
    try{

      getFullStockDataDailyChange(singleStockList).then((newStock) => {

        getFullStockDataWeeklyChange(newStock).then((newStock) => {

          getFullStockDataMonthlyChange(newStock).then((newStock) => {

            const userId:ObjectId = new ObjectId(req.user.id);

            User.findOne({_id: userId}, function(err, doc) {
              if (err) {
                console.log(err);
              } else {
                doc.watchlist = [...doc.watchlist, ...newStock.map((stock) => {return stock.symbol})];
                doc.save();
                res.send(newStock);
              }
            });
          })
        })
      });

    } catch (err) {
      console.error(err);
      res.status(404).send("error");
    }
});

stockwatchlistcontroller.route('/deleteStock').post(verifyJWT, async function (req, res) {
  const stocksToDelete:String[] = req.body.symbols;

  const userId:ObjectId = new ObjectId(req.user.id);

  User.findOne({_id: userId}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      doc.watchlist = doc.watchlist.filter(item => !stocksToDelete.includes(item));
      doc.save();
      console.log("successful deletion");
      res.send("successful deletion");
    }
  });
});

module.exports = stockwatchlistcontroller;