import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import services from '../../Images/image 13.png';
import '../component/CSS/service.css';

const Service = () => {
    return (
        <div className="containercards mt-5">   
            <Grid container xs={12} md={12} spacing={4} alignItems="center" justifyContent="center">
                {/* Left Side: Text */}
                <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
                    <CardContent style={{ textAlign: 'start' }}>
                        <Typography variant="h3" gutterBottom style={{ color: '#FF9906' }}>
                            OUR CERTIFICATIONS
                        </Typography>
                        <Typography variant="h2" className='mb-4 fw-bold'>
                            Recognized Excellence
                        </Typography>
                        <Typography variant="h5" paragraph className='text-secondary'>
                            This certificate acknowledges our commitment<br />
                            to providing exceptional insurance services.<br />
                            Your trust in us is our greatest asset.<br />
                            We pledge to continue delivering reliable and <br />
                            comprehensive coverage to protect your future.
                        </Typography>
                    </CardContent>
                </Grid>

                {/* Right Side: Image Grid */}
                <Grid item xs={12} md={6} className='text-center' display="flex" justifyContent="center" alignItems="center">
                    <Card sx={{ maxWidth: '100%' }}>
                        <CardMedia>
                            <img src={services} alt="Services" style={{ width: "100%", height: "50vh", objectFit: 'cover' }} />
                        </CardMedia>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Service;
