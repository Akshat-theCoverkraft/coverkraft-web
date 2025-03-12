import React, { useEffect, useState } from 'react'
import Navbar from '../../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box';
import CustomInput from '../../component/CustomInput';
import Button from '../../component/Button';
import { useLocation } from 'react-router-dom';
import Vault from '../Vault';
import { useDispatch } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../ServiceModule/Service';
import { saveDocument, updateDocument } from '../../store/action/action';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import Footer from '../../Landing/component/Footer';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ProgressBarCircle from '../../component/ProgressBarCircle';
import DateTimePicker from '../../component/DateTimePicker';
import { formatDate } from '../../utils/dateUtils';
import axios from 'axios';
import { THEME_COLOR } from '../../constants';
const MotorPolicyForm = () => {
    const location = useLocation();
    const responseData = location.state?.responseData;
    const mode = location.state?.mode;
    const policyDetails = location.state?.policyDetails;
    console.log('responsethedata',responseData)
console.log('policydetails',policyDetails)
    // Now you can use the responseData and mode in your component
    let headingText;
    if (mode === 'edit') {
        headingText = 'Edit Policy';
    } else {
        headingText = 'Add Policy';
    }
    const PolicyType = policyDetails?.policyType.toLowerCase();
    console.log('policythe tpe',PolicyType)
    const [policyNumber, setPolicyNumber] = useState(responseData?.policyNumber || policyDetails?.policyNumber || "");
    const [policyStartDate, setPolicyStartDate] = useState(responseData?.policyStartDate || policyDetails?.policyStartDate || "");
    const [policyEndDate, setPolicyEndDate] = useState(responseData?.policyEndDate || policyDetails?.policyEndDate || "");
    const [assetType, setAssetType] = useState(responseData?.assetType || policyDetails?.policyDetails?.assetType || '')
    const [vehicleEngineNumber, setVehicleEngineNumber] = useState(responseData?.vehicleEngineNumber || policyDetails?.policyDetails?.vehicleEngineNumber || '');
    const [idv, setIdv] = useState(responseData?.idv || policyDetails?.policyDetails?.idv || '');
    const [netPremium, setNetPremium] = useState(responseData?.netPremium || policyDetails?.policyDetails?.netPremium || '');
    // const [sumAssured, setSumAssured] = useState(responseData?.sumInsured || policyDetails?.policyDetails?.sumInsured || "");
    const [premiumPaid, setPremiumPaid] = useState(responseData?.totalPremium || policyDetails?.premiumPaid || "");
    const [ncb, setNcb] = useState(responseData?.ncpPercentage || policyDetails?.policyDetails?.ncpPercentage || '');
    const [tpPremium, setTpPremium] = useState(responseData?.tpPremium || policyDetails?.policyDetails?.tpPremium || '');
    const [odPremium, setOdpremium] = useState(responseData?.odPremium || policyDetails?.policyDetails?.odPremium || '')
    const [insuredName, setInsuredName] = useState(responseData?.insuredName || policyDetails?.insuredName || "");
    const [insuredCompany, setInsuredCompany] = useState(responseData?.insuranceCompany || policyDetails?.insuredCompany || "");
    const [registrationNumber, setRegistrationNumber] = useState(responseData?.registrationNumber || policyDetails?.policyDetails?.registrationNumber || "");
    const [registrationYear, setRegistrationYear] = useState(responseData?.registrationYear || policyDetails?.policyDetails?.registrationYear || "");
    const [make, setMake] = useState(responseData?.make || policyDetails?.policyDetails?.make || "");
    const [model, setModel] = useState(responseData?.model || policyDetails?.policyDetails?.model || '');

    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('userId');
    const documentId = localStorage.getItem('documentId');
    const policyId = localStorage.getItem('policyId')

    const token = localStorage.getItem('token')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const inputFields = [
        policyNumber,
        policyStartDate,
        policyEndDate,
        premiumPaid,
        insuredName,
        insuredCompany,
        registrationNumber,
        make,
        model,
        assetType,
        vehicleEngineNumber,
        idv
    ];
    const calculateProgress = () => {
        const filledFields = inputFields.filter((field) => field !== "").length;
        const totalFields = inputFields.length;
        return (filledFields / totalFields) * 100;
    };

    const handleStartDateChange = (date) => {
        setPolicyStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setPolicyEndDate(date);
    };
    useEffect(() => {
        // Calculate progress whenever input fields change
        const progress = calculateProgress();
        // Handle progress value, you can store it in state or use directly
    }, [
        policyNumber,
        policyStartDate,
        policyEndDate,
        premiumPaid,
        insuredName,
        insuredCompany,
        registrationNumber,
        make,
        model,
        assetType,
        vehicleEngineNumber,
        idv
    ]);
    const handleSubmit = async () => {
        try {
            setLoading(true); // Set loading state to true to disable the button

            const payload = {
                policyNumber,
                policyStartDate,
                policyEndDate,
                premiumPaid,
                insuredName,
                insuredCompany,
                registrationNumber,
                make,
                model,
                assetType,
                vehicleEngineNumber,
                idv
            };

            if (validateFields(payload)) {
                if (mode === 'edit') {
                    // Make API call to update the existing policy
                    await updatePolicy(payload);
                } else {
                    // Make API call to create a new policy
                    await createPolicy(payload);
                }
            } else {
                toast.error("Please fill all required fields!");
            }
        } catch (error) {
            console.error('Failed to save policy:', error);
        } finally {
            setLoading(false); // Reset loading state to false after API call completes
        }
    };

    const validateFields = (payload) => {
        // Implement your validation logic here
        return (
            payload.policyNumber &&
            payload.policyStartDate &&
            payload.policyEndDate &&
            payload.insuredName &&
            payload.insuredCompany &&
            payload.registrationNumber &&
            payload.make &&
            payload.model &&
            payload.assetType &&
            payload.premiumPaid &&
            payload.vehicleEngineNumber &&
            payload.idv
        );
    };

    // const createPolicy = (payload) => {
    //     console.log('================')

    //     const formData = new FormData();

    //     formData.append('userId', userId);
    //     formData.append('documentId', documentId);
    //     formData.append('policyType', responseData?.policyType.toLowerCase());
    //     formData.append('policyNumber', policyNumber);
    //     formData.append('policyStartDate', policyStartDate);
    //     formData.append('policyEndDate', policyEndDate);
    //     formData.append('premiumPaid', premiumPaid);
    //     formData.append('netPremium', netPremium);
    //     formData.append('insuredName', insuredName);
    //     formData.append('insuranceCompany', insuredCompany);
    //     formData.append('registrationNumber', registrationNumber);
    //     formData.append('registrationYear', registrationYear);
    //     formData.append('assetType', assetType);
    //     formData.append('vehicleEngineNumber', vehicleEngineNumber);
    //     formData.append('make', make);
    //     formData.append('model', model);
    //     formData.append('ncpPercentage', ncb);
    //     formData.append('tpPremium', tpPremium);
    //     formData.append('odPremium', odPremium)
    //     formData.append('idv', idv);
    //     dispatch(saveDocument(API_URL, formData))
    //     .then((response) => {
    //         if (response && response.status === 200) { // Ensure the response is successful
    //             toast.success("Successfully Created");
    //             navigate('/coverkraft/vault');
    //         } else {
    //             throw new Error("Failed to create policy");
    //         }
    //     })
    //         .catch((error) => {
    //             toast.error("Error creating policy");
    //             console.log("toast", toast.error);
    //         });
    // }
    // const createPolicy = (payload) => {
    //     console.log('================')
    
    //     const formData = new FormData();
    
    //     formData.append('userId', userId);
    //     formData.append('documentId', documentId);
    //     formData.append('policyType', responseData?.policyType.toLowerCase());
    //     formData.append('policyNumber', policyNumber);
    //     formData.append('policyStartDate', policyStartDate);
    //     formData.append('policyEndDate', policyEndDate);
    //     formData.append('premiumPaid', premiumPaid);
    //     formData.append('netPremium', netPremium);
    //     formData.append('insuredName', insuredName);
    //     formData.append('insuranceCompany', insuredCompany);
    //     formData.append('registrationNumber', registrationNumber);
    //     formData.append('registrationYear', registrationYear);
    //     formData.append('assetType', assetType);
    //     formData.append('vehicleEngineNumber', vehicleEngineNumber);
    //     formData.append('make', make);
    //     formData.append('model', model);
    //     formData.append('ncpPercentage', ncb);
    //     formData.append('tpPremium', tpPremium);
    //     formData.append('odPremium', odPremium);
    //     formData.append('idv', idv);
    //     try {
    //         const response =  axios.post(`${API_URL}policy/create`, formData, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`, 
    //                 'Content-Type': 'multipart/form-data', 
    //             },
    //         });
    //         console.log('respnse bhi btaoo',response)
            
    //         if (response && response.status === 200) {

    //             toast.success("Successfully Created");
    //             navigate('/coverkraft/vault');
    //         } else {
    //             console.log('hello error',response.response.status)
    //             toast.error('Error creating policy')
    //         }
    //     } catch (error) {
    //         const errorMessage = error.response?.data?.message || "Error creating policy";
    //         toast.error(`Error: ${errorMessage}`);
    //         console.error("Error:", errorMessage);
    //     }
    // }

    const createPolicy = async (payload) => {
        console.log('================')
    
        const formData = new FormData();
    
        formData.append('userId', userId);
        formData.append('documentId', documentId);
        formData.append('policyType', responseData?.policyType.toLowerCase());
        formData.append('policyNumber', policyNumber);
        formData.append('policyStartDate', policyStartDate);
        formData.append('policyEndDate', policyEndDate);
        formData.append('premiumPaid', premiumPaid);
        formData.append('netPremium', netPremium);
        formData.append('insuredName', insuredName);
        formData.append('insuranceCompany', insuredCompany);
        formData.append('registrationNumber', registrationNumber);
        formData.append('registrationYear', registrationYear);
        formData.append('assetType', assetType);
        formData.append('vehicleEngineNumber', vehicleEngineNumber);
        formData.append('make', make);
        formData.append('model', model);
        formData.append('ncpPercentage', ncb);
        formData.append('tpPremium', tpPremium);
        formData.append('odPremium', odPremium);
        formData.append('idv', idv);
    
        try {
            const response = await axios.post(`${API_URL}policy/create`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'multipart/form-data', 
                },
            });
    
            if (response && response.status === 200) {
                toast.success("Successfully Created");
                navigate('/coverkraft/vault');
            } else {
                console.log('hello error', response.status);
                toast.error('Error creating policy');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error creating policy";
            toast.error(`Error: ${errorMessage}`);
            console.error("Error:", errorMessage);
        }
    }
    
    
    const updatePolicy = (payload) => {
        console.log('================')
        const formData = new FormData();
        formData.append('_id', policyId)
        formData.append('userId', userId);
        formData.append('documentId', documentId);
        formData.append('policyType', PolicyType);
        formData.append('policyNumber', policyNumber);
        formData.append('policyStartDate', policyStartDate);
        formData.append('policyEndDate', policyEndDate);
        formData.append('premiumPaid', premiumPaid);
        formData.append('netPremium', netPremium);
        formData.append('insuredName', insuredName);
        formData.append('insuranceCompany', insuredCompany);
        formData.append('registrationNumber', registrationNumber);
        formData.append('registrationYear', registrationYear);
        formData.append('assetType', assetType);
        formData.append('vehicleEngineNumber', vehicleEngineNumber);
        formData.append('make', make);
        formData.append('model', model);
        formData.append('ncpPercentage', ncb);
        formData.append('tpPremium', tpPremium);
        formData.append('odPremium', odPremium)
        formData.append('idv', idv);
        dispatch(updateDocument(API_URL, formData))
            .then(() => {
                toast.success("Successfully Updated");
                navigate('/coverkraft/vault')
            })
            .catch((error) => {
                toast.error("Error updating policy");
            });
    }

    return (
        <div>
            <Navbar />
            <ToastContainer />
            <Grid container justifyContent="center" alignItems='center' sx={{ backgroundColor: THEME_COLOR.BACKGROUND }}>
                <Grid item xs={12} sm={10} md={8}>
                    <Card className='my-4' style={{ padding: '40px 90px', backgroundColor: THEME_COLOR.FADE_BACKGROUND, color: THEME_COLOR.COLOR, boxShadow: ' rgba(17, 17, 26, 0.1) 0px 0px 16px', borderRadius: '20px' }}>
                        <div className='d-flex justify-content-between'>
                            <Typography variant="h4" component="h2" className='fw-bold'>{headingText}</Typography>
                            <ProgressBarCircle progress={calculateProgress()} />                        </div>
                        <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}> Details</p>
                        <div>

                            <Grid container spacing={6}>
                                <Grid item xs={12} md={6}>
                                    <CustomInput
                                        type="text"
                                        label="Policy Number"
                                        // placeholder="policy number"
                                        value={policyNumber}
                                        onChange={(e) => {
                                            setPolicyNumber(e.target.value);
                                        }}
                                        required
                                    />

                                    <Grid container spacing={3} className='mb-2'>
                                        <Grid item xs={12} md={6}>

                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Start date <span className='text-danger'>*</span>
                                            </label>
                                            <DateTimePicker
                                                height={50}
                                                isIcon={false}
                                                label="DD/MM/YYYY"
                                                value={formatDate(policyStartDate)}
                                                onChange={handleStartDateChange}
                                                className="bg-dark text-light"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>

                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                End date <span className='text-danger'>*</span>
                                            </label>
                                            <DateTimePicker
                                                height={50}
                                                isIcon={false}
                                                label="DD/MM/YYYY"
                                                value={formatDate(policyEndDate)}
                                                onChange={handleEndDateChange}
                                            />
                                        </Grid>
                                    </Grid>
                                    <CustomInput
                                        type="text"
                                        label="Insured Name"
                                        value={insuredName}
                                        onChange={(e) => {
                                            setInsuredName(e.target.value);

                                        }}
                                        required
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Insurance Company"
                                        value={insuredCompany}
                                        onChange={(e) => {
                                            setInsuredCompany(e.target.value);

                                        }}
                                        required
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Registration Number"
                                        value={registrationNumber}
                                        onChange={(e) => {
                                            setRegistrationNumber(e.target.value);

                                        }}
                                        required
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Registration Year"
                                        value={registrationYear}
                                        onChange={(e) => {
                                            setRegistrationYear(e.target.value);

                                        }}

                                    />
                                    <CustomInput
                                        type="number"
                                        label="IDV"
                                        value={idv}
                                        onChange={(e) => {
                                            setIdv(e.target.value);

                                        }}
                                        required
                                    />

                                    <CustomInput
                                        type="text"
                                        label="NCB%"
                                        value={ncb}
                                        onChange={(e) => {
                                            setNcb(e.target.value);

                                        }}

                                    />
                                    <Button
                                        text={mode === 'edit' ? 'Update' : 'Save'}
                                        size="lg"
                                        block={true}
                                        onClick={handleSubmit}

                                    />


                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {/* <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}>Vehicle Details</p> */}





                                    <CustomInput
                                        type="number"
                                        label="Net Premium"
                                        value={netPremium}
                                        onChange={(e) => {
                                            setNetPremium(e.target.value);

                                        }}

                                    />
                                    <CustomInput
                                        type="number"
                                        label="Total Premium"
                                        value={premiumPaid}
                                        onChange={(e) => {
                                            setPremiumPaid(e.target.value);
                                        }}
                                        required
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Asset type"
                                        value={assetType}
                                        onChange={(e) => {
                                            setAssetType(e.target.value);
                                        }}
                                        required
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Vehicle Engine Number"
                                        value={vehicleEngineNumber}
                                        onChange={(e) => {
                                            setVehicleEngineNumber(e.target.value);
                                        }}
                                        required

                                    />
                                    <CustomInput
                                        type="text"
                                        label="Make "
                                        value={make}
                                        onChange={(e) => {
                                            setMake(e.target.value);
                                        }}
                                        required
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Model "
                                        value={model}
                                        onChange={(e) => {
                                            setModel(e.target.value);
                                        }}
                                        required
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Tp premium"
                                        value={tpPremium}
                                        onChange={(e) => {
                                            setTpPremium(e.target.value);

                                        }}

                                    />
                                    <CustomInput
                                        type="text"
                                        label="Od Premium"
                                        value={odPremium}
                                        onChange={(e) => {
                                            setOdpremium(e.target.value);

                                        }}

                                    />

                                </Grid>
                            </Grid>


                        </div>
                    </Card>
                </Grid>
            </Grid>
            <Footer />
        </div>
    )
}

export default MotorPolicyForm
