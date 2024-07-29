import React, { useState, useEffect } from 'react';
import './CSS/login.css'
import LoginImg from '../Images/img_phone_login.png';
import logo from '../Images/coverkraft_logo.png';
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
import Grid from '@mui/material/Grid';
import { messaging, getToken } from '../ServiceModule/FirebaseConfig';
import { useNavigate } from "react-router-dom";
import GlobalDropdown from '../component/StateDropdown';
import axios from 'axios';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CityDropdown from '../component/CityDropdown';
const Register = () => {
    const [fullName, setFullName] = useState();
    const [DOB, setDOB] = useState();
    const [mobileNumber, setMobileNumber] = useState();
    const [email, setEmail] = useState();
    const [address, setAddress] = useState();
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState();
    const [valid, setValid] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [fcmToken, setFcmToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     const requestFcmToken = async () => {
    //         try {
    //             const token = await getToken(messaging, { vapidKey: 'BHcTGP4Tg96WJexHhweIX-BXTmhJuOvAu583-K6v0eKZ86Ae3bA16xhsKLL3sTosvXytcUqHJmq0I61_P7CafcQ' });
    //             setFcmToken(token);
    //         } catch (error) {
    //             console.error('An error occurred while retrieving token. ', error);
    //             setFcmToken(null);
    //         }
    //     };
    //     requestFcmToken();
    // }, []);





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


    const [stateOptions, setStateOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');
    const [selectedCityId, setSelectedCityId] = useState('');
    
    const handleStateSelect = (stateId) => {
        setSelectedStateId(stateId);
    };
    const handleCitySelect = (cityId) => {
        setSelectedCityId(cityId);
    };
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get(`${API_URL}state/getAll`);
                const optionsData = response.data.data.map((item) => ({
                    value: item.id,
                    label: item.stateNameEnglish,
                }));
                setOptions(optionsData);

            } catch (error) {
                console.error('Error fetching options:', error);
                setError('Failed to load options');
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);



    const handleValueChange = (value) => {
        setSelectedValue(value);
        console.log('value selected', selectedValue)
    };
    const handleChange = (event) => {
        const value = event.target.value;
        const label = options.find(option => option.value === value)?.label || '';
        setSelectedValue(value);
        // setSelectedLabel(label);
    };
    console.log('selectedvaluee', selectedValue)




    //function for register and integrate API start
    const handleRegister = () => {
        const roleID = 3;
        if (
            fullName &&
            DOB &&
            mobileNumber &&
            email &&
            address &&
            roleID
        ) {
            if (!isOldEnough(DOB)) {
                toast.error('You must be at least 18 years old to register.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            const formData = new FormData();

            formData.append('userName', fullName);
            formData.append('userDob', DOB);
            formData.append('userPhone', mobileNumber);
            formData.append('userEmail', email);
            formData.append('userAddress', address);
            formData.append('userFcmId', fcmToken);
            formData.append('roleID', roleID)
            formData.append('state', selectedStateId)
            formData.append('city', selectedCityId)

            dispatch(registrationCustomer(API_URL, formData));
            toast.success('User registered successfully');
            navigate('/coverkraft/login')
        } else {
            toast.error("Please fill all required fields", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    //function for register and integrate API end

    //function to check user is above 18 or not
    const isOldEnough = (dob) => {
        const today = new Date(); // Get today's date
        const birthDate = new Date(dob); // Convert dob to a Date object
        let age = today.getFullYear() - birthDate.getFullYear(); // Calculate age

        // Calculate the month difference
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // If the birth month hasn't occurred yet this year, or it's the birth month but the birth day hasn't occurred yet, subtract one year from age
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Return true if age is 18 or older
        return age >= 18;
    };


    return (
        <div className='overflow-hidden'>
            <Navbar />
            <section class=" ">
                <div class="container-fluid h-custom ">
                    <div class="row d-flex justify-content-center align-items-center ">
                        <div class="col-md-8  col-lg-6 col-xl-5">
                            <img src={LoginImg}
                                class="img-fluid" alt="Sample image" height={1000} width={1000}/>
                        </div>
                        <div class="col-md-5 col-lg-4 col-xl-5">
                            <form className='shadow shadow-md m-4' style={{ padding: '20px 70px' }}>
                                <div class="d-flex flex-row align-items-center justify-content-center mb-3 ">
                                    <img src={logo} alt='logo' />
                                </div>
                                <div>
                                    <h1 className='text-center'>Register new account</h1>
                                    <h5 className='text-center text-secondary    mb-4'>Please complete your  profile Details to continue.</h5>

                                    <div className=''>
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
                                            <Grid item xs={12} md={6}>
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
                                        </Grid>
                                        <Grid container spacing={3} className='pt-0'>
                                            <Grid item xs={12} md={6} className='pt-0'>

                                                <GlobalDropdown onStateSelect={handleStateSelect} />

                                            </Grid>
                                            <Grid item xs={12} md={6}  className='pt-0'>
                                              
                                                <CityDropdown selectedStateId={selectedStateId} onCitySelect={handleCitySelect} />

                                            </Grid>
                                        </Grid>
                                        <CustomInput
                                            type="number"
                                            label="Pin Code"
                                            value={pincode}
                                            onChange={(e) => { setPincode(e.target.value) }}
                                            placeholder="Enter your pin code"
                                            required

                                        />
                                        <div data-mdb-input-init className="form-outline mb-4">
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Address
                                            </label>
                                            <textarea

                                                className={`form-control form-control-lg rounded-5`}
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
                                            <Link to='/coverkraft/login'
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
