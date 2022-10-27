import React from 'react'
import Stock from '../interfaces/Stock';
import Button from '@material-ui/core/Button';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function stock(props: {stock:Stock, deleteStockFromWatchlist:any}): JSX.Element{
    function handleStockDelete(){
        props.deleteStockFromWatchlist(props.stock);
    }

    return (
        <>
            <TableRow key={props.stock.symbol}>
                <TableCell><Button onClick={handleStockDelete}>Delete</Button></TableCell>
                <TableCell>{props.stock.symbol}</TableCell>
                <TableCell>{props.stock.symbol}</TableCell>
                <TableCell>{props.stock.price}</TableCell>
                <TableCell align="right">{props.stock.price}</TableCell>
            </TableRow>
        </>
    )
}