import React, { useState, useEffect, useRef } from 'react';
import './CSS/login.css';
import LoginImg from '../Images/img_phone_login.png';
import logo from '../Images/CoverKraft-beta.png';
import { getAuth, PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import CustomInput from '../component/CustomInput';
import Button from '../component/Button';
import { verifyUser } from '../store/action/action';
import API_URL from '../ServiceModule/Service';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { requestForToken } from '../helper';
import LOGING from '../Images/LOGING.png';
const Login = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [otp, setOtp] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [valid, setValid] = useState(false);
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const recaptchRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Syncs `valid` with input validation
    useEffect(() => {
        if (valid) {
            setValid(true);
        } else {
            setValid(false);
        }
    }, [!valid]);

    // Handle phone input (10-digit number)
    const handlephonechange = (e) => {
        let number = e.target.value.replace(/\D/g, '');
        number = number.slice(0, 10);
        setPhoneNumber(number);
        const isValid = /^\d{10}$/.test(number.replace('+91', ''));
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
            const response = await axios.get(`${API_URL}user/verifyPhone?userPhone=${userPhone}`);
            console.log(response, "response");

            if (response.status === 200) {
                const userId = response.data.user._id;
                const token = response.data.user.token;

                localStorage.setItem('userId', userId);
                localStorage.setItem('token', token);

                // Future use: Firebase OTP sending
                // const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',{ size:'invisible' })
                // firebase.auth().signInWithPhoneNumber('+91'+ phoneNumber,verifier)
                //     .then(confirmationResult => {
                //         setVerificationId(confirmationResult.verificationId)
                //         toast.success('Phone verification done, OTP sent to your phone number.')
                //         setLoggedIn(true);
                //     })
                //     .catch(error => {
                //         console.error('Error sending OTP:',error)
                //     })

                setLoggedIn(true);
                toast.success(response.message);

            } else {
                toast.error('Phone number verification failed');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                toast.error(error.response.data.message || 'An unexpected error occurred');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    // OTP verification (final login)
    const handleVerify = () => {
        const formData = new FormData();
        formData.append('userPhone', phoneNumber);
        const fcmToken = localStorage.getItem('fcmToken');

        if (fcmToken) {
            formData.append('userFcmId', fcmToken);
        }

        dispatch(verifyUser(API_URL, formData));
        localStorage.setItem('loggedIn', 'true');
        toast.success('Phone number authentication done');
        navigate('/coverkraft');
    };
    // Trigger login on Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };
    return (
        <div
            className="overflow-hidden"
            style={{
                backgroundColor: '#313131',
                minHeight: '100vh',
                paddingLeft: '0px',
                marginLeft: '0px',
                position: 'relative',
            }}
        >
            <ToastContainer />
            {/* <Navbar /> */}

            {/* LOGIN image with centered text */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100vh',
                    width: 'auto',
                    padding: 0,
                    margin: 0,
                    zIndex: 1,
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'stretch',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-30%, -50%)',
                        color: 'white',
                        textAlign: 'center',
                        zIndex: 5,
                        padding: '20px',
                        maxWidth: '400px',
                        fontFamily: 'Poppins, sans-serif',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            marginBottom: '10px',
                            textShadow: '0 0 10px rgba(0,0,0,0.7)',
                        }}
                    >
                        Beema bhi, Bharosa bhi
                    </h1>
                    <p
                        style={{
                            fontSize: '18px',
                            opacity: 0.85,
                            lineHeight: '1.5',
                            textShadow: '0 0 6px rgba(0,0,0,0.6)',
                        }}
                    >
                        Secure your future. Simplify your policies. Trust the process.
                    </p>
                </div>
                <img
                    src={LOGING}
                    alt="Sample"
                    style={{
                        height: '100vh',
                        width: 'auto',
                        margin: 0,
                        padding: 0,
                        objectFit: 'cover',
                    }}
                />
            </div>
            {/* Form section */}
            <section
                style={{
                    marginLeft: '150px',
                    marginRight: '100px',
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: '100vh',
                }}
            >
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-start align-items-center gx-5">
                        <div className="col-md-4 col-lg-5 col-xl-4 order-1" style={{ marginLeft: 0 }}>
                            <form
                                className="shadow-md text-white"
                                style={{
                                    padding: '60px',
                                    backgroundColor: '#000',
                                    borderRadius: '12px',
                                    width: '500px',
                                    minHeight: '620px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <div className="d-flex flex-row align-items-center justify-content-center mb-5">
                                    <img
                                        src={logo}
                                        alt="logo"
                                        style={{
                                            width: '300px',        // Adjust this based on taste (100-150px is clean)
                                            height: 'auto',
                                            maxWidth: '100%',
                                            objectFit: 'contain'
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
                                                placeholder="Enter your number"
                                                className={`slim-input ${!valid && phoneNumber.length > 0 ? 'is-invalid' : ''
                                                    }`}
                                                required
                                                style={{
                                                    fontSize: '14px',
                                                    padding: '8px 12px',
                                                    height: '60px',
                                                    borderRadius: '40px',
                                                }}
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
                                                  borderRadius="30px"
                                                text={loggedIn ? 'Logging in...' : 'Login'}
                                                size="lg"
                                                block={true}
                                                onClick={handleLogin}
                                                disabled={!valid || loggedIn}
                                                className="mt-2 slim-button"
                                                customStyle={{
                                                    color: "#fff",
                                                    backgroundColor: "#5A9E1E",
                                                    // borderRadius: "40px",
                                                    padding: "14px 32px",
                                                    fontSize: "1.4rem",
                                                    fontWeight: 700,
                                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "1px",
                                                }}
                                            />
                                            <p className="medium fw-bold mt-2 pt-1 mb-0 text-center">
                                                Don't have an account?{' '}
                                                <Link to="/coverkraft/register" className="custom-color">
                                                    Register
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h1 className="text-center">6 Digit Verification</h1>
                                        <h5 className="text-center text-secondary mt-3 mb-5">
                                            Please enter 6 digit OTP to Login OTP sent to XXXXXXX{phoneNumber.slice(-3)}
                                        </h5>
                                        <OtpInput
                                            value={otp}
                                            onChange={handleOtpChange}
                                            numInputs={6}
                                            renderInput={(props, _i) => (
                                                <input
                                                    {...props}
                                                    style={{
                                                        textAlign: 'center',
                                                        width: '3.5rem',
                                                        height: '3.5rem',
                                                        margin: '0 15px',
                                                        fontSize: '1.2rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #ccc',
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
