import React, { useState, useRef } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../Landing/component/Footer';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import share from '../Images/ic-share1.png'
import Button from '../component/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import AddIcon from '../Images/addIcon.png'
import PolicyTabs from './component/PolicyTabs';
import './vault.css'
import PolicyDetail from './component/PolicyDetail';
import uploadPdf from '../Images/uploadPdf.png';
import uploadImg from '../Images/uploadImg.png';
import { extractData } from '../store/action/action';
import API_URL from '../ServiceModule/Service';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';
import axios from 'axios'
import IMAGE_PATH from '../ServiceModule/imagePath';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton, RedditShareButton } from 'react-share';
import twitter from '../Images/twiter.png';
import facebook from '../Images/fb.png';
import whatsapp from '../Images/wtsp.png';
import email from '../Images/gmial.png';
import reddit from '../Images/reddit.png'
import GradientButton from '../component/GradientButton';
//styling for breadcrumbs
const useStyles = makeStyles((theme) => ({
    separator: {
        color: '#42988E',
        fontSize: '1.6rem',
        marginBottom: '12px'
    },
    breadcrumbsContainer: {
        display: 'flex',
        alignItems: 'center',
    },
}));

//styling for dialog box
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    borderRadius: '300px',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Vault = () => {
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const inputRef = useRef();
    const imageRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedPolicyId, setSelectedPolicyId] = React.useState('');
    const [shareAllPolicy, setShareAllPolicy] = useState(false);
    const [selectedPolicies, setSelectedPolicies] = useState([]);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null)
    //function for share icon
    const handleShareIconClick = () => {
        setShareAllPolicy(prevState => !prevState);
        setShowShareDialog(false);
    };

    //function for checkbox selected for sharing card
    const handleCardClick = (policyId) => {
        console.log('what is policy id',policyId)
        setSelectedPolicyId(policyId);
        localStorage.setItem('selectedPolicyId', policyId);
    };
    console.log('selectedpolicyid',selectedPolicyId)
    //function for share dialog
    const toggleShareDialog = () => {
        setShowShareDialog(!showShareDialog);
        console.log('dialog of share', showShareDialog)
    };

    //add policy dialog box open and close function start
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    //add policy dialog box open and close function end


    //confirm box open and close function start
    const handleConfirmDialogOpen = () => {
        setConfirmDialogOpen(true);
        setOpen(false);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
    };
    //confirm box open and close function end


    //upload pdf handle function start
    const handleFile = (e) => {
        setFiles(e.target.files);
        setConfirmDialogOpen(true);
    }
    //upload pdf handle function end


    //upload image handle function start
    const handleImage = (e) => {
        setImage(e.target.files);
        setConfirmDialogOpen(true);
    }
    //upload image handle function end


    //function to handle ocr data extraction API start
    const handleConfirm = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('ocrText', files[i]);
            }
        } else if (image) {
            for (let i = 0; i < image.length; i++) {
                formData.append('ocrText', image[i]);
            }
        }
    
        setLoading(true);
        try {
            const response = await axios.post(API_URL + 'document/ocrExtractData', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setLoading(false);
            
            if (response.status === 200) {
                const responseData = response.data; // Use the response data directly here
                setResponseData(responseData);
                console.log('responsedata', responseData);
                const documentId = responseData.documentId;
                localStorage.setItem('documentId', documentId);
                const ocrTextObject = JSON.parse(responseData.ocrText);
                const PolicyType = ocrTextObject.policyType.toLowerCase();
                console.log('policyytyype', PolicyType);
                if (PolicyType === 'car_policy' || PolicyType === 'bike_policy' || PolicyType === 'other_vehicle') {
                    navigate('/coverkraft/motor-policy', { state: { responseData: ocrTextObject } });
                } else if (PolicyType === 'health' || PolicyType === 'other_health') {
                    console.log('heyy', ocrTextObject);
                    navigate('/coverkraft/health-policy', { state: { responseData: ocrTextObject } });
                } else if (PolicyType === 'life' || PolicyType === 'accident') {
                    navigate('/coverkraft/life-policy', { state: { responseData: ocrTextObject } });
                }
            } else {
                toast.error('File is not 200 status due to some issue!');
            }
        } catch (error) {
            setLoading(false);
            toast.error('File is not extracted due to some issue!');
        }
    };
    
    //function to handle ocr data extraction API start

    //handle the css on breadcrumbs
    const classes = useStyles();

    // function to handle breadcrumbs start
    function handleClick(event) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }
    // function to handle breadcrumbs end

    const handleShareClick = async () => {
        console.log('policyids---------', selectedPolicies)
        try {
            const token = localStorage.getItem('token');
            const queryParams = selectedPolicies.map(id => `_id=${id}`).join('&');



            const response = await axios.get(`${API_URL}policy/excelTable?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },


            });
            const filePath = response.data.filePath;
            console.log('file path:', IMAGE_PATH + filePath);
            setPdfUrl(IMAGE_PATH + filePath);
            console.log('pdfurl', pdfUrl)

            // const link = document.createElement('a');
            // link.href = IMAGE_PATH + filePath;
            // link.setAttribute('download', 'policies.xlsx');
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            toggleShareDialog();
        } catch (error) {
            console.error('Error fetching policy list:', error);
        }
    }

    const handleSharePdf = async () => {
        console.log('policyids---------', selectedPolicies)
        try {
            const token = localStorage.getItem('token');
            const queryParams = selectedPolicies.map(id => `_id=${id}`).join('&');



            const response = await axios.get(`${API_URL}policy/pdfTable?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },


            });
            const filePath = response.data.filePath;
            console.log('file path:', IMAGE_PATH + filePath);
            setPdfUrl(IMAGE_PATH + filePath);
            console.log('pdfurl', pdfUrl)

            // const link = document.createElement('a');
            // link.href = IMAGE_PATH + filePath;
            // link.setAttribute('download', 'policies.xlsx');
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            toggleShareDialog();
        } catch (error) {
            console.error('Error fetching policy list:', error);
        }
    }




    const handleCheckboxChange = (policyId) => {
        setSelectedPolicies(prevSelected =>
            prevSelected.includes(policyId)
                ? prevSelected.filter(id => id !== policyId)
                : [...prevSelected, policyId]
        );
    };
    console.log('selected policiedddd',selectedPolicies)
    const [policyListLength, setPolicyListLength] = useState(0);
    const [archieveList,setArchieveList]=useState(0)

    const handlePolicyListLengthChange = (length) => {
        setPolicyListLength(length);
        console.log('policylistlength',policyListLength)
    };  

    const handleArchieveListChange=(length)=>{
        setArchieveList(length);

    }
    return (
        <>

            <div className='overflow-hidden'>
                <Navbar />

                <div className='bg-color'>
                    <Stack spacing={2} className='p-5'>
                        <div className={classes.breadcrumbsContainer}>
                            <Breadcrumbs
                                separator={<span className={classes.separator}>.</span>}
                                aria-label="breadcrumb"
                            >
                                <Link key="1" className='text-decoration-none font-size text-secondary' onClick={handleClick} style={{ fontSize: '21px' }}>
                                    Vault
                                </Link>
                                <Typography className='text-dark cursor-pointer font-size' style={{ fontSize: '21px' }}>My Policies</Typography>
                            </Breadcrumbs>
                            {policyListLength > 0  && (
                                <img src={share} alt="Share Icon" height={60} className='ml-4' onClick={handleShareIconClick} style={{ cursor: 'pointer' }} />
                            )}
                             
                            <GradientButton
                                text='Add Policy'
                                size="md"
                                className='ml-4 '
                                startIcon={AddIcon}
                                onClick={handleClickOpen}
                            />
                            {shareAllPolicy && (
                                <>
                                    <Button
                                        text='Export to Excel'
                                        size="md"
                                        className='ml-4 '

                                        onClick={handleShareClick}
                                    />
                                    <Button
                                        text='Export to PDF'
                                        size="md"
                                        className='ml-4 '

                                        onClick={handleSharePdf}
                                    />
                                </>
                            )}
                        </div>
                    </Stack>
                    <Grid container spacing={-4} >
                        <Grid item xs={12} md={7} lg={7} xl={7} >
                            <PolicyTabs handleCardClick={handleCardClick} shareAllPolicy={shareAllPolicy} selectedPolicies={selectedPolicies} handleCheckboxChange={handleCheckboxChange} onPolicyListLengthChange={handlePolicyListLengthChange} onArchieveListLength={handleArchieveListChange}/>
                        </Grid>
                        <Grid item xs={12} md={5} lg={5} xl={5}>
                            <PolicyDetail policyId={selectedPolicyId} />
                        </Grid>
                    </Grid>
                </div>
                <Footer />

                {/* dialog box for add policy start */}
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    className=''
                    fullWidth
                    maxWidth='sm'
                >
                    <DialogTitle className='text-center fw-bold pt-5 fs-2' id="customized-dialog-title">
                        Add Policies
                    </DialogTitle>
                    <Typography className=' text-center px-5' style={{ color: '#616060', fontSize: '20px' }} >
                        Effortlessly upload documents, fill forms with ease.
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent className='p-5'>
                        <Card className='border mx-3' style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                            {!files ? (
                                <React.Fragment>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFile}
                                        hidden
                                        ref={inputRef}
                                    />
                                    <Card
                                        className=" p-3  cursor-pointer d-flex justify-content-center"
                                        onClick={() => inputRef.current.click()}
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            fontSize: "22px",
                                            boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px'
                                        }}
                                    >
                                        <img src={uploadPdf} alt='' height={35} className='mr-3' />
                                        <p>Upload Document</p>
                                    </Card>
                                </React.Fragment>
                            ) : (
                                Array.from(files).map((file, indx) => (
                                    <Card
                                        className="d-flex justify-content-between p-3 cursor-pointer "
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            fontSize: "22px",
                                        }}
                                        key={indx}
                                    >
                                        {file.name}
                                        <IconButton
                                            aria-label="close"
                                            onClick={() => setFiles(null)}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Card>
                                ))
                            )}
                        </Card>

                        <Card className='m-3 border' style={{ boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                            {!image ? (
                                <React.Fragment>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImage}
                                        hidden
                                        ref={imageRef}
                                    />
                                    <Card
                                        className="d-flex justify-content-center card-detail p-3  cursor-pointer"
                                        onClick={() => imageRef.current.click()}
                                        style={{

                                            fontSize: "22px",
                                            boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px'
                                        }}
                                    >
                                        <img src={uploadImg} alt='' height={40} className='mr-3' />
                                        <p>Upload Image</p>
                                    </Card>
                                </React.Fragment>
                            ) : (
                                Array.from(image).map((image, indx) => (
                                    <Card
                                        className="d-flex justify-content-between p-3 cursor-pointer "
                                        style={{
                                            backgroundColor: "white",
                                            color: "black",
                                            fontSize: "22px",
                                        }}
                                        key={indx}
                                    >
                                        {image.name}
                                        <IconButton
                                            aria-label="close"
                                            onClick={() => setImage(null)}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Card>
                                ))
                            )}
                        </Card>
                    </DialogContent>
                </BootstrapDialog>

                {/* Dialog box of confirm box start */}
                <BootstrapDialog
                    onClose={handleConfirmDialogClose}
                    aria-labelledby="confirmation-dialog-title"
                    open={confirmDialogOpen}
                    className=''
                    fullWidth
                    maxWidth='sm'
                >


                    <DialogContent className=''>
                        {loading && (
                            <div className="overlay-container">
                                <div className="fade-screen"></div>
                                <div className="loader-overlay d-flex justify-content-center">
                                    <Spinner className=" text-center" style={{ width: '3rem', height: '3rem', color: '#8AC642' }} animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>

                                </div>
                            </div>
                        )}
                        <Typography className='fw-bold text-center fs-4' variant="body1" gutterBottom>
                            Are you sure you want to proceed?
                        </Typography>

                    </DialogContent>
                    <DialogActions className='mx-5 my-3'>
                        <Button
                            text='Cancel'
                            size="md"
                            block={true}
                            onClick={handleConfirmDialogClose}

                        />
                        <Button
                            text='Confirm'
                            size="lg"
                            block={true}
                            onClick={handleConfirm}

                        />
                    </DialogActions>
                </BootstrapDialog>

                {/* dialog  box for share functionality */}
                {showShareDialog && (
                    <div style={{ position: 'absolute', top: '32%', left: '30%', transform: 'translate(-20%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', zIndex: '9999' }}>
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
        </>
    );
};

export default Vault;
