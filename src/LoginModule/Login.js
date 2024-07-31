import React, { useState, useEffect } from 'react';
import './CSS/login.css'
import LoginImg from '../Images/img_phone_login.png';
import logo from '../Images/coverkraft_logo.png';
import { getAuth, PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber, signInWithPopup } from 'firebase/auth';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';
//import * as auth from 'firebase/auth';
import { appFire } from '../ServiceModule/FirebaseConfig';
import firebaseConfig from '../ServiceModule/FirebaseConfig';
import OtpInput from 'react-otp-input';
import CustomInput from '../component/CustomInput';
import Button from '../component/Button';
import { verifyUser } from '../store/action/action';
import API_URL from '../ServiceModule/Service';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Navbar from '../component/Navbar';
import Footer from '../Landing/component/Footer';
import { useNavigate } from "react-router-dom";
import { getStoredToken } from "../helper";


const Login = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [otp, setOtp] = React.useState([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [valid, setValid] = useState(false);
   
    const auth1 = getAuth(appFire);
    const dispatch = useDispatch();
    const navigate = useNavigate();
   
    const User = useSelector((state) => state.user)
    //useeffect
    useEffect(() => {
        if (valid) {
            setValid(true);
        } else {
            setValid(false);
        }
    }, [!valid]);

   

    //function for handle phone number input field start
    const handlephonechange = (e) => {
        let number = e.target.value.replace(/\D/g, '');
        number = number.slice(0, 10);
        setPhoneNumber(number);
        const isValid = /^\d{10}$/.test(number.replace('+91', ''));
        setValid(isValid);
    }
    //function for handle phone number input field end

    //function for handle otp input field start
    const handleOtpChange = (newValue) => {
        setOtp(newValue)
    }
    //function for handle otp input field end

    //function to handle login and integrate verify number API and recaptcha start
    const handleLogin = async () => {
        try {
            const userPhone = phoneNumber;

            const response = await axios.get(`${API_URL}user/verifyPhone?userPhone=${userPhone}`);
            console.log(response, "response");
            if (response.status === 200) {
                const userId = response.data.user._id;
                const token = response.data.user.token;
                // Store the user ID in local storage
                localStorage.setItem('userId', userId);
                localStorage.setItem('token',token);
            //     const appVerifier = new RecaptchaVerifier(auth1, 'recaptcha-container', {});
            //     await appVerifier.render();
            //     await appVerifier.verify();
            //     console.log('appVerifier', appVerifier);
            //    // signInWithPopup(auth1,
            //     const confirmationResult = await signInWithPhoneNumber(auth1,'+919893079903', appVerifier);
                setLoggedIn(true);

                // localStorage.setItem('verificationId', confirmationResult.verificationId);
                toast.success(' OTP is sent  to your phone number');
            } else {
                // If status is not 200, display error message
                toast.error('Phone number verification failed');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.');
        }
    }
    //function to handle login and integrate verify number API and recaptcha end


    //function to verify otp and login start
    const handleVerify = () => {
        // const storedValue = localStorage.getItem('verificationId');
        // const phoneProvider = new PhoneAuthProvider(auth1);
        // const credential1 = PhoneAuthProvider.credential(
        //     storedValue,
        //     otp
        // )
        // console.log('cred1', credential1)
        // const credential=signInWithPopup(auth1, phoneProvider )
        // console.log('cred',credential)
        // signInWithCredential(auth1, credential)
        //     .then(() => {
                const formData = new FormData();
                formData.append('userPhone', phoneNumber);
        //         const fcmToken = getStoredToken();

        //         if (fcmToken) {
        //             formData.append('userFcmId', fcmToken);
        //         }
                dispatch(verifyUser(API_URL, formData))
                localStorage.setItem('loggedIn', 'true');
                toast.success('Phone number authentication done');
                navigate('/coverkraft');
            // })
            // .catch((error) => {
            //     toast.error('Authentication failed');
            // })
    }
    //function to verify otp and login end

    //function for handling event on enter start
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };
    //function for handling event on enter end

    return (
        <div className='overflow-hidden'>
            <Navbar />
            <section class=" " style={{ margin: '60px 0px' }}>
                <div class="container-fluid h-custom">
                    <div class="row d-flex justify-content-center align-items-center h-100">

                        <div class="col-md-9 col-lg-6 col-xl-5">
                            <img src={LoginImg}
                                class="img-fluid" alt="Sample image" height={1000} width={1000}/>
                        </div>
                        <div class="col-md-4 col-lg-5 col-xl-4 offset-xl-1">
                            <form className='shadow shadow-md ' style={{ padding: '70px' }}>
                                <div class="d-flex flex-row align-items-center justify-content-center mb-5  ">
                                    <img src={logo} alt='logo' />
                                </div>


                                {!loggedIn ? (
                                    <div >
                                        <h1 className='text-center'>Login to your Account</h1>
                                        <h5 className='text-center text-secondary mt-3 mb-5'>Enter your mobile number</h5>
                                        <div>
                                            <CustomInput
                                                label="Mobile Number"
                                                value={phoneNumber}
                                                onChange={handlephonechange}
                                                onKeyDown={handleKeyPress}
                                                placeholder="Enter your number"
                                                className={!valid && phoneNumber.length > 0 ? 'is-invalid' : ''}
                                                required
                                            />
                                            {!valid && phoneNumber.length > 0 && (
                                                <div className="invalid-feedback">
                                                    Please enter a valid 10-digit mobile number.
                                                </div>
                                            )}
                                        </div>

                                        <div class="text-center text-lg-start mt-4 pt-2">
                                            <div id="recaptcha-container"></div>
                                            <Button
                                                text={loggedIn ? 'Logging in...' : 'Login'}
                                                size="lg"
                                                block={true}
                                                onClick={handleLogin}
                                                disabled={!valid || loggedIn}
                                                className='mt-2'
                                            />
                                            <p class="medium fw-bold mt-2 pt-1 mb-0 text-center">Don't have an account? <Link to='/coverkraft/register'
                                                class="custom-color" >Register</Link></p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h1 className='text-center'>6 Digit Verfication</h1>
                                        <h5 className='text-center text-secondary mt-3 mb-5'>Please enter 6 digit OTP to Login OTP sent to XXXXXXX090</h5>

                                        <OtpInput
                                            value={otp}
                                            onChange={handleOtpChange}
                                            numInputs={6}
                                            renderInput={(props, i) => (
                                                <input
                                                    {...props}
                                                    style={{
                                                        display: 'flex',
                                                        textAlign: 'center',
                                                        justifyContent: 'center',
                                                        width: '100%',
                                                        height: '100%',
                                                        margin: '17px',
                                                        padding: '17px'
                                                    }}
                                                />
                                            )}
                                        />


                                        <div class="text-center text-lg-start mt-4 pt-2">
                                            <Button
                                                text='Verify'
                                                size="lg"
                                                block={true}
                                                 onClick={handleVerify}
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

            </section>
            <Footer />

        </div>
    )
}

export default Login
