// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { motion } from "framer-motion";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <motion.form
        onSubmit={handleSubmit}
        className="login-form"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🔑 Admin Login
        </motion.h2>

        <motion.div
          className="form-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
          />
        </motion.div>

        <motion.div
          className="form-group"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </motion.div>

        <motion.button
          type="submit"
          className="login-button"
          whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </motion.form>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 90vh;
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          padding: 2rem;
        }

        .login-form {
          background: #fff;
          padding: 2rem 2.5rem;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          width: 100%;
        }

        .login-form h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #4f46e5;
          font-size: 1.8rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #555;
        }

        /* Fix: Make inputs and button uniform size and box model */
        input, button {
          box-sizing: border-box;      /* Include padding and border in width/height */
          width: 100%;                 /* Full width */
          height: 45px;                /* Fixed height */
          padding: 10px 12px;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-family: inherit;
          line-height: 1.2;
          transition: all 0.3s ease;
          display: block;
        }

        input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 8px rgba(79, 70, 229, 0.4);
        }

        /* Button specific overrides */
        button.login-button {
          border: none;
          background-color: #4f46e5;
          color: white;
          cursor: pointer;
          padding: 0 12px; /* Override horizontal padding to match inputs */
          /* line-height to vertically center text */
          line-height: 45px;
          text-align: center;
          font-weight: 600;
          user-select: none;
          /* Remove default button styles */
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
