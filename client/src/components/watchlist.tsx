import React from 'react';
import Stock from './stock';

export default function watchlist(props: {stocks:any[]}): JSX.Element {
    console.log('The stocks are: ' + props.stocks);
    return <>{
        props.stocks.map(stock => 
            {
                return <Stock key={stock._id} stock={stock}></Stock>
            })
      }</>
}