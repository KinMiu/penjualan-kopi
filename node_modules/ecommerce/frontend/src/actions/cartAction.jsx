// redux/actions/cartAction.js
import axios from 'axios';
import {
  SET_CART,
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CLEAR_CART,
  SAVE_SHIPPING_INFO
} from '../constants/cartConstants';

export const fetchUserCart = (userId) => async (dispatch) => {
  const { data } = await axios.get(`/api/v1/cart/${userId}`);
  dispatch({ type: SET_CART, payload: data.items });
};

export const addItemToCart = (userId, productId, quantity) => async (dispatch) => {
  const { data } = await axios.post('/api/v1/cart/add', { userId, productId, quantity });
  dispatch({ type: ADD_TO_CART, payload: data.items });
};

export const removeFromCart = (userId, productId) => async (dispatch) => {
  const { data } = await axios.post('/api/v1/cart/remove', { userId, productId });
  dispatch({ type: REMOVE_ITEM_FROM_CART, payload: data.items });
};

export const clearCart = (userId) => async (dispatch) => {
  await axios.delete(`/api/v1/cart/clear/${userId}`);
  dispatch({ type: CLEAR_CART });
};  

export const saveShippingInfo = (data) => (dispatch) => {
  dispatch({ type: SAVE_SHIPPING_INFO, payload: data });
};