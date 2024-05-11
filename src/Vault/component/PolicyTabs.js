import * as React from 'react';
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
export default function PolicyTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Card className='mx-5 rounded-4 border ' style={{ justifyContent: 'center',boxShadow:' rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box sx={{ width: '95%' }} className='m-3'>
                    <Box sx={{ maxWidth: { xs: 370, sm: 530 }, width: '75%', bgcolor: '#EAF0FD', margin: 'auto' }} className='p-2 rounded' alignItems="center">
                        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons={false}
                            aria-label="scrollable prevent tabs example" centered textColor="#42988E" TabIndicatorProps={{ style: { display: 'none' } }}>
                            <Tab label="Active" className='m-2 fw-bolder px-5' sx={{ color: value === 0 ? '#42988E' : '#777777', backgroundColor: value === 0 ? 'white' : 'inherit', textTransform: 'capitalize' }} />
                            <Tab label="Expired" className='m-2 fw-bolder px-5' sx={{ color: value === 1 ? '#42988E' : '#777777', backgroundColor: value === 1 ? 'white' : 'inherit',textTransform:'capitalize' }} />
                            <Tab label="Archive" className='m-2 fw-bolder px-5' sx={{ color: value === 2 ? '#42988E' : '#777777', backgroundColor: value === 2 ? 'white' : 'inherit' ,textTransform:'capitalize'}} />
                        </Tabs>
                    </Box>
                </Box>
            </Grid>
            <Card className='m-5 rounded  card-detail' style={{boxShadow:' rgba(17, 17, 26, 0.1) 0px 0px 16px'}}>
                <CardContent style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '230px', height: '60px', backgroundImage: `url(${red})`, backgroundSize: 'cover', opacity: 1 }}></div>

                    <Grid container spacing={0}>
                        <Grid item xs={12} md={3}>
                            <img
                                src={scooty}
                                alt="Trendy Pants and Shoes"
                                style={{ width: '75%', maxWidth: '75%' }}
                                className="img-fluid rounded-start "
                               
                            />
                        </Grid>
                        <Grid item xs={12} md={9} className='d-flex align-items-end justify-content-between'>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="dot" style={{ backgroundColor: '#42988E', width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px', marginBottom: '14px' }}></span>
                                    <Typography variant="body1" component="p" gutterBottom style={{ color: '#89CFC7' }} className='mb-3'>Two Wheeler Insurance</Typography>
                                </div>
                                <h4 variant="h4" component="h2" gutterBottom className='fw-bold'>Honda Activa</h4>
                                <h6 className='mb-4' style={{ color: '#585858' }}>MP-09-UZ-1234</h6>
                                <h6 variant="h6" component="h2" gutterBottom style={{ color: '#9E9E9E' }}>Expires on 04 Dec,2024</h6>
                            </div>
                            <div style={{ alignItems: 'end' }}>
                                <img src={arrow} className='mr-2' height={40} />
                            </div>
                        </Grid>
                    </Grid>

                   
                    <div style={{ position: 'absolute', top: 10, right: 30, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>40 days left</div>

                </CardContent>
            </Card>
            <Card className='m-5 rounded shadow shadow-sm card-detail'>
            <CardContent style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '230px', height: '60px', backgroundImage: `url(${red})`, backgroundSize: 'cover', opacity: 1 }}></div>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={2}>
                            <img
                                src={car}
                                alt="Trendy Pants and Shoes"
                                style={{ width: '100%', maxWidth: '100%' }}
                                className="img-fluid rounded-start "
                            />
                        </Grid>
                        <Grid item xs={12} md={10} className='d-flex align-items-end justify-content-between'>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="dot" style={{ backgroundColor: '#42988E', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px', marginBottom: '8px' }}></span>
                                    <Typography variant="body1" component="p" gutterBottom style={{ color: '#89CFC7' }}>Car Insurance</Typography>
                                </div>
                                <h4 className='fw-bold'>Hyundai Venue</h4>
                                <h6 className='mb-4' style={{ color: '#585858' }}>MP-09-UZ-1234</h6>
                                <h6 style={{ color: '#9E9E9E' }}>Expires on  04 Dec,2024</h6>


                            </div>
                            <div style={{ alignItems: 'end' }}>
                                <img src={arrow} className='mr-2' height={40} />
                            </div>
                        </Grid>
                    </Grid>
                    <div style={{ position: 'absolute', top: 10, right: 30, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>40 days left</div>

                </CardContent>
            </Card>
            <Card className='m-5 rounded shadow shadow-sm card-detail'>
                <CardContent style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '230px', height: '60px', backgroundImage: `url(${red})`, backgroundSize: 'cover', opacity: 1 }}></div>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={2}>
                            <img
                                src={family}
                                alt="Trendy Pants and Shoes"
                                style={{ width: '100%', maxWidth: '100%' }}
                                className="img-fluid rounded-start "
                            />
                        </Grid>
                        <Grid item xs={12} md={10} className='d-flex align-items-end justify-content-between'>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="dot" style={{ backgroundColor: '#42988E', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px', marginBottom: '8px' }}></span>
                                    <Typography variant="body1" component="p" gutterBottom style={{ color: '#89CFC7' }}>Two Wheeler Insurance</Typography>
                                </div>
                                <h4 className='fw-bold'>Honda Cb Hornet</h4>
                                <h6 className='mb-4' style={{ color: '#585858' }}>MP-09-UZ-1234</h6>
                                <h6 style={{ color: '#9E9E9E' }}>Expires on  04 Dec,2024</h6>


                            </div>
                            <div style={{ alignItems: 'end' }}>
                                <img src={arrow} className='mr-2' height={40} />
                            </div>
                        </Grid>
                    </Grid>
                    <div style={{ position: 'absolute', top: 10, right: 30, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>40 days left</div>

                </CardContent>
            </Card>
        </Card>
    );
}
