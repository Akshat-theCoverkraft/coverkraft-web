import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Images/CoverKraft-beta.png";
import profile from "../Images/ic-profile.png";
import notification from "../Images/ic-notification.png";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, styled } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProfileDrawer from "../component/profile";
import "./footer.css";
import { THEME_COLOR } from "../constants";

const DarkMenu = styled(Menu)(() => ({
  ".MuiMenu-paper": {
    backgroundColor: "#333",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  ".MuiMenu-list": {
    minWidth: "150px",
  },
}));

const MobileMenu = styled(Menu)(({ theme }) => ({
  ".MuiMenu-paper": {
    backgroundColor: "#333",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    right: "0 !important",
    left: "auto !important",
    transformOrigin: "right top !important",
  },
}));

const StyledButton = styled("button")(() => ({
  backgroundColor: "transparent",
  color: "#8AC642",
  border: "1.5px solid #8AC642",
  borderRadius: "5px",
  padding: "8px 16px",
  fontSize: "1rem",
  fontWeight: "600",
  minWidth: "100px",
  cursor: "pointer",
  userSelect: "none",
  transition: "all 0.25s ease",
  "&:hover": {
    backgroundColor: "#8AC642",
    color: "#000",
  },
}));

const NAV_ITEMS = [
  { key: "home", label: "Home", path: "/coverkraft" },
  { key: "about", label: "About Us", path: "/coverkraft/about", auth: true },
  { key: "contact", label: "Contact Us", path: "/coverkraft/contactus", auth: true },
];

const MORE_MENU_ITEMS = [
  { key: "Card", label: "Why prefer CoverKraft", id: "card" },
  { key: "blog", label: "Blog", id: "blog" },
  { key: "testimonials", label: "Testimonials", id: "testimonials" },
  { key: "faq", label: "FAQ", id: "faq" },
];

const LOCAL_STORAGE_KEYS = ["loggedIn", "verificationId", "userId", "policyId", "selectedPolicyId", "token"];

function Navbar({ scrollToContactBottom }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [moreAnchor, setMoreAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const loggedIn = useMemo(() => localStorage.getItem("loggedIn") === "true", []);
  const isMobile = useMemo(() => windowWidth < 1260, [windowWidth]);
  const isHomePage = useMemo(() => location.pathname === "/coverkraft", [location.pathname]);
  const visibleNavItems = useMemo(() => NAV_ITEMS.filter(item => !item.auth || loggedIn), [loggedIn]);

  // Get active item based on current path
  const activeItem = useMemo(() => {
    const currentItem = NAV_ITEMS.find(item => item.path === location.pathname);
    return currentItem?.key || "";
  }, [location.pathname]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      if (newWidth >= 1260) setMobileAnchor(null);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation handler
  const handleNavigation = useCallback((item) => {
    if (item.isHelp && typeof scrollToContactBottom === "function") {
      return loggedIn ? scrollToContactBottom() : navigate("/coverkraft/login");
    }
    if (item.auth && !loggedIn) return navigate("/coverkraft/login");
    navigate(item.path);
  }, [loggedIn, navigate, scrollToContactBottom]);

  // Logout handler with page refresh
  const handleLogout = useCallback(() => {
    LOCAL_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
    setProfileAnchor(null);
    navigate("/coverkraft");
    // Force page refresh after logout
    setTimeout(() => window.location.reload(), 100);
  }, [navigate]);

  const handleVault = useCallback(() => {
    navigate(localStorage.getItem("token") ? "/coverkraft/vault" : "/coverkraft/login");
  }, [navigate]);

  const handleMoreItemClick = useCallback((id) => {
    setMoreAnchor(null);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Menu close handlers
  const closeMenus = {
    profile: () => setProfileAnchor(null),
    mobile: () => setMobileAnchor(null),
    more: () => setMoreAnchor(null),
  };

  const toggleMobileMenu = useCallback((e) => {
    setMobileAnchor(prev => prev ? null : e.currentTarget);
  }, []);

  // Render user actions
  const UserActions = () => {
    if (!loggedIn) {
      return <StyledButton onClick={() => navigate("/coverkraft/login")}>Login</StyledButton>;
    }

    return (
      <>
        <img
          src={notification}
          alt="notification"
          onClick={() => navigate("/coverkraft/notification")}
          style={{ height: 24, width: 24, cursor: "pointer" }}
        />
        <img
          src={profile}
          alt="profile"
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          style={{ height: 24, width: 24, cursor: "pointer" }}
        />
        <DarkMenu 
          anchorEl={profileAnchor} 
          open={Boolean(profileAnchor)} 
          onClose={closeMenus.profile}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{
            "& .MuiMenu-paper": {
              right: "70px !important",
              left: "auto !important",
            }
          }}
        >
          <MenuItem onClick={() => { setDrawerOpen(true); closeMenus.profile(); }}>
            <AccountCircleOutlinedIcon style={{ marginRight: "10px" }} />
            My Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon style={{ marginRight: "10px" }} />
            Logout
          </MenuItem>
        </DarkMenu>
        <StyledButton onClick={handleVault}>Policy Vault</StyledButton>
      </>
    );
  };

  // Mobile menu items
  const MobileMenuItems = () => (
    <>
      {visibleNavItems.map(item => (
        <MenuItem key={item.key} onClick={() => { handleNavigation(item); closeMenus.mobile(); }}>
          {item.label}
        </MenuItem>
      ))}
      {loggedIn ? (
        <>
          <MenuItem onClick={() => { navigate("/coverkraft/notification"); closeMenus.mobile(); }}>
            Notification
          </MenuItem>
          <MenuItem onClick={() => { handleLogout(); closeMenus.mobile(); }}>
            Logout
          </MenuItem>
        </>
      ) : (
        <MenuItem onClick={() => { navigate("/coverkraft/login"); closeMenus.mobile(); }}>
          Login
        </MenuItem>
      )}
    </>
  );

  // Desktop navigation items
  const DesktopNavItems = () => (
    <>
      {visibleNavItems.map(item => (
        <div
          key={item.key}
          className="nav-item"
          onClick={() => handleNavigation(item)}
          style={{
            cursor: "pointer",
            color: activeItem === item.key ? "#8AC642" : "white",
            fontWeight: activeItem === item.key ? "600" : "400",
            padding: "8px 16px",
            borderRadius: "4px",
            transition: "all 0.3s ease",
          }}
        >
          {item.label}
        </div>
      ))}
    </>
  );

  // More menu (only on home page)
  const MoreMenu = () => {
    if (!isHomePage) return null;
    
    return (
      <>
        <IconButton onClick={(e) => setMoreAnchor(e.currentTarget)} sx={{ color: THEME_COLOR.COLOR }}>
          <MoreVertIcon />
        </IconButton>
        <DarkMenu 
          anchorEl={moreAnchor} 
          open={Boolean(moreAnchor)} 
          onClose={closeMenus.more}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {MORE_MENU_ITEMS.map(item => (
            <MenuItem key={item.key} onClick={() => handleMoreItemClick(item.id)}>
              {item.label}
            </MenuItem>
          ))}
        </DarkMenu>
      </>
    );
  };

  return (
    <>
      {/* Sticky Navbar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "10px 70px",
          backgroundColor: "black",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        <div className="nav-style d-flex justify-content-between align-items-center">
          <img
            src={Logo}
            alt="Logo"
            height={65}
            width={214}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/coverkraft")}
          />

          {isMobile ? (
            <>
              <IconButton onClick={toggleMobileMenu}>
                {mobileAnchor ? 
                  <CloseIcon sx={{ color: THEME_COLOR.COLOR }} /> : 
                  <MenuIcon sx={{ color: THEME_COLOR.COLOR }} />
                }
              </IconButton>
              <MobileMenu
                anchorEl={mobileAnchor}
                open={Boolean(mobileAnchor)}
                onClose={closeMenus.mobile}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MobileMenuItems />
              </MobileMenu>
            </>
          ) : (
            <div className="d-flex align-items-center" style={{ gap: "24px" }}>
              <DesktopNavItems />
              <UserActions />
              <MoreMenu />
            </div>
          )}
        </div>
      </div>

      {/* Spacer div */}
      <div style={{ height: "95px" }} />

      {/* Profile Drawer */}
      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default Navbar;