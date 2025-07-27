import React from "react";
import "./SideBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { MdReviews } from "react-icons/md";

const SideBar = ({ searchReviewOpen, clickHandler }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-logo">
        <img
          src="https://clipground.com/images/ecommerce-logo-png-19.png"
          alt="Ecommerce"
        />
      </Link>

      <Link to="/admin/dashboard" className={isActive("/admin/dashboard") ? "active" : ""}>
        <p><DashboardIcon /> Dashboard</p>
      </Link>

      <div className="sidebar-tree">
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon style={{ color: "white" }} />}
          defaultExpandIcon={<ImportExportIcon style={{ color: "white" }} />}
        >
          <TreeItem
            nodeId="1"
            label="Products"
            classes={{ label: "tree-label" }}
          >
            <TreeItem
              nodeId="2"
              label="All"
              icon={<PostAddIcon />}
              onClick={() => navigate("/admin/products")}
              sx={{ color: "white", "&:hover": { color: "tomato" } }}
            />
            <TreeItem
              nodeId="3"
              label="Create"
              icon={<AddIcon />}
              onClick={() => navigate("/admin/product")}
              sx={{ color: "white", "&:hover": { color: "tomato" } }}
            />
          </TreeItem>
        </TreeView>
      </div>

      <Link to="/admin/orders" className={isActive("/admin/orders") ? "active" : ""}>
        <p><ListAltIcon /> Orders</p>
      </Link>

      <Link to="/admin/users" className={isActive("/admin/users") ? "active" : ""}>
        <p><PeopleIcon /> Users</p>
      </Link>

      <Link to="/admin/reviews" className={isActive("/admin/reviews") ? "active" : ""}>
        <p><RateReviewIcon /> Reviews</p>
      </Link>

      {isActive("/admin/reviews") && (
        <div className="search-review" onClick={clickHandler}>
          <p><MdReviews style={{ marginRight: "8px" }} /> Search Review by ID</p>
        </div>
      )}
    </div>
  );
};

export default SideBar;
