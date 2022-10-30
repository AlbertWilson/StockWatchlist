import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel, GridRowId } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';

export default function Stockwatchlist(props: {stocks:any[], isLoading:boolean, handleSelectedRows:any}) {

  const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Company Name', width: 125 },
    { field: 'col2', headerName: 'Symbol', width: 125 },
    { field: 'col3', headerName: 'Day Price', width: 125 },
    { field: 'col4', headerName: 'Day $ Change', width: 125 },
    { field: 'col5', headerName: 'Day % Change', width: 125 },
    { field: 'col6', headerName: '7 Day $ Change', width: 125 },
    { field: 'col7', headerName: '7 Day % Change', width: 125 },
    { field: 'col8', headerName: '30 Day $ Change', width: 125 },
    { field: 'col9', headerName: '30 Day % Change', width: 125 },
  ];

  const rows: GridRowsProp = props.stocks.map((stock) => {
    return { id: stock.symbol,
      col1: stock.companyName, 
      col2: stock.symbol, 
      col3: stock.todayPrice, 
      col4: stock.todayPriceChange, 
      col5: stock.todayPricePercentChange, 
      col6: stock.price7DaysAgo, 
      col7: stock.percentageChange7DaysAgo, 
      col8: stock.price30DaysAgo, 
      col9: stock.percentageChange30DaysAgo}
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
