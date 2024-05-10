import React from 'react';
import './CSS/afterglow.css';
import mockup from '../../Images/Afterglow-mockup.png';
import checkicon from '../../Images/Check-icon.png';
import googleicon from '../../Images/Google-icon.png';
import appleicon from '../../Images/Apple-icon.png';

const Afterglow = () => {
  return (
    <div className='container-fluid bg-image d-flex justify-content-around p-5'>
      <div className='col-md-4'>
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
      </div>
      <div className='col-md-4'>
        <img src={mockup} alt='' />
      </div>
    </div>
  );
}

export default Afterglow;
