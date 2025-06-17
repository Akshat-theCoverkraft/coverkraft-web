import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton, Menu, MenuItem, styled } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../Images/CoverKraft-beta.png";
import profileIcon from "../Images/ic-profile.png";
import notificationIcon from "../Images/ic-notification.png";
import ProfileDrawer from "../component/profile";
import { THEME_COLOR } from "../constants";

const NAV_ITEMS = [
  { key: "home", label: "Home", path: "/coverkraft" },
  { key: "about", label: "About Us", path: "/coverkraft/about", auth: true },
  {
    key: "contact",
    label: "Contact Us",
    path: "/coverkraft/contactus",
    auth: true,
  },
];

const MORE_MENU_ITEMS = [
  { key: "Card", label: "Why prefer CoverKraft", id: "card" },
  { key: "blog", label: "Blog", id: "blog" },
  { key: "testimonials", label: "Testimonials", id: "testimonials" },
  { key: "faq", label: "FAQ", id: "faq" },
];

const LOCAL_STORAGE_KEYS = [
  "loggedIn",
  "verificationId",
  "userId",
  "policyId",
  "selectedPolicyId",
  "token",
];

const StyledButton = styled("button")(() => ({
  backgroundColor: "transparent",
  color: "#8AC642",
  border: "1.5px solid #8AC642",
  borderRadius: "5px",
  padding: "8px 16px",
  fontSize: "1.4rem",
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

const DarkMenu = styled(Menu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    backgroundColor: "#333",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    minWidth: 160,
  },
}));

function Navbar({ scrollToContactBottom }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [moreAnchor, setMoreAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loggedIn = useMemo(
    () => localStorage.getItem("loggedIn") === "true",
    []
  );
  const isMobile = useMemo(() => window.innerWidth < 1260, []);
  const isHomePage = useMemo(
    () => location.pathname === "/coverkraft",
    [location.pathname]
  );

  const visibleNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (isHomePage && item.key === "home") return false;
      return !item.auth || loggedIn;
    });
  }, [loggedIn, isHomePage]);

  const handleNavigation = useCallback(
    (item) => {
      if (item.auth && !loggedIn) return navigate("/coverkraft/login");
      navigate(item.path);
    },
    [loggedIn, navigate]
  );

  const handleMoreItemClick = (id) => {
    setMoreAnchor(null);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    LOCAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    setProfileAnchor(null);
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  };

  const handleVault = () => {
    navigate(
      localStorage.getItem("token") ? "/coverkraft/vault" : "/coverkraft/login"
    );
  };

  return (
    <>
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
        <div className="d-flex justify-content-between align-items-center">
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
              <IconButton onClick={(e) => setMobileAnchor(e.currentTarget)}>
                {mobileAnchor ? (
                  <CloseIcon sx={{ color: THEME_COLOR.COLOR }} />
                ) : (
                  <MenuIcon sx={{ color: THEME_COLOR.COLOR }} />
                )}
              </IconButton>
              <DarkMenu
                anchorEl={mobileAnchor}
                open={Boolean(mobileAnchor)}
                onClose={() => setMobileAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {visibleNavItems.map((item) => (
                  <MenuItem
                    key={item.key}
                    onClick={() => {
                      handleNavigation(item);
                      setMobileAnchor(null);
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                {loggedIn ? (
                  <>
                    <MenuItem
                      key="notify"
                      onClick={() => {
                        navigate("/coverkraft/notification");
                        setMobileAnchor(null);
                      }}
                    >
                      Notification
                    </MenuItem>
                    <MenuItem key="logout" onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    onClick={() => {
                      navigate("/coverkraft/login");
                      setMobileAnchor(null);
                    }}
                  >
                    Login
                  </MenuItem>
                )}
              </DarkMenu>
            </>
          ) : (
            <div className="d-flex align-items-center" style={{ gap: 24 }}>
              {visibleNavItems.map((item) => (
                <div
                  key={item.key}
                  style={{
                    cursor: "pointer",
                    color:
                      location.pathname === item.path ? "#8AC642" : "white",
                    fontWeight: location.pathname === item.path ? "600" : "400",
                    fontSize: "1.5rem",
                    padding: "4px 10px",
                    transition: "color 0.3s ease",
                  }}
                  onClick={() => handleNavigation(item)}
                >
                  {item.label}
                </div>
              ))}
              {loggedIn ? (
                <>
                  <img
                    src={notificationIcon}
                    alt="notification"
                    style={{ height: 24, width: 24, cursor: "pointer" }}
                    onClick={() => navigate("/coverkraft/notification")}
                  />
                  <img
                    src={profileIcon}
                    alt="profile"
                    style={{ height: 24, width: 24, cursor: "pointer" }}
                    onClick={(e) => setProfileAnchor(e.currentTarget)}
                  />
                  <DarkMenu
                    anchorEl={profileAnchor}
                    open={Boolean(profileAnchor)}
                    onClose={() => setProfileAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem
                      onClick={() => {
                        setDrawerOpen(true);
                        setProfileAnchor(null);
                      }}
                    >
                      <AccountCircleOutlinedIcon sx={{ mr: 1 }} /> My Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </DarkMenu>
                </>
              ) : (
                <StyledButton onClick={() => navigate("/coverkraft/login")}>
                  Login
                </StyledButton>
              )}
              <StyledButton onClick={handleVault}>Policy Vault</StyledButton>
              {isHomePage && (
                <IconButton
                  onClick={(e) => setMoreAnchor(e?.currentTarget)}
                  sx={{ color: THEME_COLOR.COLOR }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
              <DarkMenu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={() => setMoreAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {MORE_MENU_ITEMS.map((item) => (
                  <MenuItem
                    key={item?.key}
                    onClick={() => handleMoreItemClick(item?.id)}
                  >
                    {item?.label}
                  </MenuItem>
                ))}
              </DarkMenu>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: "95px" }} />
      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default Navbar;
