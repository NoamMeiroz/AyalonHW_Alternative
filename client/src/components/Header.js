import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import lime from '@material-ui/core/colors/lime';

import './header.css';

class Header extends Component {
 
    render() {
        return <header className="root">
                <AppBar position="static">
                    <Toolbar>
                    <IconButton edge="start" style={{ color: lime[50] }} aria-label="דף הבית" 
                        component={Link} to="/">
                        <HomeIcon/>
                    </IconButton>
                    {(this.props.auth) ?
                        <IconButton edge="start" style={{ color: lime[50] }} aria-label="מעסיקים" 
                            component={Link} to="/companies">
                            <EmojiTransportationIcon/>
                        </IconButton>
                        : null
                    }
                    <Typography variant="h6" className="title">
                        אלטרנתיב
                    </Typography>
                    {(!this.props.auth) ? 
                        <Button component={Link} to="/signin" color="inherit">כניסה</Button> : 
                        null
                    }
                    {(this.props.auth) ?
                        <Button component={Link} to="/signout" color="inherit">יציאה</Button> :
                            null
                    }
                    </Toolbar>
                </AppBar>
            </header>;
    }
    
};

function mapStateToProps(state) {
    return { auth: state.auth.authenticated };
}

export default connect(mapStateToProps)( Header );

