import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import FormContainer from '../components/FormContainer';
import CheckOutSteps from '../components/CheckOutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart ? cart : '';
  const { address, city, postalCode, country } = shippingAddress;

  if (!shippingAddress) {
    history.push('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push('/payment');
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <div>
      {/* <p>rdux state - shipping address{JSON.stringify(cart.shippingAddress)}</p> */}

      <FormContainer>
        <CheckOutSteps step1 step2 step3 />
        <h1>payment method</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as='legend'>select method</Form.Label>
            <Col>
              <Form.Check
                type='radio'
                label='paypal or credit card'
                id='paypal'
                name='paymentMethod'
                value='paypal'
                checked
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                }}
              ></Form.Check>
            </Col>
          </Form.Group>

          <Button onClick={(e) => submitHandler(e)} variant='primary'>
            continue
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default PaymentScreen;
