import { useState } from 'react';
import './Shipping.css';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { FaHome, FaPhone, FaCity } from 'react-icons/fa';
import { IoMdPin } from 'react-icons/io';
import CheckOutStep from '../../Components/CheckOutStep/CheckOutStep';
import { saveShippingInfo } from '../../actions/cartAction';
import { useNavigate } from 'react-router-dom';

// Struktur kabupaten -> kecamatan di Lampung
const wilayahLampung = {
  "Bandar Lampung": ["Tanjung Karang Barat", "Kedaton", "Rajabasa", "Tanjung Senang", "Sukarame"],
  "Lampung Selatan": ["Kalianda", "Natar", "Sidomulyo", "Ketapang", "Palas"],
  "Lampung Tengah": ["Gunung Sugih", "Terbanggi Besar", "Trimurjo", "Seputih Banyak"],
  "Lampung Timur": ["Sukadana", "Way Jepara", "Labuhan Maringgai", "Batanghari"],
  "Lampung Barat": ["Balik Bukit", "Batu Brak", "Belalau", "Sekincau", "Way Tenong"],
  "Lampung Utara": ["Kotabumi", "Abung Timur", "Abung Selatan"],
  "Tulang Bawang": ["Menggala", "Banjar Agung", "Penawar Tama"],
  "Tulang Bawang Barat": ["Panaragan", "Tulang Bawang Tengah"],
  "Way Kanan": ["Blambangan Umpu", "Baradatu", "Kasui"],
  "Metro": ["Metro Pusat", "Metro Timur", "Metro Barat"],
  "Pesawaran": ["Gedong Tataan", "Negeri Katon", "Tegineneng"],
  "Pesisir Barat": ["Krui", "Pesisir Tengah", "Pesisir Selatan"],
  "Pringsewu": ["Pringsewu", "Pagelaran", "Gading Rejo"],
  "Mesuji": ["Simpang Pematang", "Mesuji Timur", "Rawa Jitu Utara"],
  "Tanggamus": ["Kota Agung", "Wonosobo", "Pulau Panggung"]
};

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address || '');
  const [kabupaten, setKabupaten] = useState(shippingInfo.kabupaten || '');
  const [kecamatan, setKecamatan] = useState(shippingInfo.city || '');
  const [pincode, setPinCode] = useState(shippingInfo.pincode || '');
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || '');

  const handleKabupatenChange = (e) => {
    setKabupaten(e.target.value);
    setKecamatan('');
  };

  const shippingSubmitHandle = (e) => {
    e.preventDefault();

    dispatch(saveShippingInfo({
      address,
      city: kecamatan,
      state: kabupaten,
      country: 'Indonesia',
      pincode,
      phoneNo,
    }));

    navigate('/order/confirm');
  };

  return (
    <>
      <CheckOutStep activeStep={0} />
      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Pengiriman - Provinsi Lampung</h2>
          <form className="shippingForm" onSubmit={shippingSubmitHandle}>
            <div>
              <FaHome />
              <input
                type="text"
                placeholder="Alamat Lengkap"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <FaCity />
              <select required value={kabupaten} onChange={handleKabupatenChange}>
                <option value="">Pilih Kabupaten/Kota</option>
                {Object.keys(wilayahLampung).map((kab) => (
                  <option key={kab} value={kab}>{kab}</option>
                ))}
              </select>
            </div>
            <div>
              <FaCity />
              <select required value={kecamatan} onChange={(e) => setKecamatan(e.target.value)}>
                <option value="">Pilih Kecamatan</option>
                {(wilayahLampung[kabupaten] || []).map((kec) => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
              </select>
            </div>
            <div>
              <IoMdPin />
              <input
                type="number"
                placeholder="Kode Pos"
                required
                value={pincode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
            <div>
              <FaPhone />
              <input
                type="number"
                placeholder="No. Telepon"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
            <input
              type="submit"
              value="Lanjutkan"
              className="shippingBtn"
              disabled={!kabupaten || !kecamatan}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;
