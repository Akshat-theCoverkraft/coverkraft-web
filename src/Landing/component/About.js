import React from 'react';
import './CSS/afterglow.css';
import Grid from '@mui/material/Grid';
import step1 from '../../Images/step1.png';
import step2 from '../../Images/step2.png';
import step3 from '../../Images/step3.png';
import { THEME_COLOR } from '../../constants';

const About = () => {
    return (
        <div id='about' className='p-4 p-md-5 mt-5' style={{ backgroundColor: THEME_COLOR.FADE_BACKGROUND }}>
            <h3 className='text-center mb-2' style={{ color: '#FF9906', fontWeight: 600 }}>
                HOW IT WORKS
            </h3>
            <h1 className='text-center fs-2 fs-md-1 fw-bold mb-4'>How Coverkraft Works?</h1>

            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'center' }}>
                    <img src={step1} alt="Step 1" style={{ maxWidth: '100%', height: 'auto' }} />
                    <h3 className='mt-3 fw-bold fs-4 fs-md-3'>Scan your document</h3>
                    <p className='text-secondary fs-6 fs-md-5'>
                        Scan the policy document for <br /> instant access to a digital <br /> version of your physical file.
                    </p>
                </Grid>

                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'center' }}>
                    <img src={step2} alt="Step 2" style={{ maxWidth: '100%', height: 'auto' }} />
                    <h3 className='mt-3 fw-bold fs-4 fs-md-3'>Extract your document</h3>
                    <p className='text-secondary fs-6 fs-md-5'>
                        Smart tech extracts data <br /> automatically — zero manual <br /> entry needed.
                    </p>
                </Grid>

                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'center' }}>
                    <img src={step3} alt="Step 3" style={{ maxWidth: '100%', height: 'auto' }} />
                    <h3 className='mt-3 fw-bold fs-4 fs-md-3'>Save your document</h3>
                    <p className='text-secondary fs-6 fs-md-5'>
                        Save securely to access <br /> anytime, anywhere. Your data <br /> is safe and accessible.
                    </p>
                </Grid>
            </Grid>
        </div>
    );
};

export default About;
