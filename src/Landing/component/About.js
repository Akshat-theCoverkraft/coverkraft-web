import React from 'react'
import './CSS/afterglow.css'
import happy from '../../Images/ic-happy.png'
import check from '../../Images/ic-check.png'
import done from '../../Images/ic-done.png'
import Grid from '@mui/material/Grid';
const About = () => {
    return (
        <Grid container spacing={12} className=' bg-image2  p-5 my-5'>
            <Grid item xs={12} md={5} className='ml-5'>

                <h1 className='mb-5 mt-5' style={{ fontSize: '3.0rem' }}>Explore why we're the preferred destination for purchasing <span className='text-danger'>insurance</span></h1>
                <p className='text-secondary' style={{ fontSize: '1.7rem' }}>Join the multitude of  satisfied customers who choose us as their go-to destination for insurance solutions in India</p>

            </Grid>
           
            <Grid item xs={12} md={6} className='ml-5'>
                <Grid container class=" bg-white mb-4 rounded-4 row p-3">
                    <Grid item xs={12} md={3}>
                        <img className='p-5 border-right' src={happy} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div class="card-body">

                            <h3 class="card-text mb-3">Seamless Experience</h3>
                            <p className='text-secondary fs-4'>Enjoy hassle-free policy management with our user-friendly platform.</p>
                        </div>
                    </Grid>
                </Grid>
                <div class="  bg-white mb-4 rounded-4 row p-3 ">
                    <div class="col-md-3" data-mdb-ripple-init data-mdb-ripple-color="light">
                        <img className='p-5 border-right' src={check} />
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">

                            <h3 class="card-text mb-3">Best Value</h3>
                            <p className='text-secondary fs-4'>Enjoy hassle-free policy management with our user-friendly platform.</p>
                        </div>
                    </div>
                </div>
                <div class=" bg-white mb-4 rounded-4 row p-3 ">
                    <div class="col-md-3">
                        <img className='p-5 border-right' src={done} />
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">

                            <h3 class="card-text mb-3">Seamless Experience</h3>
                            <p className='text-secondary fs-4'>Enjoy seamless transactions for a stress-free insurance journey </p>
                        </div>
                    </div>
                </div>


            </Grid>
        </Grid>
    )
}

export default About
