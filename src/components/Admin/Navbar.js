import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SelectIsAdmin } from "../../redux/MallSlice";
import "./Navbar.css";
const Navbar = () => {
  const isAdmin = useSelector(SelectIsAdmin);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="/">
        WEN
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav ul-flex">
          <li className="nav-item active">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/malls">
              Malls
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/shops">
              Shops
            </Link>
          </li>
          <li className="nav-item dropdown dropdown-nav ">
            <div className="d-flex align-items-center">
              <i className="fas fa-user admin-user" />
              <a
                className="nav-link"
                href={isAdmin ? "/" : "/admin/login"}
                onClick={() => localStorage.setItem("loginStatus", false)}
              >
                {isAdmin ? "Logout" : "Admin Login"}
              </a>
            </div>
            {/* <a
              className="nav-link dropdown-toggle"
              data-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-user admin-user" />
            </a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">
                Setting
              </a>
              <a className="dropdown-item" href="#">
                Logout
              </a>
            </div> */}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
