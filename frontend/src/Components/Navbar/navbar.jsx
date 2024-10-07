import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import nav_dropdown from "../Assets/nav_dropdown.png";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdownToggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const getInitial = () => {
    const username = localStorage.getItem("user-name");
    if (username) {
      return username.charAt(0).toUpperCase();
    } else {
      console.log("Username not found in local storage.");
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.replace("/");
  };

  return (
    <div>
      <div className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="Shopper Logo" />
          <p>SHOPPER</p>
        </div>
        <img
          className="nav-dropdown"
          onClick={dropdownToggle}
          src={nav_dropdown}
          alt="Dropdown Menu"
        />
        <ul ref={menuRef} className="nav-menu">
          <li onClick={() => setMenu("shop")}>
            <Link style={{ textDecoration: "none" }} to={"/"} >
              Shop
            </Link>
            {menu === "shop" ? <hr /> : null}
          </li><li onClick={() => setMenu("mens")}>
            <Link style={{ textDecoration: "none" }} to={"/mens"}>
              Men
            </Link>
            {menu === "mens" ? <hr /> : null}
          </li><li onClick={() => setMenu("womens")}>
            <Link style={{ textDecoration: "none" }} to={"/womens"}>
              Women
            </Link>
            {menu === "womens" ? <hr /> : null}
          </li><li onClick={() => setMenu("kids")}>
            <Link style={{ textDecoration: "none" }} to={"/kids"}>
              Kids
            </Link>
            {menu === "kids" ? <hr /> : null}
          </li>
        </ul>
        <div className="nav-login-cart">
          {localStorage.getItem("auth-token") ? (
            <>
              <p className="nav-profile-pic">{getInitial() || "?"}</p>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
          <Link to="/cart">
            <img src={cart_icon} alt="Cart Icon" />
          </Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
