import React, { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../Images/CKbig.png";
import profileIcon from "../Images/ic-profile.png";
import notificationIcon from "../Images/ic-notification.png";
import ProfileDrawer from "../component/profile";
import { THEME_COLOR } from "../constants";
import { Badge } from "@mui/material";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import { useEffect } from "react";


const NAV_ITEMS = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About Us", path: "/about", auth: true },
  { key: "contact", label: "Contact Us", path: "/contactus", auth: true },
];

const MORE_MENU_ITEMS = [
  { key: "Card", label: "Tips And Tricks", id: "card" },
  { key: "blog", label: "Blogs And News", id: "blog" },
  { key: "testimonials", label: "Testimonials", id: "testimonials" },
  { key: "faq", label: "FAQs", id: "faq" },
];

const SESSION_KEYS = ["userId", "token", "loginTime", "isLoggedIn"];

export const StyledButton = styled("button")(() => ({
  backgroundColor: "transparent",
  color: "#8AC642",
  border: "1.5px solid #8AC642",
  borderRadius: "20px",
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
    backgroundColor: "#212121",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    minWidth: 150,
  },
  "& .MuiModal-root": {
    zIndex: 1,
  },
}));

function Navbar({ scrollToContactBottom }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [moreAnchor, setMoreAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userId = useMemo(() => sessionStorage.getItem("userId"), []);

  const loggedIn = useMemo(() => sessionStorage.getItem("isLoggedIn") === "true", []);
  const isHomePage = useMemo(() => location.pathname === "/", [location.pathname]);
  const [unreadPolicyCount, setUnreadPolicyCount] = useState(0);
  useEffect(() => {
    if (loggedIn) {
      fetchUnreadPolicyCount(); // Initial load

      // Real-time update every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadPolicyCount();
      }, 3000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [loggedIn]);

  const fetchUnreadPolicyCount = async () => {
    try {
      const res = await axios.get(`${API_URL}notification/getAll`, {
        params: { userId: userId, type: "policy", status: "active" }
      });

      if (res.data?.data) {
        const count = res.data.data.filter(n => n.notificationStatus !== "seen").length;
        setUnreadPolicyCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchUnreadPolicyCount();
    }
  }, [loggedIn]);

  const visibleNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (isHomePage && item.key === "home") return false;
      return !item.auth || loggedIn;
    });
  }, [loggedIn, isHomePage]);

  const handleNavigation = useCallback(
    (item) => {
      if (item.auth && !loggedIn) return navigate("/login");
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
    sessionStorage.clear();

    setProfileAnchor(null);
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  };

  const handleVault = () => {
    navigate(sessionStorage.getItem("token") ? "/vault" : "/login");
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
          padding: isMobile ? "10px 20px" : "10px 70px",
          backgroundColor: "black",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <img
            src={Logo}
            alt="Logo"
            height={70}
            width={280}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
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
              >
                {visibleNavItems.map((item) => (
                  <MenuItem
                    key={item.key}
                    onClick={() => {
                      handleNavigation(item);
                      setMobileAnchor(null);
                    }}
                    sx={{ fontSize: "1.3rem" }}

                  >
                    {item.label}
                  </MenuItem>
                ))}
                {loggedIn ? (
                  [
                    <MenuItem
                      key="notify"
                      onClick={() => {
                        navigate("/notification");
                        setMobileAnchor(null);
                      }}
                      sx={{ fontSize: "1.3rem" }}
                    >
                      Notification
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout} sx={{ fontSize: "1.3rem" }}>
                      Logout
                    </MenuItem>,
                  ]
                ) : (
                  <MenuItem
                    onClick={() => {
                      navigate("/login");
                      setMobileAnchor(null);
                    }}
                    sx={{ fontSize: "1.3rem" }}
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
                    color: location.pathname === item.path ? "#8AC642" : "white",
                    fontWeight: location.pathname === item.path ? "600" : "400",
                    fontSize: "1.7rem",
                    padding: "4px 10px",
                  }}
                  onClick={() => handleNavigation(item)}
                >
                  {item.label}
                </div>
              ))}
              {loggedIn ? (
                <>
                  <Badge
                    badgeContent={unreadPolicyCount}
                    color="success"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#8AC642",
                        color: "black",
                        fontSize: "0.8rem",
                        fontWeight: "bold"
                      }
                    }}
                  >
                    <img
                      src={notificationIcon}
                      alt="notification"
                      style={{ height: 28, width: 28, cursor: "pointer" }}
                      onClick={() => navigate("/notification")}
                    />
                  </Badge>


                  <img
                    src={profileIcon}
                    alt="profile"
                    style={{
                      height: 28,
                      width: 28,
                      cursor: "pointer",
                    }}
                    onClick={(e) => setProfileAnchor(e.currentTarget)}
                  />
                  <DarkMenu
                    anchorEl={profileAnchor}
                    open={Boolean(profileAnchor)}
                    onClose={() => setProfileAnchor(null)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        mt: 1.2,
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setDrawerOpen(true);
                        setProfileAnchor(null);
                      }}
                      sx={{ fontSize: "1.3rem" }}
                    >
                      <AccountCircleOutlinedIcon sx={{ mr: 1 }} /> My Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ fontSize: "1.3rem" }}>
                      <LogoutIcon sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </DarkMenu>
                </>
              ) : (
                <StyledButton style={{ fontSize: "1.3rem" }} onClick={() => navigate("/login")}>
                  Login
                </StyledButton>
              )}
              <StyledButton style={{ fontSize: "1.3rem" }} onClick={handleVault}>
                Policy Vault
              </StyledButton>
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
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1.2,
                  },
                }}
              >
                {MORE_MENU_ITEMS.map((item) => (
                  <MenuItem
                    key={item?.key}
                    onClick={() => handleMoreItemClick(item?.id)}
                    sx={{ fontSize: "1.3rem" }}
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
