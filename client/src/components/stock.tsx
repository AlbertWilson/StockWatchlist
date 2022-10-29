import React from 'react'
import Stock from '../interfaces/Stock';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';


export default function stock(props: {stock:Stock, deleteStockFromWatchlist:any}): JSX.Element {
    function handleStockDelete(){
        props.deleteStockFromWatchlist(props.stock);
    }

    return (
        <>
            <TableRow key={props.stock.symbol}>
                <TableCell>
                    <ListItemButton onClick={handleStockDelete}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </TableCell>
                <TableCell>{props.stock.companyName}</TableCell>
                <TableCell>{props.stock.symbol}</TableCell>
                <TableCell>{props.stock.todayPrice}</TableCell>
                <TableCell>{props.stock.todayPriceChange}</TableCell>
                <TableCell>{props.stock.todayPricePercentChange}</TableCell>
            </TableRow>
        </>
    )
}