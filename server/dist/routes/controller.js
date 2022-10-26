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
controller.route('/stocks').get(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const stocks = Stock_1.default.find((err, stocks) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(stocks);
            }
        });
    });
});
controller.route('/addStock').post(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const stock = new Stock_1.default({
            symbol: req.body.symbol
        });
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
module.exports = controller;
//# sourceMappingURL=controller.js.map