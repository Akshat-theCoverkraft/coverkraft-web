import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  useMediaQuery,
  useTheme,
  Badge,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Security as VaultIcon,
} from "@mui/icons-material";
import Logo from "../Images/CKbig.png";
import profileIcon from "../Images/ic-profile.png";
import notificationIcon from "../Images/ic-notification.png";
import ProfileDrawer from "../component/profile";
import { THEME_COLOR } from "../constants";
import axios from "axios";
import API_URL from "../ServiceModule/Service";

const NAV_ITEMS = [
  { key: "home", label: "Home", path: "/" },
  {
    key: "about",
    label: "About Us",
    path: "/about",
    auth: true,
    children: [{ label: "Our Leaders", path: "/Our-LeaderShip" }],
  },
  { key: "contact", label: "Contact Us", path: "/contactus", auth: true },
];

const MORE_MENU_ITEMS = [
  { key: "blog", label: "Blogs And News", id: "blog" },
  { key: "Card", label: "Tips And Tricks", id: "card" },
  { key: "testimonials", label: "Testimonials", id: "testimonials" },
  { key: "faq", label: "FAQs", id: "faq" },
];

const StyledButton = styled("button")(() => ({
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
  "@media (max-width: 768px)": {
    fontSize: "1.2rem",
    padding: "6px 12px",
    minWidth: "80px",
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
    zIndex: 1300,
  },
}));

const NavItem = styled("div")(({ active }) => ({
  cursor: "pointer",
  color: active ? "#8AC642" : "white",
  fontWeight: active ? "600" : "400",
  fontSize: "1.7rem",
  padding: "4px 10px",
  transition: "all 0.2s ease",
  "&:hover": {
    color: "#8AC642",
  },
  "@media (max-width: 1024px)": {
    fontSize: "1.5rem",
  },
}));

const MenuSection = styled("div")(() => ({
  padding: "8px 0",
}));

const SectionTitle = styled("div")(() => ({
  padding: "8px 16px 4px",
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#8AC642",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

function Navbar({ scrollToContactBottom }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [anchorEls, setAnchorEls] = useState({
    profile: null,
    mobile: null,
    more: null,
    submenu: null,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadPolicyCount, setUnreadPolicyCount] = useState(0);
const userName = useMemo(() => sessionStorage.getItem("userName"), []);

  // Memoized values
  const userId = useMemo(() => sessionStorage.getItem("userId"), []);
  const userEmail = useMemo(() => sessionStorage.getItem("userEmail"), []);
  const loggedIn = useMemo(() => sessionStorage.getItem("isLoggedIn") === "true", []);
  const isHomePage = useMemo(() => location.pathname === "/", [location.pathname]);

  const visibleNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (isHomePage && item.key === "home") return false;
      return !item.auth || loggedIn;
    });
  }, [loggedIn, isHomePage]);

  // Fetch unread notifications
  const fetchUnreadPolicyCount = useCallback(async () => {
    if (!loggedIn || !userId) return;
    
    try {
      const res = await axios.get(`${API_URL}notification/getAll`, {
        params: { userId, type: "policy", status: "active" },
      });

      if (res.data?.data) {
        const count = res.data.data.filter(n => n.notificationStatus !== "seen").length;
        setUnreadPolicyCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  }, [loggedIn, userId]);

  useEffect(() => {
    fetchUnreadPolicyCount();
  }, [fetchUnreadPolicyCount]);

  // Generic anchor handler
  const setAnchor = useCallback((type, value) => {
    setAnchorEls(prev => ({ ...prev, [type]: value }));
  }, []);

  // Navigation handlers
  const handleNavigation = useCallback((item) => {
    if (item.auth && !loggedIn) return navigate("/login");
    navigate(item.path);
  }, [loggedIn, navigate]);

  const handleHomeClick = useCallback(() => {
    if (isHomePage) {
      window.location.reload();
    } else {
      navigate("/");
    }
  }, [isHomePage, navigate]);

  const handleMoreItemClick = useCallback((id) => {
    setAnchor('more', null);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }, [setAnchor]);

  const handleLogout = useCallback(() => {
    sessionStorage.clear();
    setAnchor('profile', null);
    setAnchor('mobile', null);
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  }, [navigate, setAnchor]);

  const handleVault = useCallback(() => {
    navigate(sessionStorage.getItem("token") ? "/vault" : "/login");
  }, [navigate]);
  const handlePrivacyPolicy = useCallback(() => {
    navigate("/privacy-policy");
  }, [navigate]);

  const closeAllMenus = useCallback(() => {
    setAnchorEls({
      profile: null,
      mobile: null,
      more: null,
      submenu: null,
    });
  }, []);

  // Mobile Menu Sections
  const renderMobileMenuSections = () => {
    const sections = [];

    if (loggedIn) {
      // Quick Actions Section
      sections.push(
        <MenuSection key="quick-actions">
          <SectionTitle>Quick Actions</SectionTitle>
          <MenuItem
            onClick={() => {
              handleVault();
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            <VaultIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            Policy Vault
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePrivacyPolicy();
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            Privacy Policy
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/notification");
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            <Badge
              badgeContent={unreadPolicyCount}
              color="success"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#8AC642",
                  color: "black",
                  fontSize: "0.7rem",
                },
              }}
            >
              <NotificationsIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            </Badge>
            Notifications
          </MenuItem>
        </MenuSection>
      );

      sections.push(<Divider key="divider1" sx={{ borderColor: "#333" }} />);

      // Account Section
      sections.push(
        <MenuSection key="account">
          <SectionTitle>Account</SectionTitle>
          <MenuItem
            onClick={() => {
              setDrawerOpen(true);
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            <AccountCircleOutlinedIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            My Profile
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            <LogoutIcon sx={{ mr: 1.5, color: "#f44336" }} />
            Logout
          </MenuItem>
        </MenuSection>
      );

      sections.push(<Divider key="divider2" sx={{ borderColor: "#333" }} />);
    } else {
      // Guest Actions
      sections.push(
        <MenuSection key="guest-actions">
          <SectionTitle>Get Started</SectionTitle>
          <MenuItem
            onClick={() => {
              navigate("/login");
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            Login
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleVault();
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            <VaultIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            Policy Vault
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePrivacyPolicy();
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            Privacy Policy
          </MenuItem>
        </MenuSection>
      );

      sections.push(<Divider key="divider3" sx={{ borderColor: "#333" }} />);
    }

    // Navigation Section
    if (visibleNavItems.length > 0) {
      sections.push(
        <MenuSection key="navigation">
          <SectionTitle>Navigation</SectionTitle>
          {visibleNavItems.map((item) => (
            <React.Fragment key={item.key}>
              <MenuItem
                onClick={() => {
                  handleNavigation(item);
                  closeAllMenus();
                }}
                sx={{ fontSize: "1.3rem", py: 1.5 }}
              >
                {item.label}
              </MenuItem>
              {item.children?.map((child) => (
                <MenuItem
                  key={child.label}
                  onClick={() => {
                    navigate(child.path);
                    closeAllMenus();
                  }}
                  sx={{ fontSize: "1.2rem", pl: 4, py: 1 }}
                >
                  {child.label}
                </MenuItem>
              ))}
            </React.Fragment>
          ))}
        </MenuSection>
      );
    }

    return sections;
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          padding: isMobile ? "10px 20px" : "10px 70px",
          backgroundColor: "black",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <img
            src={Logo}
            alt="Logo"
            height={isMobile ? 50 : 70}
            width={isMobile ? 200 : 280}
            style={{ cursor: "pointer" }}
            onClick={handleHomeClick}
          />

          {isMobile ? (
            <>
              <IconButton onClick={(e) => setAnchor('mobile', anchorEls.mobile ? null : e.currentTarget)}>
                {anchorEls.mobile ? (
                  <CloseIcon sx={{ color: THEME_COLOR.COLOR }} />
                ) : (
                  <MenuIcon sx={{ color: THEME_COLOR.COLOR }} />
                )}
              </IconButton>
              <DarkMenu
                anchorEl={anchorEls.mobile}
                open={Boolean(anchorEls.mobile)}
                onClose={() => setAnchor('mobile', null)}
                PaperProps={{
                  sx: {
                    maxHeight: "80vh",
                    width: "280px",
                    overflowY: "auto",
                  },
                }}
              >
                {renderMobileMenuSections()}
              </DarkMenu>
            </>
          ) : (
            <div className="d-flex align-items-center" style={{ gap: isTablet ? 16 : 24 }}>
              {visibleNavItems.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.key}>
                      <NavItem
                        active={location.pathname === item.path}
                        onClick={(e) => setAnchor('submenu', e.currentTarget)}
                      >
                        {item.label}
                      </NavItem>
                      <DarkMenu
                        anchorEl={anchorEls.submenu}
                        open={Boolean(anchorEls.submenu)}
                        onClose={() => setAnchor('submenu', null)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        PaperProps={{ sx: { mt: 1 } }}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate(item.path);
                            setAnchor('submenu', null);
                          }}
                          sx={{ fontSize: "1.3rem" }}
                        >
                          {item.label}
                        </MenuItem>
                        {item.children.map((child) => (
                          <MenuItem
                            key={child.label}
                            onClick={() => {
                              navigate(child.path);
                              setAnchor('submenu', null);
                            }}
                            sx={{ fontSize: "1.3rem" }}
                          >
                            {child.label}
                          </MenuItem>
                        ))}
                      </DarkMenu>
                    </div>
                  );
                }

                return (
                  <NavItem
                    key={item.key}
                    active={location.pathname === item.path}
                    onClick={() => handleNavigation(item)}
                  >
                    {item.label}
                  </NavItem>
                );
              })}

              <StyledButton onClick={() => navigate("/joinUs")}>
                Join Us
              </StyledButton>
              <StyledButton onClick={handlePrivacyPolicy}>
                Privacy Policy
              </StyledButton>
              
              <StyledButton onClick={handleVault}>
                Policy Vault
              </StyledButton>

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
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <img
                      src={notificationIcon}
                      alt="notification"
                      style={{ height: 28, width: 28, cursor: "pointer" }}
                      onClick={() => navigate("/notification")}
                    />
                  </Badge>
                  
                  <Tooltip
                    title={!!userEmail ? "" : "Please update email."}
                    PopperProps={{
                      sx: {
                        "& .MuiTooltip-tooltip": {
                          fontSize: "1.4rem",
                          padding: "8px 12px",
                        },
                      },
                    }}
                  >
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={!!userEmail}
                      sx={{
                        "& .MuiBadge-badge": {
                          right: -2,
                          top: 2,
                          height: "10px",
                          minWidth: "10px",
                          borderRadius: "50%",
                        },
                      }}
                    >
                      <div
  onClick={(e) => setAnchor('profile', e.currentTarget)}
  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
>
  {/* Avatar circle instead of profileIcon */}
  <div style={{
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, #90DB78, #3FC8EE)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 14, color: '#000',
  }}>
    {sessionStorage.getItem('userName')?.charAt(0).toUpperCase() || 'U'}
  </div>

  {/* Hi, FirstName below avatar */}
  <span style={{
    fontSize: 15, color: '#8AC642',
    fontFamily: 'Gotham, sans-serif',
    fontWeight: 600, marginTop: 2,
    whiteSpace: 'nowrap', lineHeight: 1,
  }}>
   Hi, {sessionStorage.getItem('userName')?.split(' ')[0]?.charAt(0).toUpperCase() + sessionStorage.getItem('userName')?.split(' ')[0]?.slice(1).toLowerCase()} 👋

  </span>
</div>
                    </Badge>
                  </Tooltip>

                  <DarkMenu
                    anchorEl={anchorEls.profile}
                    open={Boolean(anchorEls.profile)}
                    onClose={() => setAnchor('profile', null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{ sx: { mt: 1.2 } }}
                  >
                    <MenuItem
                      onClick={() => {
                        setDrawerOpen(true);
                        setAnchor('profile', null);
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
                <StyledButton onClick={() => navigate("/login")}>
                  Login
                </StyledButton>
              )}
              

              {isHomePage && (
                <IconButton
                  onClick={(e) => setAnchor('more', e.currentTarget)}
                  sx={{ color: THEME_COLOR.COLOR }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}

              <DarkMenu
                anchorEl={anchorEls.more}
                open={Boolean(anchorEls.more)}
                onClose={() => setAnchor('more', null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { mt: 1.2 } }}
              >
                {MORE_MENU_ITEMS.map((item) => (
                  <MenuItem
                    key={item.key}
                    onClick={() => handleMoreItemClick(item.id)}
                    sx={{ fontSize: "1.3rem" }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </DarkMenu>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: isMobile ? "80px" : "95px" }} />
      
      <ProfileDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />
    </>
  );
}

export default Navbar;