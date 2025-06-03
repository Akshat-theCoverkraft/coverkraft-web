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
            </div>
          )}
        </div>
      </div>

      <div style={{ height: "95px" }} />

      {/* Profile Drawer */}
      <ProfileDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
}

export default Navbar;
