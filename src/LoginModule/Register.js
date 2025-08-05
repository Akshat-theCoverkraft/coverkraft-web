import React, { useState } from 'react';
import './CSS/login.css';
import logo from '../Images/CoverKraft-beta.png';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../component/CustomInput';
import Button from '../component/Button';
import API_URL from '../ServiceModule/Service';
import { registrationCustomer } from '../store/action/action';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LOGING from '../Images/LOGING.png';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [valid, setValid] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const commonInputStyle = {
        height: 48,
        fontSize: "1.222rem",
        borderRadius: 42,
        paddingLeft: "20px",
        width: "100%",
        color: "white",
        borderColor: "grey"
    };

    const handlephonechange = (e) => {
        setPhoneError('');
        let number = e.target.value.replace(/\D/g, '');
        number = number.slice(0, 10);
        setMobileNumber(number);
        const isValid = /^\d{10}$/.test(number);
        setValid(isValid);
    };

    const handleEmailChange = (e) => {
        setEmailError('');
        const emailId = e.target.value.trim();
        const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailId);
        setEmail(emailId);
        setIsValidEmail(isValid);
    };

    const handleRegister = async () => {
        const roleID = 4;

        if (!fullName || !mobileNumber || !email) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!valid) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        if (!isValidEmail) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        setEmailError('');
        setPhoneError('');

        const formData = new FormData();
        formData.append('userName', fullName);
        formData.append('userPhone', mobileNumber);
        formData.append('userEmail', email);
        formData.append('roleId', roleID);

        try {
            const response = await dispatch(registrationCustomer(API_URL, formData));
            toast.success(response.message);
            navigate("/login");
        } catch (error) {
            const errorMsg = error.message.toLowerCase();

            if (errorMsg.includes('email')) {
                setEmailError(error.message);
            }

            if (errorMsg.includes('phone')) {
                setPhoneError(error.message);
            }

            if (!errorMsg.includes('email') && !errorMsg.includes('phone')) {
                toast.error('Registration failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegister();
        }
    };

    return (
        <div className="overflow-hidden" style={{ backgroundColor: '#121212' }}>
            <ToastContainer />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                        <form
                            className="shadow-md text-white w-100"
                            style={{
                                maxWidth: '500px',
                                backgroundColor: '#000',
                                borderRadius: '12px',
                                padding: '40px',
                            }}
                        >
                            <div className="text-center mb-4">
                                <img src={logo} alt="Logo" style={{ width: '250px' }} />
                            </div>

                            <h2 className="text-center mb-3">Create your Account</h2>
                            <p className="text-center text-white-50 mb-4">Enter your details to register</p>

                            <CustomInput
                                label="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter your full name"
                                name="fullName"
                                required
                                inputStyle={commonInputStyle}
                            />

                            <CustomInput
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter your email"
                                name="email"
                                required
                                inputStyle={commonInputStyle}
                                validationMessage={!isValidEmail && email.length > 0 ? 'Please enter a valid email address.' : emailError}
                            />

                            <CustomInput
                                label="Mobile Number"
                                type="tel"
                                value={mobileNumber}
                                onChange={handlephonechange}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter your number"
                                name="mobileNumber"
                                required
                                inputStyle={commonInputStyle}
                                validationMessage={!valid && mobileNumber.length > 0 ? 'Please enter a valid 10-digit mobile number.' : phoneError}
                            />

                            <div className="d-flex flex-row justify-content-between gap-3 mt-4">

                                <Button
                                    text="Cancel"
                                    onClick={handleCancel}
                                    className="flex-fill"
                                    style={{
                                        color: "#fff",
                                        backgroundColor: "#5A9E1E",
                                        borderRadius: "0px",
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                />
                                <Button
                                    text={isSubmitting ? 'Registering...' : 'Register'}
                                    onClick={handleRegister}
                                    className="flex-fill"
                                    disabled={!valid || !isValidEmail || !fullName || !email || !mobileNumber || isSubmitting}
                                />
                            </div>

                            <p className="text-center mt-3 mb-0">
                                Already have an account?{" "}
                                <Link to="/login" className="custom-color">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>

                    <div
                        className="col-md-6 d-none d-md-block position-relative p-0"
                        style={{
                            height: '100%',
                            maxHeight: '100vh',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={LOGING}
                            alt="Background"
                            className="w-100"
                            style={{
                                height: '100%',
                                objectFit: 'contain',
                                opacity: 0.95,
                            }}
                        />
                        <div
                            className="position-absolute text-white text-center"
                            style={{
                                top: '55%',
                                left: '54%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 2,
                                width: '90%',
                            }}
                        >
                            <h1 className="fw-bold" style={{ fontSize: '32px' }}>Beema bhi, Bharosa bhi</h1>
                            <p className="opacity-75" style={{ fontSize: '23px' }}>
                                Secure your future. Simplify your policies. Trust the process.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>


    );
};

export default Register;
