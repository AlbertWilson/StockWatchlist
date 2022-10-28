import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stock from './stock';
import Title from './title';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function stockwatchlist(props: {stocks:any[], deleteStockfromWatchlist:any}) {
  return (
    <React.Fragment>
    <Title>Stock Watchlist</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell>Company Name</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Price Change</TableCell>
            <TableCell>Percent Change</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.stocks.map((stock) => (
            <Stock key={stock._id} stock={stock} deleteStockFromWatchlist={props.deleteStockfromWatchlist} />
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}