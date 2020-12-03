import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import requireAuth from '../requireAuth'; //used to check if login successfull

import './legend.css';

class Legend extends Component {

    state = {
        legends: {}
    }

    componentDidUpdate(prevProps) {
        let companyList = {};
        if (prevProps.data !== this.props.data) {
            for (let company in this.props.companies) {
                companyList[company] = { color: this.props.companies[company].color, count: 0 };
            }
            for (let employee of this.props.data) {
                companyList[employee.EMPLOYER_ID].count = companyList[employee.EMPLOYER_ID].count + 1;
                companyList[employee.EMPLOYER_ID].name = employee.COMPANY;
            }
            this.setState({ legends: companyList });
        }
    }

    getItemList() {
        return Object.values(this.state.legends).map(values => {
            let jsx = <ListItem key={values.name}>
                <ListItemIcon style={{minWidth: 20}}>
                    <CheckBoxOutlineBlankIcon fontSize="small"
                        style={{
                            backgroundColor: `${values.color}`,
                            fill: `${values.color}`,
                            fontSize: '0.8rem'
                        }}
                    />
                </ListItemIcon>
                <ListItemText disableTypography={true} primary={`${values.name}, ${values.count} עובדים`} style={{margin: 0}}></ListItemText>
            </ListItem>;
            return jsx;
        })
    }

    render() {
        const jsx = <div>
            <Box style={{ opacity: 0.8, backgroundColor: 'white', border: '2px solid rgba(0,0,0,0.2)' }} >
                <List dense style={{padding:0}}>
                    {this.getItemList()}
                </List>
            </Box>
        </div>;
        return jsx;

    }
}

export default requireAuth(Legend);

