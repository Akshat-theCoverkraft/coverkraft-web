import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Drawer, Box, Typography, TextField } from "@mui/material";
import Button from "../component/Button";
import CustomInput from '../component/CustomInput';
import icProfileBg from '../Images/ic_profile_bg.png';
import icDefaultProfile from '../Images/ic_default_profile.png';
import editIcon from '../Images/edit-icon.png';
import { getBYIDUsers, updateUser } from '../store/action/action';
import API_URL from '../ServiceModule/Service';
import IMAGE_PATH from '../ServiceModule/imagePath';
import { getAllState } from '../store/action/action';
import GlobalDropdown from './StateDropdown';
import { Card, Grid } from '@material-ui/core';
import family from '../Images/ic_family_member.png'
import about from '../Images/ic_about.png'
import communication from '../Images/ic_communication_pref.png'
import help from '../Images/ic_help.png'
import logout from '../Images/ic_logout.png'
import rightArrow from '../Images/Symbol.png'
import Family from '../profile/Family';
import Communication from '../profile/Communication';
import Help from '../profile/Help';
import About from '../profile/About';
import { useNavigate } from 'react-router-dom';
import CityDropdown from './CityDropdown';
import GlobalDatePicker from './GlobalDatePicker';
import { toast, ToastContainer } from 'react-toastify';
import {THEME_COLOR} from "../constants"

const ProfileDrawer = ({ open, onClose, userName }) => {
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [communicationDrawerOpen, setCommunicationDrawerOpen] = useState(false);
    const [aboutDrawerOpen, setAboutDrawerOpen] = useState(false);
    const [helpDrawerOpen, setHelpDrawerOpen] = useState(false)
    const userEmail = localStorage.getItem('userEmail');
    const [profileImage, setProfileImage] = useState(icDefaultProfile);
    console.log("profileImage", profileImage)
    const [showImageInput, setShowImageInput] = useState(false);
    const [username, setuserName] = useState();
    const [useremail, setuserEmail] = useState();
    const [userDob, setuserDob] = useState();
    const [userAddress, setuserAddress] = useState();
    const [state, setstate] = useState('');
    console.log("state", state);
    const [city, setCity] = useState('')
    console.log('city', city)
    const [userPhone, setuserPhone] = useState();
    const [pinCode, setpinCode] = useState();
    const [gender, setgender] = useState();
    const [userImgFile, setuserImgFile] = useState(null);
    console.log("userImgFile", userImgFile)
    const userbyId = useSelector((state) => state.user);
    const states = useSelector((state) => state.user);
    const [update, setUpdate] = useState(false);
    const navigate = useNavigate();
    const [selectedStateId, setSelectedStateId] = useState('');
    const [selectedCityId, setSelectedCityId] = useState('');
    const [isValidPinCode, setIsValidPinCode] = useState(true);
    const [valid, setValid] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleCitySelect = (cityId) => {
        setSelectedCityId(cityId);
    };
    //useeffect
    useEffect(() => {
        dispatch(getAllState(API_URL));
    }, [dispatch]);

    useEffect(() => {
        if (states !== null && states !== undefined) {
            if (states.getAllState !== null && states.getAllState !== undefined) {
                if (states.getAllState.data !== null && states.getAllState.data !== undefined) {
                    setstate(states.getAllState.data)
                }
            }
        }

    }, [states])

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        dispatch(getBYIDUsers(API_URL, userId));
    }, [dispatch]);


    useEffect(() => {
        if (userbyId.getUserById && userbyId.getUserById.data) {
            const data = userbyId.getUserById.data;
            console.log("data", data)
            setuserName(data.userName);
            setuserEmail(data.userEmail);
            setuserPhone(data.userPhone);
            setuserDob(new Date(data?.userDob?.split('/')?.reverse()?.join('-')));
            setuserAddress(data.userAddress);
            setstate(data.state === null ? null : data.state._id);
            setCity(data.city === null ? null : data.city._id);
            setpinCode(data.pinCode);
            setgender(data.gender);
            setProfileImage(data.userImg ? IMAGE_PATH + data.userImg : icDefaultProfile);

        }
    }, [userbyId]);
    console.log('userimg kya h', profileImage)
    const handleStateSelect = (stateId) => {
        setSelectedStateId(stateId);
    };
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

    function handleUpateProfile() {

        const formData = new FormData();
        console.log("FormData values before appending:", formData);

        formData.append("_id", localStorage.getItem("userId"));
        formData.append("userName", username);
        formData.append("userEmail", useremail);
        formData.append("userPhone", userPhone);
        formData.append("userDob", userDob);
        formData.append("userAddress", userAddress);
        formData.append("state", selectedStateId);
        formData.append('city', selectedCityId)
        formData.append("pinCode", pinCode);
        formData.append("gender", gender);
        if (userImgFile) {
            formData.append("userImg", userImgFile); // Append the file here
        }
        if (
            username &&
            useremail &&
            userPhone &&
            userDob &&
            userAddress &&
            selectedStateId &&
            selectedCityId &&
            pinCode &&
            gender ||
            userImgFile
        ) {
            if (!isOldEnough(userDob)) {
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

            dispatch(updateUser(API_URL, formData))
                // .then(() => {
                //     toast.success('Updated successfully')
                // }).catch((error) => {
                //     toast.error('Error in updating')
                // })
                toast.success('Updated successfully');
                setTimeout(() => {
                    onClose();
                }, 3000);
            // onClose();
        } else {
            toast.error('Please fill all required fields!')
            console.log("No fields are being updated");
        }

    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                setuserImgFile(file);
            };
            reader.readAsDataURL(file);
        }
    };


    const toggleImageInput = () => {
        setShowImageInput(!showImageInput);
    };

    const handleEdit = () => {
        setUpdate(!update);
    }

    const handleFamilyClose = () => {
        setDrawerOpen(false);

    }
    const handleCommunicationclose = () => {
        setCommunicationDrawerOpen(false);

    }
    const handleHelpclose = () => {
        setHelpDrawerOpen(false);

    }
    const handleAboutClose = () => {
        setAboutDrawerOpen(false);

    }
    const handleFamilyOpen = () => {
        setDrawerOpen(true);
    };
    const handleCommunicationOpen = () => {
        setCommunicationDrawerOpen(true);
    };
    const handleAboutOpen = () => {
        // setAboutDrawerOpen(true);
        onClose();
        navigate('/coverkraft/about')
    };
    const handleHelpOpen = () => {
        setHelpDrawerOpen(true);
    };
    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('verificationId');
        localStorage.removeItem('userId');
        localStorage.removeItem('policyId')
        navigate('/coverkraft');
    };


    const handlePinCodeChange = (e) => {
        let pin = e.target.value.replace(/\D/g, '');  // Remove all non-digit characters
        pin = pin.slice(0, 6);  // Limit to 6 digits
        setpinCode(pin);
        const isValidPin = /^\d{5,6}$/.test(pin);  // Check if it's 5 or 6 digits
        setIsValidPinCode(isValidPin);
    };
    //function to handle email input field start
   const handleEmailChange = (e) => {
    const emailId = e.target.value;

    // Regular expression to validate the email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Regex to check for exactly one @ symbol and at least two dots after @
    const validEmail = emailRegex.test(emailId) &&
    emailId.split('@').length === 2 && 
    emailId.split('@')[1].split('.').length <= 3;
    setuserEmail(emailId);
    setIsValidEmail(validEmail);
};
    //function to handle email input field start
    //function to handle phone number input field start
    const handlephonechange = (e) => {
        let number = e.target.value.replace(/\D/g, '');
        number = number.slice(0, 10);
        setuserPhone(number);
        const isValid = /^\d{10}$/.test(number.replace('+91', ''));
        setValid(isValid);
    }
    //function to handle phone number input field end
    const handleDobChange = (date) => {
        setuserDob(date);
    };

    const headerStyle = {
        wordWrap: 'break-word', // Ensures long words break onto the next line
        overflowWrap: 'break-word', // Alternative property to ensure wrapping
        maxWidth: '25%', // Ensures the element respects the container's width
        whiteSpace: 'normal' // Ensures that text can wrap and does not stay in a single line
      };
    



    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            className=""
            sx={{
                "& .MuiPaper-root": {
                    backgroundColor: THEME_COLOR.FADE_BACKGROUND
                },
            }}>
            <ToastContainer />
            <Box sx={{ width: 850, padding: 0, overflowX: 'hidden', backgroundColor: THEME_COLOR.FADE_BACKGROUND }} role="presentation" className=''>
                <div className="main-container">
                    <div className="background-image-container1" style={{ height: "30vh", padding:' 0px 200px' }}>
                        <div className="profile-details">

                            <div className="profile-image-container">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="profile-image"
                                />
                                {update && (
                                    <label htmlFor="profile-image-upload">
                                        <img
                                            src={editIcon}
                                            alt="Edit"
                                            className="edit-icon"
                                            onClick={toggleImageInput}
                                        />
                                    </label>
                                )}
                                {showImageInput && (
                                    <input
                                        id="profile-image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                    />
                                )}

                            </div>


                            <div className="spacer" />
                            <h2 className="text-header text-light" style={{headerStyle}}>{username}</h2>
                            <div className="spacer-small" />
                            <p className="register-text">{useremail}</p>
                            <div class="text-center text-lg-start ">
                                <Button
                                    text={!update ? 'Edit Profile' : 'View'}
                                    size="sm"
                                    block={true}
                                    onClick={handleEdit}
                                />
                            </div>
                        </div>

                    </div>


                </div>
                {!update ? (
                    <Card className='main-container m-5 p-4' style={{background: THEME_COLOR.FADE_BACKGROUND, color: THEME_COLOR.COLOR}}>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-5' alignItems='center' onClick={handleFamilyOpen}>
                            <Grid item xs={1}><img src={family} /></Grid>
                            <Grid item xs={9}>Family member</Grid>
                            <Grid item xs={2}><img style={{maxHeight: '2.5rem'}} src={rightArrow} /></Grid>
                        </Grid>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' alignItems='center' onClick={handleCommunicationOpen}>
                            <Grid item xs={1}><img src={communication} /></Grid>
                            <Grid item xs={9}>Communication preferances </Grid>
                            <Grid item xs={2}><img style={{maxHeight: '2.5rem'}} src={rightArrow} /></Grid>
                        </Grid>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' alignItems='center' onClick={handleHelpOpen}>
                            <Grid item xs={1}><img src={help} /></Grid>
                            <Grid item xs={9}>Help</Grid>
                            <Grid item xs={2}><img style={{maxHeight: '2.5rem'}} src={rightArrow} /></Grid>
                        </Grid>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' alignItems='center' onClick={handleAboutOpen}>
                            <Grid item xs={1}><img src={about} /></Grid>
                            <Grid item xs={9}>About</Grid>
                            <Grid item xs={2}><img style={{maxHeight: '2.5rem'}} src={rightArrow} /></Grid>
                        </Grid>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' alignItems='center' onClick={handleLogout}>
                            <Grid item xs={1}><img src={logout} /></Grid>
                            <Grid item xs={9}>Logout</Grid>
                            <Grid item xs={2}><img style={{maxHeight: '2.5rem'}} src={rightArrow} /></Grid>
                        </Grid>
                    </Card>
                ) : (
                    <div className="main-container mt-4 p-4">
                        <Grid container spacing={4} xs={12}  >
                            <Grid item xs={6}>
                                <CustomInput
                                    label="Name"
                                    placeholder="Enter your Name"
                                    value={username}
                                    onChange={(e) => setuserName(e.target.value)}
                                    required
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <CustomInput
                                    type="email"
                                    label="Email Address"
                                    value={useremail}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email address "
                                    className={!isValidEmail ? 'is-invalid' : ''}
                                    validationMessage={!isValidEmail ? 'Please enter a valid email address containing @.' : ''}
                                    style={{ width: '48%' }}
                                    required
                                />
                            </Grid>
                        </Grid>
                        
                        {/* <Grid item xs={6}>
                                <CustomInput
                                    label="UserDOB"
                                    placeholder="Enter your UserDOB"
                                    value={userDob}
                                    onChange={(e) => setuserDob(e.target.value)}
                                />
                            </Grid> */}
                            <Grid container spacing={4} xs={12}  >
                                <Grid item xs={6} style={{overflow: 'hidden'}} >
                                    <CustomInput
                                        type="number"
                                        label="Mobile Number"
                                        value={userPhone}
                                        onChange={handlephonechange}
                                        placeholder="Enter your mobile number"
                                        className={!valid ? 'is-invalid' : ''}
                                        validationMessage={!valid ? ' Please enter a valid 10-digit mobile number.' : ''}
                                        required
                                        style={{ width: '88%' }}
                                    />
                                </Grid>
                                <Grid item xs={6} >
                                    <GlobalDatePicker
                                        label="DOB"
                                        selectedDate={userDob}
                                        handleDateChange={handleDobChange}
                                        className='custom-picker form-control rounded-5 '
                                        placeholder="select Date"
                                        width="100%"
                                    />
                                </Grid>
                            </Grid>
                            <div className='col-12' >
                                <CustomInput
                                    label="Address"
                                    placeholder="Enter your Address"
                                    value={userAddress}
                                    onChange={(e) => setuserAddress(e.target.value)}
                                    required
                                />
                            </div>
                     
                        {/* {states.getAllState && states.getAllState.data && (
                                    <GlobalDropdown
                                        label="State"
                                        value={state}
                                        onChange={(e) => setstate(e.target.value)}
                                        options={states.getAllState.data.map(state => ({ value: state._id, label: state.stateNameEnglish }))}

                                    />
                                )} */}
                        <Grid container spacing={3} className="px-3">
                            <Grid item xs={12} md={6}>

                                <GlobalDropdown onStateSelect={handleStateSelect} initialValue={state} />

                            </Grid>
                            <Grid item xs={12} md={6}>

                                <CityDropdown selectedStateId={selectedStateId} onCitySelect={handleCitySelect} initialValue={city} />

                            </Grid>
                        </Grid>



                        <Grid container xs={12} spacing={4}>
                            <Grid item xs={6}>
                                <CustomInput
                                    label="Pincode"
                                    placeholder="Enter your PinCode"
                                    value={pinCode}
                                    onChange={handlePinCodeChange}
                                    className={!isValidPinCode ? 'is-invalid' : ''}
                                    validationMessage={!isValidPinCode ? 'Please enter a valid pin code (5 or 6 digits).' : ''}
                                    required
                                />

                            </Grid>
                            <Grid item xs={6}>
                                {/* <CustomInput
                                    label="Gender"
                                    placeholder="Enter your gender"
                                    value={gender}
                                    onChange={(e) => setgender(e.target.value)}
                                    required

                                /> */}
                                <label className="form-label fw-bold text-light" htmlFor="inputField">
                                    Gender<span className='text-danger'>*</span>
                                </label>
                                <select
                                    id="stateDropdown"
                                    className="dropdown-select rounded-5 bg-dark rounded-5 text-light border-2 border-dark rounded-xl shadow-md focus:border-primary focus:ring-2 focus:ring-primary transition duration-300"
                                    value={gender}
                                    onChange={(e) => setgender(e.target.value)}
                                >
                                    <option disabled  >Select Your Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>

                                </select>
                            </Grid>
                        </Grid>

                        <div className="spacer-small" />
                        <Button size='md' text="Update" onClick={handleUpateProfile} disabled={!isValidEmail} // Disable button if email is not valid
                            bgcolor={!isValidEmail ? '#d3d3d3' : '#8AC642'} />
                    </div>
                )}
            </Box>
            <Family family={drawerOpen} onfamilyclose={handleFamilyClose} />
            <Communication communication={communicationDrawerOpen} onCommunicationClose={handleCommunicationclose} />
            <Help help={helpDrawerOpen} onHelpClose={handleHelpclose} />
            {/* <About about={aboutDrawerOpen} onAboutclose={handleAboutClose} /> */}
        </Drawer>
    );
};

export default ProfileDrawer;
