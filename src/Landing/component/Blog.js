import React from 'react'
import blog from '../../Images/blog.png'
import symbol from '../../Images/Symbol.png'
import sideblog from '../../Images/sideBlog.png'
import Grid from '@mui/material/Grid';
const Blog = () => {
    return (
        <Grid container justifyContent='center' className='m-5'>
            <h1 className='text-center m-5' style={{fontSize:'60px'}}> <span className='border-bottom'>Latest</span> from the blog</h1>
            
            <Grid container spacing={6} >
                
                    <Grid item xs={12} md={5} style={{marginLeft:'20px'}}>
                        <div class=" hover-overlay mb-3" data-mdb-ripple-init data-mdb-ripple-color="light">
                            <img src={blog} class="img-fluid" height={920} width={920} />
                            
                        </div>
                        <div class="card-body">
                            <p class="card-title fw-bold fs-5 mb-3" style={{ color: '#42988E' }}>21 JAN 2024</p>
                            <h2 class="card-text  mb-3">Health Insurance: Family floater  polices  can include <br /> new-borns and children, till they  turn 25</h2>
                            <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                        </div>
                    </Grid>
                
               
                    <Grid item xs={12} md={6} >
                        <div class="row">
                            <div class="col-md-4">
                                <img
                                    src={sideblog}
                                    alt="Trendy Pants and Shoes"
                                    class="img-fluid rounded-start mr-5"
                                />
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <p class="card-title fw-bold fs-5 mb-3 " style={{ color: '#42988E' }}>21 JAN 2024</p>
                                    <h3 class="card-text mb-3">Health Insurance: Family floater  polices  can <br />include  new-borns and children, till they <br /> turn 25</h3>
                                    <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                                </div>
                            </div>
                        </div>
                        <div class="row ">
                            <div class="col-md-4">
                                <img
                                    src={sideblog}
                                    alt="Trendy Pants and Shoes"
                                    class="img-fluid rounded-start mr-5"
                                />
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <p class="card-title fw-bold fs-5 mb-3 " style={{ color: '#42988E' }}>21 JAN 2024</p>
                                    <h3 class="card-text mb-3">Health Insurance: Family floater  polices  can <br />include  new-borns and children, till they <br /> turn 25</h3>
                                    <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <img
                                    src={sideblog}
                                    alt="Trendy Pants and Shoes"
                                    class="img-fluid rounded-start mr-5"
                                />
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <p class="card-title fw-bold fs-5 mb-3 " style={{ color: '#42988E' }}>21 JAN 2024</p>
                                    <h3 class="card-text mb-3">Health Insurance: Family floater  polices  can <br />include  new-borns and children, till they <br /> turn 25</h3>
                                    <div className='d-flex '> <p href="#!" class="fw-bold mr-2" data-mdb-ripple-init>Read More</p><img src={symbol} height={15} className='mt-2' /></div>
                                </div>
                            </div>
                        </div>
                    </Grid>
               
            </Grid>
        </Grid>
    )
}

export default Blog