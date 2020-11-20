import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export default ChildComponent => {
    class ComposedComponent extends Component {

        componentDidMount() {
            this.shouldNavigateAway();
        };

        componentDidUpdate() {
            this.shouldNavigateAway();
        };

        shouldNavigateAway() {
            if (!this.props.auth) {
                this.props.history.push('/');
            }
        }
        render() {
            if (!this.props.auth) {
                return (
                    <div></div>
                );
            }
            else {
                return <ChildComponent {...this.props} />;
            }
        }
    }

    function mapStateToProps(state) {
        return { auth: state.auth.authenticated };
    }
    return withRouter(connect(mapStateToProps)(ComposedComponent));
};