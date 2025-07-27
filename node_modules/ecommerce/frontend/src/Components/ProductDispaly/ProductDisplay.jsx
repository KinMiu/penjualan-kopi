/* eslint-disable react/prop-types */
import './ProductDispaly.css';
import ProductCard from '../ProductCard/ProductCard';
import Loader from '../Loader/Loder';

const ProductDisplay = ({ loading, error, product }) => {
  return (
    <div className='product-section' id='product-section'>
      <div className="product-container">
        <div className="heading">
          <h2>Featured Products</h2>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="product-grid">
            {product && product.length > 0 ? (
              product.map((item) => (
                <ProductCard item={item} key={item._id} />
              ))
            ) : (
              <p className="no-product">No products available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
