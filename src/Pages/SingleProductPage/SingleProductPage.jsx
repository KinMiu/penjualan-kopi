import { useEffect, useState } from 'react';
import './SingleProductPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, getSingleProducts, newReview } from '../../actions/productAction';
import { useNavigate, useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import Loader from '../../Components/Loader/Loder';
import Review from '../../Components/Review/Review';
import { useAlert } from 'react-alert';
import { addItemToCart } from '../../actions/cartAction';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Rating,
} from '@mui/material';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import InteractionService from '../../api/service/Interaction.service';

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
};

const SingleProductPage = () => {
  const { user, isAuthenticate } = useSelector(state => state.user);
  const navigate = useNavigate();
  const alert = useAlert();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, error, loading } = useSelector((state) => state.singleProduct);
  const { success, error: reviewError } = useSelector((state) => state.newReview);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [open, setOpen] = useState(false);

  const [interactionLogged, setInteractionLogged] = useState(false);  // 🔥 Prevent duplicate log

  useEffect(() => {
    dispatch(getSingleProducts(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  useEffect(() => {
    if (id && user?._id && !interactionLogged) {
      console.log('📦 Mencatat interaksi untuk produk ID:', id);
      InteractionService.InteractionService.logInteraction({
        user_id: user._id,
        product_id: id,
        interaction_type: 'click',
        interaction_value: 0.2
      });
      setInteractionLogged(true);
    }
  }, [id, user, interactionLogged]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearError());
    }
    if (success) {
      alert.success('Ulasan berhasil dikirim!');
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [error, reviewError, success, alert, dispatch]);

  const increseQuantity = () => {
    if (product.Stock > quantity) setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const submitReviewToggle = () => setOpen(!open);

  const reviewSubmitHandler = () => {
    const formData = new FormData();
    formData.set('comment', comments);
    formData.set('rating', rating);
    formData.set('productId', id);
    dispatch(newReview(formData));
    setOpen(false);
  };

  const addCartHandler = () => {
    if (!isAuthenticate) {
      alert.error("Silakan login terlebih dahulu.");
      navigate(`/auth?redirect=/product/${id}`);
      return;
    }
    if (product.Stock > 0) {
      dispatch(addItemToCart(user._id, id, quantity));
      alert.success('Kopi berhasil ditambahkan ke keranjang!');

      InteractionService.InteractionService.logInteraction({
        user_id: user._id,
        product_id: id,
        interaction_type: 'add_to_cart',
        interaction_value: 0.5
      });
    } else {
      alert.error('Stok kopi habis');
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="single-product-page">
      <div className="single-product-container">
        <div className="left-side">
          <div className="carousel">
            <Carousel>
              {product.images?.map((image, i) => (
                <img key={image.url} src={image.url} className="carousel-img" alt={`Slide ${i}`} />
              ))}
            </Carousel>
          </div>
        </div>

        <div className="rght-side">
          <div className="id-title">
            <h1>{product.name}</h1>
            <p>ID Produk: {product._id}</p>
          </div>

          <div className="review-container">
            <Rating value={product.ratings} size="large" readOnly precision={0.5} />
            <span>({product.numOfReviews} Ulasan)</span>
          </div>

          <h2 className="product-price">{formatRupiah(product.price)}</h2>

          <div className="counter">
            <div>
              <button className='cnt' onClick={decreaseQuantity}>-</button>
              <p>{quantity}</p>
              <button className='cnt' onClick={increseQuantity}>+</button>
            </div>
            <button className='add-to-cart btn' onClick={addCartHandler}>Tambah ke Keranjang</button>
          </div>

          <div className="status">
            <span className='status-text'>Status:
              <span className={product.Stock > 0 ? 'greenColor' : 'redColor'}>
                {product.Stock > 0 ? ' Tersedia' : ' Habis'}
              </span>
            </span>
          </div>

          <p className="discription"><span className='discription-text'>Asal Kopi: </span>{product.origin || 'Tidak diketahui'}</p>
          <p className="discription"><span className='discription-text'>Jenis: </span>{product.type || 'Tidak diketahui'}</p>
          <p className="discription"><span className='discription-text'>Deskripsi: </span>{product.description}</p>

          <button onClick={submitReviewToggle} className='submit-review btn'>Tulis Ulasan</button>

          <Dialog open={open} onClose={submitReviewToggle}>
            <DialogTitle>Tulis Ulasan</DialogTitle>
            <DialogContent className='submitDialog'>
              <Rating onChange={(e) => setRating(e.target.value)} value={rating} size='large' />
              <textarea
                required
                className='submitDialogTextArea'
                cols={30}
                rows={5}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tulis pengalamanmu menikmati kopi ini..."
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle}>Batal</Button>
              <Button onClick={reviewSubmitHandler} color='primary'>Kirim</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      <div className="id-title ok">
        <p>Ulasan Konsumen</p>
      </div>
      <Review product={product} submitReviewToggle={submitReviewToggle} />
    </div>
  );
};

export default SingleProductPage;
