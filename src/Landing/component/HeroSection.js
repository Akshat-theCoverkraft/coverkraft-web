import React from 'react'
import topcircle from '../../Images/Top-half-circle.png';
import family from '../../Images/family-home.png';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Button from '../../component/Button';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <div className='mt-5 pt-5  d-flex justify-content-between ' style={{ padding: '0 95px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7} lg={7} xl={7} >
          <h1 className='custom-size  pt-5 ' dangerouslySetInnerHTML={{ __html: t('secureFuture') }}></h1>
          <p style={{ color: '#7B7B7B', fontSize: '23px' }}>Choose us for tailored insurance coverage, exceptional customer<br /> service, and peace of mind with reliable, comprehensive protection <br />for all you needs.</p>
          <button className='btn btn-lg rounded-5 py-3 px-5' style={{ color: 'white', backgroundColor: '#8AC642' }} >
            Policy Vault
          </button>
        </Grid>
        <Grid item xs={12} md={3} lg={3} xl={3}>
          <div> <img src={family} className=' ' height={550} /></div>
        </Grid>
      </Grid>
      {/* <div className=''>
    
      
 */}
      {/* Secure your future<br/> with reliable <span style={{color:'#42988E'}}>insurance</span><br/> coverage Today! */}
      {/* </h1>
      </div>
      <div className=''>
       
      </div> */}
    </div>
  )
}

export default HeroSection
