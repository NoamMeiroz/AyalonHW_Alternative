import React, { Component } from 'react';
import requireAuth from '../requireAuth'; //used to check if login successfull 
import { connect } from 'react-redux';
import * as actions from '../../actions'; 

class SignOut extends Component {
    componentDidMount() {
        this.props.signOut();
    }

    render() {
        return <div>תודה על השתתפותך בתוכנית מעסיקים</div>;
    }

}

export default connect(null, actions)(requireAuth(SignOut));