import React, { useState } from "react";
import axios from "axios";
import API_URL from "../ServiceModule/Service";

const PlayStoreTesting = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  // 🔹 Request OTP
  const requestOtp = async () => {
    if (!phone) {
      showError("Please enter your registered phone number.");
      return;
    }

    try {
      setLoading(true);
      clearMessage();

      await axios.post(`${API_URL}sms/request-otp`, {
        userPhone: phone,
      });

      showSuccess("OTP has been sent to your phone number.");
    } catch (err) {
      showError(
        err?.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete User
  const deleteUser = async () => {
    if (!phone || !otp) {
      showError("Please enter phone number and OTP.");
      return;
    }

    try {
      setLoading(true);
      clearMessage();

      await axios.delete(`${API_URL}user/deleteUserPhone`, {
        data: {
          userPhone: phone,
          otp: otp,
        },
      });

      showSuccess(
        "Your account and all related data have been permanently deleted."
      );

      // Reset form
      setPhone("");
      setOtp("");
    } catch (err) {
      showError(
        err?.response?.data?.message ||
          "Account deletion failed. Please check OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setMessage(msg);
    setMessageType("success");
  };

  const showError = (msg) => {
    setMessage(msg);
    setMessageType("error");
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Play Store Testing Page</h2>
        <p style={styles.subtitle}>
          OTP verification & account deletion (for Google Play review)
        </p>

        {/* Alerts */}
        {message && (
          <div
            style={{
              ...styles.alert,
              background:
                messageType === "success" ? "#1b5e20" : "#7f1d1d",
            }}
          >
            {message}
          </div>
        )}

        {/* Phone */}
        <label style={styles.label}>Registered Phone Number</label>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={requestOtp}
          style={styles.primaryBtn}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Request OTP"}
        </button>

        {/* OTP */}
        <label style={styles.label}>OTP</label>
        <input
          type="text"
          placeholder="Enter OTP received"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={deleteUser}
          style={styles.deleteBtn}
          disabled={loading}
        >
          {loading ? "Deleting Account..." : "Delete Account"}
        </button>

        <p style={styles.note}>
          ⚠️ Account deletion is permanent and cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default PlayStoreTesting;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#161616",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
    color: "#fff",
  },

  title: {
    textAlign: "center",
    marginBottom: "6px",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "13px",
    color: "#aaa",
    marginBottom: "18px",
  },

  alert: {
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "14px",
    color: "#fff",
  },

  label: {
    fontSize: "13px",
    marginBottom: "6px",
    display: "block",
    color: "#ccc",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#0d0d0d",
    color: "#fff",
    fontSize: "14px",
    marginBottom: "12px",
    outline: "none",
  },

  primaryBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#1976d2",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "16px",
  },

  deleteBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#d32f2f",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },

  note: {
    fontSize: "11px",
    color: "#aaa",
    marginTop: "12px",
    textAlign: "center",
  },
};
