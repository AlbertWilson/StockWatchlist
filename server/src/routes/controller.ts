const express = require('express');
const controller = express.Router();
import Stock from '../model/Stock';
import FullStockData from '../model/FullStockData';
const app = express();

var yahooFinance = require('yahoo-finance');

export default function getFullStockData(stockSymbol:string): Promise<FullStockData> {
    const stockData:Promise<FullStockData> = yahooFinance.quote({
        symbol: stockSymbol,
        modules: [ 'price' ]
      }).then((quotes) => {
        const fullStock:FullStockData = {
          symbol: stockSymbol,
          price: quotes.price.regularMarketPrice
        }
        return fullStock;
      });

    return stockData;
}


controller.route('/stocks').get(function (req, res){

  const stocks = Stock.find((err: any, stocks: any) => {
    if (err) {
      res.send(err);
    } else {      
      const watchlist:Promise<FullStockData>[] = stocks.map(async (stock) => {
        return await getFullStockData(stock.symbol);
      });

      Promise.all(watchlist).then((watchlist) => (res.send(watchlist)));
    }
  })
});

controller.route('/addStock').post(async function (req, res) {
    const stock = new Stock({
      symbol: req.body.symbol
    })

    // maybe ensure that we don't add a stock that is already there

    stock.save((err:any) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully wrote to db');
      }
    })
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