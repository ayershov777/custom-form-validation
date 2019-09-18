import React, { Component } from 'react';
import LoginPage from '../LoginPage/LoginPage.jsx';
import SignupPage from '../SignupPage/SignupPage.jsx';
import HomePage from '../HomePage/HomePage.jsx';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import userService from '../../utils/userService';

class App extends Component {
  state = {
    user: null,
  };

  handleLogin = () => {
    this.setState({
      user: userService.getUser(),
    });
  };

  render() {
    return <Router>
      <div style={{
        backgroundColor: '#18121E',
        height: '100vh'
      }}>
        <Switch>
          <Route exact path="/" render={ props =>
            this.state.user
            ? <HomePage />
            : <Redirect to="/signup" /> }
          />

          <Route exact path="/signup" render={ props =>
            <SignupPage
              history={props.history}
              isEmailAvailable={userService.isEmailAvailable}
              handleSignup={userService.signup}
            /> } 
          />

          <Route exact path="/login" render={ props =>
            <LoginPage /> }
          />
        </Switch>
      </div>
    </Router>
  }
}

export default App;