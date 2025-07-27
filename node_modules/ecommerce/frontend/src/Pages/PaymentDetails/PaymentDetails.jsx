import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentDetails.css';

const PaymentDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState(null);

  const fetchDetails = async () => {
    try {
      const { data } = await axios.get(`/api/v1/order/orders/${orderId}`);
      setOrder(data.data);
    } catch (err) {
      console.error("Gagal ambil detail pembayaran", err);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const { data } = await axios.get(`/api/v1/payment/status/${orderId}`);

      if (data.status === 'settlement' || data.status === 'capture') {
        if (order?.paymentInfo?.status !== data.status) {
          await axios.put(`/api/v1/order/orders/pay/${orderId}`, {
            paymentInfo: {
              status: data.status,
              va_number: data.va_number,
              bank: data.bank,
              method: order?.paymentInfo?.type || '',
            }
          });
          setSuccessMessage('✅ Pembayaran berhasil!');
          fetchDetails();
        }
      }
    } catch (error) {
      console.error("Gagal cek status pembayaran:", error.message);
    }
  };

  // Countdown timer
  useEffect(() => {
    let interval;
    if (order?.paymentInfo?.expiry_time) {
      const expiry = new Date(order.paymentInfo.expiry_time).getTime();

      interval = setInterval(() => {
        const now = Date.now();
        const diff = expiry - now;

        if (diff <= 0) {
          clearInterval(interval);
          setRemainingTime(0);
        } else {
          setRemainingTime(diff);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [order?.paymentInfo?.expiry_time]);

  useEffect(() => {
    fetchDetails();
    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const formatCountdown = (ms) => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  if (loading) return <p>Memuat detail pembayaran...</p>;
  if (!order) return <p>Order tidak ditemukan.</p>;

  const { paymentInfo, totalPrice } = order;
  const {
    type,
    va_number,
    bank,
    qr_string,
    redirectUrl,
    store,
    payment_code,
    status,
    midtrans_order_id,
    expiry_time
  } = paymentInfo || {};

  const generateQRUrl = qr_string
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr_string)}`
    : null;

  return (
    <div className="payment-details-container">
      {/* Kiri: Info Pembayaran */}
      <div className="payment-info">
        <h2>Detail Pembayaran</h2>

        <p><strong>Metode:</strong> {type?.toUpperCase() || '-'}</p>
        <p><strong>Status Pembayaran:</strong> {status}</p>
        <p><strong>Total Tagihan:</strong> Rp{totalPrice.toLocaleString('id-ID')}</p>
        <p><strong>Order ID:</strong> {midtrans_order_id}</p>

        {va_number && bank && (
          <>
            <p><strong>Bank:</strong> {bank?.toUpperCase()}</p>
            <p><strong>Nomor Virtual Account:</strong> {va_number}</p>
          </>
        )}

        {["alfamart", "indomaret"].includes(type) && store && (
          <>
            <p><strong>Store:</strong> {store?.toUpperCase()}</p>
            <p><strong>Kode Pembayaran:</strong> {payment_code || '-'}</p>
            <p>Silakan pergi ke kasir <strong>{store?.toUpperCase()}</strong> dan tunjukkan kode ini untuk membayar.</p>
          </>
        )}

        {["gopay", "ovo", "dana", "shopeepay"].includes(type) && (
          <>
            <p>Setelah membuka aplikasi <strong>{type?.toUpperCase()}</strong>, periksa notifikasi untuk menyelesaikan pembayaran.</p>
            {redirectUrl && (
              <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
                Klik di sini jika tidak diarahkan otomatis.
              </a>
            )}
          </>
        )}

        {expiry_time && (
          <p><strong>Berlaku hingga:</strong> {new Date(expiry_time).toLocaleString('id-ID')}</p>
        )}

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>

      {/* Kanan: QR / Timer */}
      <div className="qr-section">
        {type === "qris" && qr_string && (
          <>
            <img src={generateQRUrl} alt="QRIS QR Code" />
          </>
        )}

        {remainingTime !== null && (
          <p className={`countdown-timer ${remainingTime <= 0 ? 'expired' : ''}`}>
            {remainingTime <= 0
              ? '⛔ Waktu pembayaran telah habis'
              : `⏳ Sisa waktu pembayaran: ${formatCountdown(remainingTime)}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
