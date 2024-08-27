import React from 'react'
import blog from '../../Images/blog.png'
import symbol from '../../Images/Symbol.png'
import sideblog from '../../Images/sideBlog.png'
import Grid from '@mui/material/Grid';
import './CSS/afterglow.css'
import { Card } from '@mui/material';
const Blog = () => {
    return (
        <Grid container justifyContent='center' className='m-5'>
            {/* <h1 className='text-center m-5' style={{fontSize:'60px'}}> <span className='border-bottom'>Latest</span> from the blog</h1> */}
            <div className="text-center ">
                <h3 className=" fw-bold" style={{ color: "#FF9906" }}>
                    NEWS & BLOG
                </h3>
                <h1 className="mt-3 fw-bold">Latest from the blog</h1>
            </div>

            <Grid container xs={12} md={12} spacing={8} className='blog-bg' >

                <Grid item xs={12} md={6} >
                    <div className='' style={{borderRadius:'25px',  boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px'}}>
                    <div class=" hover-overlay mb-3" data-mdb-ripple-init data-mdb-ripple-color="light">
                        <img src={blog} class="img-fluid" height={900} width={980} />

                    </div>
                    <div class="card-body p-4">
                        <p class="card-title fw-bold fs-5 mb-3" style={{ color: '#42988E' }}>21 JAN 2024</p>
                        <h2 class="card-text  mb-3">Health Insurance: Family floater  polices  can include <br /> new-borns and children, till they  turn 25</h2>
                        <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                    </div>
                    </div>
                </Grid>


                <Grid item xs={12} md={6}  >
                <Card class=" mb-5 rounded-5">
                        <Grid container  xs={12}   style={{boxShadow:'rgba(17, 17, 26, 0.1) 0px 0px 16px'}}>
                        <Grid  item xs={3} className='mr-5'>
                            <img
                                src={sideblog}
                                alt="Trendy Pants and Shoes"
                                class="img-fluid rounded-start mr-5"
                            />
                        </Grid>
                        <Grid item xs={8} className='p-3'>
                            <div class="card-body">
                                <p class="card-title fw-bold fs-4 mb-4 " style={{ color: '#42988E' }}>21 JAN 2024</p>
                                <h3 class="card-text mb-4" >Health Insurance: Family floater  polices  can include  new-borns and children, till they <br /> turn 25</h3>
                                <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                            </div>
                        </Grid>
                        </Grid>
                    </Card>
                    <Card class=" mb-5">
                        <Grid container  xs={12}   style={{boxShadow:'rgba(17, 17, 26, 0.1) 0px 0px 16px'}}>
                        <Grid  item xs={3} className='mr-5'>
                            <img
                                src={sideblog}
                                alt="Trendy Pants and Shoes"
                                class="img-fluid rounded-start mr-5"
                            />
                        </Grid>
                        <Grid item xs={8} className='p-3'>
                            <div class="card-body">
                                <p class="card-title fw-bold fs-4 mb-4 " style={{ color: '#42988E' }}>21 JAN 2024</p>
                                <h3 class="card-text mb-4" >Health Insurance: Family floater  polices  can include  new-borns and children, till they <br /> turn 25</h3>
                                <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                            </div>
                        </Grid>
                        </Grid>
                    </Card>
                    <Card class=" mb-5">
                        <Grid container  xs={12}   style={{boxShadow:'rgba(17, 17, 26, 0.1) 0px 0px 16px'}}>
                        <Grid  item xs={3} className='mr-5'>
                            <img
                                src={sideblog}
                                alt="Trendy Pants and Shoes"
                                class="img-fluid rounded-start mr-5"
                            />
                        </Grid>
                        <Grid item xs={8} className='p-3'>
                            <div class="card-body">
                                <p class="card-title fw-bold fs-4 mb-4 " style={{ color: '#42988E' }}>21 JAN 2024</p>
                                <h3 class="card-text mb-4" >Health Insurance: Family floater  polices  can include  new-borns and children, till they <br /> turn 25</h3>
                                <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                            </div>
                        </Grid>
                        </Grid>
                    </Card>
                    <Card class=" mb-5">
                        <Grid container  xs={12}   style={{boxShadow:'rgba(17, 17, 26, 0.1) 0px 0px 16px'}}>
                        <Grid  item xs={3} className='mr-5'>
                            <img
                                src={sideblog}
                                alt="Trendy Pants and Shoes"
                                class="img-fluid rounded-start mr-5"
                            />
                        </Grid>
                        <Grid item xs={8} className='p-3'>
                            <div class="card-body">
                                <p class="card-title fw-bold fs-4 mb-4 " style={{ color: '#42988E' }}>21 JAN 2024</p>
                                <h3 class="card-text mb-4" >Health Insurance: Family floater  polices  can include  new-borns and children, till they <br /> turn 25</h3>
                                <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                            </div>
                        </Grid>
                        </Grid>
                    </Card>
                </Grid>

            </Grid>
        </Grid>
    )
}

export default Blog