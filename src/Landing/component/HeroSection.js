import React from 'react'
import topcircle from '../../Images/Top-half-circle.png';
import card from '../../Images/cardd.png';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <div className=' pb-5 d-flex justify-content-between ' style={{ padding: '0 95px' }}>
       <Grid container spacing={2}>
        <Grid item xs={12} md={9} lg={9} xl={9} >
        <h1 className='custom-size  pt-5 ' dangerouslySetInnerHTML={{ __html: t('secureFuture') }}></h1>
        </Grid>
        <Grid item xs={12} md={3} lg={3} xl={3}>
          <div> <img src={card} className='card-img  mt-5' /></div>
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
