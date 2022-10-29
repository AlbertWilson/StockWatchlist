import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PriceChangeIcon from '@mui/icons-material/PriceChange';

function showStocksBy7DayPercentageChange() {

}

function showStocksBy30DayPercentageChange() {
    
}

export default function stockwatchlist(){
    return (<React.Fragment>
        <ListItemButton>
        <ListItemIcon >
            <PriceChangeIcon fontSize="large"/>
        </ListItemIcon>
        <ListItemText primary="Daily % Change" />
        </ListItemButton>
        <ListItemButton onClick={showStocksBy7DayPercentageChange}>
        <ListItemIcon>
            <PriceChangeIcon fontSize="large"/>
        </ListItemIcon>
        <ListItemText primary="Weekly % Change" />
        </ListItemButton>
        <ListItemButton onClick={showStocksBy30DayPercentageChange}>
        <ListItemIcon>
            <PriceChangeIcon fontSize="large"/>
        </ListItemIcon>
        <ListItemText primary="Monthly % Change" />
        </ListItemButton>
    </React.Fragment>)
}