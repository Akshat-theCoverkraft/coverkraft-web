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
import share from '../Images/ic-share.png'
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
    let [color, setColor] = useState("#ffffff");
    const inputRef = useRef();
    const imageRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedPolicyId, setSelectedPolicyId] = React.useState('');

    const handleCardClick = (policyId) => {
      setSelectedPolicyId(policyId);
      localStorage.setItem('selectedPolicyId', policyId);
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
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            console.log("response", response);
            if (response.status === 200) {
                // Set response data in state
                setResponseData(response.data);
                const documentId = response.data.documentId;
                localStorage.setItem('documentId', documentId);
                console.log('documentid', documentId)
                navigate('/add-policy', { state: { responseData: response.data,mode:'add' } });

            } else {
                toast.error('File is not extracted due to some issue!')
            }
        } catch (error) {
            setLoading(false);
            toast.error('File is not extracted due to some issue!')
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
                                <Link key="1" href="/" className='text-decoration-none font-size text-secondary' onClick={handleClick} style={{ fontSize: '21px' }}>
                                    Vault
                                </Link>
                                <Typography className='text-dark cursor-pointer font-size' style={{ fontSize: '21px' }}>My Policies</Typography>
                            </Breadcrumbs>
                            <img src={share} alt="Share Icon" height={60} className='ml-4' />
                            <Button
                                text='Add Policy'
                                size="md"
                                className='ml-4 '
                                startIcon={AddIcon}
                                onClick={handleClickOpen}
                            />
                        </div>
                    </Stack>
                    <Grid container spacing={-4} >
                        <Grid item xs={12} md={7} lg={7} xl={7} >
                            <PolicyTabs handleCardClick={handleCardClick}/>
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
                                    <Spinner className="text-success text-center" style={{ width: '3rem', height: '3rem' }} animation="border" role="status">
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
            </div>
        </>
    );
};

export default Vault;
