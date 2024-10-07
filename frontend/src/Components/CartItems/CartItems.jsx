import React, { useContext } from "react";
import "./CartItems.css";
import RemoveIcon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems = {}, removeFromCart } = useContext(ShopContext); // Provide default empty object for cartItems

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product.map((product) => {
        const { id, image, name, new_price } = product;
        const quantity = cartItems[id] || 0;

        if (quantity > 0) {
          return (
            <div key={id}>
              <div className="cartitems-format-main">
                <img src={image} className="carticon-product-icon" alt={name} />
                <p>{name}</p>
                <p>${new_price}</p>
                <button className="cartitems-quantity">{quantity}</button>
                <p>${(new_price * quantity).toFixed(2)}</p>
                <img
                  src={RemoveIcon}
                  onClick={() => removeFromCart(id)}
                  className="cartitems-remove-icon"
                  alt="Remove item"
                />
              </div>
              <hr />
            </div>
          );
        }

        return null; // Don't render if quantity is 0
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Total</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <button>PROCEED TO CHECKOUT</button>
          </div>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promocode, Enter it here.</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="Enter your promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
