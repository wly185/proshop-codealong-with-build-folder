import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { updateProduct, listProductDetails } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';

const ProductEditScreen = ({ match }) => {
  const productId = match.params.id;

  const dispatch = useDispatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate
  } = productUpdate;

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userInfo.isAdmin) {
      history.push('/login');
    }

    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(listProductDetails());
      history.push('/admin/productlist');
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setBrand(product.brand);
        setImage(product.image);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, history, successUpdate, userInfo.isAdmin]);

  const uploadFileHandler = async (e) => {
    // console.log('screen handler');
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.post('/api/upload', formData, config);
      // console.log('screen', data);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error.response.data);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        name,
        price,
        category,
        brand,
        description,
        image,
        countInStock,
        _id: productId
      })
    );
  };

  return (
    <Fragment>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        go back
      </Link>
      <h1>edit user</h1>
      {/* <p>user {JSON.stringify(user)}</p> */}

      {error && <Message variant='danger'>{error}</Message>}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

      {loading && <Loader />}
      {loadingUpdate && <Loader />}

      {productDetails && product && (
        <FormContainer>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>name</Form.Label>
              <Form.Control
                placeholder={name}
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>price</Form.Label>
              <Form.Control
                placeholder={price}
                type='text'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onClick={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>category</Form.Label>
              <Form.Control
                placeholder={category}
                type='text'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>brand</Form.Label>
              <Form.Control
                placeholder={brand}
                type='text'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>count in stock</Form.Label>
              <Form.Control
                placeholder={countInStock}
                type='text'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>description</Form.Label>
              <Form.Control
                placeholder={description}
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
        </FormContainer>
      )}
    </Fragment>
  );
};

export default ProductEditScreen;
