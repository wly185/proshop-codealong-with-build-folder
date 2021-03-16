import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Alert
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  payOrder,
  deliverOrder
} from '../actions/orderActions';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match }) => {
  const dispatch = useDispatch();
  const orderId = match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  // const [delivered, setDelivered] = useState();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  // const order = useSelector((state) => state.orderDetails.order);

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    success: successPay,
    error: errorPay
  } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    success: successDeliver,
    error: errorDeliver
  } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);

  useEffect(() => {
    const addPayPalScript = async () => {
      //api call
      const { data: clientId } = await axios.get('/api/config/paypal');
      // console.log('api call', clientId);

      //create script tag dynamically and insert into html
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    //check for paypal script
    if (!order || successPay || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, match, successPay]);

  function successPaymentHandler(paymentResult) {
    dispatch(payOrder(orderId, paymentResult));
  }

  const buttonHandler = () => {
    dispatch(deliverOrder(orderId));
  };
  return (
    <>
      <h1>order {orderId}</h1>
      {/* <p>order{JSON.stringify(order)}</p> */}

      {error && <Message variant='danger'>{error}</Message>}
      {errorPay && <Message variant='danger'>{errorPay}</Message>}
      {errorDeliver && <Message variant='danger'>{errorDeliver}</Message>}
      {successPay && <Message variant='success'>{successPay}</Message>}
      {successDeliver && <Message variant='success'>{successDeliver}</Message>}
      {loading && <Loader />}
      {loadingDeliver && <Loader />}
      {loadingPay && <Loader />}
      {!error && order && userLogin && (
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>shipping</h2>
                <p>
                  <strong>name:</strong>
                  {order.user.name}
                </p>
                <p>
                  <strong>email:</strong>
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>
                <p>
                  <strong>address: </strong>
                  {order.shippingAddress.address},{order.shippingAddress.city},
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                <p>delivered: {JSON.stringify(order.isDelivered)}</p>
                <Alert variant='success'> some info</Alert>
                {order.isDelivered === true && (
                  <Message variant='success'>
                    order delivered on {order.deliveredAt.substring(0, 10)}
                  </Message>
                )}
                {order.isDelivered === false && (
                  <Message variant='info'>
                    order delivered not delivered yet
                  </Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>payment method</h2>
                <p>
                  <strong>method: </strong>
                  {order.paymentMethod}
                </p>
                <p>paid: {JSON.stringify(order.isPaid)}</p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>order items</h2>
                {order.orderItems.length === 0 || !order.orderItems ? (
                  <Message>your order is empty</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fluid
                              rounded
                            ></Image>
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product._id}`}>
                              {item.product.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ${item.product.price.toFixed(2)} = $
                            {item.qty * item.product.price.toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>order summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>total</Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {error && <Message variant='danger'>{error}</Message>}
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>

              {userLogin.userInfo.isAdmin === true &&
                order.isDelivered === false && (
                  <ListGroup>
                    <Button onClick={buttonHandler}>mark as delivered</Button>
                  </ListGroup>
                )}
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default OrderScreen;
