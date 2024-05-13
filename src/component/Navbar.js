/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../Images/Coverkraft-logo.png'
import Button from './Button';
import profile from '../Images/ic-profile.png'
import notification from '../Images/ic-notification.png'
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


function Navbar(props) {
    const navigate = useNavigate();
    const scrollToHomeBottom = props.scrollToHomeBottom
    const scrollToAboutBottom = props.scrollToAboutBottom
    const scrollToServiceBottom = props.scrollToServiceBottom
    const scrollToContactBottom = props.scrollToContactBottom
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const [anchorEl, setAnchorEl] = useState(null);
    const [isSticky, setIsSticky] = useState(false);
    const { t, i18n } = useTranslation();
    const [englishChecked, setEnglishChecked] = useState(i18n.language === 'en');
    const [hindiChecked, setHindiChecked] = useState(i18n.language === 'hi');
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    function handleLogin() {
        navigate('/login')
    }
    function handleVault() {
        navigate('/vault')
    }

    function handleHome() {
        navigate('/')
    }

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('verificationId');
        localStorage.removeItem('userId');
        navigate('/');
    };
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

  

    const handleLanguageUpdate = () => {
        if (englishChecked) {
            changeLanguage('en');
        } else if (hindiChecked) {
            changeLanguage('hi');
        }
        handleClose();
    };



    const handleEnglishChange = (event) => {
        setEnglishChecked(event.target.checked);
        setHindiChecked(!event.target.checked);
    };

    const handleHindiChange = (event) => {
        setHindiChecked(event.target.checked);
        setEnglishChecked(!event.target.checked);
    };
    return (
        <>
            <div data-animate-on-scroll className='' style={{ padding: '10px 70px',boxShadow:'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px ' }}>
                <div className='sticky nav-style col-md-12 d-flex justify-content-between py-4  ' >
                    <div>
                        <img className="d-inline-block align-top animate-style" alt="" onClick={handleHome} style={{ cursor: 'pointer' }}
                            src={Logo}
                        />
                    </div>
                    <div className="grid gap-5 d-flex align-items-center">
                        <div className={isSticky ? 'nav-item active custom-home-Scroll animate-style' : 'nav-item active custom-home-font animate-style'} onClick={handleHome}>Home</div>
                       

                        {loggedIn ? (
                            <>
                                <div className={isSticky ? 'nav-item active custom-home-Scroll animate-style' : 'nav-item active custom-home-font animate-style'} onClick={scrollToAboutBottom}>
                                    About Us
                                </div>
                                <div className={isSticky ? 'nav-item active custom-home-Scroll animate-style' : 'nav-item active custom-home-font animate-style'} onClick={scrollToServiceBottom}>
                                    Policy
                                </div>
                                <div className={isSticky ? 'nav-item active custom-home-Scroll animate-style' : 'nav-item active custom-home-font animate-style'} onClick={scrollToContactBottom}>
                                    Help
                                </div>
                                <img src={notification} alt='' />
                                <img src={profile} alt='' onClick={handleOpenMenu} style={{ cursor: 'pointer' }} />
                                <Menu
                                    style={{
                                        marginTop: "70px"
                                    }}
                                    // className='mt-5'
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseMenu}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                >
                                    <MenuItem
                                    >
                                        <AccountCircleOutlinedIcon />{" "}

                                        <span
                                            style={{
                                                paddingLeft: "10px",
                                                padding: "9px",
                                                fontSize: "20px",
                                                fontFamily: "Poppins",
                                            }}
                                        >{" "}
                                            My Profile
                                        </span>
                                    </MenuItem>
                                    <MenuItem onClick={handleClickOpen}>
                                        <TranslateOutlinedIcon />{" "}
                                        <span
                                            style={{
                                                padding: "9px",
                                                fontSize: "20px",
                                                fontFamily: "Poppins",
                                            }}
                                        >{" "}
                                            Language
                                        </span>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout} >
                                        <LogoutIcon />{" "}
                                        <span
                                            style={{
                                                padding: "9px",
                                                fontSize: "20px",
                                                fontFamily: "Poppins",
                                            }}
                                        >{" "}
                                            Logout
                                        </span>
                                    </MenuItem>

                                </Menu>
                                <button className='btn btn-lg py-2 px-5' style={{ color: 'white', backgroundColor: '#42988E' }} onClick={handleVault}>
                                    Vault
                                </button>

                            </>
                        ) : (
                            <button className={`btn btn-lg custom-color py-2 px-5`} style={{ borderColor: '#42988E',color:'#42988E' }} onClick={handleLogin}>
                                Login
                            </button>
                        )}


                    </div>

                </div>

            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
                PaperProps={{
                    style: {
                        width: '40%', // Adjust the width as needed
                        maxWidth: '600px', // Optional maximum width
                        height: '50%', // Adjust the height as needed
                        maxHeight: '500px', // Optional maximum height
                    },
                }}
            >
                <DialogTitle className='p-5' style={{ fontSize: "40px", textAlign: 'center' }} id="draggable-dialog-title">
                    Select Language
                </DialogTitle>
                <DialogContent>

                    <div className="row mt-4" style={{ textAlign: 'center' }}>
                        <div className="col-6">
                            <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label"
                                style={{
                                    fontWeight: "550",
                                    fontSize: "24px",
                                    fontFamily: "Poppins",
                                }}
                            >
                                English
                            </label>

                        </div>

                        <div className="col-6">

                            <input
                                id="englishCheckbox"
                                type="checkbox"
                                checked={englishChecked}
                                onChange={handleEnglishChange} style={{
                                    width: "20%",
                                    height: "40px",
                                }}

                            />
                        </div>
                    </div>

                    <div className="row mt-4" style={{ textAlign: 'center' }}>
                        <div className="col-6">
                            <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label"
                                style={{
                                    fontWeight: "550",
                                    fontSize: "24px",
                                    fontFamily: "Poppins",
                                }}
                            >
                                Hindi
                            </label>

                        </div>

                        <div className="col-6">

                            <input
                                 id="hindiCheckbox"
                                 type="checkbox"
                                 checked={hindiChecked}
                                 onChange={handleHindiChange}
                                style={{
                                    width: "20%",
                                    height: "40px",
                                }}

                            />
                        </div>
                    </div>

                </DialogContent>
                <DialogActions className="modal-footer border-0 d-flex justify-content-center mb-5">
                    <Button
                        text='Cancel'
                        onClick={handleClose}

                    />
                    <Button
                        text='Update'
                        onClick={handleLanguageUpdate}

                    />

                </DialogActions>
            </Dialog>
        </>
    )
}

export default Navbar