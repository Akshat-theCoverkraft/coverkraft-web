import React from 'react';
import './CSS/afterglow.css';
import mockup from '../../Images/Afterglow-mockup.png';
import checkicon from '../../Images/Check-icon.png';
import googleicon from '../../Images/Google-icon.png';
import appleicon from '../../Images/Apple-icon.png';
import Grid from '@mui/material/Grid';
const Afterglow = () => {
  return (
    <Grid container className=' bg-image my-5 p-5'>
      <Grid item xs={12} md={6} className='ml-5'>
        <h2 className='mb-4' style={{ fontSize: '3rem' }}>Get our another app</h2>
        <h1 className='mb-5' style={{ fontSize: '4.5rem' }}>AfterGlow</h1>
        <div className=''>
          <div className='d-flex mb-3'>
            <img src={checkicon} height={30} alt='' />
            <p className='ml-2 fs-5'>Schedule messages for convenience.</p>
          </div>
          <div className='d-flex mb-3'>
            <img src={checkicon} height={30} alt='' />
            <p className='ml-2 fs-5'>Easily connect with family members.</p>
          </div>
          <div className='d-flex mb-3'>
            <img src={checkicon} height={30} alt='' />
            <p className='ml-2 fs-5'>Effortless communication with loved ones.</p>
          </div>
          <div className='d-flex'>
            <img src={checkicon} height={30} alt='' />
            <p className='ml-2 fs-5'>Personalized profiles and preferences.</p>
          </div>
        </div>
        <div className='mt-5'>
          <img src={googleicon} className='mr-3' alt='' />
          <img src={appleicon} alt='' />
        </div>
      </Grid>
      <Grid item xs={12} md={5} className='d-flex justify-content-center'>
        <img src={mockup} alt='' />
      </Grid>
    </Grid>
  );
}

export default Afterglow;
