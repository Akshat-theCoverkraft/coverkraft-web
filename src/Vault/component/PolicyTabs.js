import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import { Checkbox } from '@mui/material';
import Typography from '@mui/material/Typography';
import scooty from '../../Images/Scooty.png';
import HealthInsurance from '../../Images/Health Insurance.png'
import car from '../../Images/Car.png';
import arrow from '../../Images/right-arrow.png'
import red from '../../Images/red-bg.png'
import family from '../../Images/Family.png'
import './policy.css'
import { useDispatch, useSelector } from 'react-redux'
import API_URL from '../../ServiceModule/Service';
import Pagination from '@mui/material/Pagination';
import emptyImage from '../../Images/ic-empty.png'
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios'

export default function PolicyTabs({ handleCardClick, shareAllPolicy, selectedPolicies, handleCheckboxChange,onPolicyListLengthChange }) {
    const [value, setValue] = React.useState(0);
    const [pagePolicy, setPagePolicy] = useState(1);
    const [pageArchive, setPageArchive] = useState(1);
    const itemsPerPage = 10;
    const [policyList, setPolicyList] = useState([]);
    const [pageActive, setPageActive] = useState(1)
    const [archieveList, setArchieveList] = useState([]);
    
    const handlePageChangePolicy = (event, value) => {
        setPagePolicy(value);
    };
    const handlePageActive = (event, value) => {
        setPageActive(value);
    }

    const handlePageChangeArchive = (event, value) => {
        setPageArchive(value);
    };

    const getPaginatedData = (list, page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return list.slice(startIndex, endIndex);
    };

    //useEffect
    useEffect(() => {
        const fetchPolicyList = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                let status = 'active';
                if (value === 1) {
                    status = 'expired';
                }

                const response = await axios.get(`${API_URL}policy/getById`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        userId: userId,
                        policyType: status
                    }
                });

                // Assuming response.data is the whole response object
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    
                    setPolicyList(response.data.data);
                    onPolicyListLengthChange(response.data.data.length); // Update parent with policyList length
                    console.log('length btade',response.data.data.length)

                } else {
                    console.error('Expected an array but got:', response.data);
                    setPolicyList([]);
                    onPolicyListLengthChange(0);
                }

            } catch (error) {
                console.error('Error fetching policy list:', error);
                setPolicyList([]);
                onPolicyListLengthChange(0);

            }
        };

        fetchPolicyList();
    }, [value]);

    useEffect(() => {
        const fetchArchieveList = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');


                const response = await axios.get(`${API_URL}policy/archiveData`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {

                        userId: userId,
                        status: 'archive'
                    }
                });

                // Assuming response.data is the whole response object
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    setArchieveList(response.data.data);
                    
                } else {
                    console.error('Expected an array but got:', response.data);
                    setArchieveList([]);
                }

            } catch (error) {
                console.error('Error fetching policy list:', error);
                setArchieveList([]);
            }
        };

        fetchArchieveList();
    }, [value]);


    //function for set the value
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };




    return (
        <Card className='mx-5 rounded-4 border' style={{ justifyContent: 'center', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
            <TabContext value={value}>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{ width: '95%' }} className='m-3'>

                        <Box sx={{ maxWidth: { xs: 370, sm: 530 }, width: '75%', bgcolor: '#EAF0FD', margin: 'auto',borderRadius:'35px' }} className='p-2 ' alignItems="center">
                            <TabList onChange={handleChange} variant="scrollable" scrollButtons={false}
                                aria-label="scrollable prevent tabs example" textColor="#42988E" TabIndicatorProps={{ style: { display: 'none' } }}>
                                <Tab label="Active" value={0} className='m-2 fw-bolder px-5 rounded-5' sx={{ color: value === 0 ? '#8AC642' : '#777777', backgroundColor: value === 0 ? 'white' : 'inherit', textTransform: 'capitalize' }} />
                                <Tab label="Expired" value={1} className='m-2 fw-bolder px-5 rounded-5' sx={{ color: value === 1 ? '#8AC642' : '#777777', backgroundColor: value === 1 ? 'white' : 'inherit', textTransform: 'capitalize' }} />
                                <Tab label="Archive" value={2} className='m-2 fw-bolder px-5 rounded-5' sx={{ color: value === 2 ? '#8AC642' : '#777777', backgroundColor: value === 2 ? 'white' : 'inherit', textTransform: 'capitalize' }} />
                            </TabList>
                        </Box>
                    </Box>
                </Grid>



                <TabPanel value={0} className=''>
                    <div style={{ minHeight: '79vh', maxHeight: '79vh', overflowY: 'auto' }}>
                        {policyList.length === 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '70vh' }}>
                                <img src={emptyImage} alt="No Data" />
                                <p>Add your new policy effortlessly to your account</p>

                            </div>
                        ) : (
                            getPaginatedData(policyList, pageActive).map((policy, index) => {



                                let endDate, diffInDays, status;

                                try {
                                    if (policy.policyEndDate) {
                                        // Try to parse the date part of the policy end date
                                        const datePart = policy.policyEndDate.split(' ')[0];
                                        const [day, month, year] = datePart.split('/');

                                        // Create a new Date object with the date components
                                        endDate = new Date(year, month - 1, day);

                                        if (isNaN(endDate)) throw new Error('Invalid date');

                                        const now = new Date();

                                        // Remove the time component from the dates
                                        const endDateWithoutTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                                        const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                                        // Calculate the difference in milliseconds between the dates
                                        const diffInMs = endDateWithoutTime.getTime() - nowWithoutTime.getTime();
                                        diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

                                        if (diffInDays <= 0) {
                                            status = 'Expired';
                                        } else if (diffInDays <= 60) {
                                            status = `${diffInDays} days left`;
                                        }
                                    }
                                } catch (error) {
                                    console.error('Error parsing policy end date:', error);
                                }


                                return (
                                   
                                        <Card className='m-5 rounded card-detail policy-card-container' key={index} style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} onClick={() => handleCardClick(policy._id)}>
                                            <CardContent style={{ position: 'relative' }}>
                                                {status && (
                                                    <div style={{ position: 'absolute', top: 0, right: 0, width: '230px', height: '60px', backgroundImage: `url(${red})`, backgroundSize: 'cover', opacity: 1 }}></div>
                                                )}
                                                <Grid container spacing={0} alignItems="center">
                                                    {shareAllPolicy && (
                                                        <Grid item xs={1}>
                                                            <Checkbox
                                                                checked={selectedPolicies.includes(policy._id)}
                                                                onChange={() => handleCheckboxChange(policy._id)} />
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={shareAllPolicy ? 2 : 3}>
                                                        <img src={policy.policyType === 'car_policy' ? car :
                                                            policy.policyType === 'bike_policy' ? scooty :
                                                                policy.policyType === 'other_vehicle' ? scooty :
                                                                    policy.policyType === 'life' ? family :
                                                                        policy.policyType === 'accident' ? family :
                                                                            policy.policyType === 'health' ? HealthInsurance :
                                                                                policy.policyType === 'other_health' ? HealthInsurance : ''

                                                        } alt="Policy Image" style={{ width: '75%', maxWidth: '75%' }} className="img-fluid rounded-start" />
                                                    </Grid>
                                                    <Grid item xs={shareAllPolicy ? 9 : 9} className='d-flex align-items-end justify-content-between'>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span className="dot" style={{ backgroundColor: '#8AC642', width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px', marginBottom: '14px' }}></span>
                                                                <Typography variant="body1" component="p" gutterBottom style={{ color: '#8AC642' }} className='mb-3'>
                                                                    {
                                                                        policy.policyType === 'car_policy' ? 'Car Insurance' :
                                                                            policy.policyType === 'bike_policy' ? 'Two Wheeler Insurance' :
                                                                                policy.policyType === 'other_vehicle' ? 'Other Vehicle Insurance' :
                                                                                    policy.policyType === 'life' ? 'Life Insurance' :
                                                                                        policy.policyType === 'accident' ? 'Accident Insurance' :
                                                                                            policy.policyType === 'health' ? 'Health Insurance' :
                                                                                                policy.policyType === 'other_health' ? 'Other Health Insurance' : ''
                                                                    }
                                                                </Typography>
                                                            </div>
                                                            <h4 variant="h4" component="h2" gutterBottom className='fw-bold'>{policy.insuredName}</h4>
                                                            <h6 className='mb-4' style={{ color: '#585858' }}>{policy.policyNumber}</h6>
                                                            <h6 variant="h6" component="h2" gutterBottom style={{ color: '#9E9E9E' }}>Expires on {policy.policyEndDate}</h6>
                                                        </div>
                                                        <div style={{ alignItems: 'end' }}>
                                                            <img src={arrow} className='mr-2' height={40} />
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                {status && (
                                                    <div style={{ position: 'absolute', top: 10, right: 30, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>{status}</div>
                                                )}
                                            </CardContent>
                                        </Card>

                                   
                                );


                            })

                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                            <Pagination
                                variant='outlined'
                                size='large'
                                count={Math.ceil(policyList.length / itemsPerPage)}
                                page={pageActive}
                                onChange={handlePageActive}
                            />
                        </Box>


                    </div>
                </TabPanel>

                <TabPanel value={1}>
                    <div style={{ minHeight: '79vh', maxHeight: '79vh', overflowY: 'auto' }}>
                        {policyList.length === 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '70vh' }}>
                                <img src={emptyImage} alt="No Data" />
                                <p>Add your new policy effortlessly to your account</p>
                            </div>
                        ) : (
                            getPaginatedData(policyList, pagePolicy).map((policy, index) => (
                                <div>
                                    <Card className='m-5 rounded card-detail' key={index} style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} onClick={() => handleCardClick(policy._id)}>
                                        <CardContent style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: 0, right: 0, width: '230px', height: '60px', backgroundImage: `url(${red})`, backgroundSize: 'cover', opacity: 1 }}></div>
                                            <Grid container spacing={0}>
                                                <Grid item xs={12} md={3}>
                                                    <img src={policy.policyType === 'car_policy' ? car : scooty} alt="Policy Image" style={{ width: '75%', maxWidth: '75%' }} className="img-fluid rounded-start" />
                                                </Grid>
                                                <Grid item xs={12} md={9} className='d-flex align-items-end justify-content-between'>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span className="dot" style={{ backgroundColor: '#42988E', width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px', marginBottom: '14px' }}></span>
                                                            <Typography variant="body1" component="p" gutterBottom style={{ color: '#89CFC7' }} className='mb-3'>{policy.policyType === 'car_policy' ? 'Car Insurance' : 'Two Wheeler Insurance'}</Typography>
                                                        </div>
                                                        <h4 variant="h4" component="h2" gutterBottom className='fw-bold'>{policy.insuredName}</h4>
                                                        <h6 className='mb-4' style={{ color: '#585858' }}>{policy.policyNumber}</h6>
                                                        <h6 variant="h6" component="h2" gutterBottom style={{ color: '#9E9E9E' }}>Expires on {policy.policyEndDate}</h6>
                                                    </div>
                                                    <div style={{ alignItems: 'end' }}>
                                                        <img src={arrow} className='mr-2' height={40} />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <div style={{ position: 'absolute', top: 10, right: 30, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>Expired</div>
                                        </CardContent>
                                    </Card>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                                        <Pagination
                                            variant='outlined'
                                            size='large'
                                            count={Math.ceil(policyList.length / itemsPerPage)}
                                            page={pagePolicy}
                                            onChange={handlePageChangePolicy}
                                        />
                                    </Box>
                                </div>
                            ))
                        )}

                    </div>
                </TabPanel>
                <TabPanel value={2}>
                    <div style={{ minHeight: '79vh', maxHeight: '79vh', overflowY: 'auto' }}>
                        {archieveList.length === 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '70vh' }}>
                                <img src={emptyImage} alt="No Data" />
                                <p>Add your new policy effortlessly to your account</p>
                            </div>
                        ) : (
                            getPaginatedData(archieveList, pageArchive).map((policy, index) => (
                                <div>
                                    <Card className='m-5 rounded card-detail ' key={index} style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }} onClick={() => handleCardClick(policy._id)}>
                                        <CardContent style={{ position: 'relative' }}>
                                            <Grid container spacing={0}>
                                                <Grid item xs={12} md={3}>
                                                    <img src={policy.policyType === 'car_policy' ? car : scooty} alt="Policy Image" style={{ width: '75%', maxWidth: '75%' }} className="img-fluid rounded-start" />
                                                </Grid>
                                                <Grid item xs={12} md={9} className='d-flex align-items-end justify-content-between'>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span className="dot" style={{ backgroundColor: '#42988E', width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px', marginBottom: '14px' }}></span>
                                                            <Typography variant="body1" component="p" gutterBottom style={{ color: '#89CFC7' }} className='mb-3'>{policy.policyType === 'car_policy' ? 'Car Insurance' : 'Two Wheeler Insurance'}</Typography>
                                                        </div>
                                                        <h4 variant="h4" component="h2" gutterBottom className='fw-bold'>{policy.insuredName}</h4>
                                                        <h6 className='mb-4' style={{ color: '#585858' }}>{policy.policyNumber}</h6>
                                                        <h6 variant="h6" component="h2" gutterBottom style={{ color: '#9E9E9E' }}>Expires on {policy.policyEndDate}</h6>
                                                    </div>
                                                    <div style={{ alignItems: 'end' }}>
                                                        <img src={arrow} className='mr-2' height={40} />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                                        <Pagination
                                            variant='outlined'
                                            size='large'
                                            count={Math.ceil(archieveList.length / itemsPerPage)}
                                            page={pageArchive}
                                            onChange={handlePageChangeArchive}
                                        />
                                    </Box>
                                </div>
                            ))
                        )}

                    </div>
                </TabPanel>


            </TabContext>


        </Card>
    );
}
