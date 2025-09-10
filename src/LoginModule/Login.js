import React, { useState, useEffect, useRef } from "react";
import "./CSS/login.css";
import LoginImg from "../Images/img_phone_login.png";
import logo from "../Images/CoverKraft-beta.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
import CustomInput from "../component/CustomInput";
import Button from "../component/Button";
import { verifyUser } from "../store/action/action";
import API_URL from "../ServiceModule/Service";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LOGING from "../Images/LOGING.png";
import { registerFirebaseSW, requestFCMPermission } from "../fcm";

const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [otp, setOtp] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(false);
  const [fcmId, setFcmId] = useState("");
  const recaptchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the previous route from location state
  const from = location.state?.from || '/';

  const commonInputStyle = {
    height: 48,
    fontSize: "1.222rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "white",
    borderColor: "grey",
  };

  const [phoneNumberError, phoneNumberSetError] = useState("");

  // ✅ Prevent back navigation when on OTP screen
  useEffect(() => {
    if (loggedIn) {
      const handlePopState = (e) => {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
      };

      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [loggedIn]);

  // Sync valid with input validation
  useEffect(() => {
    if (valid) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [!valid]);

  // Handle phone input (10-digit number)
  const handlephonechange = (e) => {
    phoneNumberSetError("");
    let number = e.target.value.replace(/\D/g, "");
    number = number.slice(0, 10);
    setPhoneNumber(number);
    const isValid = /^\d{10}$/.test(number.replace("+91", ""));
    setValid(isValid);
  };

  // Handle OTP input
  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  // Login handler
  const handleLogin = async () => {
    try {
      phoneNumberSetError("");
      const userPhone = phoneNumber;
      const response = await axios.get(
        `${API_URL}user/verifyPhone?userPhone=${userPhone}`
      );

      if (response.status === 200) {
        const user = response.data.user;
        const userId = user._id;
        const userEmail = user.userEmail;
        const token = user.token;

        // ✅ Store session info
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("loginTime", Date.now().toString());
        sessionStorage.setItem("isLoggedIn", "true");

        setLoggedIn(true);
      } else {
        toast.error("⚠️ Couldn't verify phone number. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          phoneNumberSetError("This phone number is not registered.");
          toast.error("This phone number is not registered.");
        } else if (status === 401) {
          toast.error("Unauthorized. Please check your credentials.");
        } else if (status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(error.response.data.message || "Something went wrong.");
        }
      } else {
        toast.error("⚡ Network error. Please check your internet connection.");
      }
    }
  };

  // OTP verification (final login)
  const handleVerify = async () => {
    if (otp.length === 6) {
      try {
        const registration = await registerFirebaseSW();
        const fcmToken = await requestFCMPermission(registration);

        await dispatch(
          verifyUser(API_URL, {
            userPhone: phoneNumber,
            userFcmId: fcmToken || "NA",
          })
        );

        sessionStorage.setItem("loggedIn", "true");
        toast.success("Phone number authentication successful");
        
        // ✅ Redirect to the previous route or home page
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Verification failed:", error);
        toast.error("Verification failed. Please try again.");
      }
    } else {
      toast.error("Please enter a 6-digit OTP.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && valid && !loggedIn) {
      e.preventDefault();
      handleLogin();
    }
  };

  const handleOtpKeyPress = (e) => {
    if (e.key === "Enter" && otp.length === 6) {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className="overflow-hidden" style={{ backgroundColor: "#121212" }}>
      <ToastContainer />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <form
              className="shadow-md text-white w-100"
              style={{
                maxWidth: "500px",
                backgroundColor: "#000",
                borderRadius: "12px",
                padding: "40px",
                minHeight: "620px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text-center mb-4">
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: "250px",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>

              {!loggedIn ? (
                <>
                  <h2 className="text-center mb-2">Login to your Account</h2>
                  <p className="text-center text-white-50 mb-4">
                    Enter your mobile number
                  </p>

                  <CustomInput
                    label="Mobile Number"
                    value={phoneNumber}
                    onChange={handlephonechange}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter Your Number"
                    className={` ${
                      !valid && phoneNumber.length > 0 ? "is-invalid" : ""
                    }`}
                    required
                    inputStyle={commonInputStyle}
                    validationMessage={
                      !valid && phoneNumber.length > 0
                        ? "Please enter a valid 10-digit mobile number."
                        : phoneNumberError
                    }
                  />

                  <Button
                    text={loggedIn ? "Logging in..." : "Login"}
                    size="lg"
                    block={true}
                    onClick={handleLogin}
                    disabled={!valid || loggedIn}
                    className="mt-3"
                    customStyle={{
                      color: "#fff",
                      backgroundColor: "#5A9E1E",
                      borderRadius: "40px",
                      padding: "14px 32px",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  />

                  <p className="medium fw-bold mt-4 mb-0 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="custom-color">
                      Register
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-center mb-2">6 Digit Verification</h2>
                  <p className="text-center text-white-50 mb-4">
                    Please enter the 6-digit OTP sent to XXXXXXX
                    {phoneNumber.slice(-3)}
                  </p>

                  <div className="d-flex justify-content-center align-items-center my-4">
                    <OtpInput
                      value={otp}
                      onChange={handleOtpChange}
                      numInputs={6}
                      renderInput={(props) => (
                        <input
                          {...props}
                          onKeyDown={handleOtpKeyPress}
                          style={{
                            textAlign: "center",
                            width: "3.5rem",
                            height: "3.5rem",
                            margin: "0 10px",
                            fontSize: "1.2rem",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                    />
                  </div>

                  {otp.length > 0 && otp.length !== 6 && (
                    <div className="invalid-feedback d-block mt-2 text-center">
                      Please enter a valid 6-digit OTP.
                    </div>
                  )}

                  <Button
                    text="Verify"
                    size="lg"
                    block={true}
                    onClick={handleVerify}
                    className="mt-4"
                    disabled={otp.length !== 6}
                  />
                </>
              )}
            </form>
          </div>

          <div
            className="col-md-6 d-none d-md-block position-relative p-0"
            style={{
              height: "100%",
              maxHeight: "100vh",
            }}
          >
            <img
              src={LOGING}
              alt="Background"
              className="w-100"
              style={{
                height: "100%",
                opacity: 0.95,
              }}
            />
            <div
              className="position-absolute text-white text-center"
              style={{
                top: "55%",
                left: "54%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                width: "90%",
              }}
            >
              <h1 className="fw-bold" style={{ fontSize: "32px" }}>
                Beema bhi, Bharosa bhi
              </h1>
              <p className="opacity-75" style={{ fontSize: "23px" }}>
                Secure your future. Simplify your policies. Trust the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;