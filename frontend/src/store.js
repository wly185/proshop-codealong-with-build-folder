import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; //for async calls
import { composeWithDevTools } from 'redux-devtools-extension'; //for devtools

import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productUpdateReducer,
  productCreateReducer,
  reviewCreateReducer,
  topProductsReducer
} from './reducers/productReducer.js';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer
} from './reducers/userReducer.js';
import { cartReducer } from './reducers/cartReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverReducer
} from './reducers/orderReducers';

const cartItemsFromStorage = window.localStorage.getItem('cartItems')
  ? JSON.parse(window.localStorage.getItem('cartItems'))
  : [];

// const cartItemsFromStorage = {};

const userInfoFromStorage = window.localStorage.getItem('userInfo')
  ? JSON.parse(window.localStorage.getItem('userInfo'))
  : null;

const shippingAddressFromStorage = window.localStorage.getItem(
  'shippingAddress'
)
  ? JSON.parse(window.localStorage.getItem('shippingAddress'))
  : '';

// console.log('persisted', persisted);
//https://stackoverflow.com/questions/45022445/js-ternary-functions-with-multiple-conditions

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage
  },
  userLogin: { userInfo: userInfoFromStorage }
};
//why the nesting

// const initialState = {};

//mount reducers you have created
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  productDelete: productDeleteReducer,
  productUpdate: productUpdateReducer,
  productCreate: productCreateReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,
  reviewCreate: reviewCreateReducer,
  topProducts: topProductsReducer
});

//store instance
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

// store.subscribe(() => getLocalStorage(store.getState().cart.cartItems));

export default store;
