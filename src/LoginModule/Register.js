import React, { useState, useEffect } from 'react';
import './CSS/login.css'
import LoginImg from '../Images/Login-img.png';
import logo from '../Images/Coverkraft-logo.png';
import { Link } from 'react-router-dom';
import CustomInput from '../component/CustomInput';
import Button from '../component/Button';
import API_URL from '../ServiceModule/Service';
import { registrationCustomer } from '../store/action/action';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../component/Navbar';
import Footer from '../Landing/component/Footer';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
const Register = () => {
    const [fullName, setFullName] = useState();
    const [DOB, setDOB] = useState();
    const [mobileNumber, setMobileNumber] = useState();
    const [email, setEmail] = useState();
    const [address, setAddress] = useState();
    const [state, setState] = useState();
    const [pincode, setPincode] = useState();
    const [valid, setValid] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const dispatch = useDispatch();

    //function to handle phone number input field start
    const handlephonechange = (e) => {
        let number = e.target.value.replace(/\D/g, '');
        number = number.slice(0, 10);
        setMobileNumber(number);
        const isValid = /^\d{10}$/.test(number.replace('+91', ''));
        setValid(isValid);
    }
    //function to handle phone number input field end

    //function to handle email input field start
    const handleEmailChange = (e) => {
        const emailId = e.target.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(email);
        setEmail(emailId);
        setIsValidEmail(isValid);
    };
    //function to handle email input field start

    //function for register and integrate API start
    function handleRegister() {
        if (
            fullName &&
            DOB &&
            mobileNumber &&
            email &&
            address
        ) {

            const formData = new FormData();
            formData.append('userName', fullName);
            formData.append('userDob', DOB);
            formData.append('userPhone', mobileNumber);
            formData.append('userEmail', email);
            formData.append('userAddress', address);
            formData.append('userFcmId', "1001");


            dispatch(registrationCustomer(API_URL, formData))
        } else {
            toast.error("Please fill all required field", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }
    //function for register and integrate API end

    return (
        <div className='overflow-hidden'>
            <Navbar />
            <section class=" ">
                <div class="container-fluid h-custom ">
                    <div class="row d-flex justify-content-center align-items-center ">
                        <div class="col-md-8  col-lg-6 col-xl-5">
                            <img src={LoginImg}
                                class="img-fluid" alt="Sample image" />
                        </div>
                        <div class="col-md-5 col-lg-4 col-xl-5">
                            <form className='shadow shadow-md m-4' style={{ padding: '20px 70px' }}>
                                <div class="d-flex flex-row align-items-center justify-content-center mb-3 ">
                                    <img src={logo} alt='logo' />
                                </div>
                                <div>
                                    <h1 className='text-center'>Register new account</h1>
                                    <h5 className='text-center text-secondary    mb-4'>Please complete your  profile Details to continue.</h5>

                                    <div>
                                        <CustomInput
                                            type="text"
                                            label="Full Name"
                                            value={fullName}
                                            onChange={(e) => { setFullName(e.target.value) }}
                                            placeholder="Enter your name"
                                            required
                                        />

                                        <CustomInput
                                            type="date"
                                            label="Date of Birth"
                                            value={DOB}
                                            onChange={(e) => { setDOB(e.target.value) }}
                                            placeholder="DD/MM/YYYY"

                                        />
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <CustomInput
                                                    type="number"
                                                    label="Mobile Number"
                                                    value={mobileNumber}
                                                    onChange={handlephonechange}
                                                    placeholder="Enter your mobile number"
                                                    className={!valid ? 'is-invalid' : ''}
                                                    validationMessage={!valid ? ' Please enter a valid 10-digit mobile number.' : ''}
                                                    required
                                                    style={{ width: '88%' }}

                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}></Grid>
                                            <CustomInput
                                                type="email"
                                                label="Email Address"
                                                value={email}
                                                onChange={handleEmailChange}
                                                placeholder="Enter your email address "
                                                className={!isValidEmail ? 'is-invalid' : ''}
                                                validationMessage={!isValidEmail ? 'Please enter a valid email address containing @.' : ''}
                                                style={{ width: '48%' }}
                                            />

                                        </Grid>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <CustomInput
                                                    type="text"
                                                    label="State"
                                                    value={state}
                                                    onChange={(e) => { setState(e.target.value) }}
                                                    placeholder="Enter your state"
                                                    required

                                                />

                                            </Grid>
                                            <Grid item xs={12} md={6}></Grid>

                                            <CustomInput
                                                type="number"
                                                label="Pin Code"
                                                value={pincode}
                                                onChange={(e) => { setPincode(e.target.value) }}
                                                placeholder="Enter your pin code"
                                                required

                                            />
                                        </Grid>
                                        {/* <CustomInput
                                            type="text"
                                            label="Address"
                                            value={address}
                                            onChange={(e) => { setAddress(e.target.value) }}
                                            placeholder="Enter your  address"
                                            required

                                        /> */}
                                        <div data-mdb-input-init className="form-outline mb-4">
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Address
                                            </label>
                                            <textarea

                                                className={`form-control form-control-lg `}
                                                value={address}
                                                onChange={(e) => { setAddress(e.target.value) }}
                                                placeholder='Enter Your Address'
                                                required
                                            />

                                        </div>

                                    </div>

                                    <div class="text-center text-lg-start mt-4 pt-2">
                                        <Button
                                            text='Save'
                                            size="lg"
                                            block={true}
                                            onClick={handleRegister}

                                        />
                                        <p class="medium fw-bold mt-2 pt-1 mb-0 text-center">Already have an account?
                                            <Link to='/login'
                                                class="custom-color" >Login</Link></p>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

            </section>
            <Footer />
        </div>
    )
}

export default Register
