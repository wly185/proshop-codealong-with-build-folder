import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { LinkContainer } from 'react-router-bootstrap';
import { Button, Table, Row, Col } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';

import {
  listOrders
  // ,
  // deleteOrder,
  // createOrder
} from '../actions/orderActions';
import {} from '../constants/orderConstants';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const orderList = useSelector((state) => state.orderList);
  const { orders, error, loading } = orderList;

  // const orderDelete = useSelector((state) => state.orderDelete);
  // const {
  //   error: errorDelete,
  //   loading: loadingDelete,
  //   success: successDelete
  // } = orderDelete;

  // const orderCreate = useSelector((state) => state.orderCreate);
  // const {
  //   error: errorCreate,
  //   loading: loadingCreate,
  //   success: successCreate,
  //   product: createdProduct
  // } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo.isAdmin) {
      history.push('/login');
    } else {
      dispatch(listOrders());
    }
    // if (successCreate && createdProduct) {
    //   history.push(`/admin/product/${createdProduct._id}/edit`);
    // } else {
    //   dispatch(listProducts());
    // }

    // if (successDelete) {
    //   dispatch(listProducts());
    // }
  }, [dispatch, history, userInfo]);

  return (
    <Fragment>
      <Row className='align-items-center'>
        <Col>
          <h1>orders</h1>
        </Col>
      </Row>

      {loading && <Loader />}
      {error && <Message variant='danger'>{error}</Message>}

      {orders && (
        <Table striped border hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                <td>{order.user}</td>
                <td>{order.paidAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <i style={{ color: 'green' }} className='fas fa-check'></i>
                  ) : (
                    <i style={{ color: 'red' }} className='fas fa-times'></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <i style={{ color: 'green' }} className='fas fa-check'></i>
                  ) : (
                    <i style={{ color: 'red' }} className='fas fa-times'></i>
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
    </Fragment>
  );
};

export default OrderListScreen;
