import React from 'react'
import Stock from '../interfaces/Stock';
import Button from '@material-ui/core/Button';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


export default function stock(props: {stock:Stock, deleteStockFromWatchlist:any}): JSX.Element{
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
                <TableCell>{props.stock.price}</TableCell>
                <TableCell>{props.stock.priceChange}</TableCell>
                <TableCell>{props.stock.pricePercentChange}</TableCell>
            </TableRow>
        </>
    )
}