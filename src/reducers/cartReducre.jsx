import {
  SET_CART,
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CLEAR_CART,
  SAVE_SHIPPING_INFO
} from '../constants/cartConstants';

const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
  switch (action.type) {
    case SET_CART:
      return { ...state, cartItems: action.payload };
    case ADD_TO_CART:
      return { ...state, cartItems: action.payload };
    case REMOVE_ITEM_FROM_CART:
      return { ...state, cartItems: action.payload };
    case CLEAR_CART:
      return { ...state, cartItems: [] };
    case SAVE_SHIPPING_INFO:
      return { ...state, shippingInfo: action.payload };
    default:
      return state;
  }
};

export { cartReducer };