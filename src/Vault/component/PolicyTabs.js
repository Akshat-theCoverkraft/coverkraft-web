import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import scooty from '../../Images/Scooty.png';
import car from '../../Images/Car.png';
import family from '../../Images/Family.png'
import arrow from '../../Images/right-arrow.png'
import red from '../../Images/red-bg.png'
import './policy.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPolicyList } from '../../store/action/action';
import API_URL from '../../ServiceModule/Service';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import emptyImage from '../../Images/ic-empty.png'
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
export default function PolicyTabs() {
    const [value, setValue] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [cardsPerPage] = React.useState(5);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [policyList, setPolicyList] = useState([]);
    const policyLists = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllPolicyList(API_URL));
    }, [dispatch]);

    useEffect(() => {
        if (policyLists !== null && policyLists !== undefined) {
            if (policyLists.getPolicyList !== null && policyLists.getPolicyList !== undefined) {
                if (policyLists.getPolicyList.data !== null && policyLists.getPolicyList.data !== undefined) {
                    setPolicyList(policyLists.getPolicyList.data)
                }
            }
        }

    }, [policyLists]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };


    return (
        <Card className='mx-5 rounded-4 border' style={{ justifyContent: 'center', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
            <TabContext value={value}>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{ width: '95%' }} className='m-3'>

                        <Box sx={{ maxWidth: { xs: 370, sm: 530 }, width: '75%', bgcolor: '#EAF0FD', margin: 'auto' }} className='p-2 rounded' alignItems="center">
                            <TabList onChange={handleChange} variant="scrollable" scrollButtons={false}
                                aria-label="scrollable prevent tabs example" centered textColor="#42988E" TabIndicatorProps={{ style: { display: 'none' } }}>
                                <Tab label="Active" value={0} className='m-2 fw-bolder px-5' sx={{ color: value === 0 ? '#42988E' : '#777777', backgroundColor: value === 0 ? 'white' : 'inherit', textTransform: 'capitalize' }} />
                                <Tab label="Expired" value={1} className='m-2 fw-bolder px-5' sx={{ color: value === 1 ? '#42988E' : '#777777', backgroundColor: value === 1 ? 'white' : 'inherit', textTransform: 'capitalize' }} />
                                <Tab label="Archive" disabled value='2' className='m-2 fw-bolder px-5' sx={{ color: value === 2 ? '#42988E' : '#777777', backgroundColor: value === 2 ? 'white' : 'inherit', textTransform: 'capitalize' }} />
                            </TabList>
                        </Box>
                    </Box>
                </Grid>

                <TabPanel value={0}>
                    <>
                        {policyList.length === 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <img src={emptyImage} alt="No Data" />
                                <p>Add your new policy effortlessly to your account</p>

                            </div>
                        ) : (
                            policyList.slice((page - 1) * cardsPerPage, page * cardsPerPage).map((policy, index) => {
                                if (!policy) return null;

                                let endDateParts;
                                if (policy.policyEndDate) {
                                    endDateParts = policy.policyEndDate.split(' ');

                                    if (endDateParts.length !== 2) return null;
                                }

                                // Extract date and time components if endDateParts exists
                                let endDate, endDateWithoutTime, diffInDays;
                                if (endDateParts) {
                                    const [day, month, year] = endDateParts[0].split('/');
                                    const [hour, minute, second] = endDateParts[1].split(':');

                                    // Create a new Date object with the components
                                    endDate = new Date(year, month - 1, day, hour, minute, second);
                                    const now = new Date();

                                    // Remove the time component from the dates
                                    endDateWithoutTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                                    const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                                    // Calculate the difference in milliseconds between the dates
                                    const diffInMs = endDateWithoutTime.getTime() - nowWithoutTime.getTime();
                                    diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                                }

                                let status;
                                if (diffInDays <= 0) {
                                    status = 'Expired';
                                } else if (diffInDays <= 60) {
                                    status = `${diffInDays} days left`;
                                }

                                return (
                                    <Card className='m-5 rounded card-detail' key={index} style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                                        <CardContent style={{ position: 'relative' }}>
                                            {status && (
                                                <div style={{ position: 'absolute', top: 0, right: 0, width: '230px', height: '60px', backgroundImage: `url(${red})`, backgroundSize: 'cover', opacity: 1 }}></div>
                                            )}
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
                                            {status && (
                                                <div style={{ position: 'absolute', top: 10, right: 30, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>{status}</div>
                                            )}
                                        </CardContent>
                                    </Card>

                                );

                            })
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                            <Pagination variant='outlined' size='large' count={Math.ceil(policyList.length / cardsPerPage)} page={page} onChange={handlePageChange} />
                        </Box>
                    </>
                </TabPanel>

                <TabPanel value={1}>
                    <>
                        {
                            policyList.slice((page - 1) * cardsPerPage, page * cardsPerPage).map((policy, index) => {
                                if (!policy) return null;

                                let endDateParts;
                                if (policy.policyEndDate) {
                                    endDateParts = policy.policyEndDate.split(' ');

                                    if (endDateParts.length !== 2) return null;
                                }

                                // Extract date and time components if endDateParts exists
                                let endDate, endDateWithoutTime, diffInDays;
                                if (endDateParts) {
                                    const [day, month, year] = endDateParts[0].split('/');
                                    const [hour, minute, second] = endDateParts[1].split(':');

                                    // Create a new Date object with the components
                                    endDate = new Date(year, month - 1, day, hour, minute, second);
                                    const now = new Date();

                                    // Remove the time component from the dates
                                    endDateWithoutTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                                    const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                                    // Calculate the difference in milliseconds between the dates
                                    const diffInMs = endDateWithoutTime.getTime() - nowWithoutTime.getTime();
                                    diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                                }

                                let status;
                                if (diffInDays <= 0) {
                                    status = 'Expired';
                                } else if (diffInDays <= 60) {
                                    return null;
                                }
                                if (status === 'Expired') {
                                    return (
                                        <>
                                            <Card className='m-5 rounded card-detail' key={index} style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                                                <CardContent style={{ position: 'relative' }}>
                                                    {status && (
                                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '230px', height: '60px', backgroundImage: `url(${red})`, backgroundSize: 'cover', opacity: 1 }}></div>
                                                    )}
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
                                                    {status && (
                                                        <div style={{ position: 'absolute', top: 10, right: 30, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>{status}</div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                                                <Pagination variant='outlined' size='large' count={Math.ceil(policyList.length / cardsPerPage)} page={page} onChange={handlePageChange} />
                                            </Box>
                                        </>
                                    );
                                } else {
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' ,height:'50vh'}}>
                                            <img src={emptyImage} alt="No Data" /><br />
                                            <p className='fw-bold' style={{ color: '#525252' }}>Add your new policy effortlessly to your account</p>

                                        </div>
                                    );
                                }
                            })
                        }
                    </>
                </TabPanel>

            </TabContext>


        </Card>
    );
}
