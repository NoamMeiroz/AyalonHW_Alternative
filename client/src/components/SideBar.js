import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import AssessmentIcon from '@material-ui/icons/Assessment';
import RoomIcon from '@material-ui/icons/Room';
import lime from '@material-ui/core/colors/lime';

import './SideBar.css';

class SideBar extends Component {

    state = {
        active: {
            home: true,
            map: false,
            clustering: false,
            companies: false,
            bi: false
        }
    };

    componentDidMount() {
        this.setActive(this.props.location.pathname.substring(1));
    }

    setActive = (component) => {

        if (component === "")
            component = "home";
        let activeState = this.state.active;
        Object.keys(activeState).forEach(v => activeState[v] = false);

        activeState[component] = true;
        this.setState({
            active: activeState
        });
    }

    render() {
        return <Drawer
            variant="permanent"
            anchor="left"
            className="SideBar"
        >
            <img src="logo.png"
                alt="חברת נתיבי איילון" width="184px" height="81" />

            <div className="menu-bar">
                <IconButton edge="start" style={{ color: lime[50] }} aria-label="דף הבית"
                    className={this.state.active.home ? "active" : null}
                    onClick={(e) => { this.setActive("home"); }}
                    component={Link} to="/">
                    <HomeIcon />
                    דף הבית
                </IconButton>
                {(this.props.auth) ?
                    <div>
                        <div>
                            <IconButton edge="start" style={{ color: lime[50] }} aria-label="D"
                                className={this.state.active.map ? "active" : null}
                                onClick={(e) => {
                                    this.setActive("map");
                                }}
                                component={Link} to="/map">
                                <RoomIcon />
                                מפה 
                            </IconButton>
                        </div>
                        <div>
                            <IconButton edge="start" style={{ color: lime[50] }} aria-label="מעסיקים"
                                className={this.state.active.companies ? "active" : null}
                                onClick={(e) => {
                                    this.setActive("companies");
                                }}
                                component={Link} to="/companies">
                                <EmojiTransportationIcon />
                                רשימת החברות
                            </IconButton>
                        </div>
                        <div>
                            <IconButton edge="start" style={{ color: lime[50] }} aria-label="BI"
                                className={this.state.active.bi ? "active" : null}
                                onClick={(e) => {
                                    this.setActive("bi");
                                }}
                                target="_blank"
                                href="https://ayalon.promise-dev.com:8088/superset/dashboard/1/">
                                <AssessmentIcon />
                                BI
                            </IconButton>
                        </div>
                    </div>
                    : null
                }
            </div>
        </Drawer>;
    }
}

function mapStateToProps(state) {
    return { auth: state.auth.authenticated };
}

export default connect(mapStateToProps)(withRouter(SideBar));

