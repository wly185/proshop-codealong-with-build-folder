import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  let history = useHistory();
  let location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';
  const { loading, error, userInfo } = userRegister ? userRegister : '';

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setMessage('passwords do not match');
    } else {
      dispatch(register(name, email, password));
      // console.log(name,email, password);}
    }
  };

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, redirect, history]);

  return (
    <FormContainer>
      <h1>sign up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader></Loader>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>name</Form.Label>
          <Form.Control
            type='text'
            placeholder='enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

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

        <Form.Group controlId='password2'>
          <Form.Label>confirm password</Form.Label>
          <Form.Control
            type='password'
            placeholder='re-enter password'
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          onClick={(e) => submitHandler(e)}
        >
          sign up
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
