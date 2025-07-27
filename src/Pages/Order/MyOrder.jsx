/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { MdRocketLaunch } from 'react-icons/md';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { clearError, getMyOrder } from '../../actions/orderAction';
import './MyOrder.css';

const MyOrder = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, orders, error } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);

  const rows = orders?.map((item) => {
    const paymentStatus = item.paymentInfo?.status;
    const orderStatus = item.orderStatus;

    const isUnpaid = paymentStatus !== 'settlement' && paymentStatus !== 'capture';

    let displayStatus = '-';
    if (isUnpaid) {
      displayStatus = 'Belum Dibayar';
    } else if (orderStatus === 'Paid') {
      displayStatus = 'Sedang Dikemas';
    } else if (orderStatus === 'Shipped') {
      displayStatus = 'Dikirim';
    } else if (orderStatus === 'Delivered') {
      displayStatus = 'Terkirim';
    }

    const productNames = item.OrderItems.map(i => i.name).join(', ');

    return {
      id: item._id,
      products: productNames,
      status: displayStatus,
      itemQty: item.OrderItems.length,
      amount: item.totalPrice,
      showPayNow: isUnpaid,
    };
  }) || [];

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 200, flex: 0.9 },
    {
      field: 'products',
      headerName: 'Produk',
      minWidth: 200,
      flex: 1.2,
      renderCell: (params) => (
        <div className="product-names">
          {params.value}
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 0.6,
      cellClassName: (params) => {
        if (params.value === 'Terkirim') return 'greenColor';
        if (params.value === 'Dikirim') return 'orangeColor';
        if (params.value === 'Sedang Dikemas') return 'blueColor';
        return 'redColor';
      },
    },
    {
      field: 'itemQty',
      headerName: 'Qty',
      minWidth: 100,
      type: 'number',
      flex: 0.3,
    },
    {
      field: 'amount',
      headerName: 'Total (Rp)',
      minWidth: 150,
      type: 'number',
      flex: 0.5,
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      minWidth: 180,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <div className="actionBtns">
          <Link to={`/order/${params.row.id}`} className="detailBtn" title="Lihat Detail">
            <MdRocketLaunch />
          </Link>
          {params.row.showPayNow && (
            <Link
              to={`/payment-details/${params.row.id}`}
              className="payBtn"
              title="Bayar Sekarang"
            >
              <RiMoneyDollarCircleLine />
            </Link>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    dispatch(getMyOrder());
  }, [dispatch, alert, error]);

  return (
    <div className="my-order-page">
      <Typography variant="h4" id="my-order-heading">
        Pesanan {user?.name}
      </Typography>
      <div className="my-order-table">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={8}
          autoHeight
          disableSelectionOnClick
          className="ordersTable"
        />
      </div>
    </div>
  );
};

export default MyOrder;
