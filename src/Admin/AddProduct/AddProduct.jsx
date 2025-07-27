import { useEffect, useState } from 'react'
import './AddProduct.css'
import SideBar from '../SideBar/SideBar'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux'
import { addNewProduct, clearError } from '../../actions/productAction'
import AccountTree from '@mui/icons-material/AccountTree';
import Description from '@mui/icons-material/Description';
import Storage from '@mui/icons-material/Storage';
import Spellcheck from '@mui/icons-material/Spellcheck';
import AttachMoney from '@mui/icons-material/AttachMoney';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ADD_NEW_PRODUCT_RESET } from '../../constants/productConstants';
import imageCompression from 'browser-image-compression';

const AddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, success } = useSelector(state => state.newProduct);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = ["Arabika", "Robusta", "Liberika", "Excelsa"];

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError());
        }
        if (success) {
            alert.success("Product berhasil ditambahkan.");
            navigate("/admin/dashboard");
            dispatch({ type: ADD_NEW_PRODUCT_RESET });
        }
    }, [alert, dispatch, success, error, navigate]);

    const createProductSubmitHandler = (e) => {
        e.preventDefault();
        const myFormData = new FormData();

        myFormData.set("name", name);
        myFormData.set("price", price);
        myFormData.set("description", description);
        myFormData.set("category", category);
        myFormData.set("Stock", Stock);

        images.forEach((image) => {
            myFormData.append("images", image);
        });

        dispatch(addNewProduct(myFormData));
    };

    const createProductImagesChange = async (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
        };

        for (const file of files) {
            try {
                const compressedFile = await imageCompression(file, options);
                const compressedBase64 = await imageCompression.getDataUrlFromFile(compressedFile);

                setImagesPreview((old) => [...old, compressedBase64]);
                setImages((old) => [...old, compressedBase64]);
            } catch (error) {
                console.error("Gagal kompres gambar:", error);
            }
        }
    };

    return (
        <div className="dashboard">
            <SideBar />
            <div className="newProductContainer">
                <form
                    className="createProductForm"
                    encType="multipart/form-data"
                    onSubmit={createProductSubmitHandler}
                >
                    <h1>CREATE PRODUCT</h1>

                    <div>
                        <Spellcheck />
                        <input
                            type="text"
                            placeholder="Product Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <AttachMoney />
                        <input
                            type="number"
                            placeholder="Price"
                            required
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div>
                        <Description />
                        <textarea
                            placeholder="Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            cols="30"
                            rows="1"
                        ></textarea>
                    </div>

                    <div>
                        <AccountTree />
                        <select onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Choose Category</option>
                            {categories.map((cate) => (
                                <option key={cate} value={cate}>
                                    {cate}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Storage />
                        <input
                            type="number"
                            placeholder="Stock"
                            required
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>

                    <div id="createProductFormFile">
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={createProductImagesChange}
                            multiple
                        />
                    </div>

                    <div id="createProductFormImage">
                        {imagesPreview.map((image, index) => (
                            <img key={index} src={image} alt="Product Preview" />
                        ))}
                    </div>

                    <Button
                        id="createProductBtn"
                        type="submit"
                        disabled={loading ? true : false}
                    >
                        Create
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
