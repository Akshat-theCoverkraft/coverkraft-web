import React from 'react'
import './CSS/afterglow.css'
import checkicon from '../../Images/Check-icon.png'
import googleicon from '../../Images/Google-icon.png';
import appleicon from '../../Images/Apple-icon.png';
import mockup from '../../Images/Coverkraft-mockup.png';
import Grid from '@mui/material/Grid';
const Coverkraft = () => {
  return (
    <Grid container xs={12} md={12} spacing={4} justifyContent='center' className='bg-image1 mb-5 p-5'>
      <Grid item xs={12} md={6} className='d-flex' >
        <img src={mockup} alt='' width={800} />
      </Grid>
      <Grid item xs={12} md={6} className="mt-5 d-flex flex-column justify-content-center " >
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#FF9906", fontSize:'29px' }}>
            DOWNLOAD APP
          </h1>
          <h1 className="mt-3 mb-5 fw-bold" style={{fontSize:'50px'}}>Get the Coverkraft app</h1>
        </div>
        <div className='mb-5'>
          <div className="d-flex mb-2">
            <img src={checkicon} height={30} alt="check icon" />
            <p className="ml-2 fs-3">Track your policy status on the go</p>
          </div>
          <div className="d-flex mb-2">
            <img src={checkicon} height={30} alt="check icon" />
            <p className="ml-2 fs-3">Prioritising securing documents</p>
          </div>
          <div className="d-flex mb-2">
            <img src={checkicon} height={30} alt="check icon" />
            <p className="ml-2 fs-3">Use the documents anytime from the policy vault</p>
          </div>
          <div className="d-flex mb-2">
            <img src={checkicon} height={30} alt="check icon" />
            <p className="ml-2 fs-3">Convert physical policy documents into digital documents</p>
          </div>
        </div>
        <div className="my-5">
          <img src={googleicon} className="mr-3" alt="Google Play Store" />
          <img src={appleicon} alt="Apple App Store" />
        </div>
      </Grid>



    </Grid>
  )
}

export default Coverkraft