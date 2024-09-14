import React, { useState, useEffect } from 'react';
import { CardContent, Grid, Typography } from '@mui/material';
import './CSS/service.css';
import API_URL from '../../ServiceModule/Service';
import IMAGE_PATH from '../../ServiceModule/imagePath';

const Job = () => {
    const [cardData, setCardData] = useState([]);

    useEffect(() => {
        // Replace with your actual API endpoint
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}tips/getAll`);
                const result = await response.json();
                if (result.status) {
                    setCardData(result.data); // Access the data field in the API response
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
        <div className="" style={{marginTop:'100px'}}>
            <Grid container xs={12} md={12} spacing={4} alignItems="center" justifyContent="center" style={{ backgroundColor: '#F7FAFE' }}>
                {/* Left Side: Text */}
                <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
                    <CardContent>
                        <Typography variant="h3" gutterBottom style={{ color: '#FF9906' }}>
                            BENEFITS
                        </Typography>
                        <Typography variant="h2" className='mb-4 fw-bold'>
                            Why Prefer Coverkraft
                        </Typography>
                        <Typography variant="h5" paragraph className='text-secondary'>
                            Choose us for personalized insurance <br />solutions, exceptional customer care, and<br /> unwavering commitment to protecting what <br />matters most to you.
                        </Typography>
                    </CardContent>
                </Grid>

                {/* Right Side: Image Grid */}
                <Grid item xs={12} md={5} className='text-center' display="flex" justifyContent="center" alignItems="center">
                    <Grid container spacing={4}>
                        {cardData.map((card) => (
                            <Grid item xs={12} md={6} key={card._id}>
                                <div style={styles.cardWrapper}>
                                    <div style={styles.cardBackground}></div>
                                    <div style={styles.cardContainer}>
                                        <div style={styles.flexItem}>
                                            <img src={IMAGE_PATH + card.icon} alt="Icon" style={styles.cardIcon} />
                                            <h3 style={styles.cardTitle}>{card.subtitle}</h3>
                                        </div>
                                        <p className='text-secondary'>{card.description}</p>
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

const styles = {
    cardWrapper: {
        position: 'relative',
        width: '300px',
        height: '150px',
        margin: '20px',
    },
    cardBackground: {
        position: 'absolute',
        top: -20,
        left: -20,
        width: '100%',
        height: '90%',
        borderRadius: '15px 15px 15px 15px',
        background: 'linear-gradient(135deg, #42CDC9, #B4E498)',
        zIndex: 1,
    },
    cardContainer: {
        position: 'absolute',
        top: '5px',
        left: '5px',
        width: 'calc(100% - 10px)',
        height: 'calc(100% - 10px)',
        backgroundColor: 'white',
        borderRadius: '15px 15px 15px 0',
        zIndex: 2,

        padding: '10px',
    },
    flexItem: {
        display: 'flex',
        flexDirection: 'row',
        padding: '10px',
    },
    cardIcon: {
        width: '50px',
        height: '50px',
        marginBottom: '10px',
        marginRight: '10px'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '700',
        marginTop: '10px',
    },
    cardDescription: {
        fontSize: '14px',
        fontColor: 'gray'
    },
};
