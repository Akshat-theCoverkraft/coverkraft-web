// import React, { useState, useEffect, useContext } from 'react';
// import { Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';
// import group from '../../Images/Services1.png';
// import services from '../../Images/image 13.png';
// import '../component/CSS/service.css'


// const Service = () => {




//     return (
//         <>


//             <div className="containercards mt-5">
//                 <Grid container spacing={4} alignItems="center">
//                     {/* Left Side: Text */}
//                     <Grid item xs={12} md={6}>
//                         <CardContent style={{ textAlign: 'center' }}>
//                             <Typography variant="h4" gutterBottom style={{ color: '#FF9906' }}>
//                                 OUR CERTIFICATIONS
//                             </Typography>
//                             <Typography variant="h3">
//                                 Recognized Excellence
//                             </Typography>
//                             <Typography variant="h5">
//                                 This certificate acknowledges our commitment to providing exceptional insurance services. Your trust in us is our greatest asset. We pledge to continue delivering reliable and comprehensive coverage to protect your future.
//                             </Typography>
//                         </CardContent>
//                     </Grid>

//                     {/* Right Side: Image Grid */}
//                     <Grid item xs={12} md={6} className='text-center'>
//                         <Grid container spacing={2} justifyContent="center" alignItems="center">
//                             <Grid item xs={12} sm={6} md={6}>
//                                 <Card>
//                                     <CardMedia>
//                                         <img src={services} alt="Services" style={{ width: "100%", height: "40vh", objectFit: 'cover' }} />
//                                     </CardMedia>
//                                 </Card>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             </div>


//         </>
//     );
// };

// export default Service;

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import services from '../../Images/image 13.png';
import '../component/CSS/service.css';

const Service = () => {
    return (
        <div className="containercards mt-5">
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                {/* Left Side: Text */}
                <Grid item xs={12} md={6}>
                    <CardContent style={{ textAlign: ' center' }}>
                        <Typography variant="h4" gutterBottom style={{ color: '#FF9906' }}>
                            OUR CERTIFICATIONS
                        </Typography>
                        <Typography variant="h3">
                            Recognized Excellence
                        </Typography>
                        <Typography variant="h5" paragraph>
                            This certificate acknowledges our commitment<br />
                            to providing exceptional insurance services.<br />
                            Your trust in us is our greatest asset.<br />
                            We pledge to continue delivering reliable and <br />
                            comprehensive coverage to protect your future.
                        </Typography>
                    </CardContent>
                </Grid>

                {/* Right Side: Image Grid */}
                <Grid item xs={12} md={6} className='text-center'>
                    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                        <Grid item xs={12} sm={6} md={8} display="flex" justifyContent="center">
                            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CardMedia>
                                    <img src={services} alt="Services" style={{ width: "100%", height: "40vh", objectFit: 'cover' }} />
                                </CardMedia>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default Service;
