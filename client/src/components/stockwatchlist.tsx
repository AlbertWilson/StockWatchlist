import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

export default function Stockwatchlist(props: {stocks:any[], isLoading:boolean, handleSelectedRows:any}) {

  const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Company Name', width: 225 },
    { field: 'col2', headerName: 'Symbol', width: 100 },
    { field: 'col3', headerName: 'Day Price', width: 125 },
    { field: 'col4', headerName: 'Day $ Change', width: 125 },
    { field: 'col5', headerName: 'Day % Change', width: 125 },
    { field: 'col6', headerName: '7 Day % Change', width: 125 },
    { field: 'col7', headerName: '30 Day % Change', width: 150 },
  ];

  const rows: GridRowsProp = props.stocks.map((stock) => {
    return { id: stock.symbol,
      col1: stock.companyName, 
      col2: stock.symbol, 
      col3: stock.todayPrice, 
      col4: stock.todayPriceChange, 
      col5: stock.todayPricePercentChange, 
      col7: stock.percentageChange7DaysAgo, 
      col9: stock.percentageChange30DaysAgo
    }
  })

  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGrid
      rows={rows}
      columns={columns}
      checkboxSelection
      onSelectionModelChange={(ids) => {props.handleSelectedRows(ids)}}
      loading={props.isLoading}
      />
    </div>
  );
}
