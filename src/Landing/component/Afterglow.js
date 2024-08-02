import React from 'react';
import './CSS/afterglow.css';
import mockup from '../../Images/Afterglow-mockup.png';
import checkicon from '../../Images/Check-icon.png';
import googleicon from '../../Images/Google-icon.png';
import appleicon from '../../Images/Apple-icon.png';
import Grid from '@mui/material/Grid';
import Carousel1 from '../Carousel1';

const Afterglow = () => {
  return (
    <div className=' bg-image my-5 p-5' style={{ height: '50vh' }}>
      <div className='text-center text-white'>
        <h3>BENEFITS</h3>
        <h1 className='mt-5'>Comprehensive Coverage Options</h1>
        <p className='mt-3'>Our insurance plans offer extensive coverage,ensuring you and your loved ones are protected in <br />
          any situation. Enjoy peace of mind with our reliable and tailored solutions.</p>
        <button className='btn btn-lg rounded-5 mt-5 py-3 px-5' style={{ color: 'white', borderColor: 'white' }} >
          View all
        </button>
      </div>
      <Carousel1 />
    </div>
  );
}

export default Afterglow;
