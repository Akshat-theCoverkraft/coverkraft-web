import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Security as VaultIcon,
  KeyboardArrowDown as ArrowDownIcon,
  DirectionsCar as CarIcon,
  TwoWheeler as BikeIcon,
  Favorite as HealthIcon,
  FlightTakeoff as TravelIcon,
  Assignment as ClaimIcon,
} from "@mui/icons-material";
import Logo from "../Images/CKbig.png";
import profileIcon from "../Images/ic-profile.png";
import notificationIcon from "../Images/ic-notification.png";
import ProfileDrawer from "../component/profile";
import { THEME_COLOR } from "../constants";
import axios from "axios";
import API_URL from "../ServiceModule/Service";


// ─── MEGA MENU DATA ────────────────────────────────────────────────────────────
const MEGA_MENU_DATA = [
  {
    key: "car",
    label: "Car Insurance",
    icon: <CarIcon sx={{ fontSize: 16 }} />,
    color: "#FF5A1F",
    items: [
      { label: "Third-Party Car Insurance", path: "/products/car-third-party" },
      { label: "Comprehensive Car Insurance", path: "/products/car-comprehensive" },
      { label: "Standalone Own Damage", path: "/products/car-own-damage" },
      { label: "Car Insurance Add-ons", path: "/products/car-addons" },
      { label: "View All Car Plans →", path: "/products/car", isViewAll: true },
    ],
  },
  {
    key: "bike",
    label: "Two-Wheeler",
    icon: <BikeIcon sx={{ fontSize: 16 }} />,
    color: "#00A8E8",
    items: [
      { label: "Third-Party Bike Insurance", path: "/products/bike-third-party" },
      { label: "Comprehensive Bike Insurance", path: "/products/bike-comprehensive" },
      { label: "Standalone Own Damage", path: "/products/bike-own-damage" },
      { label: "Bike Add-on Covers", path: "/products/bike-addons" },
      { label: "View All Bike Plans →", path: "/products/bike", isViewAll: true },
    ],
  },
  {
    key: "health",
    label: "Health Insurance",
    icon: <HealthIcon sx={{ fontSize: 16 }} />,
    color: "#E53935",
    items: [
      { label: "Individual Health Plan", path: "/products/health-individual" },
      { label: "Family Floater Plan", path: "/products/health-family" },
      { label: "Corona Kavach / Rakshak", path: "/products/health-covid" },
      { label: "Claims Settlement Guide", path: "/products/health-claims" },
      { label: "View All Health Plans →", path: "/products/health", isViewAll: true },
    ],
  },
  {
    key: "travel",
    label: "Travel Insurance",
    icon: <TravelIcon sx={{ fontSize: 16 }} />,
    color: "#00C48C",
    items: [
      { label: "International Travel", path: "/products/travel-international" },
      { label: "Student Travel", path: "/products/travel-student" },
      { label: "Schengen Travel", path: "/products/travel-schengen" },
      { label: "Domestic Travel", path: "/products/travel-domestic" },
      { label: "View All Travel Plans →", path: "/products/travel", isViewAll: true },
    ],
  },
];


const NAV_ITEMS = [
  { key: "home", label: "Home", path: "/" },
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

// ─── MEGA MENU STYLED ───────────────────────────────────────────────────────────
const MegaMenuWrapper = styled("div")(() => ({
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  width: 880,
  background: "#1a1a1a",
  borderRadius: "0 0 16px 16px",
  border: "1px solid #2a2a2a",
  borderTop: "2px solid #8AC642",
  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
  padding: "24px 28px 28px",
  zIndex: 1300,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 0,
  animation: "fadeSlideDown 0.18s ease",
  "@keyframes fadeSlideDown": {
    from: { opacity: 0, transform: "translateX(-50%) translateY(-8px)" },
    to: { opacity: 1, transform: "translateX(-50%) translateY(0)" },
  },
}));

const MegaCol = styled("div")(({ isLast }) => ({
  padding: "0 18px 0 0",
  borderRight: isLast ? "none" : "1px solid #2e2e2e",
  paddingLeft: isLast ? 18 : 0,
  "&:first-of-type": { paddingLeft: 0 },
}));

const MegaColTitle = styled("div")(({ color }) => ({
  display: "flex",
  alignItems: "center",
  gap: 7,
  color: color || "#8AC642",
  fontWeight: 700,
  fontSize: "1.2rem",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: `2px solid ${color ? color + "33" : "#8AC64233"}`,
}));

const MegaLink = styled("div")(({ isViewAll, color }) => ({
  padding: "7px 10px",
  borderRadius: 6,
  fontSize: "1.25rem",
  fontWeight: isViewAll ? 700 : 400,
  color: isViewAll ? (color || "#8AC642") : "rgba(255,255,255,0.82)",
  cursor: "pointer",
  transition: "all 0.13s",
  "&:hover": {
    background: "rgba(138,198,66,0.1)",
    color: "#8AC642",
    paddingLeft: 14,
  },
}));


function Navbar({ scrollToContactBottom }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const megaRef = useRef(null);
  const [anchorEls, setAnchorEls] = useState({
    profile: null,
    mobile: null,
    more: null,
    submenu: null,
  });
  const [megaOpen, setMegaOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadPolicyCount, setUnreadPolicyCount] = useState(0);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
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

  // Close mega menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setMegaOpen(false);
  }, [location.pathname]);

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

  const performLogout = useCallback(() => {
    sessionStorage.clear();
    setAnchor('profile', null);
    setAnchor('mobile', null);
    setLogoutConfirmOpen(false);
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  }, [navigate, setAnchor]);

  const handleLogout = useCallback(() => {
    setAnchor('profile', null);
    setAnchor('mobile', null);
    setLogoutConfirmOpen(true);
  }, [setAnchor]);

  const handleVault = useCallback(() => {
    navigate(sessionStorage.getItem("token") ? "/vault" : "/login");
  }, [navigate]);

  const handlePrivacyPolicy = useCallback(() => {
    navigate("/legal#PrivacyPolicy");
  }, [navigate]);

  // ── NEW: Claim handler ──────────────────────────────────────────────────────
  const handleClaim = useCallback(() => {
    navigate("/claim");
  }, [navigate, loggedIn]);

  const closeAllMenus = useCallback(() => {
    setAnchorEls({
      profile: null,
      mobile: null,
      more: null,
      submenu: null,
    });
  }, []);

  // ── MEGA MENU COMPONENT (inline) ──────────────────────────────────────────
  const MegaMenuDropdown = () => (
    <MegaMenuWrapper>
      {MEGA_MENU_DATA.map((col, idx) => (
        <MegaCol key={col.key} isLast={idx === MEGA_MENU_DATA.length - 1}
          style={{ paddingLeft: idx === 0 ? 0 : 18 }}>
          <MegaColTitle color={col.color}>
            {col.icon}
            {col.label}
          </MegaColTitle>
          {col.items.map((item) => (
            <MegaLink
              key={item.label}
              isViewAll={item.isViewAll}
              color={col.color}
              onClick={() => {
                setMegaOpen(false);
                navigate(item.path);
              }}
            >
              {item.label}
            </MegaLink>
          ))}
        </MegaCol>
      ))}
    </MegaMenuWrapper>
  );

  // Mobile Menu Sections
  const renderMobileMenuSections = () => {
    const sections = [];

    sections.push(
      <MenuSection key="insurance-products">
        <SectionTitle>Insurance Products</SectionTitle>
        {MEGA_MENU_DATA.map((cat) => (
          <React.Fragment key={cat.key}>
            <MenuItem
              sx={{
                fontSize: "1.3rem",
                py: 1,
                color: cat.color,
                fontWeight: 700,
              }}
            >
              {cat.label}
            </MenuItem>
            {cat.items.filter((i) => !i.isViewAll).map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  closeAllMenus();
                }}
                sx={{ fontSize: "1.15rem", pl: 4, py: 0.8, color: "rgba(255,255,255,0.8)" }}
              >
                {item.label}
              </MenuItem>
            ))}
          </React.Fragment>
        ))}
      </MenuSection>
    );

    sections.push(<Divider key="div-ins" sx={{ borderColor: "#333" }} />);

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
          {/* ── NEW: Claim in mobile quick actions ── */}
          <MenuItem
            onClick={() => {
              handleClaim();
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            <ClaimIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            Claim
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
          {/* ── NEW: Claim in mobile guest actions ── */}
          <MenuItem
            onClick={() => {
              handleClaim();
              closeAllMenus();
            }}
            sx={{ fontSize: "1.3rem", py: 1.5 }}
          >
            <ClaimIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            Claim
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
              {/* ── INSURANCE PRODUCTS MEGA TRIGGER ── */}
              <div
                ref={megaRef}
                style={{ position: "relative" }}
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <NavItem
                  active={location.pathname.startsWith("/products")}
                  style={{ userSelect: "none" }}
                >
                  Insurance Products
                  <ArrowDownIcon
                    sx={{
                      fontSize: 18,
                      transition: "transform 0.2s",
                      transform: megaOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </NavItem>
                {megaOpen && <MegaMenuDropdown />}
              </div>

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

              {/* ── NEW: Claim button ── */}
              <StyledButton onClick={handleClaim}>
                Claim
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
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #90DB78, #3FC8EE)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 14, color: '#000',
                        }}>
                          {sessionStorage.getItem('userName')?.charAt(0).toUpperCase() || 'U'}
                        </div>
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

      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#212121",
            color: "#fff",
            borderRadius: "16px",
            border: "1px solid #444",
            minWidth: { xs: "86vw", sm: 380 },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.8rem", fontWeight: 700 }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#d6d6d6", fontSize: "1.25rem" }}>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setLogoutConfirmOpen(false)}
            sx={{
              color: "#fff",
              borderColor: "#666",
              fontSize: "1.1rem",
              textTransform: "none",
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={performLogout}
            sx={{
              backgroundColor: "#f44336",
              color: "#fff",
              fontSize: "1.1rem",
              textTransform: "none",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;
