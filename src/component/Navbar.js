import React, { useEffect, useState, useCallback, useMemo } from 'react';
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

const MORE_MENU_ITEMS = [
    { key: 'Card', label: 'Why prefer CoverKraft', id: 'card' },
    { key: 'about', label: 'About Us', id: 'about' },
    { key: 'blog', label: 'Blog', id: 'blog' },
    { key: 'testimonials', label: 'Testimonials', id: 'testimonials' },
    { key: 'faq', label: 'FAQ', id: 'faq' },
    { key: 'service', label: 'Service', id: 'service' },
];

const LOCAL_STORAGE_KEYS = ['loggedIn', 'verificationId', 'userId', 'policyId', 'selectedPolicyId', 'token'];

function Navbar({ scrollToContactBottom }) {
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    // State management
    const [profileAnchor, setProfileAnchor] = useState(null);
    const [mobileAnchor, setMobileAnchor] = useState(null);
    const [moreAnchor, setMoreAnchor] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Memoized values
    const loggedIn = useMemo(() => localStorage.getItem('loggedIn') === 'true', []);
    const isMobile = useMemo(() => windowWidth < 1260, [windowWidth]);
    const visibleNavItems = useMemo(() => 
        NAV_ITEMS.filter(item => !item.auth || loggedIn), 
        [loggedIn]
    );

    // Scroll visibility effect
    useEffect(() => {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsVisible(currentScrollY < 10 || currentScrollY < lastScrollY);
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Window resize effect
    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            setWindowWidth(newWidth);
            if (newWidth >= 1260) {
                setMobileAnchor(null);
            }
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Event handlers
    const secure = useCallback((callback) => () => {
        if (loggedIn) {
            callback();
        } else {
            navigate('/coverkraft/login');
        }
    }, [loggedIn, navigate]);

    const handleNavigation = useCallback((item) => {
        if (item.isHelp) {
            return secure(scrollToContactBottom)();
        }
        if (item.auth) {
            return secure(() => navigate(item.path))();
        }
        navigate(item.path);
    }, [secure, scrollToContactBottom, navigate]);

    const handleLogout = useCallback(() => {
        LOCAL_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
        navigate('/coverkraft');
        setProfileAnchor(null);
    }, [navigate]);

    const handleVault = useCallback(() => {
        const isLoggedIn = !!localStorage.getItem('token');
        navigate(isLoggedIn ? '/coverkraft/vault' : '/coverkraft/login');
    }, [navigate]);

    const handleMoreItemClick = useCallback((id) => {
        setMoreAnchor(null);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Menu handlers
    const handleProfileMenuClose = useCallback(() => setProfileAnchor(null), []);
    const handleMobileMenuClose = useCallback(() => setMobileAnchor(null), []);
    const handleMoreMenuClose = useCallback(() => setMoreAnchor(null), []);

    const handleMobileMenuToggle = useCallback(() => {
        setMobileAnchor(prev => prev ? null : true);
    }, []);

    const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

    // Render mobile menu items
    const renderMobileMenuItems = () => (
        <>
            {visibleNavItems.map(item => (
                <MenuItem 
                    key={item.key} 
                    onClick={() => {
                        handleNavigation(item);
                        handleMobileMenuClose();
                    }}
                >
                    {item.label}
                </MenuItem>
            ))}
            {loggedIn ? (
                <>
                    <MenuItem onClick={() => {
                        navigate('/coverkraft/notification');
                        handleMobileMenuClose();
                    }}>
                        Notification
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleLogout();
                        handleMobileMenuClose();
                    }}>
                        Logout
                    </MenuItem>
                </>
            ) : (
                <MenuItem onClick={() => {
                    navigate('/coverkraft/login');
                    handleMobileMenuClose();
                }}>
                    Login
                </MenuItem>
            )}
        </>
    );

    // Render desktop navigation items
    const renderDesktopNavItems = () => (
        <>
            {visibleNavItems.map(item => (
                <div
                    key={item.key}
                    className={`nav-item ${activeItem === item.key ? 'active' : ''}`}
                    onClick={() => {
                        handleNavigation(item);
                        setActiveItem(item.key);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {item.label}
                </div>
            ))}
        </>
    );

    // Render user actions (login/profile/vault)
    const renderUserActions = () => {
        if (loggedIn) {
            return (
                <>
                    <img 
                        src={notification} 
                        alt='notification' 
                        onClick={() => navigate('/coverkraft/notification')} 
                        style={{ height: 24, width: 24, cursor: 'pointer' }} 
                    />
                    <img 
                        src={profile} 
                        alt='profile' 
                        onClick={(e) => setProfileAnchor(e.currentTarget)} 
                        style={{ height: 32, width: 32, cursor: 'pointer' }} 
                    />
                    <DarkMenu 
                        anchorEl={profileAnchor} 
                        open={Boolean(profileAnchor)} 
                        onClose={handleProfileMenuClose}
                    >
                        <MenuItem onClick={() => {
                            setDrawerOpen(true);
                            handleProfileMenuClose();
                        }}>
                            <AccountCircleOutlinedIcon style={{ marginRight: '10px' }} /> 
                            My Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon style={{ marginRight: '10px' }} /> 
                            Logout
                        </MenuItem>
                    </DarkMenu>
                    <button 
                        className='btn btn-lg px-4 py-2' 
                        style={{ 
                            backgroundColor: '#8AC642', 
                            color: 'white', 
                            border: 'none' 
                        }} 
                        onClick={handleVault}
                    >
                        Vault
                    </button>
                </>
            );
        }

        return (
            <button 
                className='btn btn-lg px-4 py-2' 
                style={{ 
                    color: '#8AC642', 
                    borderColor: '#8AC642', 
                    background: 'transparent' 
                }} 
                onClick={() => navigate('/coverkraft/login')}
            >
                Login
            </button>
        );
    };

    // Render more menu
    const renderMoreMenu = () => (
        <>
            <IconButton onClick={(e) => setMoreAnchor(e.currentTarget)} sx={{ color: THEME_COLOR.COLOR }}>
                <MoreVertIcon />
            </IconButton>
            <DarkMenu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={handleMoreMenuClose}
            >
                {MORE_MENU_ITEMS.map(item => (
                    <MenuItem 
                        key={item.key} 
                        onClick={() => handleMoreItemClick(item.id)}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </DarkMenu>
        </>
    );

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: '10px 70px',
                backgroundColor: 'black',
                boxShadow: '0px 4px 6px rgba(0,0,0,0.3)',
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                transition: 'transform 0.3s ease-in-out'
            }}>
                <div className='nav-style d-flex justify-content-between align-items-center'>
                    <img 
                        src={Logo} 
                        alt='Logo' 
                        height={65} 
                        width={214} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleNavigation(NAV_ITEMS[0])} 
                    />

                    {isMobile ? (
                        <>
                            <IconButton onClick={handleMobileMenuToggle}>
                                {mobileAnchor ? 
                                    <CloseIcon sx={{ color: THEME_COLOR.COLOR }} /> : 
                                    <MenuIcon sx={{ color: THEME_COLOR.COLOR }} />
                                }
                            </IconButton>
                            <DarkMenu 
                                open={Boolean(mobileAnchor)} 
                                onClose={handleMobileMenuClose}
                            >
                                {renderMobileMenuItems()}
                            </DarkMenu>
                        </>
                    ) : (
                        <div className='d-flex align-items-center gap-4'>
                            {renderDesktopNavItems()}
                            {renderUserActions()}
                            {renderMoreMenu()}
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer div */}
            <div style={{ height: '95px' }} />

            {/* Profile Drawer */}
            <ProfileDrawer open={drawerOpen} onClose={handleDrawerClose} />
        </>
    );
}

export default Navbar;