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
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StockWatchlist from './components/stockwatchlist';
import Options from './components/options';
import Stock from './interfaces/Stock';
import axios from 'axios';

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

function App() {
  const [stocks, setStocks] = React.useState<Stock[]>([]);
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const stockSymbolRef = React.createRef<HTMLInputElement>();

  const addStock = (stock:Stock) => {
    try {
      const request = axios.post('http://localhost:9000/addStock', stock);
      request.then((response) => {
        setStocks((prevStocks) => [...prevStocks, response.data]);
      }).catch((error) => {
        console.error(error);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStock = async (stock:Stock) => {
    await axios.post('http://localhost:9000/deleteStock', stock)
  };
  
  React.useEffect(() => {
    const fetchStocks = () => {
      try {
        const request = axios.get('http://localhost:9000/stocks');
        request.then((response) => {
          setStocks(response.data);
        }).catch((error) => {
          console.error(error);
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStocks();
  }, []);

  function addStockToWatchlist() {
    const stockSymbol = stockSymbolRef.current != null ? stockSymbolRef.current.value : '';

    if (stockSymbol === ''){
      return;
    }

    const stock:Stock = {
      symbol: stockSymbol
    };

    addStock(stock); 

    if (stockSymbolRef.current != null) stockSymbolRef.current.value = ''; // set textbox field to empty

  }

  function deleteStockFromWatchlist(stockToDelete:Stock) {
    const currentStocks = [...stocks];
    const updatedStocks = currentStocks.filter(stock => stock.symbol !== stockToDelete.symbol);
    setStocks(updatedStocks); // update UI state
    deleteStock(stockToDelete); // make backend call to delete stock from mongodb
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
              Stock Watchlist
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
                <StockWatchlist stocks={stocks} deleteStockfromWatchlist={deleteStockFromWatchlist}/>
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {/* Add Stock to Watchlist */}
              <Grid item xs={3}>
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

export default App;
