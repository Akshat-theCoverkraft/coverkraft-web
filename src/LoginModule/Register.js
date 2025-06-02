import React, { useState, useEffect } from 'react';
import './CSS/login.css';
import LoginImg from '../Images/img_phone_login.png';
import logo from '../Images/coverkraft_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../component/CustomInput';
import Button from '../component/Button';
import API_URL from '../ServiceModule/Service';
import { registrationCustomer } from '../store/action/action';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../component/Navbar';
import Footer from '../Landing/component/Footer';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import GlobalDropdown from '../component/StateDropdown';
import CityDropdown from '../component/CityDropdown';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [DOB, setDOB] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');
    const [selectedCityId, setSelectedCityId] = useState('');
    const [valid, setValid] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPinCode, setIsValidPinCode] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fcmToken, setFcmToken] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlephonechange = (e) => {
        let number = e.target.value.replace(/\D/g, '').slice(0, 10);
        setMobileNumber(number);
        setValid(/^\d{10}$/.test(number));
    };

    const handleEmailChange = (e) => {
        const emailId = e.target.value;
        const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailId);
        setEmail(emailId);
        setIsValidEmail(isValid);
    };

    const handlePinCodeChange = (e) => {
        const pin = e.target.value;
        setPincode(pin);
        setIsValidPinCode(/^\d{5,6}$/.test(pin));
    };

    const handleStateSelect = (stateId) => setSelectedStateId(stateId);
    const handleCitySelect = (cityId) => setSelectedCityId(cityId);

    const isOldEnough = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    };

    const handleRegister = async () => {
        const roleID = 3;
        if (fullName && DOB && mobileNumber && email && address && roleID) {
            if (!isOldEnough(DOB)) {
                toast.error('You must be at least 18 years old to register.');
                return;
            }

            const formData = new FormData();
            formData.append('userName', fullName);
            formData.append('userDob', DOB);
            formData.append('userPhone', mobileNumber);
            formData.append('userEmail', email);
            formData.append('userAddress', address);
            formData.append('userFcmId', fcmToken);
            formData.append('roleId', roleID);
            if (selectedCityId) formData.append('city', selectedCityId);
            if (selectedStateId) formData.append('state', selectedStateId);

            try {
                await dispatch(registrationCustomer(API_URL, formData));
                toast.success('Successfully Registered');
                navigate("/coverkraft/login");
            } catch (error) {
                toast.error('Registration failed');
            }
        } else {
            toast.error("Please fill all required fields");
        }
    };

    return (
        <div className="bg-dark text-light min-vh-100 overflow-hidden">
            <ToastContainer />
            <Navbar />
            <section className="py-5">
                <div className="container-fluid h-custom">
                    <div className="row justify-content-center align-items-center g-4">
                        <div className="col-md-6 d-none d-md-block text-center">
                            <img src={LoginImg} alt="Phone Login" className="img-fluid" />
                        </div>
                        <div className="col-md-6 col-lg-5">
                            <form className="shadow-lg p-4 rounded-4 bg-secondary text-light">
                                <div className="text-center mb-3">
                                    <img src={logo} alt="Logo" height={60} />
                                </div>
                                <h2 className="text-center fw-bold">Register</h2>
                                <p className="text-center text-muted mb-4">Create your CoverKraft account</p>

                                <CustomInput type="text" label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                <CustomInput type="date" label="Date of Birth" value={DOB} onChange={(e) => setDOB(e.target.value)} required />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <CustomInput
                                            type="number"
                                            label="Mobile Number"
                                            value={mobileNumber}
                                            onChange={handlephonechange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <CustomInput
                                            type="email"
                                            label="Email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <GlobalDropdown onStateSelect={handleStateSelect} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <CityDropdown selectedStateId={selectedStateId} onCitySelect={handleCitySelect} />
                                    </Grid>
                                </Grid>
                                <CustomInput
                                    label="Pin Code"
                                    placeholder="Enter your Pin Code"
                                    value={pincode}
                                    onChange={handlePinCodeChange}
                                    required
                                />
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label fw-bold">Address</label>
                                    <textarea
                                        id="address"
                                        className="form-control rounded-3 bg-dark text-light border-light"
                                        rows={3}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your address"
                                        required
                                    />
                                </div>
                                <div className="d-grid mt-4">
                                    <Button text="Save" size="lg" block onClick={handleRegister} />
                                </div>
                                <p className="text-center mt-3">
                                    Already have an account?{' '}
                                    <Link to="/coverkraft/login" className="text-info fw-bold">Login</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Register;
