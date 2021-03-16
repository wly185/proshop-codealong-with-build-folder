import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';

const ProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const userLogin = useSelector((state) => state.userLogin);
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading: loadingOrder, error: errorOrders, orders } = useSelector(
    (state) => state.orderListMy
  );

  let history = useHistory();

  const { loading, error, user } = userDetails ? userDetails : '';

  const { userInfo } = userLogin ? userLogin : '';
  const { success } = userUpdateProfile ? userUpdateProfile : '';

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setMessage('passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [userInfo, history, user, dispatch]);

  return (
    <Fragment>
      <Row>
        <Col md={3}>
          <h2>user profile</h2>
          {message && <Message variant='danger'>{message}</Message>}
          {error && <Message variant='danger'>{error}</Message>}
          {success && <Message variant='success'>profile updated</Message>}
          {loading && <Loader></Loader>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>email address</Form.Label>
              <Form.Control
                type='text'
                placeholder={name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>email address</Form.Label>
              <Form.Control
                type='email'
                placeholder={email}
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
              update
            </Button>
          </Form>
        </Col>
        <Col md={9}>
          <h2>my orders</h2>
          {loadingOrder && <Loader />}
          {errorOrders && <Message variant='danger'>{errorOrders}</Message>}
          {orders && (
            <Table striped border hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i
                          className='fas fa-times'
                          style={{ color: 'red' }}
                        ></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i
                          className='fas fa-times'
                          style={{ color: 'red' }}
                        ></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/orders/${order._id}`}>
                        <Button variant='light' className='btn-sm'>
                          details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProfileScreen;
