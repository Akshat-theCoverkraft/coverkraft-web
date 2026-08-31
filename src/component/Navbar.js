import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Security as VaultIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Assignment as ClaimIcon,
} from "@mui/icons-material";
import Logo from "../Images/CKbig.png";
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
  color: "rgba(255,255,255,0.9)",
  border: "0",
  borderRadius: "999px",
  padding: "clamp(7px, 0.7vw, 10px) clamp(7px, 0.8vw, 11px)",
  fontSize: "clamp(1.08rem, 0.86vw, 1.32rem)",
  fontWeight: "700",
  minWidth: "auto",
  cursor: "pointer",
  userSelect: "none",
  whiteSpace: "nowrap",
  transition: "color 0.28s ease, background 0.28s ease, transform 0.28s ease",
  "&:hover": {
    background: "linear-gradient(135deg, rgba(138,198,66,0.13), rgba(45,212,191,0.1))",
    color: "#B8FF62",
    transform: "translateY(-0.5px)",
  },
  "@media (max-width: 768px)": {
    fontSize: "1.4rem",
    padding: "9px 12px",
    minWidth: "80px",
  },
}));

const DarkMenu = styled(Menu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    background: "linear-gradient(145deg, rgba(7,15,19,0.98), rgba(11,21,28,0.98))",
    color: "white",
    borderRadius: "18px",
    border: "1px solid rgba(126,231,55,0.13)",
    boxShadow: "0 18px 46px rgba(0,0,0,0.36), 0 0 28px rgba(45,212,191,0.08)",
    minWidth: 150,
  },
  "& .MuiModal-root": {
    zIndex: 1300,
  },
}));

const NavItem = styled("div")(({ active }) => ({
  cursor: "pointer",
  color: active ? "#B8FF62" : "rgba(255,255,255,0.88)",
  fontWeight: 800,
  fontSize: "clamp(1.08rem, 0.86vw, 1.32rem)",
  padding: "clamp(7px, 0.7vw, 10px) clamp(9px, 1vw, 14px)",
  borderRadius: "999px",
  border: "0",
  background: active ? "linear-gradient(135deg, rgba(138,198,66,0.14), rgba(45,212,191,0.1))" : "transparent",
  boxShadow: active ? "0 0 16px rgba(45,212,191,0.13)" : "none",
  display: "flex",
  alignItems: "center",
  gap: 5,
  transition: "color 0.28s ease, background 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease",
  "&:hover": {
    color: "#B8FF62",
    background: "linear-gradient(135deg, rgba(138,198,66,0.12), rgba(45,212,191,0.09))",
    boxShadow: "0 0 14px rgba(45,212,191,0.12)",
    transform: "translateY(-0.5px)",
  },
  "@media (max-width: 1024px)": {
    fontSize: "1.28rem",
  },
}));

const MenuSection = styled("div")(() => ({
  padding: "8px 0",
}));

const SectionTitle = styled("div")(() => ({
  padding: "8px 16px 4px",
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#8AC642",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const mobileMenuItemSx = {
  fontSize: { xs: "1.7rem", sm: "1.6rem" },
  py: 1.55,
};

const mobileSubMenuItemSx = {
  fontSize: { xs: "1.5rem", sm: "1.4rem" },
  pl: 4,
  py: 1.15,
  color: "rgba(255,255,255,0.8)",
};

// ─── MEGA MENU STYLED ───────────────────────────────────────────────────────────
const MegaMenuWrapper = styled("div")(() => ({
  position: "absolute",
  top: "calc(100% + 16px)",
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(880px, calc(100vw - 48px))",
  background: "linear-gradient(145deg, rgba(6,14,18,0.97), rgba(10,22,30,0.97))",
  backdropFilter: "blur(18px)",
  borderRadius: "22px",
  border: "1px solid rgba(126,231,55,0.18)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.42), 0 0 34px rgba(45,212,191,0.1)",
  padding: "22px 24px 24px",
  zIndex: 1300,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 0,
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
  fontSize: "1.35rem",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: `1px solid ${color ? color + "2d" : "#8AC6422d"}`,
}));

const MegaLink = styled("div")(({ isViewAll, color }) => ({
  padding: "7px 10px",
  borderRadius: 6,
  fontSize: "1.4rem",
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isCompactNav = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const megaRef = useRef(null);
  const [anchorEls, setAnchorEls] = useState({
    profile: null,
    mobile: null,
    more: null,
    submenu: null,
  });
  const [megaOpen, setMegaOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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

  useEffect(() => {
    let frameId = null;
    let currentScrolled = window.scrollY > 12;

    const updateScrolled = () => {
      const nextScrolled = window.scrollY > 12;
      if (nextScrolled !== currentScrolled) {
        currentScrolled = nextScrolled;
        setHasScrolled(nextScrolled);
      }
      frameId = null;
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateScrolled);
      }
    };

    updateScrolled();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

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
    setAnchor('mobile', null);
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
    navigate("/privacy-policy");
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
    <MegaMenuWrapper
      as={motion.div}
      initial={{ opacity: 0, y: -8, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -8, x: "-50%" }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {MEGA_MENU_DATA.map((col, idx) => (
        <MegaCol key={col.key} isLast={idx === MEGA_MENU_DATA.length - 1}
          style={{ paddingLeft: idx === 0 ? 0 : 18 }}>
          <MegaColTitle color={col.color}>
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

    if (loggedIn) {
      // Quick Actions Section
      sections.push(
        <MenuSection key="quick-actions">
          <SectionTitle>Quick Actions</SectionTitle>
          <MenuItem
            onClick={() => {
              navigate("/joinUs");
              closeAllMenus();
            }}
            sx={mobileMenuItemSx}
          >
            Join Us
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleVault();
              closeAllMenus();
            }}
            sx={mobileMenuItemSx}
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
            sx={mobileMenuItemSx}
          >
            <ClaimIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            Claim
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePrivacyPolicy();
              closeAllMenus();
            }}
            sx={mobileMenuItemSx}
          >
            Privacy Policy
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/notification");
              closeAllMenus();
            }}
            sx={mobileMenuItemSx}
          >
            <Badge
              badgeContent={unreadPolicyCount}
              color="success"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#8AC642",
                  color: "black",
                  fontSize: "1rem",
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
            sx={mobileMenuItemSx}
          >
            <AccountCircleOutlinedIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            My Profile
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={mobileMenuItemSx}
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
            sx={mobileMenuItemSx}
          >
            Login
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/joinUs");
              closeAllMenus();
            }}
            sx={mobileMenuItemSx}
          >
            Join Us
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleVault();
              closeAllMenus();
            }}
            sx={mobileMenuItemSx}
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
            sx={mobileMenuItemSx}
          >
            <ClaimIcon sx={{ mr: 1.5, color: "#8AC642" }} />
            Claim
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePrivacyPolicy();
              closeAllMenus();
            }}
            sx={mobileMenuItemSx}
          >
            Privacy Policy
          </MenuItem>
        </MenuSection>
      );

      sections.push(<Divider key="divider3" sx={{ borderColor: "#333" }} />);
    }

    if (isHomePage) {
      sections.push(
        <MenuSection key="home-sections">
          <SectionTitle>Home Sections</SectionTitle>
          {MORE_MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.key}
              onClick={() => handleMoreItemClick(item.id)}
              sx={mobileMenuItemSx}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuSection>
      );

      sections.push(<Divider key="divider-home-sections" sx={{ borderColor: "#333" }} />);
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
                sx={mobileMenuItemSx}
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
                  sx={mobileSubMenuItemSx}
                >
                  {child.label}
                </MenuItem>
              ))}
            </React.Fragment>
          ))}
        </MenuSection>
      );
    }

    sections.push(<Divider key="div-ins" sx={{ borderColor: "#333" }} />);

    sections.push(
      <MenuSection key="insurance-products">
        <SectionTitle>Insurance Products</SectionTitle>
        {MEGA_MENU_DATA.map((cat) => (
          <React.Fragment key={cat.key}>
            <MenuItem
              sx={{
                ...mobileMenuItemSx,
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
                sx={mobileSubMenuItemSx}
              >
                {item.label}
              </MenuItem>
            ))}
          </React.Fragment>
        ))}
      </MenuSection>
    );

    return sections;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: isMobile ? 6 : "clamp(6px, 0.8vw, 10px)",
          left: 0,
          right: 0,
          zIndex: 1200,
          padding: isMobile ? "0 8px" : isCompactNav ? "0 clamp(10px, 1.8vw, 20px)" : "0 clamp(10px, 1.6vw, 28px)",
          pointerEvents: "none",
        }}
      >
        <motion.div
          className="d-flex justify-content-between align-items-center"
          style={{
            width: "100%",
            minHeight: isMobile ? 56 : isCompactNav ? 62 : "clamp(62px, 5.2vw, 72px)",
            paddingTop: hasScrolled ? (isMobile ? 5 : 7) : (isMobile ? 7 : 8),
            paddingBottom: hasScrolled ? (isMobile ? 5 : 7) : (isMobile ? 7 : 8),
            paddingLeft: isMobile ? 12 : isCompactNav ? 14 : "clamp(14px, 1.5vw, 20px)",
            paddingRight: isMobile ? 8 : isCompactNav ? 12 : "clamp(10px, 1.2vw, 16px)",
            borderRadius: isMobile ? 30 : 999,
            background: hasScrolled
              ? "linear-gradient(135deg, rgba(4,10,14,0.93), rgba(7,17,22,0.93))"
              : "radial-gradient(circle at 8% 50%, rgba(126,231,55,0.16), transparent 24%), radial-gradient(circle at 92% 50%, rgba(45,212,191,0.12), transparent 24%), linear-gradient(135deg, rgba(5,12,16,0.98), rgba(8,18,25,0.97))",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: hasScrolled
              ? "0 12px 30px rgba(0,0,0,0.3), 0 0 18px rgba(45,212,191,0.08), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 12px 26px rgba(0,0,0,0.23), 0 0 24px rgba(126,231,55,0.11), 0 0 28px rgba(45,212,191,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
            backdropFilter: "blur(18px)",
            transition: "padding 0.22s ease, background 0.22s ease, box-shadow 0.22s ease",
            pointerEvents: "auto",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{
              cursor: "pointer",
              width: isMobile ? "min(164px, 66vw)" : isCompactNav ? "clamp(176px, 19vw, 204px)" : "clamp(188px, 16vw, 238px)",
              height: "auto",
              maxHeight: isMobile ? 42 : isCompactNav ? 50 : hasScrolled ? 52 : 58,
              maxWidth: isMobile ? "66vw" : "22vw",
              objectFit: "contain",
              transition: "max-height 0.3s ease, width 0.3s ease",
            }}
            onClick={handleHomeClick}
          />

          {isCompactNav ? (
            <>
              <IconButton
                onClick={(e) => setAnchor('mobile', anchorEls.mobile ? null : e.currentTarget)}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(126,231,55,0.13), rgba(45,212,191,0.1))",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 0 18px rgba(45,212,191,0.12), inset 0 0 16px rgba(255,255,255,0.04)",
                }}
              >
                {anchorEls.mobile ? (
                  <CloseIcon sx={{ color: "#B8FF62", fontSize: 32 }} />
                ) : (
                  <MenuIcon sx={{ color: "#B8FF62", fontSize: 32 }} />
                )}
              </IconButton>
              <DarkMenu
                anchorEl={anchorEls.mobile}
                open={Boolean(anchorEls.mobile)}
                onClose={() => setAnchor('mobile', null)}
                PaperProps={{
                  sx: {
                    maxHeight: "calc(100vh - 76px)",
                    width: { xs: "calc(100vw - 20px)", sm: "380px" },
                    maxWidth: "420px",
                    overflowY: "auto",
                    borderRadius: "20px",
                    mt: 1.4,
                    background: "linear-gradient(145deg, rgba(6,14,18,0.98), rgba(10,22,30,0.98))",
                    border: "1px solid rgba(126,231,55,0.16)",
                  },
                }}
              >
                {renderMobileMenuSections()}
              </DarkMenu>
            </>
          ) : (
            <div className="d-flex align-items-center" style={{ gap: isTablet ? "clamp(5px, 0.55vw, 8px)" : "clamp(6px, 0.6vw, 10px)", minWidth: 0 }}>
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
                      fontSize: 17,
                      transition: "transform 0.28s ease",
                      transform: megaOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </NavItem>
                <AnimatePresence>{megaOpen && <MegaMenuDropdown />}</AnimatePresence>
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
                          sx={{ fontSize: "1.5rem" }}
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
                            sx={{ fontSize: "1.5rem" }}
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
                        fontSize: "0.95rem",
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
                      sx={{ fontSize: "1.5rem" }}
                    >
                      <AccountCircleOutlinedIcon sx={{ mr: 1 }} /> My Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ fontSize: "1.5rem" }}>
                      <LogoutIcon sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </DarkMenu>
                </>
              ) : (
                <StyledButton
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#06100d",
                    background: "linear-gradient(135deg, #D3FF55 0%, #8AE63D 52%, #43E0CF 100%)",
                    boxShadow: "0 10px 26px rgba(126,231,55,0.3), 0 0 16px rgba(45,212,191,0.16)",
                    minWidth: "clamp(88px, 7.6vw, 104px)",
                    paddingLeft: "clamp(14px, 1.4vw, 18px)",
                    paddingRight: "clamp(14px, 1.4vw, 18px)",
                  }}
                >
                  Login
                </StyledButton>
              )}

              {isHomePage && (
                <IconButton
                  onClick={(e) => setAnchor('more', e.currentTarget)}
                  sx={{
                    color: "rgba(255,255,255,0.88)",
                    width: "clamp(38px, 3.4vw, 44px)",
                    height: "clamp(38px, 3.4vw, 44px)",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(126,231,55,0.11), rgba(45,212,191,0.09))",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "0 0 16px rgba(45,212,191,0.1), inset 0 0 16px rgba(255,255,255,0.04)",
                    "&:hover": {
                      color: "#B8FF62",
                      background: "linear-gradient(135deg, rgba(126,231,55,0.18), rgba(45,212,191,0.14))",
                    },
                  }}
                >
                  <MenuIcon sx={{ fontSize: 26 }} />
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
                    sx={{ fontSize: "1.5rem" }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </DarkMenu>
            </div>
          )}
        </motion.div>
      </motion.div>

      <div style={{ height: isHomePage ? "0px" : isMobile ? "66px" : isCompactNav ? "76px" : "82px" }} />
      
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
