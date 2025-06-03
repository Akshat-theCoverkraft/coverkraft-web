<<<<<<< Updated upstream
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Images/coverkraft_logo_1.png";
import profile from "../Images/ic-profile.png";
import notification from "../Images/ic-notification.png";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ProfileDrawer from "../component/profile";
import "./footer.css";
import { THEME_COLOR } from "../constants";
import { styled } from "@mui/material";

const DarkMenu = styled(Menu)(() => ({
  ".MuiMenu-paper": {
    backgroundColor: "#333",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
}));

function Navbar(props) {
  const navigate = useNavigate();
  const { scrollToContactBottom } = props;
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const { i18n } = useTranslation();

  // State management
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeItem, setActiveItem] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Scroll behavior for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1260) {
        setMobileMenuAnchor(null); // Close mobile menu on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Authentication check helper
  const requireAuth = (callback) => {
    if (loggedIn) {
      callback();
    } else {
      navigate("/coverkraft/login");
    }
  };

  // Navigation handlers
  const handleHome = () => {
    setActiveItem("home");
    navigate("/coverkraft");
  };

  const handleAbout = () => {
    requireAuth(() => {
      setActiveItem("about");
      navigate("/coverkraft/about");
    });
  };

  const handleVault = () => {
    requireAuth(() => {
      setActiveItem("vault");
      navigate("/coverkraft/vault");
    });
  };

  const handleHelp = () => {
    requireAuth(() => {
      setActiveItem("help");
      // scrollToContactBottom();
    });
  };

  const handleNotification = () => {
    requireAuth(() => {
      navigate("/coverkraft/notification");
    });
  };

  const handleLogin = () => {
    navigate("/coverkraft/login");
  };

  const handleLogout = () => {
    [
      "loggedIn",
      "verificationId",
      "userId",
      "policyId",
      "selectedPolicyId",
      "token",
    ].forEach((key) => localStorage.removeItem(key));
    navigate("/coverkraft");
  };

  // Menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleMobileMenuToggle = (event) => {
    setMobileMenuAnchor(mobileMenuAnchor ? null : event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleDrawerOpen = () => {
    handleProfileMenuClose();
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const isMobile = windowWidth < 1260;

  return (
    <>
      {/* Fixed Navbar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "10px 70px",
          backgroundColor: "black",
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1000,
        }}
      >
        <div className="sticky nav-style col-md-12 d-flex justify-content-between py-4">
          {/* Logo */}
          <div>
            <img
              className="d-inline-block align-top animate-style"
              alt="CoverKraft Logo"
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              src={Logo}
              height={65}
              width={214}
            />
          </div>

          {/* Mobile Menu */}
          {isMobile ? (
            <>
              <IconButton onClick={handleMobileMenuToggle}>
                {mobileMenuAnchor ? (
                  <CloseIcon sx={{ color: THEME_COLOR.COLOR }} />
                ) : (
                  <MenuIcon sx={{ color: THEME_COLOR.COLOR }} />
                )}
              </IconButton>
              <DarkMenu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleHome();
                    handleMobileMenuClose();
                  }}
                >
                  Home
                </MenuItem>
                {loggedIn ? (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleAbout();
                        handleMobileMenuClose();
                      }}
                    >
                      About Us
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleVault();
                        handleMobileMenuClose();
                      }}
                    >
                      Policy
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleHelp();
                        handleMobileMenuClose();
                      }}
                    >
                      Help
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleNotification();
                        handleMobileMenuClose();
                      }}
                    >
                      Notification
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleVault();
                        handleMobileMenuClose();
                      }}
                    >
                      Vault
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                        handleMobileMenuClose();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    onClick={() => {
                      handleLogin();
                      handleMobileMenuClose();
                    }}
                  >
                    Login
                  </MenuItem>
                )}
              </DarkMenu>
            </>
          ) : (
            /* Desktop Menu */
            <div className="d-flex align-items-center gap-5">
              <div
                className={`nav-item ${activeItem === "home" ? "active" : ""}`}
                onClick={handleHome}
                style={{ cursor: "pointer" }}
              >
                Home
              </div>

              {loggedIn ? (
                <>
                  <div
                    className={`nav-item ${
                      activeItem === "about" ? "active" : ""
                    }`}
                    onClick={handleAbout}
                    style={{ cursor: "pointer" }}
                  >
                    About Us
                  </div>
                  <div
                    className={`nav-item ${
                      activeItem === "vault" ? "active" : ""
                    }`}
                    onClick={handleVault}
                    style={{ cursor: "pointer" }}
                  >
                    Policy
                  </div>
                  <div
                    className={`nav-item ${
                      activeItem === "help" ? "active" : ""
                    }`}
                    onClick={handleHelp}
                    style={{ cursor: "pointer" }}
                  >
                    Help
                  </div>

                  {/* Notification Icon */}
                  <img
                    src={notification}
                    alt="Notifications"
                    onClick={handleNotification}
                    style={{ cursor: "pointer", height: "24px", width: "24px" }}
                  />

                  {/* Profile Icon */}
                  <img
                    src={profile}
                    alt="Profile"
                    onClick={handleProfileMenuOpen}
                    style={{ cursor: "pointer", height: "32px", width: "32px" }}
                  />

                  {/* Profile Dropdown Menu */}
                  <DarkMenu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    style={{ marginTop: "10px" }}
                  >
                    <MenuItem onClick={handleDrawerOpen}>
                      <AccountCircleOutlinedIcon
                        style={{ marginRight: "10px" }}
                      />
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon style={{ marginRight: "10px" }} />
                      Logout
                    </MenuItem>
                  </DarkMenu>

                  {/* Vault Button */}
                  <button
                    className="btn btn-lg rounded-5 py-2 px-5"
                    style={{
                      color: "white",
                      backgroundColor: "#8AC642",
                      border: "none",
                    }}
                    onClick={handleVault}
                  >
                    Vault
                  </button>
                </>
              ) : (
                /* Login Button for Non-authenticated Users */
                <button
                  className="btn btn-lg py-2 px-5"
                  style={{
                    borderColor: "#8AC642",
                    color: "#8AC642",
                    borderRadius: "25px",
                    backgroundColor: "transparent",
                  }}
                  onClick={handleLogin}
                >
                  Login
                </button>
              )}
=======
// Navbar.js (Updated with three-dot menu for Landing sections)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Images/coverkraft_logo_1.png';
import profile from '../Images/ic-profile.png';
import notification from '../Images/ic-notification.png';
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ProfileDrawer from "../component/profile";
import './footer.css';
import { THEME_COLOR } from '../constants';

const DarkMenu = styled(Menu)(() => ({
    '.MuiMenu-paper': {
        backgroundColor: '#333',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    },
}));

const NAV_ITEMS = [
  { key: 'home', label: 'Home', path: '/coverkraft', auth: false },
  { key: 'about', label: 'About Us', path: '/coverkraft/about', auth: true },
  { key: 'help', label: 'Help', path: '', auth: true, isHelp: true },
];

// The extra menu for Landing sections - add IDs in your Landing components accordingly!
const MORE_MENU_ITEMS = [


  { key: 'Card', label: 'Why prefer CoverKraft', id: 'card' },
  { key: 'about', label: 'About Us', id: 'about' },
  { key: 'blog', label: 'Blog', id: 'blog' },
  { key: 'testimonials', label: 'Testimonials', id: 'testimonials' },
  { key: 'faq', label: 'FAQ', id: 'faq' },
  { key: 'service', label: 'Service', id: 'service' },
];

function Navbar({ scrollToContactBottom }) {
    const navigate = useNavigate();
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const { i18n } = useTranslation();

    const [profileAnchor, setProfileAnchor] = useState(null);
    const [mobileAnchor, setMobileAnchor] = useState(null);
    const [moreAnchor, setMoreAnchor] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const isMobile = windowWidth < 1260;

    useEffect(() => {
        const onScroll = () => {
            const scrollY = window.scrollY;
            setIsVisible(scrollY < 10 || scrollY < window.lastY);
            window.lastY = scrollY;
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 1260) setMobileAnchor(null);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const secure = (callback) => () => {
        if (loggedIn) callback();
        else navigate('/coverkraft/login');
    };

    const handleNavigation = (item) => {
        if (item.isHelp) return secure(scrollToContactBottom)();
        if (item.auth) return secure(() => navigate(item.path))();
        navigate(item.path);
    };

    const handleLogout = () => {
        ['loggedIn', 'verificationId', 'userId', 'policyId', 'selectedPolicyId', 'token']
            .forEach(key => localStorage.removeItem(key));
        navigate('/coverkraft');
    };

    const handleMoreClick = (event) => {
        setMoreAnchor(event.currentTarget);
    };

    const handleMoreClose = () => {
        setMoreAnchor(null);
    };

    const handleMoreItemClick = (id) => {
        handleMoreClose();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
     const handleVault = () => {
    const isLoggedIn = !!localStorage.getItem('token'); // Change 'token' to your actual key if different

    if (isLoggedIn) {
      navigate('/coverkraft/vault');
    } else {
      navigate('/coverkraft/login'); // Redirect to login if not logged in
    }
  };

    return (
        <>
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                padding: '10px 70px', backgroundColor: 'black',
                boxShadow: '0px 4px 6px rgba(0,0,0,0.3)',
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                transition: 'transform 0.3s ease-in-out'
            }}>
                <div className='nav-style d-flex justify-content-between align-items-center'>
                    <img src={Logo} alt='Logo' height={65} width={214} style={{ cursor: 'pointer' }} onClick={() => handleNavigation(NAV_ITEMS[0])} />

                    {isMobile ? (
                        <>
                            <IconButton onClick={() => setMobileAnchor(mobileAnchor ? null : true)}>
                                {mobileAnchor ? <CloseIcon sx={{ color: THEME_COLOR.COLOR }} /> : <MenuIcon sx={{ color: THEME_COLOR.COLOR }} />}
                            </IconButton>
                            <DarkMenu open={Boolean(mobileAnchor)} onClose={() => setMobileAnchor(null)}>
                                {NAV_ITEMS.filter(item => !item.auth || loggedIn).map(item => (
                                    <MenuItem key={item.key} onClick={() => { handleNavigation(item); setMobileAnchor(null); }}>{item.label}</MenuItem>
                                ))}
                                {loggedIn ? (
                                    <>
                                        <MenuItem onClick={() => { navigate('/coverkraft/notification'); setMobileAnchor(null); }}>Notification</MenuItem>
                                        <MenuItem onClick={() => { handleLogout(); setMobileAnchor(null); }}>Logout</MenuItem>
                                    </>
                                ) : (
                                    <MenuItem onClick={() => { navigate('/coverkraft/login'); setMobileAnchor(null); }}>Login</MenuItem>
                                )}
                            </DarkMenu>
                        </>
                    ) : (
                        <div className='d-flex align-items-center gap-4'>
                            {NAV_ITEMS.filter(item => !item.auth || loggedIn).map(item => (
                                <div
                                    key={item.key}
                                    className={`nav-item ${activeItem === item.key ? 'active' : ''}`}
                                    onClick={() => { handleNavigation(item); setActiveItem(item.key); }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.label}
                                </div>
                            ))}

                            {loggedIn ? (
                                <>
                                    <img src={notification} alt='notification' onClick={() => navigate('/coverkraft/notification')} style={{ height: 24, width: 24, cursor: 'pointer' }} />
                                    <img src={profile} alt='profile' onClick={(e) => setProfileAnchor(e.currentTarget)} style={{ height: 32, width: 32, cursor: 'pointer' }} />
                                    <DarkMenu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
                                        <MenuItem onClick={() => { setDrawerOpen(true); setProfileAnchor(null); }}>
                                            <AccountCircleOutlinedIcon style={{ marginRight: '10px' }} /> My Profile
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            <LogoutIcon style={{ marginRight: '10px' }} /> Logout
                                        </MenuItem>
                                    </DarkMenu>
                                    <button className='btn btn-lg px-4 py-2' style={{ backgroundColor: '#8AC642', color: 'white', border: 'none' }} onClick={handleVault}>
                                        Vault
                                    </button>
                                    {/* Move three-dot menu after Vault */}
                                    <IconButton onClick={handleMoreClick} sx={{ color: THEME_COLOR.COLOR }}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <DarkMenu
                                        anchorEl={moreAnchor}
                                        open={Boolean(moreAnchor)}
                                        onClose={handleMoreClose}
                                    >
                                        {MORE_MENU_ITEMS.map(item => (
                                            <MenuItem key={item.key} onClick={() => handleMoreItemClick(item.id)}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </DarkMenu>
                                </>
                            ) : (
                                <>
                                    <button className='btn btn-lg px-4 py-2' style={{ color: '#8AC642', borderColor: '#8AC642', background: 'transparent' }} onClick={() => navigate('/coverkraft/login')}>
                                        Login
                                    </button>
                                    {/* Move three-dot menu after Login button for consistency */}
                                    <IconButton onClick={handleMoreClick} sx={{ color: THEME_COLOR.COLOR }}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <DarkMenu
                                        anchorEl={moreAnchor}
                                        open={Boolean(moreAnchor)}
                                        onClose={handleMoreClose}
                                    >
                                        {MORE_MENU_ITEMS.map(item => (
                                            <MenuItem key={item.key} onClick={() => handleMoreItemClick(item.id)}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </DarkMenu>
                                </>
                            )}
                        </div>
                    )}
                </div>
>>>>>>> Stashed changes
            </div>
          )}
        </div>
      </div>

<<<<<<< Updated upstream
      <div style={{ height: "95px" }} />

      {/* Profile Drawer */}
      <ProfileDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
=======
            <div style={{ height: '95px' }} />
            <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    );
>>>>>>> Stashed changes
}

export default Navbar;
