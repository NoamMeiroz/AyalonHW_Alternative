import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
        errors[field] = 'Required'
      }
    })
    return errors
  }

  const renderTextField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
  }) => (
     (<TextField
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />)
  );

class SignIn extends Component {
    onSubmit = (formProps) => {
        this.props.signin(formProps, () => {
            this.props.history.push('/companies');
        });

    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)} autoComplete="off">
                <div>
                    <label for="userId">שם משתמש</label>
                    <Field name="userId"  class="signinField"
                        component={renderTextField}
                        label="שם משתמש"
                        type="text"
                        required>
                    </Field>
                    <label for="password">סיסמה</label>
                    <Field class="signinField"
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
                <Button
                    variant="contained" color="primary" type="submit">אישור</Button>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.errorMessage };
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm( { form: 'signup', validate    } )
)( SignIn );

