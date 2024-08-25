import React from 'react'
import './CSS/afterglow.css'
import checkicon from '../../Images/Check-icon.png'
import googleicon from '../../Images/Google-icon.png';
import appleicon from '../../Images/Apple-icon.png';
import mockup from '../../Images/Coverkraft-mockup.png';
import Grid from '@mui/material/Grid';
const Coverkraft = () => {
  return (
    <Grid container spacing={0} justifyContent='center' className='bg-image1 mb-5 p-5'>
      <Grid item xs={12} md={6} className='ml-2' >
        <h2 className='my-5' style={{fontSize:'50px'}}>Get our <span className='fw-bold'>Coverkraft</span>  app</h2>
        <div className=''>
          <div className='d-flex'>
            <img src={checkicon} height={30}/>
            <p className='ml-2 fs-5'>Track your policy status on the go</p>
          </div>
          <div className='d-flex'>
            <img src={checkicon} height={30}/>
            <p className='ml-2 fs-5'>Prioritising securing documents</p>
          </div>
          <div className='d-flex'>
            <img src={checkicon} height={30}/>
            < p className='ml-2 fs-5'>Use the documents anytime from the policy vault</p>
          </div>  
          <div className='d-flex'>
            <img src={checkicon} height={30}/>
            <p className='ml-2 fs-5'>Convert physical policy documents into the digital document</p>
          </div>
        </div>
        <div className='my-5'>
          <img src={googleicon} className='mr-3'/>
          <img src={appleicon}/>
        </div>
      </Grid>
      <Grid item xs={12} md={5} className='d-flex justify-content-center' >
        <img src={mockup} alt=''/>
      </Grid>
    </Grid>
  )
}

export default Coverkraft