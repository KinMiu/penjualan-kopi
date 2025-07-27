import { useEffect } from 'react';
import './About.css';
import { IoMdMailUnread } from "react-icons/io";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="aboutPage">
      <div className="aboutContent">
        <div className="aboutProfile">
          <h2>Tim Kami</h2>
        </div>
        <div className="aboutText">
          <h1>Tentang Kami</h1>
          <p>
            Selamat datang di toko kopi kami! Kami berkomitmen menyediakan kopi berkualitas tinggi langsung dari petani lokal di Lampung Barat. Dengan semangat untuk menjaga kualitas dan mendukung petani, kami menghadirkan produk terbaik dengan harga terjangkau.
          </p>
          <p>
            Misi kami adalah memperkenalkan cita rasa kopi lokal kepada dunia, serta membangun jaringan distribusi kopi berkelanjutan yang menguntungkan semua pihak.
          </p>
        </div>
        <div className="aboutSocial">
          <a href="mailto:your-email@example.com" target="_blank" rel="noopener noreferrer">
            <IoMdMailUnread />
          </a>
          <a href="https://www.instagram.com/your-instagram" target="_blank" rel="noopener noreferrer">
            <FaSquareInstagram />
          </a>
          <a href="https://www.linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
