import { useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import './DashBoard.css';
import { Link } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { productForAdminPanel } from '../../actions/productAction';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashBoard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);
  const { totalAmount, orders } = useSelector(state => state.allOrder);
  const { users } = useSelector(state => state.allUser);

  useEffect(() => {
    dispatch(productForAdminPanel());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
    window.scrollTo(0, 0);
  }, [dispatch]);

  let outOfStock = 0;
  products && products.forEach((p) => {
    if (p.Stock === 0) outOfStock += 1;
  });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [{
      label: "Total Pendapatan",
      backgroundColor: ["#240750"],
      borderColor: "#240750",
      fill: false,
      data: [0, totalAmount],
    }],
  };

  const doughnutState = {
    labels: ["Habis", "Tersedia"],
    datasets: [{
      backgroundColor: ["#f87171", "#4ade80"],
      hoverBackgroundColor: ["#ef4444", "#22c55e"],
      data: [outOfStock, products?.length - outOfStock],
    }],
  };

  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard-container">

        <div className="dashboardSummary">
          <div className="summaryBox">
            <p>Total Pendapatan</p>
            <h3>Rp {totalAmount && Math.round(totalAmount).toLocaleString('id-ID')}</h3>
          </div>

          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Produk</p>
              <span>{products?.length}</span>
            </Link>
            <Link to="/admin/orders">
              <p>Pesanan</p>
              <span>{orders?.length}</span>
            </Link>
            <Link to="/admin/users">
              <p>Pengguna</p>
              <span>{users?.length}</span>
            </Link>
          </div>
        </div>

        <div className="charts">
          <div className="chartBox">
            <h3>Grafik Pendapatan</h3>
            <Line data={lineState} />
          </div>

          <div className="chartBox">
            <h3>Stok Produk</h3>
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
