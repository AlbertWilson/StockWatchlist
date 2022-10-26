import React from 'react'
import { JsxElement } from 'typescript';

export default function stock(props: {stock:any}): JSX.Element{
    function handleStockClick(){
        
    }

    return (
        <>
            <div>
                <input type='checkbox' checked={props.stock.complete} onChange={handleStockClick}/>
                {props.stock.symbol}
            </div>
        </>
    )
}