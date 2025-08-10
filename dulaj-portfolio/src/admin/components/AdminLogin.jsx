// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);

      // Optional: wait before triggering navigation
      setTimeout(() => {
        setSuccess(false);
        onLogin();
      }, 1500);
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

      {/* Success Alert */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="success-alert"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            ✅ Login Successful!
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 90vh;
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          padding: 2rem;
          position: relative;
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

        input, button {
          box-sizing: border-box;
          width: 100%;
          height: 45px;
          padding: 10px 12px;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 8px rgba(79, 70, 229, 0.4);
        }

        button.login-button {
          border: none;
          background-color: #4f46e5;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }

        .success-alert {
          position: absolute;
          bottom: 20px;
          background: #22c55e;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
