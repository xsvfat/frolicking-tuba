//login

import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import {
  FormGroup, FormControl, Jumbotron, Grid, Row, Col, Button
} from 'react-bootstrap';


class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  // handleUsernameChange(event) {
  //   this.setState({ username: event.target.value });
  // }

  // handlePasswordChange(event) {
  //   this.setState({ password: event.target.value });
  // }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={6} mdOffset={3}>
            <Jumbotron>
              <h1>Log In</h1>
              <form>
                <FormGroup
                  controlId="username"
                  //validationState={this.getValidationState()}
                >
                  <FormControl
                    type="text"
                    value={this.state.value}
                    placeholder="Email"
                    onChange={(event) => {
                      this.setState({ username: event.target.value });
                    }}
                  />
                </FormGroup>
                <FormGroup
                  controlId="password"
                  //validationState={this.getValidationState()}
                >
                  <FormControl
                    type="password"
                    value={this.state.value}
                    placeholder="Password"
                    onChange={(event) => {
                      this.setState({ password: event.target.value });
                    }}
                  />
                </FormGroup>
                <div>
                  <Button
                    bsStyle="primary"
                    onClick={(event) => {
                      event.preventDefault();
                      this.props.callback(this.state, 'signin', this);
                    }}
                  >Log In</Button>
                </div>
                <Link to="/signup">Sign Up</Link>
              </form>
            </Jumbotron>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Signin.propTypes = { callback: PropTypes.func };

export default withRouter(Signin);