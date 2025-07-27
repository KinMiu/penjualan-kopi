import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, getRecommendedProducts, clearError } from '../../actions/productAction';
import Loader from '../../Components/Loader/Loder';
import ProductCard from '../../Components/ProductCard/ProductCard';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Filteration from '../../Components/Filteration/Filteration';
import { FaAngleLeft, FaAngleRight, FaInfinity } from 'react-icons/fa6';
import './AllProduct.css';

const AllProduct = () => {
  const [price, setPrice] = useState([1000, 100000]);
  const [category, setCategory] = useState('');
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const alert = useAlert();
  const dispatch = useDispatch();

  const { products, error, loading, productsCount, resultPerPage, filteredProductsCount } = useSelector(state => state.products);
  const { rekomendasiProduct, loading: loadingRekomendasi } = useSelector(state => state.rekomendasiProduct);
  const { keyword } = useParams();
  const { user } = useSelector(state => state.user);
  console.log(rekomendasiProduct)

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    dispatch(getAllProducts(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getRecommendedProducts(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const setCurrentPageNo = e => setCurrentPage(e);

  return (
    <div className="all-product-page">
      <div className="filter-wrapper">
        <Filteration
          price={price}
          setPrice={setPrice}
          category={category}
          // setCategory={setCategory}
          ratings={ratings}
          setRatings={setRatings}
        />
      </div>
      <div className="product-wrapper">
        <h2 className="products-heading">Produk Kami</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="products-grid">
            {products && products.map(item => (
              <ProductCard item={item} key={item._id} user={user} />
            ))}
          </div>
        )}

        {resultPerPage < filteredProductsCount && (
          <div className="paginationBox">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resultPerPage}
              totalItemsCount={productsCount}
              onChange={setCurrentPageNo}
              nextPageText={<FaAngleRight />}
              prevPageText={<FaAngleLeft />}
              firstPageText={<FaInfinity />}
              lastPageText={<FaInfinity />}
              itemClass="page-item"
              linkClass="page-link"
              activeLinkClass="pageLinkActive"
              activeClass="pageItemActive"
            />
          </div>
        )}

        {/* ======== Rekomendasi Produk ======== */}
        <div className="rekomendasi-wrapper">
          <h2 className="products-heading">Rekomendasi Untuk Anda</h2>
          {loadingRekomendasi ? (
            <Loader />
          ) : (
            <div className="products-grid">
              {rekomendasiProduct && rekomendasiProduct.map(item => (
                <ProductCard item={item} key={`rekomendasi-${item._id}`} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
