import React from 'react';
import Watchlist from './components/watchlist';
import { useState, useEffect } from 'react'
import axios from 'axios';
import Stock from './interfaces/Stock';


function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const stockSymbolRef = React.createRef<HTMLInputElement>();

  const addStock = async (stock:Stock) => {
    await axios.post('http://localhost:9000/addStock', stock)
  };
  
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const {data: response} = await axios.get('http://localhost:9000/stocks');

        setStocks(response);
        
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchStocks();
  }, []);

  function addStockToWatchlist() {
    const stockSymbol = stockSymbolRef.current != null ? stockSymbolRef.current.value : '';
    if (stockSymbol === ''){
      return;
    }

    // make alphavantage api call to retrieve full stock data

    const stock:Stock = {
      symbol: stockSymbol
    };

    // add stock to database
    addStock(stock);

    setStocks((prevStocks) => [...prevStocks, stock]);

    // set textbox field to empty
    if (stockSymbolRef.current != null) stockSymbolRef.current.value = '';
  }

  return (
      <div>
        {loading && <div>Loading</div>}
        {!loading && (<div className="App">
        <Watchlist stocks={stocks} />
        <input ref={stockSymbolRef} type="text"></input>
        <button onClick={addStockToWatchlist}>Add Stock to Watchlist</button>
        </div>)}
    </div>
  );
}

export default App;
