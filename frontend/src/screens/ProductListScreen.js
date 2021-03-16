import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { LinkContainer } from 'react-router-bootstrap';
import { Button, Table, Row, Col } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';

import {
  listProducts,
  deleteProduct,
  createProduct
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

const ProductListScreen = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageNumber = match.params.pageNumber || 1;

  const productList = useSelector((state) => state.productList);
  const { products, error, loading, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    error: errorDelete,
    loading: loadingDelete,
    success: successDelete
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    error: errorCreate,
    loading: loadingCreate,
    success: successCreate,
    product: createdProduct
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo.isAdmin) {
      history.push('/login');
    }
    if (successCreate && createdProduct) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts('', pageNumber));
    }

    if (successDelete) {
      dispatch(listProducts('', pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successCreate,
    successDelete,
    createdProduct,
    pageNumber
  ]);

  const deleteHandler = (id) => {
    if (window.confirm('are you sure')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <Fragment>
      {/* <p>users {JSON.stringify(products)}</p> */}
      <Row className='align-items-center'>
        <Col>
          <h1>products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i>create product
          </Button>
        </Col>
      </Row>
      {/* <h1>products</h1> */}
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {loading && <Loader />}
      {error && <Message variant='danger'>{error}</Message>}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {successDelete && <Message variant='success'>{successDelete}</Message>}
      {successCreate && <Message variant='success'>{successCreate}</Message>}
      {products && (
        <>
          <Table striped border hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit' />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} isAdmin={true} />
        </>
      )}
    </Fragment>
  );
};

export default ProductListScreen;
