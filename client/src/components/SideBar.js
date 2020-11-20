import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ListAltIcon from '@material-ui/icons/ListAlt';
import HomeIcon from '@material-ui/icons/Home';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import RoomIcon from '@material-ui/icons/Room';
import lime from '@material-ui/core/colors/lime';

import './SideBar.css';

class SideBar extends Component {

    state = {
        active: {
            home: true,
            dashboard: false,
            companies: false,
            reports: false,
        },
        showReportOptions: false,
        reports: {
            share_potential: false
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

    setActiveReport = (component) => {

        let ractiveState = this.state.reports;
        Object.keys(ractiveState).forEach(v => ractiveState[v] = false);
        if (ractiveState[component] !== undefined ) {
            ractiveState[component] = true;
            this.setState({
                reports: ractiveState
            });
        }
    }

    render() {
        return <Drawer
            variant="permanent"
            anchor="left"
            className="SideBar"
        >
            <img src="https://www.ayalonhw.co.il/wp-content/themes/_tk-master/images/logo.png"
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
                                className={this.state.active.dashboard ? "active" : null}
                                onClick={(e) => {
                                    this.setActive("dashboard");
                                    this.setActiveReport("none");
                                }}
                                component={Link} to="/dashboard">
                                <RoomIcon />
                                Dashboard
                            </IconButton>
                        </div>
                        <div>
                            <IconButton edge="start" style={{ color: lime[50] }} aria-label="מעסיקים"
                                className={this.state.active.companies ? "active" : null}
                                onClick={(e) => {
                                    this.setActive("companies");
                                    this.setActiveReport("none");
                                }}
                                component={Link} to="/companies">
                                <EmojiTransportationIcon />
                                קליטת נתונים
                            </IconButton>
                        </div>
                        <div>
                            <IconButton edge="start" style={{ color: lime[50] }} aria-label="דוחות"
                                className={this.state.active.reports ? "active" : null}
                                onClick={(e) => {
                                    this.setActive("reports");
                                    this.setState({ showReportOptions: !this.state.showReportOptions });
                                }}>
                                <ListAltIcon />
                                דוחות
                            </IconButton>
                            {this.state.showReportOptions ?
                                <IconButton edge="start" style={{ color: lime[50] }} aria-label="מעסיקים"
                                    className={"report ".concat(this.state.reports.share_potential ? "active-report" : "not-active-report")}
                                    onClick={(e) => { this.setActiveReport("share_potential"); }}
                                    component={Link} to="/reports/share_potential">
                                    איתור עובדים קרובים מבחינה פיסית
                                </IconButton>
                                : <div></div>
                            }
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

