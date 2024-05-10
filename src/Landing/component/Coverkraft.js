import React from 'react'
import './CSS/afterglow.css'
import checkicon from '../../Images/Check-icon.png'
import googleicon from '../../Images/Google-icon.png';
import appleicon from '../../Images/Apple-icon.png';
import mockup from '../../Images/Coverkraft-mockup.png';
const Coverkraft = () => {
  return (
    <div className='bg-image1 d-flex justify-content-around p-5 col-md-12'>
      <div className='col-md-4'>
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
      </div>
      <div className='col-md-4 pl-5'>
        <img src={mockup} alt=''/>
      </div>
    </div>
  )
}

export default Coverkraft