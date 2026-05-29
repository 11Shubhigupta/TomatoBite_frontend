import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");

  // form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // SIGN UP
      if (currState === "Sign Up") {
        const response = await axios.post(url + "/api/user/register", {
          name,
          email,
          password,
        });

        if (response.data.success || response.status === 200) {
          alert("Account created successfully");
          // Switch to login
          setCurrState("Login");
        } else {
          alert(response.data.message || "Failed to register");
        }
      }

      // LOGIN
      else {
        const response = await axios.post(url + "/api/user/login", {
          email,
          password,
        });

        if (response.data.success || response.status === 200) {
          localStorage.setItem("auth", "true");
          // Save user email in localStorage so we can display details if needed
          localStorage.setItem("user", JSON.stringify({ email }));

          alert("Login successful");
          setShowLogin(false); // close popup
          window.location.reload(); // Refresh the page to trigger navbar status synchronization
        } else {
          alert(response.data.message || "Invalid email or password");
        }
      }

    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Something went wrong";
      alert(errMsg);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;