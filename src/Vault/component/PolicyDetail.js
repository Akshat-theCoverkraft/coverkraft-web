import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '../../component/Button';
import EditIcon from '../../Images/edit.png';
import detailScooty from '../../Images/detail-scooty.png';
import Grid from '@mui/material/Grid';
import premium from '../../Images/premium.png';
import value from '../../Images/value.png';
import startDate from '../../Images/startDate.png';
// import endDate from '../../Images/endDate.png';
import dateEnd from '../../Images/endDate.png'
import redBg from '../../Images/red-img.png';
import share from '../../Images/ic-share.png';
import download from '../../Images/download.png';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton, RedditShareButton } from 'react-share';
import twitter from '../../Images/twiter.png';
import facebook from '../../Images/fb.png';
import whatsapp from '../../Images/wtsp.png';
import email from '../../Images/gmial.png';
import reddit from '../../Images/reddit.png'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import API_URL from '../../ServiceModule/Service';
import { getAllPolicyDetailById } from '../../store/action/action';
import axios from 'axios'
import emptyImage from '../../Images/ic-empty.png'
import car from '../../Images/Car.png';
const PolicyDetail = ({ policyId }) => {
    const [showShareDialog, setShowShareDialog] = useState(false);

    const navigate = useNavigate();

    const [policyDetails, setPolicyDetails] = useState([]);
    useEffect(() => {
        const fetchPolicyDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}policy/fetchFullData?_id=${policyId}`);
                setPolicyDetails(response.data);
                // setLoading(false);
            } catch (error) {
                // setError(error.message);
                // setLoading(false);
            }
        };

        if (policyId) {
            fetchPolicyDetails();
        }
    }, [policyId]);

    //share url and msg
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

    //function for share dialog
    const toggleShareDialog = () => {
        setShowShareDialog(!showShareDialog);
    };

    //function for edit button
    const handleEdit = () => {

        navigate('/add-policy');

    }

    const sharePolicyDetails = () => {
        // Share logic here
    };

    return (
        <>
            {policyDetails.length === 0 ? (
                <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <img src={emptyImage} alt="No Data" />
                    <p>Add your new policy effortlessly to your account</p>

                </Card>
            ) : (
                policyDetails.map((policy, index) => {
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
                                    <Typography variant="h5" component="h2" gutterBottom className='fw-bold pl-4'>
                                        {policy.policyDetails.make_Model || policy.insuredName}
                                    </Typography>
                                    <Typography variant="h6" component="h2" gutterBottom style={{ color: '#585858' }} className='pl-4'>{policy.registrationNumber || policy.policyNumber}</Typography>
                                    <Typography variant="h6" component="h2" gutterBottom style={{ color: '#9E9E9E' }} className='pl-4'>Expires on  {policy.policyEndDate}</Typography>
                                </div>
                                <div>
                                    <img src={policy.policyType === 'car_policy' ? car : detailScooty} alt="Policy Image" width={200} className="img-fluid rounded-start" />

                                </div>
                            </div>

                            <div style={{ position: 'relative' }}>
                                {status && (
                                    <>
                                        <div className='' style={{ position: 'absolute', top: -89, right: 0, width: '200px', height: '50px', backgroundImage: `url(${redBg})`, backgroundSize: 'cover', opacity: 1, marginTop: '50px' }}></div>
                                        <div style={{ position: 'absolute', top: -33, right: 25, color: '#ffffff', fontSize: '24px', fontWeight: 'bold', zIndex: 1 }}>{status}</div>
                                    </>
                                )}
                                <Card className='' style={{ marginTop: '130px', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                                            <div className='mr-2'>
                                                <img src={premium} height={50} alt='premium' />
                                            </div>
                                            <div>
                                                <h5 style={{ color: '#585858' }}>Premium Paid</h5>
                                                <h5 className='fw-bolder'>{policy.totalPremium}</h5>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                                            <div className='mr-2'>
                                                <img src={value} height={50} alt='value' />
                                            </div>
                                            <div>
                                                <h5 style={{ color: '#585858' }}>Value(IDV)</h5>
                                                <h5 className='fw-bolder'>{policy.idv || policy.policyDetails.sumInsured}</h5>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                                            <div className='mr-2'>
                                                <img src={startDate} height={50} alt='start date' />
                                            </div>
                                            <div>
                                                <h5 style={{ color: '#585858' }}>Policy Start Date</h5>
                                                <h5 className='fw-bolder'>{policy.policyStartDate}</h5>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                                            <div className='mr-2'>
                                                <img src={dateEnd} height={50} alt='end date' />
                                            </div>
                                            <div>
                                                <h5 style={{ color: '#585858' }}>Policy End Date</h5>
                                                <h5 className='fw-bolder'>{policy.policyEndDate}</h5>
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
                                            <img src={whatsapp} alt='whatsapp' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        </WhatsappShareButton>
                                        <EmailShareButton url={shareUrl} title={policyDetailsMessage}>
                                            <img src={email} alt='whatsapp' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        </EmailShareButton>
                                        <RedditShareButton url={shareUrl} title={policyDetailsMessage}>
                                            <img src={reddit} alt='whatsapp' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        </RedditShareButton>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );

                })
            )}
        </>
    )
}

export default PolicyDetail;
