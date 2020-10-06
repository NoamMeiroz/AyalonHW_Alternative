import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';


import * as actions from '../../actions';
import './SignIn.css';

const validate = values => {
    const errors = {}
    const requiredFields = [
        'userId',
        'password'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'שדה חובה'
        }
    })
    return errors
}

const renderTextField = ({
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
}) => (
        (<TextField
            label={label}
            placeholder={label}
            error={touched && invalid}
            helperText={touched && error}
            {...input}
            {...custom}
        />)
    );

const MyButton = styled(Button)({
    margin: '30px',
});

class SignIn extends Component {
    onSubmit = (formProps) => {
        this.props.signin(formProps, () => {
            this.props.history.push('/companies');
        });

    }

    render() {
        const { handleSubmit, pristine, submitting } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)} autoComplete="off">
                <div>
                    <Field name="userId" className="signinField"
                        component={renderTextField}
                        label="שם משתמש"
                        type="text"
                        required>
                    </Field>
                </div>
                <div>
                    <Field className="signinField"
                        name="password"
                        type="password"
                        label="סיסמה"
                        required
                        component={renderTextField}>
                    </Field>
                </div>
                <div>
                    {this.props.errorMessage}
                </div>
                <div>
                    <MyButton className="Button" disabled={pristine || submitting}
                        variant="contained" color="primary" type="submit">אישור
                    </MyButton>
                </div>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.errorMessage };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signup', validate })
)(SignIn);

