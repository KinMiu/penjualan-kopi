/* eslint-disable react/prop-types */
import './ProductCard.css';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import { FaEye } from 'react-icons/fa6';

const ProductCard = ({ item }) => {
  console.log(item)
  const options = {
    size: 'small',
    value: item.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Link to={`/product/${item._id}`} className="card-container">
      <div className="img">
        <img
          src={item.images?.[0]?.url || '/default-image.jpg'}
          alt={item.name}
        />
      </div>
      <div className="card-content">
        <p className="product-name">{item.name}</p>
        <div className="rating-container">
          <Rating {...options} />
          <span className="rating-count">
            ({item.numOfReviews || 0} Reviews)
          </span>
        </div>
        <div className="price-clicks">
          <p className="price">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0
            }).format(item.price)}
          </p>
          <p className="clicks">
            <FaEye style={{ marginRight: '4px' }} />
            <span>{item.total_clicks}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
