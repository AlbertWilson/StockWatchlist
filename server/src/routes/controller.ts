const express = require('express');
const controller = express.Router();
import Stock from '../model/Stock';
import FullStockData from '../model/FullStockData';
const app = express();

var yahooFinance = require('yahoo-finance');

function getFullStockDataDailyChange(watchlist:FullStockData[]): Promise<FullStockData[]> {
  if (watchlist === undefined || watchlist.length == 0){
    return new Promise<any>(function(resolve, reject){resolve([]);});
  }

  const stockSymbols = watchlist.map((stock) => {return stock.symbol});
  const stockData:Promise<FullStockData[]> = yahooFinance.quote({
      symbols: stockSymbols,
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

controller.route('/stocks').get(async function (req, res){

  const stocks = Stock.find((err: any, stocks: any) => {
    if (err) {
      res.send(err);
    } else {
      getFullStockDataDailyChange(stocks).then((watchlist) => {

        getFullStockDataWeeklyChange(watchlist).then((stocklist) => {

          getFullStockDataMonthlyChange(stocklist).then((list) => {

            res.send(list)
          })
        })
      });
    }
  })
});

controller.route('/addStock').post(async function (req, res) {
    const stock = new Stock({
      symbol: req.body.symbol
    })

    const singleStockList = [stock];
    
    try{

      getFullStockDataDailyChange(singleStockList).then((newStock) => {

        getFullStockDataWeeklyChange(newStock).then((newStock) => {

          getFullStockDataMonthlyChange(newStock).then((newStock) => {

            stock.save((err:any) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Successfully wrote to db');
              }
            })

            res.send(newStock)
          })
        })
      });

    } catch (err) {
      console.error(err);
      res.status(404).send("error");
    }
});

controller.route('/deleteStock').post(async function (req, res) {
  const stocksToDelete:String[] = req.body.symbols;
  console.log(stocksToDelete);

  Stock.deleteMany({symbol: stocksToDelete}, function (err) {
    if (err) {
      res.send(err);
    } else {
      console.log('Successful deletion')
      res.send('Successfull deletion');
    }
  });
});

module.exports = controller;