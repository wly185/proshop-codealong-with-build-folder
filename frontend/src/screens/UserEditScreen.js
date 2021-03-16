import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = ({ match }) => {
  const userId = match.params.id;

  const dispatch = useDispatch();
  const history = useHistory();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate
  } = userUpdate;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/admin/userlist');
      // console.log('screen, useeffect');
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, user, userId, history, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
    // console.log('screen, handler');
  };

  return (
    <Fragment>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        go back
      </Link>
      <h1>edit user</h1>
      {/* <p>user {JSON.stringify(user)}</p> */}

      {error && <Message variant='danger'>{error}</Message>}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {loading && <Loader></Loader>}
      {loadingUpdate && <Loader />}
      {userDetails ? (
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

            <Form.Group controlId='email'>
              <Form.Label>email address</Form.Label>
              <Form.Control
                placeholder={email}
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='isadmin'>
              {/* <Form.Label>is admin</Form.Label> */}
              <Form.Check
                type='checkbox'
                label='is admin'
                inline='true'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
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
      ) : (
        <Message variant='danger'>no data</Message>
      )}
    </Fragment>
  );
};

export default UserEditScreen;
