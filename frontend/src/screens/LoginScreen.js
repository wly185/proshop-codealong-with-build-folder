import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin ? userLogin : '';
  let history = useHistory();
  let location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    // console.log(email, password);
  };

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, redirect, history]);

  return (
    <FormContainer>
      <h1>sign in</h1>
      {error && <Message variant='danger'></Message>}
      {loading && <Loader></Loader>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>password</Form.Label>
          <Form.Control
            type='password'
            placeholder='enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          onClick={(e) => submitHandler(e)}
        >
          sign in
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          new customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
