
import './Hero.css';
import { CgArrowLongDown } from "react-icons/cg";

const Hero = () => {
  return (
    <div className='hero-container' id='hero-container'>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Nikmati Aroma Kopi Terbaik</h1>
        <p>Temukan cita rasa kopi pilihan langsung dari petani lokal</p>
        <a href="/products">
          <button className="cta-button">
            Lihat Produk <CgArrowLongDown />
          </button>
        </a>
      </div>
    </div>
  );
};

export default Hero;
