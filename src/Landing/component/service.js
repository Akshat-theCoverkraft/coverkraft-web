import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import services from '../../Images/image 13.png';
import '../component/CSS/service.css';

const Service = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width:400px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className="containercards mt-5">
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        direction={isMobile ? 'column-reverse' : 'row'}
      >
        {/* Left Side: Text */}
        <Grid item xs={12} md={6}>
          <CardContent style={{ textAlign: isMobile ? 'center' : 'left', padding: isSmall ? '1rem 1rem' : '2rem' }}>
            <Typography variant={isSmall ? 'h5' : 'h4'} gutterBottom style={{ color: '#FF9906' }}>
              OUR CERTIFICATIONS
            </Typography>
            <Typography variant={isSmall ? 'h6' : 'h3'} className="mb-3 fw-bold">
              Recognized Excellence
            </Typography>
            <Typography
              variant="body1"
              className="text-secondary"
              style={{ lineHeight: '1.7', fontSize: isSmall ? '0.95rem' : '1.1rem' }}
            >
              This certificate acknowledges our commitment to providing exceptional
              insurance services. Your trust in us is our greatest asset. We pledge to
              continue delivering reliable and comprehensive coverage to protect your
              future.
            </Typography>
          </CardContent>
        </Grid>

        {/* Right Side: Image */}
        <Grid item xs={12} md={6} className="text-center">
          <Card sx={{ boxShadow: 3, borderRadius: '16px' }}>
            <CardMedia
              component="img"
              src={services}
              alt="Our Services"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: isSmall ? 220 : 400,
                objectFit: 'cover',
                borderRadius: '16px',
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Service;
