import React, { useState, useEffect } from "react";
import "./CSS/login.css";
import LoginImg from "../Images/img_phone_login.png";
import logo from "../Images/CKbig.png";
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
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // form / UI state
  const [loggedIn, setLoggedIn] = useState(false); // when true -> OTP screen
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [valid, setValid] = useState(false);

  // OTP should be a string (react-otp-input accepts string)
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [isLoading, setIsLoading] = useState(false); // for sending OTP / resend
  const [isVerifying, setIsVerifying] = useState(false); // for verifying OTP

  // resend state
  const RESEND_SECONDS = 30;
  const [canResend, setCanResend] = useState(false);
  const [resendCounter, setResendCounter] = useState(RESEND_SECONDS);

  const commonInputStyle = {
    height: 48,
    fontSize: "1.222rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "white",
    borderColor: "grey",
  };

  // Prevent back navigation while on OTP (optional)
  useEffect(() => {
    if (loggedIn) {
      const handlePopState = (e) => {
        // push state back so browser back won't navigate away
        window.history.pushState(null, "", window.location.href);
      };

      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [loggedIn]);

  // Resend timer effect (runs only when OTP screen is active)
  useEffect(() => {
    let timer;
    if (loggedIn && !canResend) {
      setResendCounter(RESEND_SECONDS);
      timer = setInterval(() => {
        setResendCounter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loggedIn, canResend]);

  // phone input handler (only digits, max 10)
  const handlephonechange = (e) => {
    setPhoneNumberError("");
    let number = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(number);
    setValid(/^\d{10}$/.test(number));
  };

  // OTP change handler (string)
  const handleOtpChange = (newValue) => {
    setOtp(newValue);
    setOtpError("");
  };

  const handleLogin = async () => {
    if (isLoading) return;
    if (!valid) {
      setPhoneNumberError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsLoading(true);
    setPhoneNumberError("");
    try {
      const response = await axios.post(`${API_URL}sms/request-otp`, {
        userPhone: phoneNumber,
      });

      if (response.status === 200 && response.data) {
        // clear previous session data if any
        sessionStorage.clear();
        toast.success("OTP sent successfully!");
        setLoggedIn(true);
        setCanResend(false);
        setResendCounter(RESEND_SECONDS);
      } else {
        toast.error("Couldn't send OTP. Please try again.");
      }
    } catch (error) {
      console.error("send OTP error:", error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "";
        if (status === 404) {
          setPhoneNumberError("This phone number is not registered.");
          toast.error("This phone number is not registered.");
        } else if (status === 401) {
          toast.error("Unauthorized. Please check your credentials.");
        } else if (status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(message || "Something went wrong while sending OTP.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}sms/request-otp`, {
        userPhone: phoneNumber,
      });

      if (response.status === 200 && response.data) {
        toast.success("OTP resent successfully!");
        setCanResend(false);
        setResendCounter(RESEND_SECONDS);
      } else {
        toast.error("Couldn't resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("resend OTP error:", error);
      const message = error?.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Final verification (login)
  const handleVerify = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter a 6-digit OTP.");
      toast.error("Please enter a 6-digit OTP.");
      return;
    }
    if (isVerifying) return;

    setIsVerifying(true);
    setOtpError("");

    // Attempt to get FCM token, but continue if it fails
    let fcmToken = "NA";
    try {
      const registration = await registerFirebaseSW();
      fcmToken = await requestFCMPermission(registration);
      console.log("FCM Token:", fcmToken);
    } catch (fcmError) {
      console.log("FCM Error (continuing):", fcmError);
    }

    try {
      // Try direct API call
      try {
        const directResponse = await axios.post(`${API_URL}user/loginUser`, {
          userPhone: phoneNumber,
          userFcmId: fcmToken,
          otp: otp,
        });

        if (directResponse.status === 200 && directResponse.data) {
          const responseData = directResponse.data;
          const userData =
            responseData.user || responseData.data || responseData;

          if (userData && typeof userData === "object") {
            sessionStorage.setItem("userId", userData._id || userData.id || "");
            sessionStorage.setItem(
              "userEmail",
              userData.userEmail || userData.email || ""
            );
            const accessToken =
              responseData?.tokens?.accessToken ||
              userData?.token ||
              userData?.accessToken ||
              "";

            sessionStorage.setItem("token", accessToken);

            // sessionStorage.setItem(
            //   "token",
            //   userData.token || userData.accessToken || responseData.token || ""
            // );
            sessionStorage.setItem("loginTime", Date.now().toString());
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("loggedIn", "true");

            toast.success("Login successful!");
            setTimeout(() => navigate(from, { replace: true }), 800);
            return;
          }
        }
      } catch (directApiError) {
        console.log(
          "Direct API Error:",
          directApiError?.response || directApiError
        );
        if (directApiError.response) {
          const msg =
            directApiError.response.data?.message ||
            directApiError.response.data?.error ||
            "Verification failed";
          setOtpError(msg);
          toast.error(msg);
          setOtp("");
          return;
        }
      }

      // Fallback to redux action
      const result = await dispatch(
        verifyUser(API_URL, {
          userPhone: phoneNumber,
          userFcmId: fcmToken,
          otp: otp,
        })
      );

      const isSuccess =
        (result?.type &&
          (result.type.includes("fulfilled") ||
            result.type.toLowerCase().includes("success"))) ||
        result?.payload?.success === true ||
        result?.payload?.status === 200 ||
        (result?.payload?.user &&
          Object.keys(result.payload.user).length > 0) ||
        (result?.meta?.requestStatus === "fulfilled" && !result?.error) ||
        (!result?.error &&
          result?.payload &&
          Object.keys(result.payload).length > 0);

      if (isSuccess) {
        const userData =
          result?.payload?.user ||
          result?.payload?.data?.user ||
          result?.payload?.data ||
          result?.payload;

        if (userData && typeof userData === "object") {
          sessionStorage.setItem("userId", userData._id || userData.id || "");
          sessionStorage.setItem(
            "userEmail",
            userData.userEmail || userData.email || ""
          );
          sessionStorage.setItem(
            "token",
            userData.token ||
              userData.accessToken ||
              result?.payload?.token ||
              ""
          );
          sessionStorage.setItem("loginTime", Date.now().toString());
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("loggedIn", "true");
        }

        toast.success("Login successful!");
        setTimeout(() => navigate(from, { replace: true }), 800);
      } else {
        const errorMessage =
          result?.payload?.message ||
          result?.error?.message ||
          result?.payload?.error ||
          "Invalid OTP. Please try again.";
        setOtpError(errorMessage);
        toast.error(errorMessage);
        setOtp("");
      }
    } catch (err) {
      console.error("Verification catch error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Verification failed.";
      setOtpError(errorMessage);
      toast.error(errorMessage);
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && valid && !loggedIn && !isLoading) {
      e.preventDefault();
      handleLogin();
    }
  };

  const handleOtpKeyPress = (e) => {
    if (e.key === "Enter" && otp.length === 6 && !isVerifying) {
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
              onSubmit={(e) => e.preventDefault()}
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
                    text={isLoading ? "Sending OTP..." : "Login"}
                    size="lg"
                    block={true}
                    onClick={handleLogin}
                    disabled={!valid || isLoading}
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
                      opacity: isLoading ? 0.7 : 1,
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
                  {/* Back Button */}
                  <div className="d-flex align-items-center mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        // go back to phone screen
                        setLoggedIn(false);
                        setOtp("");
                        setOtpError("");
                        setCanResend(false);
                      }}
                      className="btn p-2"
                      style={{
                        backgroundColor: "#333",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ArrowLeft size={20} color="white" />
                    </button>
                    <div className="flex-grow-1"></div>
                  </div>

                  <h2 className="text-center mb-2">6 Digit Verification</h2>
                  <p className="text-center text-white-50 mb-4">
                    Please enter the 6-digit OTP sent to XXXXXXX
                    {phoneNumber.slice(-3)}
                  </p>

                  <div className="d-flex justify-content-center align-items-center my-4">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      separator={<span style={{ width: "4px" }}></span>}
                      isInputNum={true}
                      shouldAutoFocus={true}
                      inputStyle={{
                        padding: "0.5rem 0.75rem",
                        backgroundColor: "#2c2c2c", // Dark background matching CustomInput
                        color: "#fff", // Light text matching CustomInput
                        borderRadius: "50px", // Extra rounded for capsule shape
                        border: otpError ? "1px solid red" : "0",
                        outline: "none",
                        boxShadow: otpError
                          ? "0 0 0 2px rgba(255, 0, 0, 0.4)"
                          : "none",
                        width: "55px",
                        height: "55px",
                        fontSize: "20px",
                        fontWeight: "600",
                        caretColor: "#fff",
                        textAlign: "center",
                      }}
                      focusStyle={{
                        border: otpError
                          ? "1px solid red"
                          : "1px solid #007bff",
                        outline: "none",
                        backgroundColor: "#2c2c2c", // Keep dark background on focus
                        boxShadow: otpError
                          ? "0 0 0 2px rgba(255, 0, 0, 0.4)"
                          : "0 0 0 2px rgba(0, 123, 255, 0.25)",
                      }}
                      renderInput={(props) => <input {...props} />}
                    />
                  </div>

                  {otpError && (
                    <div
                      className="invalid-feedback d-block mt-2 text-center"
                      style={{ color: "#f44336" }}
                    >
                      {otpError}
                    </div>
                  )}

                  <Button
                    text={isVerifying ? "Verifying..." : "Verify"}
                    size="lg"
                    block={true}
                    onClick={handleVerify}
                    className="mt-4"
                    disabled={otp.length !== 6 || isVerifying}
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
                      opacity: otp.length !== 6 || isVerifying ? 0.7 : 1,
                    }}
                  />

                  <div className="text-center mt-4">
                    {!canResend ? (
                      <p className="text-white-50 mb-0">
                        Resend OTP in {resendCounter} second
                        {resendCounter !== 1 ? "s" : ""}
                      </p>
                    ) : (
                      <span
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="btn btn-link text-decoration-none mt-0"
                        style={{
                          color: "#5A9E1E",
                          fontWeight: 700,
                          fontSize: "1.5rem",
                          padding: 0,
                          border: "none",
                          background: "none",
                          opacity: isLoading ? 0.5 : 1,
                        }}
                      >
                        {isLoading ? "Sending..." : "Resend OTP"}
                      </span>
                    )}
                  </div>
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
