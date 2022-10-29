const express = require('express');
const controller = express.Router();
import Stock from '../model/Stock';
import FullStockData from '../model/FullStockData';
const app = express();

var yahooFinance = require('yahoo-finance');

function getFullStockDataDailyChange(watchlist:FullStockData[]): Promise<any> {
  if (watchlist === undefined || watchlist.length == 0){
    return new Promise<any>(function(resolve, reject){resolve([]);});
  }

  const stockSymbols = watchlist.map((stock) => {return stock.symbol});
  const stockData:Promise<FullStockData> = yahooFinance.quote({
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

function getFullStockDataWeeklyChange(watchlist:FullStockData[]): Promise<FullStockData> {
  const stockSymbols = watchlist.map((stock) => {return stock.symbol});
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const stockData:Promise<FullStockData> = yahooFinance.historical({
      symbols: stockSymbols,
      from: oneWeekAgo,
      to: oneWeekAgo,
    }).then((quotes) => {
      const fullStockInfo = {}
      Object.keys(quotes).forEach((symbol:any) => {
        if (quotes[symbol][0] != undefined){
          fullStockInfo[symbol] = {price7DaysAgo: quotes[symbol][0].close};
        } else {
          fullStockInfo[symbol] = {price7DaysAgo: 'unavailable'}
        }
      })
      return fullStockInfo;
    });
  return stockData;
}

function getFullStockDataMonthlyChange(watchlist:FullStockData[]): Promise<FullStockData> {
  const stockSymbols = watchlist.map((stock) => {return stock.symbol});
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  const stockData:Promise<FullStockData> = yahooFinance.historical({
    symbols: stockSymbols,
    from: oneMonthAgo,
    to: oneMonthAgo,
  }).then((quotes) => {
    const fullStockInfo = {}
    Object.keys(quotes).forEach((symbol:any) => {
      if (quotes[symbol][0] != undefined) {
        fullStockInfo[symbol] = {price30DaysAgo: quotes[symbol][0].close};
      } else {
        fullStockInfo[symbol] = {price30DaysAgo: 'unavailable'}
      }
    })
    return fullStockInfo;
  });
return stockData;
}

function getSingleStock(symbol:string): Promise<FullStockData> {
  const stockData:Promise<FullStockData> = yahooFinance.quote({
      symbol: symbol,
      modules: ['price']
    }).then((quote) => {
      const fullStockInfo:FullStockData = {
        companyName: quote.price.longName,
        symbol: quote.price.symbol,
        todayPrice: quote.price.regularMarketPrice,
        todayPriceChange: quote.price.regularMarketChange,
        todayPricePercentChange: quote.price.regularMarketChangePercent
      }
      return fullStockInfo;
    });
  return stockData;
}

controller.route('/stocks').get(function (req, res){

  const stocks = Stock.find((err: any, stocks: any) => {
    if (err) {
      res.send(err);
    } else {

      const watchlist = async () => await getFullStockDataDailyChange(stocks).then((watchlist) => {
        res.send(watchlist)
      });

      watchlist();
    }
  })
});

controller.route('/stocksFrom7DaysAgo').post(function (req, res){

  const stocks = Stock.find((err: any, stocks: any) => {
    if (err) {
      res.send(err);
    } else {
      const watchlist = async () => await getFullStockDataWeeklyChange(stocks).then((watchlist) => {
        res.send(watchlist)
      })
      watchlist();
    }
  })
});

controller.route('/stocksFrom30DaysAgo').post(function (req, res){

  const stocks = Stock.find((err: any, stocks: any) => {
    if (err) {
      res.send(err);
    } else {
      const watchlist = async () => await getFullStockDataMonthlyChange(stocks).then((watchlist) => {
        res.send(watchlist)
      });
      watchlist();
    }
  })
});

controller.route('/addStock').post(async function (req, res) {
    const symbol:string = req.body.symbol;
    const stock = new Stock({
      symbol: symbol
    })

    const getStock = async () => await getSingleStock(symbol);
    
    try{
      const singleStock:FullStockData = await getStock();

      stock.save((err:any) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully wrote to db');
        }
      })

      res.send(singleStock);

    } catch (err) {
      console.error(err);
      res.status(404).send("error");
    }
});

controller.route('/deleteStock').post(async function (req, res) {
  Stock.deleteMany({symbol: req.body.symbol}, function (err) {
    if (err) {
      res.send(err);
    } else {
      console.log('Successful deletion')
      res.send('Successfull deletion');
    }
  });
});

module.exports = controller;