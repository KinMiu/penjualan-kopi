import { useEffect } from 'react';
import './ProductList.css';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import SideBar from '../SideBar/SideBar';
import {
  clearError,
  deleteProduct,
  productForAdminPanel
} from '../../actions/productAction';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import Loader from '../../Components/Loader/Loder';

const ProductList = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, products, loading } = useSelector((state) => state.products);
  const {
    error: deleteError,
    isDeleted,
    loading: deleteLoading
  } = useSelector((state) => state.deleteUpdateProduct);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearError());
    }

    if (isDeleted) {
      alert.success('Produk berhasil dihapus!');
      navigate('/admin/dashboard');
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(productForAdminPanel());
  }, [dispatch, error, alert, isDeleted, deleteError, navigate]);

  const columns = [
    { field: 'id', headerName: 'ID Produk', minWidth: 200, flex: 0.5 },
    { field: 'name', headerName: 'Nama', minWidth: 250, flex: 1 },
    { field: 'stock', headerName: 'Stok', type: 'number', minWidth: 120, flex: 0.3 },
    { field: 'price', headerName: 'Harga', type: 'number', minWidth: 160, flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Aksi',
      type: 'number',
      minWidth: 150,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => (
        <div className="productActions">
          <Link to={`/admin/product/${params.row.id}`}>
            <EditIcon />
          </Link>
          <Button onClick={() => deleteProductHandler(params.row.id)} style={{ minWidth: 'unset' }}>
            <DeleteIcon />
          </Button>
        </div>
      )
    }
  ];

  const rows = products?.map((product) => ({
    id: product._id,
    name: product.name,
    stock: product.Stock,
    price: `Rp${product.price.toLocaleString('id-ID')}`
  })) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="dashboard dashboard-ok">
      <SideBar />
      <div className="productListContainer">
        <h1 id="productListHeading">Daftar Produk</h1>
        {loading || deleteLoading ? (
          <Loader />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            autoHeight
            disableSelectionOnClick
            className="productListTable"
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
