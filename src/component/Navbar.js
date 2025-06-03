/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../Images/coverkraft_logo_1.png'
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
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import ck from '../Images/ck.png';
import Grid from '@mui/material/Grid';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ProfileDrawer from "../component/profile";

import './footer.css';
import { THEME_COLOR } from '../constants';
import { styled } from '@mui/material';

const DarkMenu = styled(Menu)(() => ({
    '.MuiMenu-paper': {
        backgroundColor: '#000',  // Dark background color
        color: 'white',            // Light text color
        borderRadius: '8px',       // Optional: rounded corners
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Optional: shadow effect
    },
}));

function Navbar(props) {
    const navigate = useNavigate();
    const scrollToContactBottom = props.scrollToContactBottom
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const [anchorEl, setAnchorEl] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { i18n } = useTranslation();
    const [englishChecked, setEnglishChecked] = useState(i18n.language === 'en');
    const [hindiChecked, setHindiChecked] = useState(i18n.language === 'hi');
    const [anchorElPop, setAnchorElPop] = React.useState(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [anchorElToggle, setAnchorElToggle] = useState(null);
    const [activeItem, setActiveItem] = useState('');

    // Scroll behavior for navbar visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                // Scrolling up or at the top
                setIsVisible(true);
            } else {
                // Scrolling down
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const handleItemClick = (item) => {
        setActiveItem(item);
        // Call the respective handlers based on the item
        if (item === 'home') {
            handleHome();
        } else if (item === 'about') {
            handleAbout();
        } else if (item === 'vault') {
            handleVault();
        } else if (item === 'help') {
            scrollToContactBottom();
        }
    };
    // function to open notification popup
    const handleClick = () => {
        navigate('/coverkraft/notification')
        // setAnchorElPop(event.currentTarget);
    };

    // function to close notification popup
    const handleClose = () => {
        setAnchorElPop(null);
    };

    const open = Boolean(anchorElPop);
    const id = open ? 'simple-popover' : undefined;

    //function to close profile pop up
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    //function to open language pop up

    //function to close language pop up
    const handleClickClose = () => {
        setDialogOpen(false);
    };

    //function for navigation on buttons
    function handleLogin() {
        navigate('/coverkraft/login')
    }
    function handleVault() {
        setActiveItem('vault');
        navigate('/coverkraft/vault')
    }

    function handleHome() {
        setActiveItem('home');
        navigate('/coverkraft')
    }
    function handleAbout() {
        setActiveItem('about');
        navigate('/coverkraft/about')
    }

    //function for change the language
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    //function for logout
    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('verificationId');
        localStorage.removeItem('userId');
        localStorage.removeItem('policyId')
        localStorage.removeItem('selectedPolicyId');
        localStorage.removeItem('token')
        navigate('/coverkraft');
    };

    //function for open dialog
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    //function for updating language
    const handleLanguageUpdate = () => {
        if (englishChecked) {
            changeLanguage('en');
        } else if (hindiChecked) {
            changeLanguage('hi');
        }
        handleClickClose();
    };


    //function for english language
    const handleEnglishChange = (event) => {
        setEnglishChecked(event.target.checked);
        setHindiChecked(!event.target.checked);
    };

    //function for hindi language
    const handleHindiChange = (event) => {
        setHindiChecked(event.target.checked);
        setEnglishChecked(!event.target.checked);
    };

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Function to handle window resize
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        if (window.innerWidth < 1260) {
            setShowMenu(false);
        }
    };

    // Add event listener for window resize
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    //function for toggle bar for small screen
    const handleMenuClick = (event) => {
        setAnchorElToggle(event.currentTarget);
        setShowMenu(true);
    };

    const handleCloseToggle = () => {
        setAnchorElToggle(null);
        setShowMenu(false);
    };


    const [drawerOpen, setDrawerOpen] = useState(false);
    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };
    const handleDrawerOpen = () => {
        handleCloseMenu();
        setDrawerOpen(true);
    };

    return (
        <>
            <div
                data-animate-on-scroll
                className=''
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: '10px 70px',
                    backgroundColor: 'black',
                    boxShadow: isVisible
                        ? 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
                        : 'none',
                    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    zIndex: 1000,
                }}
            >
                <div className='sticky nav-style col-md-12 d-flex justify-content-between py-4 '>
                    <div>
                        <img
                            className='d-inline-block align-top animate-style'
                            alt=''
                            onClick={handleHome}
                            style={{ cursor: 'pointer' }}
                            src={Logo}
                            height={65}
                            width={214}

                        />
                    </div>

                    {windowWidth < 1260 ? (

                        <>
                            <IconButton onClick={handleMenuClick}>
                                {showMenu ? <CloseIcon sx={{ color: THEME_COLOR.COLOR }} /> : <MenuIcon sx={{ color: THEME_COLOR.COLOR }} />}
                            </IconButton>
                            <DarkMenu
                                anchorEl={anchorElToggle}
                                open={Boolean(anchorElToggle)}
                                onClose={handleCloseToggle}
                            >
                                <MenuItem onClick={handleHome}>Home</MenuItem>
                                {loggedIn ? (
                                    <>
                                        <MenuItem onClick={handleCloseToggle}>About Us</MenuItem>
                                        <MenuItem onClick={handleCloseToggle}>Policy</MenuItem>
                                        <MenuItem onClick={handleCloseToggle}>Help</MenuItem>
                                        <MenuItem onClick={handleClick}>Notification</MenuItem>
                                        <MenuItem onClick={handleLogout}>LogOut</MenuItem>
                                        <MenuItem onClick={handleVault}>Vault</MenuItem>
                                    </>
                                ) : (
                                    <MenuItem onClick={handleLogin}>Login</MenuItem>
                                )}
                            </DarkMenu>
                        </>
                    ) : (

                        <div
                            className={`grid gap-5 d-flex align-items-center  ${showMenu ? 'show-menu' : 'hide-menu'
                                }`}
                        >
                            <div
                                className={`nav-item  ${activeItem === 'home' ? 'active' : ''}`}
                                onClick={() => handleItemClick('home')}
                            >
                                Home
                            </div>

                            {loggedIn ? (
                                <>
                                    <div
                                        className={`nav-item ${activeItem === 'about' ? 'active' : ''}`}
                                        onClick={handleAbout}
                                    >
                                        About Us
                                    </div>
                                    <div
                                        className={`nav-item ${activeItem === 'vault' ? 'active' : ''}`}
                                        onClick={handleVault}
                                    >
                                        Policy
                                    </div>
                                    <div
                                        className={`nav-item ${activeItem === 'help' ? 'active' : ''}`}
                                        onClick={scrollToContactBottom}
                                    >
                                        Help
                                    </div>
                                    <img src={notification} alt='' onClick={handleClick} style={{ cursor: 'pointer' }} />
                                    <img src={profile} alt='' onClick={handleOpenMenu} style={{ cursor: 'pointer' }} />
                                    <DarkMenu
                                        style={{
                                            marginTop: '70px',
                                        }}
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleCloseMenu}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    >
                                        <MenuItem onClick={handleDrawerOpen} >
                                            <AccountCircleOutlinedIcon />{' '}
                                            <span
                                                style={{
                                                    paddingLeft: '10px',
                                                    padding: '9px',
                                                    fontSize: '20px',
                                                    fontFamily: 'Poppins',
                                                }}
                                            >
                                                {' '}
                                                My Profile
                                            </span>

                                        </MenuItem>
                                        {/* <MenuItem onClick={handleClickOpen}>
                                            <TranslateOutlinedIcon />{' '}
                                            <span
                                                style={{
                                                    padding: '9px',
                                                    fontSize: '20px',
                                                    fontFamily: 'Poppins',
                                                }}
                                            >
                                                {' '}
                                                Language
                                            </span>
                                        </MenuItem> */}
                                        <MenuItem onClick={handleLogout} >
                                            <LogoutIcon />{' '}
                                            <span
                                                style={{
                                                    padding: '9px',
                                                    fontSize: '20px',
                                                    fontFamily: 'Poppins',
                                                }}
                                            >
                                                {' '}
                                                Logout
                                            </span>
                                        </MenuItem>
                                    </DarkMenu>
                                    <button className='btn btn-lg rounded-5 py-2 px-5' style={{ color: 'white', backgroundColor: '#8AC642' }} onClick={handleVault}>
                                        Vault
                                    </button>
                                </>
                            ) : (
                                <button className={`btn btn-lg custom-color py-2 px-5 `} style={{ borderColor: '#8AC642', color: '#8AC642', borderRadius: '25px' }} onClick={handleLogin}>
                                    Login
                                </button>
                            )}
                        </div>

                    )}

                </div>
            </div>

            {/* Spacer div to prevent content from being hidden behind fixed navbar */}
            <div style={{ height: '95px' }}></div>

            {/* dialog box for language change */}
            <Dialog
                open={dialogOpen}
                onClose={handleClickClose}
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
                        onClick={handleClickClose}

                    />
                    <Button
                        text='Update'
                        onClick={handleLanguageUpdate}

                    />

                </DialogActions>
            </Dialog>
            {/* dialog box for notification icon */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorElPop}
                onClose={handleClose}
                className='mt-3 '


                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography className='custom-color' sx={{ p: 2, fontSize: '17px', fontWeight: '500' }}>35 new notification</Typography>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Card className='rounded' sx={{ mx: 2, my: 1, p: 1, backgroundColor: '#F8FFFE', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} >
                        <Grid container spacing={3} xs={12}>
                            <Grid item xs={2}>
                                <img src={ck} />
                            </Grid>
                            <Grid item xs={8}>
                                <p style={{ fontSize: '17px', fontWeight: '700' }}>The 3 Benefits of a Retirement plan!</p>
                                <p style={{ color: '#7C7C7C', fontSize: '16px', fontWeight: '400' }}>Invent 10k/month to get 1Lakh monthly pension</p>
                            </Grid>
                            <Grid item xs={2}>
                                <p style={{ color: '#A0A0A0', fontSize: '17px' }}>2 days</p>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card className='rounded' sx={{ mx: 2, my: 1, p: 1, backgroundColor: '#F8FFFE', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} >

                        <Grid container spacing={3} xs={12}>
                            <Grid item xs={2}>
                                <img src={ck} />
                            </Grid>
                            <Grid item xs={8}>
                                <p style={{ fontSize: '17px', fontWeight: '700' }}>The 3 Benefits of a Retirement plan!</p>
                                <p style={{ color: '#7C7C7C', fontSize: '16px', fontWeight: '400' }}>Invent 10k/month to get 1Lakh monthly pension</p>
                            </Grid>
                            <Grid item xs={2}>
                                <p style={{ color: '#A0A0A0', fontSize: '17px' }}>2 days</p>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card className='rounded' sx={{ mx: 2, my: 1, p: 1, backgroundColor: '#F8FFFE', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} >

                        <Grid container spacing={3} xs={12}>
                            <Grid item xs={2}>
                                <img src={ck} />
                            </Grid>
                            <Grid item xs={8}>
                                <p style={{ fontSize: '17px', fontWeight: '700' }}>The 3 Benefits of a Retirement plan!</p>
                                <p style={{ color: '#7C7C7C', fontSize: '16px', fontWeight: '400' }}>Invent 10k/month to get 1Lakh monthly pension</p>
                            </Grid>
                            <Grid item xs={2}>
                                <p style={{ color: '#A0A0A0', fontSize: '17px' }}>2 days</p>
                            </Grid>
                        </Grid>
                    </Card>
                </div>
            </Popover>
            <ProfileDrawer open={drawerOpen} onClose={handleDrawerClose} />

        </>
    )
}

export default Navbar