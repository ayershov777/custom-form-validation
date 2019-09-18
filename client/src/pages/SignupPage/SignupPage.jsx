import React from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import './SignupPage.css';

var Filter = require('bad-words'),
  filter = new Filter();

// scroll to the bottom to see all the validation messages

class SignupPage extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.setInitialState();
  }

  setInitialState = () => {
    this.setState({
      firstName: '',
      lastName:'',
      displayName: '',
      email: '',
      password: '',
      passConf: '',
  
      isFirstNameValid: false,
      isLastNameValid: false,
      isDisplayNameValid: false,
      isEmailValid: false,
      isPasswordValid: false,
      isPassConfValid: false,
  
      firstNameFeedback: null,
      lastNameFeedback: null,
      displayNameFeedback: null,
      emailFeedback: null,
      passwordFeedback: null,
      passConfFeedback: null,
    });
  }
  
  // validation will happen when the value of any field changes
  handleChange = e => {
    let field = e.target.name;
    this.setState({
      [field]: e.target.value
    });

    // capitalize the first letter of the field name (this will make sense in the next comment)
    field = field.charAt(0).toUpperCase() + field.slice(1);
    // find a method such as: 'validateFirstName' and execute it
    this['validate' + field](e);
  };

  // looks through all fields that can be validated, and calls the dedicated validation method
  validateFields = () => {
    Object.keys(this.state)
    .filter(attr => attr.match(/^is.*Valid$/))
    .forEach(attr => {
      let field = attr.replace('is', '').replace('Valid', '');
      this['validate' + field]({
        target: document.getElementById(field.charAt(0).toLowerCase() + field.slice(1)),
        type: 'submit'
      });
    });
  }
  
  // This method is used by two separate fields
  validateName = e => {
    let name = e.target.value;
    let feedback = Feedback['name'][0];
    let isNameValid = true;
    if(name === '') {
      feedback = Feedback['name'][1];
      isNameValid = false;
    }
    else if(!name.match(/^[A-Za-z]+$/)){
      feedback = Feedback['name'][2];
      isNameValid = false;
    }

    let field = e.target.name;
    field = field.charAt(0).toUpperCase() + field.slice(1);

    this.setState({
      [e.target.name + 'Feedback']: feedback,
      ['is' + field + 'Valid']: isNameValid
    });
  };

  // These aliases are necessary because the 'validateFields' method expects each field to have a dedicated validation method.
  // Each validation method identifier is expected to include the name of the field it's responsible for validating.
  // This way I can call all validation methods procedurally and keep my code DRY
  validateFirstName = this.validateName;
  validateLastName = this.validateName;
  
  validateDisplayName = e => {
    let displayName = e.target.value;
    let re = /^[A-Za-z]+[A-Za-z\d_ ]*[A-Za-z\d]$/;
    let feedback = Feedback['displayName'][0];
    let isFieldValid = true;

    if(displayName === '' && e.type !== 'change') {
      if(this.state.firstName && this.state.lastName) {
        this.setState({ displayName: this.state.firstName + ' ' + this.state.lastName });
      } else {
        feedback = Feedback['displayName'][1];
        isFieldValid = false;
      }
    }
    else if(displayName.length < 2) {
      feedback=Feedback['displayName'][2];
      isFieldValid = false;
    }
    else if(!displayName.match(re)) {
      feedback = Feedback['displayName'][3];
      isFieldValid = false;
    }
    else if(filter.isProfane(displayName)) {
      feedback = Feedback['displayName'][4];
      isFieldValid = false;
    }

    this.setState({
      displayNameFeedback: feedback,
      isDisplayNameValid: isFieldValid,
    });
  };

  validateEmail = e => {
    let email = e.target.value;
    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    let feedback = Feedback['email'][0];
    let isEmailValid = true;

    if(email === '') {
      feedback = Feedback['email'][1];
      isEmailValid = false;
    }
    else if(!email.match(re)){
      feedback = Feedback['email'][2];
      isEmailValid = false;
    }
    
    this.setState({
      emailFeedback: feedback,
      isEmailValid,
    });
    
    if(isEmailValid) {
      this.props.isEmailAvailable(email, () => {
        this.setState({
          emailFeedback: Feedback['email'][3],
          isEmailValid: false
        });
      });
    }
  };

  validatePassword = e => {
    let password = e.target.value;
    let feedback = Feedback['password'][0];
    let isFieldValid = true;

    let validState = {
      lengthReq: true,
      numReq: true,
      charReq: true
    }

    if(password === '') {
      feedback = Feedback['password'][1];
      isFieldValid = false;
    }
    else {
      if(password.length < 6) {
        validState.lengthReq = false;
        isFieldValid = false;
      }
      if(!password.match(/\d/)) {
        validState.numReq = false;
        isFieldValid = false;
      }
      if(!(password.match(/[a-z]/) && password.match(/[A-Z]/))) {
        validState.charReq = false;
        isFieldValid = false;
      }
      if(!isFieldValid) {
        let fbs = Object.keys(validState).filter(key => !validState[key]);
        let fb = '';
        if(fbs.includes('lengthReq')) fb += Feedback['password'][2] + '|';
        if(fbs.includes('charReq')) fb += Feedback['password'][3] + '|';
        if(fbs.includes('numReq')) fb += Feedback['password'][4] + '|';
        if(fbs !== '') feedback = this.getPasswordFeedback(fb);
      }
    }

    this.setState({
      passwordFeedback: feedback,
      isPasswordValid: isFieldValid
    });
  };
  
  validatePassConf = e => {
    let passConf = e.target.value;
    let feedback = Feedback['passConf'][0];
    let isFieldValid = true;

    if(passConf === '') {
      feedback = Feedback['passConf'][1];
      isFieldValid = false;
    }
    else if(!this.state.isPasswordValid) {
      feedback = Feedback['passConf'][2];
      isFieldValid = false;
    }
    else if(passConf !== this.state.password) {
      feedback = Feedback['passConf'][3];
      isFieldValid = false;
    }

    this.setState({
      passConfFeedback: feedback,
      isPassConfValid: isFieldValid
    });
  };

  // on submit, first validate all fields, then make the request.
  // some fields may require an http request of their own, which will happen before the final signup request. (eg check username availability)
  handleSubmit = e => {
    e.preventDefault();
    this.validateFields();
    this.props.handleSignup({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      displayName: this.state.displayName,
      email: this.state.email,
      password: this.state.password
    });
    this.setInitialState();
  };

  // this method is responsible for splitting password feedback when then are multiple messages.
  // this doesn't only need to be used for passwords. At the time of writing this code, only passwords contained multiple feedbacks.
  getPasswordFeedback = (fbs) => {
    fbs = fbs.split('|');
    fbs.pop();
    return <ul>
      {fbs.map(fb =>
        <li>{fb}</li>
      )}
    </ul>;
  }

  // this helps keep my code DRY
  ControlGroup = ({ id, labelText, type='text' }) => {
    return (
      <Form.Group controlId={id}>
        <Form.Label>{labelText}</Form.Label>
        <Form.Control
          type={type}
          name={id}
          value={this.state[id]}
          onChange={this.handleChange}
          onBlur={this['validate' + id.charAt(0).toUpperCase() + id.slice(1)]}
          isValid={this.state[id + 'Feedback'] && this.state['is' + id.charAt(0).toUpperCase() + id.slice(1) + 'Valid']}
          isInvalid={this.state[id + 'Feedback'] && !this.state['is' + id.charAt(0).toUpperCase() + id.slice(1) + 'Valid']}
        />
        {/* <Form.Control.Feedback type="valid">{this.state[id + 'Feedback']}</Form.Control.Feedback> */}
        <Form.Control.Feedback type="invalid">{this.state[id + 'Feedback']}</Form.Control.Feedback>
      </Form.Group>
    );
  }
  
  render() {
    return <Container
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card>
        <Card.Body>
          <Form
            autoComplete='off'
            onSubmit={this.handleSubmit}
          >
            <Row>
              <Col><this.ControlGroup id="firstName" labelText="First Name" /></Col>
              <Col><this.ControlGroup id="lastName" labelText="Last Name" /></Col>
            </Row>
            
            <this.ControlGroup id="displayName" labelText="Display Name" />
            <this.ControlGroup id="email" labelText="Email" />
            <this.ControlGroup id="password" labelText="Password" type="password"/>
            <this.ControlGroup id="passConf" labelText="Confirm Password" type="password"/>

            <div style={{
              display: 'flex',
              flexDirection: 'row-reverse',
            }}>
              <Button variant="secondary">Cancel</Button>
              <Button variant="outline-success" onClick={this.handleSubmit}>Submit</Button>
            </div>  

          </Form>
        </Card.Body>
      </Card>
    </Container>
  }
}

// static feedback data
const Feedback = {
  'name': [
    'Looks good.',
    'This field is required.',
    'The name can only contain alphabetic characters.'
  ],
  'displayName': [
    'Looks good.',
    'This field is required.',
    'The name is too short',
    'This name contains invalid characters.',
    'This name contains inappropriate language.'
  ],
  'email': [
    'Looks good.',
    'This field is required.',
    'Please enter a valid email address.',
    'This email has already been taken.'
  ],
  'password': [
    'Looks good.',
    'This field is required.',
    'Must contain a minimum of 6 characters',
    'Must contain both uppercase and lowercase letters.',
    'Must contain at least one number.'
  ],
  'passConf': [
    'Looks good.',
    'This field is required.',
    'The password is invalid',
    'The confirmation does not match the entered password.'
  ]
};

export default SignupPage;