import React, { useState, useEffect, useRef } from "react";
import "./CSS/login.css";
import LoginImg from "../Images/img_phone_login.png";
import logo from "../Images/CoverKraft-beta.png";
// import { getAuth, PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import CustomInput from "../component/CustomInput";
import Button from "../component/Button";
import { verifyUser } from "../store/action/action";
import API_URL from "../ServiceModule/Service";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import { requestForToken } from '../helper';
import LOGING from "../Images/LOGING.png";
import { getToken } from "firebase/messaging";
const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [otp, setOtp] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [fcmId, setFcmId] = useState("");
  const recaptchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const commonItemStyle = { maxWidth: 900, width: "100%", paddingLeft: "10px !important" };
  const commonInputStyle = { height: 48, fontSize: "1.222rem", borderRadius: 42, paddingLeft: "20px", width: "100%", color: "white", borderColor: "grey" };

  // Syncs `valid` with input validation
  useEffect(() => {
    if (valid) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [!valid]);


  useEffect(() => {
    // Example mock FCM ID (replace with real logic)
    const getFcmId = async () => {
      // const token = await requestForToken(); // If using Firebase
      const token = getToken() // TEMP
      setFcmId(token);
    };
    getFcmId();
  }, []);

  // Handle phone input (10-digit number)
  const handlephonechange = (e) => {
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

  // Login handler - verifies phone and simulates Firebase OTP send
  const handleLogin = async () => {
    try {
      const userPhone = phoneNumber;
      const response = await axios.get(
        `${API_URL}user/verifyPhone?userPhone=${userPhone}`
      );

      console.log(response, "response");

      if (response.status === 200) {
        const user = response.data.user;

        console.log('this is user : ', user)
        const userId = user._id;
        const token = user.token;

        // ✅ Store session info
        sessionStorage.setItem("userId", userId);
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
          toast.error("❌ This phone number is not registered.");
        } else if (status === 401) {
          toast.error("🔒 Unauthorized. Please check your credentials.");
        } else if (status === 500) {
          toast.error("💥 Server error. Please try again later.");
        } else {
          toast.error(error.response.data.message || "Something went wrong.");
        }
      } else {
        toast.error("⚡ Network error. Please check your internet connection.");
      }
    }
  };



  // OTP verification (final login)
  // Temporary OTP verification: just allow any 6-digit input for now
  const handleVerify = async () => {
    if (otp.length === 6) {
      await dispatch(
        verifyUser(API_URL, {
          userPhone: phoneNumber,
          userFcmId: 'Test123',
        })
      );
      sessionStorage.setItem("loggedIn", "true");
      toast.success("Phone number authentication done (mocked)");
      navigate("/");
    } else {
      toast.error("Please enter a 6-digit OTP.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && valid && !loggedIn) {
      e.preventDefault();
      handleLogin();
    }
  };
  const handleOtpKeyPress = (e) => {
    if (e.key === 'Enter' && otp.length === 6) {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div
      className="overflow-hidden"
      style={{
        backgroundColor: "#313131",
        minHeight: "100vh",
        paddingLeft: "0px",
        marginLeft: "0px",
        position: "relative",
      }}
    >
      <ToastContainer />
      {/* <Navbar /> */}

      {/* LOGIN image with centered text */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "auto",
          padding: 0,
          margin: 0,
          zIndex: 1,
          background: "transparent",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-30%, -50%)",
            color: "white",
            textAlign: "center",
            zIndex: 5,
            padding: "20px",
            maxWidth: "400px",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "10px",
              textShadow: "0 0 10px rgba(0,0,0,0.7)",
            }}
          >
            Beema bhi, Bharosa bhi
          </h1>
          <p
            style={{
              fontSize: "18px",
              opacity: 0.85,
              lineHeight: "1.5",
              textShadow: "0 0 6px rgba(0,0,0,0.6)",
            }}
          >
            Secure your future. Simplify your policies. Trust the process.
          </p>
        </div>

        <img
          src={LOGING}
          alt="Sample"
          style={{
            height: "100vh",
            width: "auto",
            margin: 0,
            padding: 0,
            objectFit: "cover",
          }}
        />
      </div>
      {/* Form section */}
      <section
        style={{
          marginLeft: "150px",
          marginRight: "100px",
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "100vh",
        }}
      >
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-start align-items-center gx-5">
            <div
              className="col-md-4 col-lg-5 col-xl-4 order-1"
              style={{ marginLeft: 0 }}
            >
              <form
                className="shadow-md text-white"
                style={{
                  padding: "60px",
                  backgroundColor: "#000",
                  borderRadius: "12px",
                  width: "500px",
                  minHeight: "620px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >

                <div className="d-flex flex-row align-items-center justify-content-center mb-5">
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      width: "300px", // Adjust this based on taste (100-150px is clean)
                      height: "auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                {!loggedIn ? (
                  <div>
                    <h1 className="text-center">Login to your Account</h1>
                    <h5 className="text-center text-white mt-3 mb-5 font-weight-bold">
                      Enter your mobile number
                    </h5>
                    <div>
                      <CustomInput
                        label="Mobile Number"
                        value={phoneNumber}
                        onChange={handlephonechange}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter Your Number"
                        className={` ${!valid && phoneNumber.length > 0 ? "is-invalid" : ""
                          }`}
                        required
                        inputStyle={commonInputStyle}

                      />
                      {!valid && phoneNumber.length > 0 && (
                        <div className="invalid-feedback">
                          Please enter a valid 10-digit mobile number.
                        </div>
                      )}
                    </div>
                    <div className="text-center text-lg-start mt-4 pt-2">
                      <div id="recaptcha-container"></div>
                      <div ref={recaptchRef}></div>
                      <Button
                        borderRadius="20"
                        text={loggedIn ? "Logging in..." : "Login"}
                        size="lg"
                        block={true}
                        onClick={handleLogin}
                        disabled={!valid || loggedIn}
                        className="mt-2 "
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
                      <p className="medium fw-bold mt-2 pt-1 mb-0 text-center">
                        Don't have an account?{" "}
                        <Link
                          to="/register"
                          className="custom-color"
                        >
                          Register
                        </Link>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-center">6 Digit Verification</h1>
                    <h5 className="text-center text-secondary mt-3 mb-5">
                      Please enter 6 digit OTP to Login OTP sent to XXXXXXX
                      {phoneNumber.slice(-3)}
                    </h5>
                    <OtpInput
                      value={otp}
                      onChange={handleOtpChange}
                      numInputs={6}
                      renderInput={(props, _i) => (
                        <input
                          {...props}
                          onKeyDown={handleOtpKeyPress}
                          style={{
                            textAlign: "center",
                            width: "3.5rem",
                            height: "3.5rem",
                            margin: "0 15px",
                            fontSize: "1.2rem",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                    />
                    <div className="text-center text-lg-start mt-4 pt-2">
                      <Button
                        text="Verify"
                        size="lg"
                        block={true}
                        onClick={handleVerify}
                        className="slim-button"
                        disabled={otp.length !== 6}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
