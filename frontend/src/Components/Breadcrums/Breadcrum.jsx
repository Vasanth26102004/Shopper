import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";

const Breadcrum = (props) => {
  const { product } = props;
  return (
    <div className="breadcrum">
      Home
      <img src={arrow_icon} alt="" />
      SHOP
      <img src={arrow_icon} alt="" />
      {product?.category || "Category Not Available"}
      <img src={arrow_icon} alt="" />
      {product?.name || "Product Not Available"}
      <img src={arrow_icon} alt="" />
    </div>
  );
};

export default Breadcrum;
