import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Card } from '@mui/material';
import './CSS/afterglow.css';
import symbol from '../../Images/Symbol.png';
import API_URL from '../../ServiceModule/Service';
import IMAGE_PATH from '../../ServiceModule/imagePath';

const Blog = () => {
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        // Fetch the blog data from the API
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}news/getAll`);
                const result = await response.json();
                if (result.status) {
                    setBlogPosts(result.data);
                }
            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
        };

        fetchData();
    }, []);

    if (blogPosts.length === 0) {
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <Grid container justifyContent='center' className='p-5' style={{ backgroundColor: '#F7FAFE' }}>
            <div className="text-center">
                <h3 className="fw-bold" style={{ color: "#FF9906" }}>
                    NEWS & BLOG
                </h3>
                <h1 className="my-4 fw-bold">Latest from the blog</h1>
            </div>

            <Grid container xs={12} md={12} spacing={8}>
                {/* Main Blog Post on the Left */}
                <Grid item xs={12} md={6}>
                    <div className='' style={{ borderRadius: '25px', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                        <div className="hover-overlay mb-3">
                            <img src={IMAGE_PATH + blogPosts[0].newsImg} className="img-fluid" alt={blogPosts[0].title} />
                        </div>
                        <div className="card-body p-4">
                            <p className="card-title fw-bold fs-5 mb-3" style={{ color: '#42988E' }}>{blogPosts[0].date}</p>
                            <h2 className="card-text mb-3">{blogPosts[0].subtitle}</h2>
                            <div className='d-flex'>
                                <a href={blogPosts[0].link} className="fw-bold mr-2">Read More</a>
                                <img src={symbol} height={15} className='mt-2' alt="symbol" />
                            </div>
                        </div>
                    </div>
                </Grid>







                {/* Smaller Blog Posts on the Right */}
                <Grid item xs={12} md={6}>
                    {blogPosts.slice(1, 5).map((post, index) => (
                        <Card key={post._id} className="mb-5 rounded-5">
                            <Grid container xs={12} style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                                <Grid item xs={3} className='mr-5'>
                                    <img
                                        src={IMAGE_PATH + post.newsImg}
                                        alt={post.subtitle}
                                        className="img-fluid rounded-start"
                                        height={150}
                                        width={100}
                                    />
                                </Grid>
                                <Grid item xs={8} className='p-3'>
                                    <div className="card-body">
                                        <p className="card-title fw-bold fs-4 mb-4" style={{ color: '#42988E' }}>{post.date}</p>
                                        <h3 className="card-text mb-4">{post.subtitle}</h3>
                                        <div className='d-flex'>
                                            <a href={post.link} className="fw-bold mr-2">Read More</a>
                                            <img src={symbol} height={15} className='mt-2' alt="symbol" />
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Blog;
