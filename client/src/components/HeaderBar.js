import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
                        <Button color="primary" component={Link} to="/signout" >יציאה</Button>
                    }
                </Toolbar>
            </AppBar>
        </div>;
    }

};

function mapStateToProps(state) {
    return { auth: state.auth.authenticated };
}

export default connect(mapStateToProps)(HeaderBar);

