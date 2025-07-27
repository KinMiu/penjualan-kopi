import "./Contact.css";
import { Button } from "@mui/material";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contactPage">
      <div className="contactContent">
        <h1>Hubungi Kami</h1>
        <p>Kami senang mendengar dari Anda. Jangan ragu untuk menghubungi kami melalui detail di bawah ini atau kirim email langsung.</p>

        <div className="contactDetails">
          <div className="detailBox">
            <FaEnvelope className="icon" />
            <div>
              <h3>Email</h3>
              <p>admin@gmail.com</p>
            </div>
          </div>
          <div className="detailBox">
            <FaPhoneAlt className="icon" />
            <div>
              <h3>Telepon</h3>
              <p>+62 812 3456 7890</p>
            </div>
          </div>
          <div className="detailBox">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h3>Alamat</h3>
              <p>Jl. Kopi No. 123, Lampung Barat</p>
            </div>
          </div>
        </div>

        <a className="mailBtn" href="mailto:admin@gmail.com">
          <Button variant="contained" color="primary">Kirim Email</Button>
        </a>
      </div>
    </div>
  );
};

export default Contact;
