import React from 'react'
import Navbar from '../component/Navbar'
import Footer from '../Landing/component/Footer'
import vision from '../Images/ic_vision.png';
import mission from '../Images/ic_mission.png'
import { Card, Grid } from '@mui/material';
const About = () => {
    return (
        <div>
            <Navbar />
            <div className="content">
                <div className="padding-container">
                    <div>
                        <h1 className="text-center">About CoverKraft</h1>
                        <p className="text-center my-4 fs-5 text-secondary">
                            CoverKraft Insurance Broking Pvt Ltd is on a mission to revolutionize the insurance industry. <br />Led by a team of insurance experts and tech enthusiasts, we have developed a user-friendly tech platform to make insurance easily understandable and accessible for all.
                        </p>
                        <div className="spacer"></div>
                    </div>
                    {/* <div className="spacer"></div> */}
                    <Grid container spacing={4} xs={12} justifyContent='center' alignItems='center' className=''>
                        <Grid item xs={4}>
                            <div className='card card-container' style={{backgroundColor:'#F1F1F1',maxHeight:'500px'}}>
                                <img
                                    src={mission}
                                    alt="Mission"
                                    className="image"
                                />
                                <h2 className="header mb-3">Mission</h2>
                                <p className="text px-5">
                                    To educate customers about various risks and insurance products, equip them with tools for accessing and sharing their policies, and empower them with technology to purchase the most suitable products.
                                </p>
                            </div>
                            {/* <div className="spacer"></div> */}
                        </Grid>
                        {/* <div className="spacer"></div> */}
                        <Grid item xs={4}>
                            <div className='card card-container' style={{backgroundColor:'#F1F1F1',minHeight:'310px'}}>
                                <img
                                    src={vision}
                                    alt="Vision"
                                    className="image"
                                />
                                <h2 className="header ">Vision</h2>
                                <p className="text px-5">
                                    To be the preferred distribution partner for customers, recognized for our innovation, transparent advice, and integrity.
                                </p>
                                {/* <div className="spacer"></div> */}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default About
