import { useEffect, useState } from 'react';
import './Payment.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUserCart } from '../../actions/cartAction';

// Icon imports
import qris from '../../assets/Icons/Qris.png';
// import ovo from '../../assets/Icons/Ovo.png';
// import dana from '../../assets/Icons/Dana.png';
// import gopay from '../../assets/Icons/Gopay.png';
// import shopeepay from '../../assets/Icons/ShopeePay.webp';
import bni from '../../assets/Icons/BNI.png';
import bri from '../../assets/Icons/BRI.png';
import mandiri from '../../assets/Icons/Mandiri.png';
import bca from '../../assets/Icons/BCA.webp';
import indomaret from '../../assets/Icons/Indomaret.png';
import alfamaret from '../../assets/Icons/Alfamaret.png';

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const { cartItems, shippingInfo } = useSelector(state => state.cart);

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localCart, setLocalCart] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const paymentOptions = [
    {
      category: "QRIS",
      methods: [{ name: "QRIS", value: "qris", icon: qris }],
    },
    // {
    //   category: "E-Wallet",
    //   methods: [
    //     { name: "OVO", value: "ovo", icon: ovo },
    //     { name: "DANA", value: "dana", icon: dana },
    //     { name: "GoPay", value: "gopay", icon: gopay },
    //     { name: "ShopeePay", value: "shopeepay", icon: shopeepay },
    //   ],
    // },
    {
      category: "Virtual Account",
      methods: [
        { name: "BNI", value: "bni_va", icon: bni },
        { name: "BRI", value: "bri_va", icon: bri },
        { name: "Mandiri", value: "mandiri_va", icon: mandiri },
        { name: "BCA", value: "bca_va", icon: bca },
      ],
    },
    {
      category: "Convenience Store",
      methods: [
        { name: "Alfamart", value: "alfamart", icon: alfamaret },
        { name: "Indomaret", value: "indomaret", icon: indomaret },
      ],
    },
  ];

  useEffect(() => {
    if (user?._id) {
      if (!cartItems || cartItems.length === 0) {
        dispatch(fetchUserCart(user._id));
      } else {
        setLocalCart(cartItems);
      }
    }
  }, [dispatch, user?._id, cartItems]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setLocalCart(cartItems);
    }
  }, [cartItems]);

  const handleMidtransPayment = async () => {
    try {
      setLoading(true);

      if (!shippingInfo?.address || !shippingInfo?.phoneNo) {
        alert('Alamat pengiriman belum diisi. Silakan isi terlebih dahulu.');
        navigate('/shipping');
        return;
      }

      if (!orderInfo) {
        alert("Informasi order tidak ditemukan!");
        return;
      }

      // 1. Buat order di backend
      const orderPayload = {
        shippingInfo,
        OrderItems: localCart.map(item => ({
          productId: item.productId._id || item.productId,
          name: item.productId.name || item.name,
          price: item.productId.price || item.price,
          quantity: item.quantity,
          image: item.productId.images?.[0]?.url || item.image,
        })),
        itemsPrice: orderInfo.subTotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.Total,
      };

      const orderRes = await axios.post('/api/v1/order/orders/place', orderPayload);
      const orderId = orderRes.data.orderId;

      // 2. Dapatkan Snap Token dan redirect_url
      const { data } = await axios.post('/api/v1/payment/midtrans-token', {
        orderId,
        method: selectedMethod,
      });

      // 3. Arahkan ke halaman detail pembayaran
      navigate(`/payment-details/${orderId}`, {
        state: {
          method: selectedMethod,
          orderId,
          total: orderInfo.Total,
          qrUrl: data.qrUrl || null,
          vaNumber: data.vaNumber || null,
          bank: data.bank || null,
          snapToken: data.snapToken,
        }
      });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Terjadi kesalahan saat memulai pembayaran');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="midtransPaymentContainer">
      <div className="midtransBox">
        <h2 className="title">Pilih Pembayaran</h2>
        <div className="total-tagihan">
          <span>Total Tagihan:</span>
          <h3>Rp{orderInfo?.Total?.toLocaleString('id-ID') || '0'}</h3>
        </div>

        <div className="payment-methods">
          {paymentOptions.map((option, i) => (
            <div key={i} className="payment-category">
              <button
                className="category-btn"
                onClick={() =>
                  setExpandedCategory(expandedCategory === option.category ? null : option.category)
                }
              >
                {expandedCategory === option.category ? '▼' : '▶'} {option.category}
              </button>
              {expandedCategory === option.category && (
                <ul className="method-list">
                  {option.methods.map((method, idx) => (
                    <li
                      key={idx}
                      className={`method-item ${selectedMethod === method.value ? 'active-method' : ''}`}
                      onClick={() => setSelectedMethod(method.value)}
                      style={{ cursor: 'pointer', padding: '10px' }}
                    >
                      <img
                        src={method.icon}
                        alt={method.name}
                        className="method-icon"
                        style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
                      />
                      {selectedMethod === method.value && (
                        <div style={{ fontSize: '0.9rem', color: '#007bff', marginTop: '4px' }}>Terpilih</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <button
          className="pay-button"
          onClick={() => setShowConfirm(true)}
          disabled={loading || !localCart.length || !selectedMethod}
        >
          {loading ? 'Memproses...' : 'Bayar Sekarang'}
        </button>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Konfirmasi Pembelian</h3>
            <p>
              Apakah kamu yakin ingin melakukan pembayaran sebesar{' '}
              <strong>Rp{orderInfo?.Total?.toLocaleString('id-ID') || '0'}</strong>?
            </p>
            <div className="confirm-actions">
              <button onClick={() => setShowConfirm(false)} className="cancel-btn">BATAL</button>
              <button onClick={handleMidtransPayment} className="confirm-btn">YA, BAYAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
