import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { addNewProductReducer, allProductReviewReducer, deleteProductReviewReducer, deleteUpdateProductReducer, newReviewReducer, productReducer, rekomendasiProductReducer, singleProductReducer } from './reducers/productReducer';
import { allUserReducer, profileReducer, singleUserDetailReducer, updateAndDeleteUserReducer, userReducer } from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducre';
import { allOrderReducer, myOrderReducer, newOrderReducer, singleOrderDetailsReducer, updateAndDeleteOrderReducer } from './reducers/orderReducer';

const reducer = combineReducers({
    cart: cartReducer,
    products: productReducer,
    rekomendasiProduct: rekomendasiProductReducer,
    singleProduct: singleProductReducer,
    user: userReducer,
    profile: profileReducer,
    newOrder: newOrderReducer,
    myOrders: myOrderReducer,
    singleOrderDetails: singleOrderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: addNewProductReducer,
    deleteUpdateProduct: deleteUpdateProductReducer,
    allOrder: allOrderReducer,
    updateAndDeleteOrder: updateAndDeleteOrderReducer,
    allUser: allUserReducer,
    singleUserDetail: singleUserDetailReducer,
    updateAndDeleteUser:updateAndDeleteUserReducer,
    allProductReview:allProductReviewReducer,
    deleteProductReview:deleteProductReviewReducer,
});

const initialState = {
  cart: {
    cartItems: [],
    shippingInfo: {},
  }
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;