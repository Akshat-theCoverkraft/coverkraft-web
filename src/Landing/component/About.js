import React from 'react'
import './CSS/afterglow.css'
import Grid from '@mui/material/Grid';
import step1 from '../../Images/step1.png';
import step2 from '../../Images/step2.png';
import step3 from '../../Images/step3.png';
const About = () => {
    return (
        <div className='p-5 mt-5 ' style={{ backgroundColor: '#E5F0F4' }}>
            <h3 className='text-center mb-3' style={{color:'#FF9906'}}>
               HOW ITS WORKS
            </h3>
            <h1 className='text-center my-1'>How Coverkraft Works?</h1>
            <Grid className='mt-3' container justifyContent="center"  xs={12} spacing={0}>
                <Grid item xs={4}  style={{ textAlign: 'center' }}>
                    <img  src={step1}/>
                    <h3 className='mt-2'>Scan your document</h3>
                    <p className='' style={{color:'#585757'}}>Scan the policy document, and <br/> Simple access to a physical <br/> policy document in a digital <br/> version.</p>
                </Grid>
                <Grid className='mt-3' item xs={4} style={{ textAlign: 'center' }}>
                    <img src={step2}/>
                    <h3>Extract your document</h3>
                    <p className='' style={{color:'#585757'}}>Scan the policy document, and <br/> Simple access to a physical <br/> policy document in a digital <br/> version.</p>

                </Grid>
                <Grid  className='mt-3' item xs={4} style={{ textAlign: 'center' }}>
                    <img src={step3}/>
                    <h3>Save your document</h3>
                    <p className='' style={{color:'#585757'}}>Scan the policy document, and <br/> Simple access to a physical <br/> policy document in a digital <br/> version.</p>

                </Grid>
            </Grid>
        </div>
    )
}

export default About
