import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD
  //dont need update the add item takes care of it
  // CART_UPDATE_ITEM
} from '../constants/cartConstants';

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      //can only write statements within case
      const itemExists = state.cartItems.find(
        (i) => i.product === action.payload.product
      );

      //if you leave out the if statement it will lead to type error. because you have to add on an additional item
      if (itemExists) {
        return {
          ...state,
          //map method immutable, returns a copy. reducers cannot have any mutations
          cartItems: state.cartItems.map((x) =>
            x.product === itemExists.product ? action.payload : x
          )
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, action.payload] };
      }

    case CART_REMOVE_ITEM:
      // console.log('reducer/action', action);

      const itemToDelete = state.cartItems.find(
        (i) => i.product === action.payload.id
      );
      //dont need if statement, the filter will not remove anything if no match
      return {
        ...state,
        //filter method immutable, returns a copy. reducers cannot have any mutations
        cartItems: state.cartItems.filter(
          (x) => x.product !== itemToDelete.product
        )
      };

    // return state;

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload
      };
    case CART_SAVE_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };
    default:
      return state;
  }
};
