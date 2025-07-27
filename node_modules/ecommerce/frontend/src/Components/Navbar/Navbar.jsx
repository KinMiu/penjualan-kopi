import { useEffect, useState } from 'react';
import './Navbar.css';
import { FaSearch, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { FaCartPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserNavOption from '../UserNavOption/UserNavOption';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { isAuthenticate, user } = useSelector((state) => state.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar-section ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="Logo" />
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/products" onClick={closeMenu}>Produk</Link>
          <Link to="/contact" onClick={closeMenu}>Kontak</Link>
          <Link to="/about" onClick={closeMenu}>Tentang</Link>
        </div>

        <div className="nav-icons">
          <Link to="/search" title="Cari"><FaSearch /></Link>
          <Link to="/cart" title="Keranjang"><FaCartPlus /></Link>
          {isAuthenticate ? (
            <UserNavOption user={user} />
          ) : (
            <Link to="/auth" title="Login"><FaUserCircle /></Link>
          )}
          <div className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
