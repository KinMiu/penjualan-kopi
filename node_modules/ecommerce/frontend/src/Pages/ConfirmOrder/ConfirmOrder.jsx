import './ConfirmOrder.css';
import CheckOutStep from '../../Components/CheckOutStep/CheckOutStep';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticate } = useSelector((state) => state.user);

  const subTotal = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  const shippingCharges = subTotal > 100000 ? 0 : 10000;
  const tax = subTotal * 0.1;
  const Total = subTotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.state}, ${shippingInfo.city}`;

  const proceedPaymentHandler = () => {
    const data = {
      subTotal,
      shippingCharges,
      tax,
      Total,
    };
    sessionStorage.setItem('orderInfo', JSON.stringify(data));
    if (isAuthenticate === true) {
      navigate('/process/payment');
    }
  };

  return (
    <>
      <div className="checkout-stepper-wrapper">
        <CheckOutStep activeStep={1} />
      </div>

      <section className="confirm-order">
        <div className="confirm-container">
          <div className="left">
            <div className="shipping-info-box">
              <h1 className="shipping-heading-1">Shipping Info</h1>
              <div className="flex-gap">
                <span><b>Name</b>:</span>
                <span>{user?.name}</span>
              </div>
              <div className="flex-gap">
                <span><b>Phone</b>:</span>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div className="flex-gap">
                <span><b>Address</b>:</span>
                <span>{address}</span>
              </div>
            </div>

            <div className="cart-info-box">
              <h1 className="shipping-heading-1">Your Cart Items</h1>
              {cartItems.map((item, index) => (
                <div className="item-1" key={index}>
                  <div className="img-name">
                    <Link to={`/product/${item.productId?._id}`}>
                      <img src={item.productId?.images?.[0]?.url} alt={item.productId?.name} />
                    </Link>
                    <Link to={`/product/${item.productId?._id}`}>
                      <span>{item.productId?.name}</span>
                    </Link>
                  </div>
                  <span className="quantity-ruppee">
                    {item.quantity} x Rp{item.productId?.price?.toLocaleString('id-ID')} = <b>Rp{(item.quantity * item.productId?.price).toLocaleString('id-ID')}</b>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="right">
            <h1 className="shipping-heading">Order Summary</h1>
            <div>
              <div className="flex-space">
                <span>SubTotal:</span>
                <span>Rp{subTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex-space">
                <span>Shipping charges:</span>
                <span>Rp{shippingCharges.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex-space">
                <span>PPN (10%):</span>
                <span>Rp{tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex-space">
                <span>Total:</span>
                <span>Rp{Total.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button
              className="procced-to-pay"
              onClick={proceedPaymentHandler}
            >
              Proceed To Pay
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmOrder;
