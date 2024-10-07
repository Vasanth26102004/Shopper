import React, { useState } from "react";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      return alert("Please fill in all fields");
    }
    
    try {
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token); // Save the username from the response
        window.location.replace("/");
        alert("Signed up successfully");
      } else {
        alert(responseData.errors || "Signup failed");
      }
      localStorage.setItem("user-name", responseData.user.name);
    } catch (error) {
      alert("An error occurred during signup");
      console.error("Signup Error:", error);
    }
  };

  const login = async () => {
    if (!formData.email || !formData.password) {
      return alert("Please fill in all fields");
    }

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
        alert("Logged in successfully");
      } else {
        alert(responseData.errors || "Login failed");
      }
      localStorage.setItem("user-name", responseData.user.name);
    } catch (error) {
      alert("An error occurred during login");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-field">
          {state === "Sign Up" ? (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          ) : null}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
        >
          Continue
        </button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
              }}
            >
              Login
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Don't have an account?{" "}
            <span
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Sign Up
            </span>
          </p>
        )}
        <div className="loginsignup-agree">
          <input type="checkbox" name="terms" id="terms" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
