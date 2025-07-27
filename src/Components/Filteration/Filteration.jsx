/* eslint-disable react/prop-types */
import './Filteration.css'
import Slider from '@mui/material/Slider';
// import ReactStars from 'react-rating-stars-component'

const Filteration = ({ price, setPrice, category, setCategory, ratings, setRatings }) => {

  const handlePriceChange = (e, newPrice) => {
    setPrice(newPrice);
  };
  // const handleRatingChange = (e, newRating) => {
  //   setRatings(newRating);
  // };
  // const [options, setOptions] = useState({
  //   edit: false,
  //   color: "#e5ddd3",
  //   activeColor: "tomato",
  //   size: window.innerWidth < 600 ? 20 : 25,
  //   value: ratings,
  //   isHalf: true,
  //   onChange: handleRatingChange
  // });
  // useEffect(() => {
  //   // Update options object whenever ratings change
  //   setOptions(prevOptions => ({
  //     ...prevOptions,
  //     value: ratings
  //   }));

  //   // Perform any other logic that depends on ratings change
  //   console.log("Rating changed:", ratings);
  // }, [ratings]); // Trigger effect whenever ratings changes

  return (
    <div className='filteration-section' style={{ minHeight: "40vh" }}>
      <div className="container">
        <div className="price-filter flex">
          <span className='top-text'>Price</span>
          <span className='top-text'>Rp{price[0]} - Rp{price[1]}</span>
          <Slider
            value={price}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={200}
            max={100000}
            aria-labelledby='range-slider'
          />
        </div>
        {/* <div className="category-filter flex">
          <span className='top-text'>Category</span>
          <ul className='category-list'>
            <li
              className={category === "Laptop" ? "bold" : ""}
              onClick={() => setCategory("Laptop")}
            >Arabika</li>
            <li
              className={category === "Laptop" ? "bold" : ""}
              onClick={() => setCategory("Laptop")}
            >Robusta</li>
            <li
              className={category === "Laptop" ? "bold" : ""}
              onClick={() => setCategory("Laptop")}
            >Liberika</li>
            <li
              className={category === "Laptop" ? "bold" : ""}
              onClick={() => setCategory("Laptop")}
            >Excelsa</li>
          </ul>
        </div> */}
        {/* <div className="review-filter flex">
          <span className={`top-text ${ratings === 0 ? "" : "marginBottom"}`}

          >Customer Reviews
          </span>
          <Slider
            value={ratings}
            onChange={handleRatingChange}
            valueLabelDisplay={ratings === 0 ? "auto" : "on"}
            min={0}
            max={5}
            aria-labelledby='range-slider'
          />
        </div> */}
      </div>
    </div>
  )
}

export default Filteration
