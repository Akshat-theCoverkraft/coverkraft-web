import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '../../component/Button';
import EditIcon from '../../Images/edit.png';
import detailScooty from '../../Images/detail-scooty.png';
import Grid from '@mui/material/Grid';
import premium from '../../Images/premium.png';
import value from '../../Images/value.png';
import startDate from '../../Images/startDate.png';
import endDate from '../../Images/endDate.png';
import redBg from '../../Images/red-img.png';
import share from '../../Images/ic-share.png';
import download from '../../Images/download.png';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton,EmailShareButton,RedditShareButton } from 'react-share';
import twitter from '../../Images/twiter.png';
import facebook from '../../Images/fb.png';
import whatsapp from '../../Images/wtsp.png';
import email from '../../Images/gmial.png';
import reddit from '../../Images/reddit.png'
import { useNavigate } from "react-router-dom";
const PolicyDetail = () => {
    const navigate = useNavigate();
    const shareUrl = 'https://example.com';
    const policyDetailsMessage = `
        Policy Details:
        Vehicle: Honda Activa
        Registration Number: MP-09-UZ-1234
        Expires on: 04 Dec, 2024
        Premium Paid: ₹225
        Value(IDV): ₹1,000,00
        Policy Start Date: Dec 05, 2023
        Policy End Date: Dec 04, 2023
    `;

    const [showShareDialog, setShowShareDialog] = useState(false);

    const toggleShareDialog = () => {
        setShowShareDialog(!showShareDialog);
    };

    const handleEdit=()=>{
        console.log('heyyy');
        navigate('/add-policy');
        console.log('hellooo');
    }

    const sharePolicyDetails = () => {
        // Share logic here
    };

    return (
        <Card className='p-5 rounded-4 border' style={{ justifyContent: 'center', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>

            <div className='d-flex justify-content-between mb-5'>
                <Typography variant="h5" component="h2" gutterBottom className='fw-bold pl-4'>Details</Typography>
                <Button
                    text='Edit'
                    size="sm"
                    className='fw-bold'
                    startIcon={EditIcon}
                    // onClick={handleEdit}
                />
            </div>

            <div className='d-flex justify-content-between'>
                <div>
                    <Typography variant="h5" component="h2" gutterBottom className='fw-bold pl-4'>Honda Activa</Typography>
                    <Typography variant="h6" component="h2" gutterBottom style={{ color: '#585858' }} className='pl-4'>MP-09-UZ-1234</Typography>
                    <Typography variant="h6" component="h2" gutterBottom style={{ color: '#9E9E9E' }} className='pl-4'>Expires on  04 Dec,2024</Typography>
                </div>
                <div>
                    <img src={detailScooty} alt='' height={170} />
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <div className='' style={{ position: 'absolute', top: -89, right: 0, width: '200px', height: '50px', backgroundImage: `url(${redBg})`, backgroundSize: 'cover', opacity: 1, marginTop: '50px' }}></div>
                <div style={{ position: 'absolute', top: -33, right: 25, color: '#ffffff', fontSize: '24px', fontWeight: 'bold', zIndex: 1 }}>40 days left</div>
                <Card className='' style={{ marginTop: '105px',boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                            <div className='mr-2'>
                                <img src={premium} height={50} alt='premium' />
                            </div>
                            <div>
                                <h5 style={{ color: '#585858' }}>Premium Paid</h5>
                                <h5 className='fw-bolder'> ₹225</h5>
                            </div>
                        </Grid>
                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                            <div className='mr-2'>
                                <img src={value} height={50} alt='value' />
                            </div>
                            <div>
                                <h5 style={{ color: '#585858' }}>Value(IDV)</h5>
                                <h5 className='fw-bolder'>₹1,000,00</h5>
                            </div>
                        </Grid>
                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                            <div className='mr-2'>
                                <img src={startDate} height={50} alt='start date' />
                            </div>
                            <div>
                                <h5 style={{ color: '#585858' }}>Policy Start Date</h5>
                                <h5 className='fw-bolder'>Dec 05, 2023</h5>
                            </div>
                        </Grid>
                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                            <div className='mr-2'>
                                <img src={endDate} height={50} alt='end date' />
                            </div>
                            <div>
                                <h5 style={{ color: '#585858' }}>Policy End Date</h5>
                                <h5 className='fw-bolder'>Dec 04, 2023</h5>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }} >
                        <Grid item xs={4} md={4} style={{ padding: '30px 40px' }}>
                            <button className='btn btn-lg ' style={{ color: 'white', backgroundColor: '#42988E', padding: '10px 70px' }} >Renew</button>
                        </Grid>
                        <Grid item xs={4} md={4} style={{ padding: '30px 20px' }}>
                            <button className={`btn btn-lg custom-color `} style={{ borderColor: '#42988E', color: '#42988E', padding: '10px 80px' }} >View</button>
                        </Grid>
                        <Grid item xs={1} md={1} style={{ padding: '30px 0px' }}>
                            <img src={download} alt='download' height={50} />
                        </Grid>
                        <Grid item xs={2} md={2} style={{ padding: '20px 20px' }}>
                            <button className='btn btn-lg' onClick={toggleShareDialog}>
                                <img src={share} alt='' height={52} />
                            </button>
                        </Grid>
                    </Grid>
                </Card>
                {showShareDialog && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-20%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', zIndex: '9999' }}>
                        <p className='fw-bold '>Share Via</p>
                        <FacebookShareButton url={shareUrl} quote={policyDetailsMessage}>
                            <img src={facebook} alt='facebook' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} title={policyDetailsMessage}>
                            <img src={twitter} alt='twitter' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                        </TwitterShareButton>
                        <WhatsappShareButton url={shareUrl} title={policyDetailsMessage}>
                            <img src={whatsapp} alt='whatsapp' height={50} width={50} style={{ cursor: 'pointer' , marginRight: '10px'}} />
                        </WhatsappShareButton>
                        <EmailShareButton url={shareUrl} title={policyDetailsMessage}>
                            <img src={email} alt='whatsapp' height={50} width={50} style={{ cursor: 'pointer' , marginRight: '10px'}} />
                        </EmailShareButton>
                        <RedditShareButton url={shareUrl} title={policyDetailsMessage}>
                            <img src={reddit} alt='whatsapp' height={50} width={50} style={{ cursor: 'pointer' , marginRight: '10px'}} />
                        </RedditShareButton>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default PolicyDetail;
