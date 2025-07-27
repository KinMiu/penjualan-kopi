import { useEffect, useState } from 'react';
import './ProcessOrder.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { clearError, singleOrderDetail, updateOrder } from '../../actions/orderAction';
import Loader from '../../Components/Loader/Loder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useAlert } from 'react-alert';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import SideBar from '../SideBar/SideBar';

const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

const ProcessOrder = () => {
  const alert = useAlert();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { order, error, loading } = useSelector((state) => state.singleOrderDetails);
  const { isUpdated, message, error: updateError } = useSelector((state) => state.updateAndDeleteOrder);

  const [orderStatus, setOrderStatus] = useState('');

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('orderStatus', orderStatus);
    dispatch(updateOrder(id, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearError());
    }
    if (isUpdated) {
      alert.success(message);
      dispatch({ type: UPDATE_ORDER_RESET });
      navigate('/admin/orders');
    }
    dispatch(singleOrderDetail(id));
  }, [dispatch, alert, error, id, isUpdated, updateError]);

  return (
    <section className="confirm-order">
      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">Proses Pesanan</h1>
          {loading ? (
            <Loader />
          ) : (
            <div className="confirm-container">
              <div className="left">
                <div className="shipping-info-box">
                  <h2 className="section-title">Informasi Pengiriman</h2>
                  <div className="info-row"><strong>Nama:</strong> {order.userId?.name}</div>
                  <div className="info-row"><strong>Telepon:</strong> {order.shippingInfo?.phoneNo}</div>
                  <div className="info-row"><strong>Alamat:</strong> {`${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.state}, ${order.shippingInfo?.pincode}, ${order.shippingInfo?.country}`}</div>
                </div>

                <div className="orderDetailsPaymentStatus">
                  <div className="payment-info">
                    <h2 className="section-title">Pembayaran</h2>
                    <div className="infoPayment">
                      <span className={['settlement', 'capture'].includes(order.paymentInfo?.status) ? 'greenColor' : 'redColor'}>
                        {['settlement', 'capture'].includes(order.paymentInfo?.status) ? 'Sudah Dibayar' : 'Belum Dibayar'}
                      </span>
                      <span><strong>Total:</strong> {formatRupiah(order.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="status-info">
                    <h2 className="section-title">Status Pesanan</h2>
                    <span className={order.orderStatus === 'Delivered' ? 'greenColor' : 'redColor'}>
                      {order.orderStatus === 'Paid'
                        ? 'Barang sedang dikemas (Processing)'
                        : order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="cart-info-box">
                  <h2 className="section-title">Item Pesanan</h2>
                  <div>
                    {order.OrderItems?.map((item, index) => (
                      <div className="item-1" key={index}>
                        <div className="img-name">
                          <Link to={`/product/${item.productId}`}>
                            <img src={item.image} alt={item.name} className="item-img" />
                          </Link>
                          <Link to={`/product/${item.productId}`} className="item-name">
                            {item.name}
                          </Link>
                        </div>
                        <span className="quantity-rupiah">
                          {item.quantity} x {formatRupiah(item.price)} = <strong>{formatRupiah(item.quantity * item.price)}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="right">
                {order.orderStatus !== 'Delivered' && (
                  <form className="updateOrderForm" onSubmit={updateOrderSubmitHandler}>
                    <h2 className="section-title center">Update Status</h2>
                    <div>
                      <AccountTreeIcon />
                      <select onChange={(e) => setOrderStatus(e.target.value)} value={orderStatus}>
                        <option value="">Pilih Status</option>
                        {order.orderStatus === 'Paid' && <option value="Shipped">Dikirim</option>}
                        {order.orderStatus === 'Shipped' && <option value="Delivered">Terkirim</option>}
                      </select>
                    </div>
                    <Button id="createProductBtn" type="submit">Update</Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProcessOrder;
