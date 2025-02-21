import React from 'react'
import './CSS/afterglow.css'
import Grid from '@mui/material/Grid';
import step1 from '../../Images/step1.png';
import step2 from '../../Images/step2.png';
import step3 from '../../Images/step3.png';
import { THEME_COLOR } from '../../constants';
const About = () => {
    return (
        <div className='p-5 mt-5 ' style={{ backgroundColor: THEME_COLOR.FADE_BACKGROUND}}>
            <h3 className='text-center mb-3' style={{color:'#FF9906', fontWeight: "184px", height: "23px"}}>
               HOW ITS WORKS
            </h3>
            <h1 className='text-center fs-1 my-1 fw-bold'>How Coverkraft Works?</h1>
            <Grid className='mt-3' container justifyContent="center"  xs={12} spacing={0} style={{marginTop: "5em"}}>
                <Grid item xs={4}  style={{ textAlign: 'center' }}>
                    <img  src={step1}/>
                    <h3 className='mt-3 fw-bold fs-2'>Scan your document</h3>
                    <p className='text-secondary fs-4'>Scan the policy document, and <br/> Simple access to a physical <br/> policy document in a digital <br/> version.</p>
                </Grid>
                <Grid className='mt-3' item xs={4} style={{ textAlign: 'center' }}>
                    <img src={step2}/>
                    <h3 className='mt-3 fw-bold fs-2'>Extract your document</h3>
                    <p className='text-secondary fs-4' >Scan the policy document, and <br/> Simple access to a physical <br/> policy document in a digital <br/> version.</p>

                </Grid>
                <Grid  className='mt-3' item xs={4} style={{ textAlign: 'center' }}>
                    <img src={step3}/>
                    <h3 className='mt-3 fw-bold fs-2'>Save your document</h3>
                    <p className='text-secondary fs-4'>Scan the policy document, and <br/> Simple access to a physical <br/> policy document in a digital <br/> version.</p>

                </Grid>
            </Grid>
        </div>
    )
}

export default About
