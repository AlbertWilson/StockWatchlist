const express = require('express');
const controller = express.Router();
import Stock from '../model/Stock';
import FullStockData from '../model/FullStockData';
const app = express();

var yahooFinance = require('yahoo-finance');

function getFullStockDataDailyChange(watchlist:FullStockData[]): Promise<FullStockData> {
    const stockSymbols = watchlist.map((stock) => {return stock.symbol});
    const stockData:Promise<FullStockData> = yahooFinance.quote({
        symbols: stockSymbols,
        modules: ['price']
      }).then((quotes) => {
        return Object.keys(quotes).map((symbol:any) => {
          const fullStockInfo:FullStockData = {
            companyName: quotes[symbol].price.longName,
            symbol: quotes[symbol].price.symbol,
            price: quotes[symbol].price.regularMarketPrice,
            priceChange: quotes[symbol].price.regularMarketChange,
            pricePercentChange: quotes[symbol].price.regularMarketChangePercent
          }
          return fullStockInfo;
        })
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
        price: quote.price.regularMarketPrice,
        priceChange: quote.price.regularMarketChange,
        pricePercentChange: quote.price.regularMarketChangePercent
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

controller.route('/addStock').post(async function (req, res) {
    const symbol:string = req.body.symbol;
    const stock = new Stock({
      symbol: symbol
    })

    stock.save((err:any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully wrote to db');
      }
    })

    const getStock = async () => await getSingleStock(symbol).then((singleStock) => {
      res.send(singleStock)
    });
    
    getStock();
});

controller.route('/deleteStock').post(async function (req, res) {
  // seems to be a bug if I try to delete a stock that isn't there
  Stock.deleteMany({symbol: req.body.symbol}, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Successfull deletion');
    }
  });
});

module.exports = controller;