import { useEffect } from "react";
import "./SingleOrderDetail.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { singleOrderDetail, clearError } from "../../actions/orderAction";
import Loader from "../../Components/Loader/Loder";
import { useAlert } from "react-alert";

const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

const SingleOrderDetail = () => {
  const { id } = useParams();
  const { order, error, loading } = useSelector((state) => state.singleOrderDetails);
  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    dispatch(singleOrderDetail(id));
  }, [dispatch, alert, error, id]);

  // Status pembayaran
  const paymentStatus = order?.paymentInfo?.status;
  const isPaid = paymentStatus === 'settlement' || paymentStatus === 'capture';

  // Tampilkan status pesanan berdasarkan logika baru
  let displayOrderStatus = '';
  if (!isPaid) {
    displayOrderStatus = 'Belum Dibayar';
  } else if (order?.orderStatus === 'Paid') {
    displayOrderStatus = 'Sedang Dikemas';
  } else if (order.orderStatus === 'Shipped') {
    displayOrderStatus = 'Dikirim';
  } else if (order.orderStatus === 'Delivered') {
    displayOrderStatus = 'Terkirim';
  } else {
    displayOrderStatus = order.orderStatus;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="order-detail-wrapper">
          <div className="order-detail-container">
            <h1>Order ID: #{order && order._id}</h1>

            <div className="order-section">
              <h2>Informasi Pengiriman</h2>
              <div className="info-pair">
                <p>Nama:</p>
                <span>{order?.userId?.name}</span>
              </div>
              <div className="info-pair">
                <p>Telepon:</p>
                <span>{order?.shippingInfo?.phoneNo}</span>
              </div>
              <div className="info-pair">
                <p>Alamat:</p>
                <span>
                  {order?.shippingInfo &&
                    `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pincode}, ${order.shippingInfo.country}`}
                </span>
              </div>
            </div>

            <div className="order-section">
              <h2>Pembayaran</h2>
              <div className="info-pair">
                <p>Status:</p>
                <span className={isPaid ? "status-paid" : "status-unpaid"}>
                  {isPaid ? "Sudah Dibayar" : "Belum Dibayar"}
                </span>
              </div>
              <div className="info-pair">
                <p>Total:</p>
                <span>{formatRupiah(order?.totalPrice || 0)}</span>
              </div>
            </div>

            <div className="order-section">
              <h2>Status Pesanan</h2>
              <div className="info-pair">
                <p>Status:</p>
                <span className={
                  displayOrderStatus === "Terkirim" ? "status-delivered"
                  : displayOrderStatus === "Dikirim" ? "status-shipped"
                  : displayOrderStatus === "Sedang Dikemas" ? "status-processing"
                  : "status-unpaid"
                }>
                  {displayOrderStatus}
                </span>
              </div>
            </div>

            <div className="order-section">
              <h2>Item Pesanan</h2>
              <div className="order-items">
                {order?.OrderItems?.map((item) => (
                  <div className="order-item" key={item.productId}>
                    <img src={item.image} alt={item.name} />
                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
                    <span>{item.quantity} x {formatRupiah(item.price)} = <strong>{formatRupiah(item.quantity * item.price)}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleOrderDetail;
