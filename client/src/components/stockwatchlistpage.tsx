import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StockWatchlist from './stockwatchlist';
import Options from './options';
import Stock from '../interfaces/Stock';
import axios from 'axios';
import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel, GridRowId } from '@mui/x-data-grid';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

export default function StockWatchlistPage() {
  const [stocks, setStocks] = React.useState<Stock[]>([]);
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState<GridRowId[]>([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const stockSymbolRef = React.createRef<HTMLInputElement>();

  const addStock = (stock:Stock) => {
    try {
      const request = () => axios.post('http://localhost:9000/addStock', stock).then(async (response) => {
        setStocks((prevStocks) => {
        return [...prevStocks, response.data[0]]; // response.data[0] because the response comes back as a single value array
        });
      }).catch((error) => {
        console.error(error);
      });
      request();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStocksFromDB = async (stocks:String[]) => {
    const stocksToDelete = {'symbols': stocks}
    await axios.post('http://localhost:9000/deleteStock', stocksToDelete);
  };
  
  React.useEffect(() => {
    const fetchStocks = async () => {
    setLoading(true);
      try {
        const {data: response} = await axios.get('http://localhost:9000/stocks');
        setStocks(response);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStocks();
  }, []);

  function addStockToWatchlist() {
    const stockSymbol = stockSymbolRef.current != null ? stockSymbolRef.current.value.toUpperCase() : '';

    if (stockSymbol === ''){
      return;
    }

    const stock:Stock = {
      symbol: stockSymbol
    };

    const checkIfStockIsAdded = new Promise(function(resolve, reject) {
      stocks.forEach((stock) => {
        if (stock.symbol.toUpperCase() === stockSymbol.toUpperCase()){
          reject();
          return;
        }
      })
      resolve(stock);
    })

    checkIfStockIsAdded.then(() => addStock(stock)).catch((err) => (console.log('stock has already been added to watchlist')));

    if (stockSymbolRef.current != null) stockSymbolRef.current.value = ''; // set textbox field to empty
  }

  function handleSelectedRows(ids:any){
    setSelectedRows(ids);
  }

  function deleteStocksFromWatchlist() {
    const currentStocks:Stock[] = [...stocks];
    const stocksToDelete = [...selectedRows] as String[];
    const updatedStocks = (currentStocks:Stock[], stocksToDelete:String[]):Stock[] => {
        const filtered = currentStocks.filter((currentStock:any) => {
           return stocksToDelete.indexOf(currentStock.symbol) === -1; // indexOf returns the position a value in string
        });
        return filtered;
    };

    setStocks(updatedStocks(currentStocks, stocksToDelete)); // update UI state

    deleteStocksFromDB(stocksToDelete);
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Hi, Albert
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <Options />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Stock Watchlist */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <StockWatchlist stocks={stocks} isLoading={loading} handleSelectedRows={handleSelectedRows}/>
                </Paper>
              </Grid>
              {/* Add Stock to Watchlist */}
              <Grid item xs={3}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Button onClick={deleteStocksFromWatchlist}>DELETE Selected</Button>
                </Paper>
              </Grid>
              <Grid item xs={9} container justifyContent='flex-end'>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <TextField inputRef={stockSymbolRef} type="text"></TextField>
                  <Button onClick={addStockToWatchlist}>Add Stock to Watchlist</Button>
                </Paper>
              </Grid>
            </Grid>
            </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}