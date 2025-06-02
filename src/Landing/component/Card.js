import React, { useState, useEffect } from 'react';
import { CardContent, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import './CSS/service.css';
import API_URL from '../../ServiceModule/Service';
import { THEME_COLOR } from '../../constants';

const Job = () => {
    const [cardData, setCardData] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}tips/getAll`);
                const result = await response.json();
                if (result.status) {
                    setCardData(result.data);
                } else {
                    console.error('Error: Data not retrieved');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ marginTop: '80px', padding: '20px' }}>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                {/* Left Side: Text */}
                <Grid item xs={12} md={6}>
                    <CardContent>
                        <Typography variant={isMobile ? "h5" : "h3"} gutterBottom style={{ color: '#FF9906' }}>
                            BENEFITS
                        </Typography>
                        <Typography variant={isMobile ? "h6" : "h2"} className="mb-4 fw-bold">
                            Why Prefer Coverkraft
                        </Typography>
                        <Typography variant="body1" className="text-secondary" sx={{ fontSize: isMobile ? '1rem' : '1.2rem', lineHeight: 1.7 }}>
                            Choose us for personalized insurance solutions, exceptional customer care,
                            and unwavering commitment to protecting what matters most to you.
                        </Typography>
                    </CardContent>
                </Grid>

                {/* Right Side: Cards */}
                <Grid item xs={12} md={6}>
                    <Grid container spacing={3} justifyContent="center">
                        {cardData.map((card) => (
                            <Grid item xs={12} sm={6} key={card._id}>
                                <div style={styles.cardWrapper}>
                                    <div style={styles.cardBackground}></div>
                                    <div style={styles.cardContainer}>
                                        <div style={styles.flexItem}>
                                            <img src={card.icon} alt="Icon" style={styles.cardIcon} />
                                            <h3 style={styles.cardTitle}>{card.subtitle}</h3>
                                        </div>
                                        <CardDescription text={card.description} />
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default Job;

// 💡 Read More / Show Less Component
const MAX_LENGTH = 100;

const CardDescription = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > MAX_LENGTH;

    const handleToggle = () => setExpanded(prev => !prev);

    return (
        <div>
            <p style={styles.cardDescription}>
                {expanded ? text : `${text.slice(0, MAX_LENGTH)}${isLong ? '...' : ''}`}
            </p>
            {isLong && (
                <span
                    onClick={handleToggle}
                    style={styles.toggleText}
                >
                    {expanded ? 'Show Less' : 'Read More'}
                </span>
            )}
        </div>
    );
};

// 💅 Styles
const styles = {
    cardWrapper: {
        position: 'relative',
        width: '100%',
        height: 'auto',
        minHeight: '160px',
    },
    cardBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '15px',
        background: 'linear-gradient(135deg, #42CDC9, #B4E498)',
        zIndex: 1,
    },
    cardContainer: {
        position: 'relative',
        zIndex: 2,
        backgroundColor: THEME_COLOR.FADE_BACKGROUND,
        borderRadius: '15px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    flexItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    cardIcon: {
        width: '40px',
        height: '40px',
    },
    cardTitle: {
        fontSize: '1.6rem',
        fontWeight: 'bold',
        margin: 0,
    },
    cardDescription: {
        fontSize: '1.2rem',
        color: 'gray',
        lineHeight: 1.4,
        margin: 0,
    },
    toggleText: {
        color: '#007BFF',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '5px',
        display: 'inline-block',
        transition: 'all 0.3s ease-in-out',
        textDecoration: 'underline',
        fontWeight: 500,
    },
};
