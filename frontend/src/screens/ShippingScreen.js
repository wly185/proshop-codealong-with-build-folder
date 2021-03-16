import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import FormContainer from '../components/FormContainer';
import CheckOutSteps from '../components/CheckOutSteps';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart ? cart : '';

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();
  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push('/payment');
  };

  return (
    <div>
      {/* <p>rdux state - shipping address{JSON.stringify(cart.shippingAddress)}</p> */}
      <CheckOutSteps step1 step2 />
      <FormContainer>
        <h1>shipping</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='address'>
            <Form.Label>shipping address</Form.Label>
            <Form.Control
              type='text'
              placeholder='enter address'
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='city'>
            <Form.Label>city</Form.Label>
            <Form.Control
              type='text'
              placeholder='enter city'
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='postalCode'>
            <Form.Label>postal code</Form.Label>
            <Form.Control
              type='text'
              placeholder='enter postal code'
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='country'>
            <Form.Label>country</Form.Label>
            <Form.Control
              type='text'
              placeholder='enter country'
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button onClick={(e) => submitHandler(e)} variant='primary'>
            continue
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default ShippingScreen;
