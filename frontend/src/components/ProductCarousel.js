import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const topProducts = useSelector((state) => state.topProducts);
  const { loading, error, products } = topProducts;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return (
    <>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      {products && (
        <Carousel pause='hover' className='bg-dark'>
          {products.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/products/${product._id}`}>
                <Image src={product.image} alt={product.name} fluid></Image>
                <Carousel.Caption className='carousel-caption'>
                  <h3>
                    {product.name}({product.price})
                  </h3>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default ProductCarousel;
