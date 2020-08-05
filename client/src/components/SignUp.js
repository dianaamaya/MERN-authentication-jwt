import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

//local components
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '../config/auth';
import * as actions from '../actions';
import CustomInput from './CustomInput';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  componentDidMount() {
    this.props.resetMessage();
  }

  async onSubmit(formData) {
    await this.props.signUp(formData);
    if (!this.props.errorMessage) {
      this.props.history.push('/dashboard');
    }
  }

  async responseGoogle(res) {
    await this.props.oauthGoogle(res.accessToken);
    if (!this.props.errorMessage) {
      this.props.history.push('/dashboard');
    }
  }

  async responseFacebook(res) {
    await this.props.oauthFacebook(res.accessToken);
    if (!this.props.errorMessage) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-6 mb-4">
          <h2 className="mb-4">Registration form</h2>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <fieldset>
              <Field name="name"
                type="text"
                id="name"
                label="Name: "
                placeholder="Enter your name"
                component={CustomInput} />
            </fieldset>
            <fieldset>
              <Field name="email"
                type="text"
                id="email"
                label="Email: "
                placeholder="example@example.com"
                component={CustomInput} />
            </fieldset>
            <fieldset>
              <Field name="password"
                type="password"
                id="password"
                label="Password: "
                placeholder="Enter your Password"
                component={CustomInput} />
            </fieldset>
            <fieldset>
              <Field name="repeat_password"
                type="password"
                id="repeat_password"
                label="Repeat your password: "
                placeholder="Enter your Password again"
                component={CustomInput} />
            </fieldset>

            {this.props.errorMessage ?
              <div className="alert alert-danger">
                {this.props.errorMessage}
              </div> : null}

            <button type="submit" className="btn btn-primary">Sign Up</button>
          </form>
        </div>
        <div className="col-xs-12 col-sm-6 mb-4">
          <div className="text-center">
            <div className="alert alert-primary">
              Or sign up using third-party services
            </div>
            <FacebookLogin
              appId={FACEBOOK_APP_ID}
              render={renderProps => (
                <button className="btn btn-primary mr-2" 
                    onClick={renderProps.onClick}>
                    Facebook
                </button>
              )}
              fields="name,email,picture"
              callback={this.responseFacebook}
              cssClass="btn btn-outline-primary"
            />
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              render={renderProps => (
                <button className="btn btn-danger" 
                    onClick={renderProps.onClick} 
                    disabled={renderProps.disabled}>
                    Google
                </button>
              )}
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              className="btn btn-outline-danger"
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  }
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signup' })
)(SignUp)