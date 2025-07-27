import { useEffect } from 'react';
import './Cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { MdRemoveShoppingCart } from 'react-icons/md';
import { fetchUserCart, addItemToCart, removeFromCart } from '../../actions/cartAction';

const Cart = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticate } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticate) {
      dispatch(fetchUserCart(user._id));
    }
  }, [dispatch, user?._id, isAuthenticate]);

  const increaseQuantity = (productId, quantity, stock) => {
    const newQuantity = quantity + 1;
    if (stock <= quantity) return;
    dispatch(addItemToCart({ userId: user._id, productId, quantity: newQuantity }));
  };

  const decreaseQuantity = (productId, quantity) => {
    const newQuantity = quantity - 1;
    if (1 >= quantity) return;
    dispatch(addItemToCart({ userId: user._id, productId, quantity: newQuantity }));
  };

  const removeItemFromCartHandler = (productId) => {
    dispatch(removeFromCart({ userId: user._id, productId }));
    alert.success('Produk berhasil dihapus dari keranjang');
  };

  const checkOutHandler = () => {
    if (isAuthenticate) {
      navigate('/shipping');
    } else {
      navigate('/auth?redirect=/shipping');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
  };

  return (
    <div className="cartPage">
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <MdRemoveShoppingCart className="emptyIcon" />
          <p>Keranjangmu kosong</p>
          <Link to="/products">
            <button className="shopNowBtn">Belanja Sekarang</button>
          </Link>
        </div>
      ) : (
        <div className="cartWrapper">
          <h2 className="cartTitle">Keranjang Belanja</h2>
          <div className="cartList">
            {cartItems.map((item) => (
              <div className="cartItem" key={item.productId._id}>
                <img
                  src={item.productId?.images?.[0]?.url || '/default-image.jpg'}
                  alt={item.productId?.name || 'Produk'}
                  className="cartImg"
                />
                <div className="cartInfo">
                  <Link to={`/product/${item.productId._id}`} className="itemName">
                    {item.productId.name}
                  </Link>
                  <p>Harga: Rp{item.productId.price.toLocaleString('id-ID')}</p>
                  <div className="qtyControl">
                    <button onClick={() => decreaseQuantity(item.productId._id, item.quantity)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.productId._id, item.quantity, item.productId.Stock)}>+</button>
                  </div>
                  <p>Subtotal: Rp{(item.productId.price * item.quantity).toLocaleString('id-ID')}</p>
                  <button
                    className="removeBtn"
                    onClick={() => removeItemFromCartHandler(item.productId._id)}
                  >
                    <FaTrashAlt /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cartSummary">
            <h3>Total: Rp{calculateTotal().toLocaleString('id-ID')}</h3>
            <button className="checkoutBtn" onClick={checkOutHandler}>
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
