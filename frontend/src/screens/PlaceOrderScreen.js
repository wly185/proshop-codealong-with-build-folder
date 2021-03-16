import React, { useEffect } from 'react';

import { Link, useHistory } from 'react-router-dom';
import { Button, Row, Col, Image, ListGroup, Card } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckOutSteps from '../components/CheckOutSteps';
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  const history = useHistory();

  //calculate prices
  cart.itemsPrice = twoDecimalPlaces(
    cart.cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  );
  cart.shippingPrice = twoDecimalPlaces(cart.itemsPrice > 100 ? 10 : 0);
  cart.taxPrice = twoDecimalPlaces(0.15 * cart.itemsPrice);
  cart.totalPrice = [cart.itemsPrice, cart.shippingPrice, cart.taxPrice].reduce(
    (total, i) => total + i,
    0
  );

  function twoDecimalPlaces(num) {
    return Math.round(num * 100) / 100;
  }

  // order to be created
  const orderToBeCreated = {
    orderItems: cart.cartItems.map((i) => ({
      qty: i.qty,
      product: i.product
    })),
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice
  };

  useEffect(() => {
    if (success) {
      history.push(`/orders/${order._id}`);
      // console.log('screen,order success', order._id);
      //ORDER_CREATE_SUCCESS
    }
  }, [history, success, order]);

  //handlers
  const placeOrderHandler = () => {
    dispatch(createOrder(orderToBeCreated));
    // console.log('screen,handler', orderToBeCreated);
    //ORDER_CREATE_REQUEST
  };

  return (
    <div>
      <CheckOutSteps step1 step2 step3 step4 />
      {/* <p>order to be created{JSON.stringify(orderToBeCreated)}</p>
      <p>
        order captured and reflected from the backend
        {order && JSON.stringify(order)}
      </p> */}

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>shipping</h2>
              <p>
                <strong>address: </strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>payment method</h2>
              <strong>method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>order items</h2>
              {cart.cartItems.length === 0 || !cart.cartItems ? (
                <Message>your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
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
                  <Col>${cart.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>shipping</Col>
                  <Col>${cart.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>tax</Col>
                  <Col>${cart.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>total</Col>
                  <Col>${cart.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cart.cartItems === 0}
                onClick={placeOrderHandler}
              >
                place order
              </Button>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
