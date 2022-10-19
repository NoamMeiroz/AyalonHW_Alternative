import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RoomIcon from '@mui/icons-material/Room';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

import './SideBar.css';

class SideBar extends Component {

    state = {
        active: {
            home: true,
            map: false,
            clustering: false,
            companies: false,
            bi: false,
            algoSettings: false
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
                <IconButton edge="start" aria-label="דף הבית"
                    className={this.state.active.home ? "active" : null}
                    onClick={(e) => { this.setActive("home"); }}
                    component={Link} to="/">
                    <HomeIcon />
                    דף הבית
                </IconButton>
                {(this.props.auth) ?
                    <div>
                        <div>
                            <IconButton edge="start" aria-label="D"
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
                            <IconButton edge="start" aria-label="מעסיקים"
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
                            <IconButton edge="start" aria-label="BI"
                                className={this.state.active.bi ? "active" : null}
                                onClick={(e) => {
                                    this.setActive("bi");
                                }}
                                target="_blank"
                                href="https://www.nativapp.co.il:8088/superset/dashboard/1/">
                                <AssessmentIcon />
                                BI
                            </IconButton>
                        </div>
                        <div>
                            <IconButton edge="start" aria-label="BI"
                                className={this.state.active.algoSettings ? "active" : null}
                                onClick={(e) => {
                                    this.setActive("algoSettings");
                                }}
                                component={Link} to="/algorithmSettings">
                                <DisplaySettingsIcon />
                                הגדרות אלגוריתם
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

