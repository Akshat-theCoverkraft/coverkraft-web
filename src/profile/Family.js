import React, { useState, useEffect } from 'react';
import { Drawer, Box } from '@mui/material';
import { Card, Grid, Typography } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import backArrow from '../Images/ic_back_button.png';
import icDefaultProfile from '../Images/ic_default_profile.png';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import axios from 'axios';
import API_URL from '../ServiceModule/Service';
import addMember from '../Images/add-member.png'
import FamilyAdd from './FamilyAdd';
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Family = ({ family, onfamilyclose }) => {
    const [familyData, setFamilyData] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchFamilyDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`${API_URL}family/getById?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the headers
                    }
                });
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    setFamilyData(response.data.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                    setFamilyData([]);
                }

            } catch (error) {
                console.error('Error fetching family details:', error);
                setFamilyData([]);
            
            }
        };
        fetchFamilyDetails();

    }, [userId]);

    const handleFamilyOpen = () => {
        setDrawerOpen(true);
    };
    const handleFamilyClose = () => {
        setDrawerOpen(false);

    }


    return (
        <Drawer anchor="right" open={family} onClose={onfamilyclose}>
            <ToastContainer/>
            <Box sx={{ width: 800, padding: 0 }} role="presentation" style={{ overflowX: 'hidden' }}>
                <Grid container spacing={2} className='d-flex m-3'>
                    <Grid item>
                        <img src={backArrow} alt="Back" onClick={onfamilyclose} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">Plans for your family</Typography>
                    </Grid>
                </Grid>
                <Grid container xs={12} spacing={2}>
                    {familyData.map((profile, index) => (
                        <Grid item xs={6} key={index}>
                            <Card style={styles.card}>
                                <div className='profile-image-container' style={styles.profileImageContainer}>
                                    <img
                                        src={!profile.familyImg ? icDefaultProfile : profile.familyImg} // Replace with profile.imageUri or similar from API
                                        alt="Profile"
                                        className="profile-image"
                                        style={styles.profileImage}
                                    />
                                </div>
                                <Typography variant="subtitle1" className={styles.relationship}>
                                    {profile.familyMember}
                                </Typography>
                                <Typography variant="h5" className={styles.name}>
                                    {profile.fullName}
                                </Typography>
                                <div className='d-flex'>
                                    <EmailIcon />
                                    <Typography variant="body2" className='ml-2'>
                                        {profile.email}
                                    </Typography>
                                </div>
                                <div className='d-flex'>
                                    <CallIcon />
                                    <Typography variant="body2" className='ml-2'>
                                        {profile.mobile}
                                    </Typography>
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Grid container xs={12} justifyContent='center' alignItems='center' className='mt-5' onClick={handleFamilyOpen}>

                    <Card style={styles.card}>
                        <img height={70} src={addMember} />
                        <h4 style={{ color: '#0098DB' }}>Add member</h4>
                    </Card>
                </Grid>
            </Box>
            <FamilyAdd familyAdd={drawerOpen} onfamilyAddClose={handleFamilyClose} />
        </Drawer>
    );
};

const styles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        margin: '0 20px',
        textAlign: 'center',
    },
    profileImageContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '0px',
    },
    profileImage: {
        width: '130px',
        height: '130px',
        borderRadius: '50%',
    },
    relationship: {
        backgroundColor: '#FACFC6',
        padding: '5px 10px',
        borderRadius: '5px',
        marginBottom: '10px',
    },
    name: {
        marginBottom: '5px',
    },
    infoContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0px',
        padding: '5px 0',
    },
    infoText: {
        // marginLeft: '10px', 
    },
};

export default Family;
