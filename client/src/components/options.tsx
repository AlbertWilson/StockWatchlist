import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PriceChangeIcon from '@mui/icons-material/PriceChange';

export default function stockwatchlist(){
    return (<React.Fragment>
        <ListItemButton>
        <ListItemIcon >
            <PriceChangeIcon fontSize="large"/>
        </ListItemIcon>
        <ListItemText primary="Weekly % Change" />
        </ListItemButton>
        <ListItemButton>
        <ListItemIcon>
            <PriceChangeIcon fontSize="large"/>
        </ListItemIcon>
        <ListItemText primary="Monthly % Change" />
        </ListItemButton>
        <ListItemButton>
        <ListItemIcon>
            <PriceChangeIcon fontSize="large"/>
        </ListItemIcon>
        <ListItemText primary="Yearly % Change" />
        </ListItemButton>
    </React.Fragment>)
}