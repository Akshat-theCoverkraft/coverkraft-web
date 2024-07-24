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
import GlobalDropdown from '../component/GlobalDropdown';
import { Card, Grid } from '@material-ui/core';
import family from '../Images/ic_family_member.png'
import about from '../Images/ic_about.png'
import communication from '../Images/ic_communication_pref.png'
import help from '../Images/ic_help.png'
import logout from '../Images/ic_logout.png'
import rightArrow from '../Images/right-arrow.png'
import Family from '../profile/Family';
import Communication from '../profile/Communication';
import Help from '../profile/Help';
import About from '../profile/About';
import { useNavigate } from 'react-router-dom';
const ProfileDrawer = ({ open, onClose, userName }) => {
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [communicationDrawerOpen,setCommunicationDrawerOpen]=useState(false);
    const [aboutDrawerOpen,setAboutDrawerOpen]=useState(false);
    const [helpDrawerOpen,setHelpDrawerOpen]=useState(false)
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
    const [userPhone, setuserPhone] = useState();
    const [pinCode, setpinCode] = useState();
    const [gender, setgender] = useState();
    const [userImgFile, setuserImgFile] = useState(null);
    console.log("userImgFile", userImgFile)
    const userbyId = useSelector((state) => state.user);
    const states = useSelector((state) => state.user);
    const [update, setUpdate] = useState(false);
    const navigate=useNavigate();
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
            setuserDob(data.userDob);
            setuserAddress(data.userAddress);
            setstate(data.state.stateNameEnglish);
            setpinCode(data.pinCode);
            setgender(data.gender);
            // setProfileImage(IMAGE_PATH + data.userImg || icDefaultProfile);
            setProfileImage(data.userImg ? IMAGE_PATH + data.userImg : icDefaultProfile);

        }
    }, [userbyId]);

    function handleUpateProfile() {

        const formData = new FormData();
        console.log("FormData values before appending:", formData);

        formData.append("_id", localStorage.getItem("userId"));
        formData.append("userName", username);
        formData.append("userEmail", useremail);
        formData.append("userPhone", userPhone);
        formData.append("userDob", userDob);
        formData.append("userAddress", userAddress);
        formData.append("state", state);
        formData.append("pinCode", pinCode);
        formData.append("gender", gender);
        if (userImgFile) {
            formData.append("userImg", userImgFile); // Append the file here
        }
        if (
            username ||
            useremail ||
            userPhone ||
            userDob ||
            userAddress ||
            state ||
            pinCode ||
            gender ||
            userImgFile
        ) {
            dispatch(updateUser(API_URL, formData));
            onClose();
        } else {
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



    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 750, padding: 0 }} role="presentation">
                <div className="main-container">
                    <div className="background-image-container" style={{ backgroundImage: `url(${icProfileBg})`, height: "35vh" }}>
                        <div className="profile-details">

                           <div className="profile-image-container">
    <img
        src={profileImage}
        alt="Profile"
        className="profile-image"
    />
    <label htmlFor="profile-image-upload">
        <img
            src={editIcon}
            alt="Edit"
            className="edit-icon"
            onClick={toggleImageInput}
        />
    </label>
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
                            <h2 className="text-header">{username}</h2>
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
                    <Card className='main-container m-4 p-4'>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' onClick={handleFamilyOpen}>
                            <Grid item xs={1}><img src={family} /></Grid>
                            <Grid item xs={10}>Family member</Grid>
                            <Grid item xs={1}><img src={rightArrow} /></Grid>
                        </Grid>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' onClick={handleCommunicationOpen}>
                            <Grid item xs={1}><img src={communication} /></Grid>
                            <Grid item xs={10}>Communication preferances </Grid>
                            <Grid item xs={1}><img src={rightArrow} /></Grid>
                        </Grid>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' onClick={handleHelpOpen}>
                            <Grid item xs={1}><img src={help} /></Grid>
                            <Grid item xs={10}>Help</Grid>
                            <Grid item xs={1}><img src={rightArrow} /></Grid>
                        </Grid>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' onClick={handleAboutOpen}>
                            <Grid item xs={1}><img src={about} /></Grid>
                            <Grid item xs={10}>About</Grid>
                            <Grid item xs={1}><img src={rightArrow} /></Grid>
                        </Grid>
                        <Grid container xs={12} spacing={4} className='border-bottom mb-4' onClick={handleLogout}>
                            <Grid item xs={1}><img src={logout} /></Grid>
                            <Grid item xs={10}>Logout</Grid>
                            <Grid item xs={1}><img src={rightArrow} /></Grid>
                        </Grid>
                    </Card>
                ) : (
                    <div className="main-container mt-4 p-4">
                        <div className='row'>
                            <div className="col-6">
                                <CustomInput
                                    label="UserName"
                                    placeholder="Enter your UserName"
                                    value={username}
                                    onChange={(e) => setuserName(e.target.value)}
                                />

                            </div>
                            <div className="col-6">
                                <CustomInput
                                    label="UserEmail"
                                    placeholder="Enter your UserEmail"
                                    value={useremail}
                                    onChange={(e) => setuserEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-6">
                                <CustomInput
                                    label="UserPhone"
                                    placeholder="Enter your UserPhone"
                                    value={userPhone}
                                    onChange={(e) => setuserPhone(e.target.value)}
                                />

                            </div>
                            <div className="col-6">
                                <CustomInput
                                    label="UserDOB"
                                    placeholder="Enter your UserDOB"
                                    value={userDob}
                                    onChange={(e) => setuserDob(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-6">
                                <CustomInput
                                    label="UserAddress"
                                    placeholder="Enter your UserAddress"
                                    value={userAddress}
                                    onChange={(e) => setuserAddress(e.target.value)}
                                />

                            </div>
                            <div className="col-6">
                                {states.getAllState && states.getAllState.data && (
                                    <GlobalDropdown
                                        label="State"
                                        value={state}
                                        onChange={(e) => setstate(e.target.value)}
                                        options={states.getAllState.data.map(state => ({ value: state._id, label: state.stateNameEnglish }))}

                                    />
                                )}
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-6">
                                <CustomInput
                                    label="PinCode"
                                    placeholder="Enter your PinCode"
                                    value={pinCode}
                                    onChange={(e) => setpinCode(e.target.value)}
                                />

                            </div>
                            <div className="col-6">
                                <CustomInput
                                    label="Gender"
                                    placeholder="Enter your gender"
                                    value={gender}
                                    onChange={(e) => setgender(e.target.value)}

                                />
                            </div>
                        </div>

                        <div className="spacer-small" />
                        <Button paddingHorizontal={10} text="Update" onClick={handleUpateProfile} />
                    </div>
                )}
            </Box>
            <Family family={drawerOpen} onfamilyclose={handleFamilyClose} />
            <Communication communication={communicationDrawerOpen} onCommunicationClose={handleCommunicationclose} />
            <Help help={helpDrawerOpen} onHelpClose={handleHelpclose} />
            <About about={aboutDrawerOpen} onAboutclose={handleAboutClose} />
        </Drawer>
    );
};

export default ProfileDrawer;
