import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import PeopleOutlineRoundedIcon from '@material-ui/icons/PeopleOutlineRounded';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Badge from '@material-ui/core/Badge';


class Sites extends Component {

    render() {
        if (!this.props.sites)
            return null;
        const jsx = <div style={{ width: '100%', maxWidth: 360 }}>
            <List dense>
                {this.props.sites.map(site => {
                    return <ListItem key={site.id}>
                        <ListItemText primary={site.NAME}
                            secondary={`${site.ADDRESS_STREET} ${site.ADDRESS_BUILDING_NUMBER}, ${site.ADDRESS_CITY}`} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="מספר עובדים">
                                <Badge badgeContent={site.NUM_OF_EMPLOYEES} color="primary">
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

export default Sites;