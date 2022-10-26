const express = require('express');
const controller = express.Router();
import Stock from '../model/Stock';
const app = express();

controller.route('/stocks').get(async function (req, res){
    const stocks = Stock.find((err: any, stocks: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(stocks);
      }
    })
});

controller.route('/addStock').post(async function (req, res) {
    const stock = new Stock({
      symbol: req.body.symbol
    })

    stock.save((err:any) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Successfully wrote to db');
      }
    })

});

module.exports = controller;