import React, { Component } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Badge from '@mui/material/Badge';


class Company extends Component {

    render() {
        if (!this.props.companies)
            return null;
        const jsx = <div style={{ width: '100%', maxWidth: 360 }}>
            <List dense>
                {this.props.companies.map(company => {
                    return <ListItem key={company.WORK_CITY+"_"+company.COMPANY}>
                        <ListItemText primary={company.COMPANY} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="מספר עובדים">
                                <Badge badgeContent={company.COUNTER} max={99999} color="primary">
                                    <PeopleOutlineRoundedIcon />
                                </Badge>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })
                }
            </List></div>
        return jsx;
    }
}

export default Company;