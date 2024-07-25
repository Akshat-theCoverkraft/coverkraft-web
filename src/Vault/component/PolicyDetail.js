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
import API_URL from '../../ServiceModule/Service';
import axios from 'axios'
import emptyImage from '../../Images/ic-empty.png'
import car from '../../Images/Car.png';
import IMAGE_PATH from '../../ServiceModule/imagePath';
import moment from 'moment';
import { formatDate } from '../../utils/dateUtils';
import { updateDocument } from '../../store/action/action';
import { useDispatch } from 'react-redux'

const PolicyDetail = ({ policyId }) => {
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [policyDetails, setPolicyDetails] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //useeffect
    useEffect(() => {
        const fetchPolicyDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}policy/fetchFullData?_id=${policyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the headers
                    }
                });
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    setPolicyDetails(response.data.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                    setPolicyDetails([]);
                }

            } catch (error) {
                console.error('Error fetching policy list:', error);
                setPolicyDetails([]);
            }
        };

        if (policyId) {
            fetchPolicyDetails();
        }
    }, [policyId]);


    //function to view the pdf document
    const handleViewDocument = (documentPath) => {
        setPdfUrl(`${IMAGE_PATH}${documentPath}`);
        window.open(`${IMAGE_PATH}${documentPath}`, '_blank');
    };


    //function to download the pdf document
    const handleDownloadDocument = (documentPath) => {
        const url = `${API_URL}${documentPath}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    // If direct download fails, open the PDF in a new tab
                    window.open(url, '_blank');
                } else {
                    // If direct download is successful, initiate download
                    response.blob().then(blob => {
                        const url = window.URL.createObjectURL(new Blob([blob]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'policy_document.pdf');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                }
            })
            .catch(error => {
                console.error('Error downloading document:', error);
                // If download fails, open the PDF in a new tab
                window.open(url, '_blank');
            });
    };


    //function for share dialog
    const toggleShareDialog = () => {
        setShowShareDialog(!showShareDialog);
    };

    //function for edit button
    const handleEdit = () => {

        console.log('eheyyyyy', policyDetails[0].policyType)
        const responseData = policyDetails[0];
        const PolicyType = policyDetails[0].policyType;
        console.log('polcyytype', PolicyType)
        if (PolicyType === 'car_policy' || PolicyType === 'bike_policy' || PolicyType === 'other_vehicle') {
            navigate('/coverkraft/motor-policy', { state: { policyDetails: responseData, mode: 'edit' } })
        }
        else if (PolicyType === 'health' || PolicyType === 'other_health') {
            navigate('/coverkraft/health-policy', { state: { policyDetails: responseData, mode: 'edit' } })
        }
        else if (PolicyType === 'life' || PolicyType === 'accident') {
            navigate('/coverkraft/life-policy', { state: { policyDetails: responseData, mode: 'edit' } })
        }
        // navigate('/coverkraft/edit-policy', { state: { policyDetails: policyDetails } });
    }


    //function for share policy document
    const sharePolicyDocument = (documentPath) => {
        const url = `${IMAGE_PATH}${documentPath}`;
        setPdfUrl(url);
        toggleShareDialog();
    };

    const handleArchieve = () => {
        const formData = new FormData();
        formData.append('_id', policyId);
        formData.append('status', 'archive')
        dispatch(updateDocument(API_URL, formData))
    }

    return (
        <>
            {policyDetails.length === 0 ? (
                <Card className='rounded-4 border' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '87vh', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
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

                    const documentPath = policy.documentDetails.documentPath;

                    return (

                        <Card className='p-5 rounded-4 border' style={{ justifyContent: 'center', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>

                            <div className='d-flex justify-content-between mb-5'>
                                <Typography variant="h5" component="h2" gutterBottom className='fw-bold pl-4'>Details</Typography>
                                <Button
                                    text='Edit'
                                    size="sm"
                                    className='fw-bold'
                                    startIcon={EditIcon}
                                    onClick={handleEdit}

                                />
                            </div>

                            <div className='d-flex justify-content-between'>
                                <div>
                                    <Typography variant="h5" component="h2" gutterBottom className='fw-bold pl-4'>
                                        {policy.policyDetails.make_Model || policy.insuredName}
                                    </Typography>
                                    <Typography variant="h6" component="h2" gutterBottom style={{ color: '#585858' }} className='pl-4'>{policy.policyDetails.registrationNumber || policy.policyNumber}</Typography>
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
                                                <h5 className='fw-bolder'>{policy.premiumPaid}</h5>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                                            <div className='mr-2'>
                                                <img src={value} height={50} alt='value' />
                                            </div>
                                            <div>
                                                <h5 style={{ color: '#585858' }}>Value(IDV)</h5>
                                                <h5 className='fw-bolder'>{policy.policyDetails.idv || policy.policyDetails.sumInsured}</h5>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                                            <div className='mr-2'>
                                                <img src={startDate} height={50} alt='start date' />
                                            </div>
                                            <div>
                                                <h5 style={{ color: '#585858' }}>Policy Start Date</h5>
                                                <h5 className='fw-bolder'>{formatDate(policy.policyStartDate)}</h5>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6} className='d-flex' style={{ padding: '30px 40px' }}>
                                            <div className='mr-2'>
                                                <img src={dateEnd} height={50} alt='end date' />
                                            </div>
                                            <div>
                                                <h5 style={{ color: '#585858' }}>Policy End Date</h5>
                                                <h5 className='fw-bolder'>{formatDate(policy.policyEndDate)}</h5>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid container rowSpacing={1} className='d-flex justify-content-center' columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                                        {/* {status ? (
                                            <Grid item xs={4} md={4} style={{ padding: '30px 40px' }}>
                                                <button className='btn btn-lg' style={{ color: 'white', backgroundColor: '#42988E', padding: '10px 70px' }}>Renew</button>
                                            </Grid>
                                        ) : null} */}
                                        <Grid item xs={4} md={4} style={{ padding: '30px 40px' }}>
                                            <button className='btn btn-lg' style={{ color: 'white', backgroundColor: '#8AC642', padding: '10px 70px' }} onClick={handleArchieve}>Archieve</button>
                                        </Grid>
                                        <Grid item xs={4} md={4} style={{ padding: '30px 20px' }}>
                                            <button className={`btn btn-lg custom-color`} style={{ borderColor: '#8AC642', color: '#8AC642', padding: '10px 80px' }} onClick={() => handleViewDocument(documentPath)}>View</button>
                                        </Grid>
                                        <Grid item xs={1} md={1} style={{ padding: '30px 0px' }}>
                                            <img src={download} alt='download' height={50} onClick={() => handleDownloadDocument(documentPath)} />
                                        </Grid>
                                        <Grid item xs={2} md={2} style={{ padding: '20px 20px' }}>
                                            <button className='btn btn-lg' onClick={() => sharePolicyDocument(documentPath)}>
                                                <img src={share} alt='' height={52} />
                                            </button>
                                        </Grid>
                                    </Grid>

                                </Card>
                                {showShareDialog && (
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-20%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', zIndex: '9999' }}>
                                        <p className='fw-bold '>Share Via</p>
                                        {/* <FacebookShareButton url={shareUrl} quote={policyDetailsMessage}>
                                            <img src={facebook} alt='facebook' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        </FacebookShareButton> */}
                                        <FacebookShareButton url={pdfUrl} >
                                            <img src={facebook} alt='facebook' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        </FacebookShareButton>
                                        <TwitterShareButton url={pdfUrl}>
                                            <img src={twitter} alt='twitter' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        </TwitterShareButton>
                                        <WhatsappShareButton url={pdfUrl} >
                                            <img src={whatsapp} alt='whatsapp' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        </WhatsappShareButton>
                                        <EmailShareButton url={pdfUrl} >
                                            <img src={email} alt='whatsapp' height={50} width={50} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        </EmailShareButton>
                                        <RedditShareButton url={pdfUrl} >
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
