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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlephonechange = (e) => {
        let number = e.target.value.replace(/\D/g, '');
        number = number.slice(0, 10);
        setMobileNumber(number);
        const isValid = /^\d{10}$/.test(number.replace('+91', ''));
        setValid(isValid);
    };

    const handleEmailChange = (e) => {
        const emailId = e.target.value.trim();
        const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailId);
        setEmail(emailId);
        setIsValidEmail(isValid);
    };

    const handleRegister = async () => {
        const roleID = 3;

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

        const formData = new FormData();
        formData.append('userName', fullName);
        formData.append('userPhone', mobileNumber);
        formData.append('userEmail', email);
        formData.append('roleId', roleID);

        try {
            await dispatch(registrationCustomer(API_URL, formData));
            toast.success('Successfully Registered');
            navigate("/login");
        } catch (error) {
            toast.error('Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/"); // Navigate to home page
    };

    // Trigger register on Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegister();
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

            {/* Background image with centered text */}
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
                                            width: '300px',
                                            height: 'auto',
                                            maxWidth: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>

                                <div>
                                    <h1 className="text-center">Create your Account</h1>
                                    <h5 className="text-center text-white mt-3 mb-5 font-weight-bold">
                                        Enter your details to register
                                    </h5>

                                    <div className="mb-3">
                                        <CustomInput
                                            label="Full Name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Enter your full name"
                                            className="slim-input"
                                            name="fullName"
                                            required
                                            inputStyle={{
                                                fontSize: '14px',
                                                padding: '8px 12px',
                                                height: '60px',
                                            }}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <CustomInput
                                            label="Email"
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Enter your email"
                                            className={`slim-input ${!isValidEmail && email.length > 0 ? 'is-invalid' : ''}`}
                                            name="email"
                                            required
                                            inputStyle={{
                                                fontSize: '14px',
                                                padding: '8px 12px',
                                                height: '60px',
                                            }}
                                        />
                                        {!isValidEmail && email.length > 0 && (
                                            <div className="invalid-feedback">
                                                Please enter a valid email address.
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <CustomInput
                                            label="Mobile Number"
                                            type="tel"
                                            value={mobileNumber}
                                            onChange={handlephonechange}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Enter your number"
                                            className={`slim-input ${!valid && mobileNumber.length > 0 ? 'is-invalid' : ''}`}
                                            name="mobileNumber"
                                            required
                                            inputStyle={{
                                                fontSize: '14px',
                                                padding: '8px 12px',
                                                height: '60px',
                                            }}
                                        />
                                        {!valid && mobileNumber.length > 0 && (
                                            <div className="invalid-feedback">
                                                Please enter a valid 10-digit mobile number.
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center text-lg-start mt-4 pt-2">
                                        <div className="d-flex gap-3">
                                            <Button
                                                text="Cancel"
                                                size="lg"
                                                onClick={handleCancel}
                                                className="mt-2 flex-fill"
                                                style={{
                                                    color: "#fff",
                                                    backgroundColor: "#5A9E1E",
                                                    borderRadius: "0px",
                                                    padding: "14px 32px",
                                                    fontSize: "1rem",
                                                    fontWeight: 700,
                                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "1px",
                                                }}
                                            />
                                            <Button
                                                text={isSubmitting ? 'Registering...' : 'Register'}
                                                size="lg"
                                                onClick={handleRegister}
                                                disabled={!valid || !isValidEmail || !fullName || !email || !mobileNumber || isSubmitting}
                                                className="mt-2 flex-fill"
                                            />
                                        </div>
                                        <p className="medium fw-bold mt-2 pt-1 mb-0 text-center">
                                            Already have an account?{' '}
                                            <Link to="/login" className="custom-color">
                                                Login
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* CSS to ensure placeholder visibility */}
            <style jsx global>{`
                /* Placeholder visibility enhancement */
                .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    opacity: 1 !important;
                }
                
                .form-control::-webkit-input-placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    opacity: 1 !important;
                }
                
                .form-control::-moz-placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    opacity: 1 !important;
                }
                
                .form-control:-ms-input-placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    opacity: 1 !important;
                }
                
                /* Ensure dark background inputs show light placeholders */
                input[style*="background"]::placeholder,
                input.bg-dark::placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    opacity: 1 !important;
                }
                
                input[style*="background"]::-webkit-input-placeholder,
                input.bg-dark::-webkit-input-placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    opacity: 1 !important;
                }
                
                input[style*="background"]::-moz-placeholder,
                input.bg-dark::-moz-placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    opacity: 1 !important;
                }
                
                input[style*="background"]:-ms-input-placeholder,
                input.bg-dark:-ms-input-placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default Register;