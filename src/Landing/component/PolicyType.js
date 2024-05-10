import React from 'react';
import './CSS/policyType.css';

import HealthInsurance from '../../Images/Health Insurance-1.png';
import twoWheeler from '../../Images/Two Wheeler Insurance.png';
import HealthInsurance2 from '../../Images/Health Insurance.png';
import travel from '../../Images/Travel Insurance.png';
import car from '../../Images/Car Insurance.png';
import taxi from '../../Images/Taxi Insurance.png';
import term from '../../Images/Term Life Insurance.png';
import family from '../../Images/Family Health Insurance.png';
import Grid from '@mui/material/Grid';


const PolicyType = () => {
    const images = [HealthInsurance, twoWheeler, HealthInsurance2, travel, car, taxi, term, family];
    const texts = ['Health Insurance', 'Two Wheeler Insurance', 'Health Insurance', 'Travel Insurance', 'Car Insurance', 'Taxi Insurance', 'Term Life Insurance', 'Family Health Insurance'];


    return (
        <div className=' p-5 d-flex  rounded-4' style={{ backgroundColor: '#E5F0F4', margin: '40px 90px' }}>

            {/* <div className='grid-container col-md-8 mr-5 pr-5'> */}
            <Grid container>
                <Grid item  >
                    <Grid container spacing={4} >
                        {images.map((image, index) => (
                            <Grid item xs={6} md={4} lg={3} xl={3} style={{ width: '80%' }} >
                                <div key={index}>
                                    <div className='card'>
                                        <img src={image} alt='' />
                                    </div>
                                    <h4 className='text-center mt-3 image-text'>{texts[index]}</h4>
                                </div>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>

            </Grid>

            {/* </div> */}
            {/* 
            <div className='border-start border-secondary  col-md-3 d-flex flex-column justify-content-center align-items-center'>
                <button className='btn  rounded-pill  mb-3 policy-btn'>Policy</button>
                <h3 className='text-center  '  >Let’s get you & your <br />  family insured</h3>
                <div class="border-element"></div> */}

            {/* </div> */}
        </div>
    );
}

export default PolicyType;
