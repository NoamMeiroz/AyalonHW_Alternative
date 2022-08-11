import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import './headerBar.css';

class HeaderBar extends Component {

    render() {
        return <div className="headerBar">
            <AppBar position="fixed">
                <Toolbar className="title">
                    <div>
                        <Typography variant="h6" className="title">
                            נתיב לעסקים
                        </Typography>
                        <Typography variant="body2" className="title">
                            פתרונות תחבורה אלטרנטיבים לעובדים
                        </Typography>
                    </div>
                    {(!this.props.auth) ?
                        <Button color="primary" component={Link} to="/signin">כניסה</Button> :
                        <Box className="signout">
                            <Typography variant="subtitle1">
                                שלום:
                            </Typography>
                            <Typography variant="subtitle1" color="primary">
                                {this.props.userName}
                            </Typography>
                            <Button href="/מדריך למשתמש.pdf" download>מדריך למשתמש</Button>
                            <Button color="primary" component={Link} to="/signout" >יציאה</Button>
                        </Box>
                    }
                </Toolbar>
            </AppBar>
        </div>;
    }

};

function mapStateToProps(state) {
    return { auth: state.auth.authenticated, userName: state.auth.userName };
}

export default connect(mapStateToProps)(HeaderBar);

