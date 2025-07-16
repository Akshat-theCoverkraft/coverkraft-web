import React, { useState, useEffect } from 'react'
import Navbar from '../../component/Navbar'
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Footer from '../../Landing/component/Footer';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box';
import CustomInput from '../../component/CustomInput';
import Button from '../../component/Button';
import { useLocation } from 'react-router-dom';
import Vault from '../Vault';
import { useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../ServiceModule/Service';
import { saveDocument } from '../../store/action/action';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


//function for progress bar start
function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};

const AddPolicy = () => {
    //Get the data from ocrExtract data API using props
    const location = useLocation();
    const responseData = location.state?.responseData;
    const mode = location.state?.mode;

    // Now you can use the responseData and mode in your component
    let headingText;
    if (mode === 'add') {
        headingText = 'Add Policy';
    } else if (mode === 'edit') {
        headingText = 'Edit Policy';
    } else {
        headingText = 'Unknown Mode';
    }
    const ocrTextObject = JSON.parse(responseData.ocrText);
    const PolicyType = ocrTextObject.policyType.toLowerCase();


    //useState
    const [policyNumber, setPolicyNumber] = useState(ocrTextObject.policyNumber);
    const [registrationNumber, setRegistrationNumber] = useState(ocrTextObject.registrationNumber);
    const [startDate, setStartDate] = useState(dayjs(ocrTextObject.policyStartDate).format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs(ocrTextObject.policyEndDate).format('YYYY-MM-DD'));
    const [insuredName, setInsuredName] = useState(ocrTextObject.insuredName);
    const [netPremium, setNetPremium] = useState(ocrTextObject.netPremium);
    const [ncb, setNcb] = useState(ocrTextObject.ncpPercentage);
    const [tpPremium, setTpPremium] = useState(ocrTextObject.tpPremium);
    const [totalPremium, setTotalPremium] = useState(ocrTextObject.totalPremium);
    const [engineCC, setEngineCC] = useState(ocrTextObject.vechileEngineNumber);
    const [registrationYear, setRegistrationYear] = useState(ocrTextObject.registrationYear);
    const [idv, setIdv] = useState(ocrTextObject.idv);
    const [model, setModel] = useState(ocrTextObject.make_Model);
    const [assetType, setAssetType] = useState(ocrTextObject.assetType);
    const [odPremium, setOdPremium] = useState(ocrTextObject.odPremium);
    const [insuranceCompany, setInsuranceCompany] = useState(ocrTextObject.insuranceCompany);
    const [terminalIllness, setTerminalIllness] = useState(ocrTextObject.terminalIllness);
    const [hospitalCare, setHospitalCare] = useState(ocrTextObject.hospitalCare);
    const [waiverPremium, setWaiverPremium] = useState(ocrTextObject.waiverOfPremium);
    const [disability, setDisability] = useState(ocrTextObject.accidentalIllness);
    const [illness, setIllness] = useState(ocrTextObject.criticalIllness);
    const [pa, setPa] = useState(ocrTextObject.pa);
    const [type, setType] = useState(ocrTextObject.type)
    const [dayRenewal, setDayRenewal] = useState(ocrTextObject.dayRenewal);
    const [maturityDate, setMaturityDate] = useState(ocrTextObject.maturityDate);
    const [sumInsured, setSumInsured] = useState(ocrTextObject.sumInsured);
    const [vehicleType, setVehicleType] = useState(ocrTextObject.vehicleType);
    const [dob, setDob] = useState(dayjs(ocrTextObject.dob).format('YYYY-MM-DD'));
    const [premiumPaid, setPremiumPaid] = useState(ocrTextObject.premiumPaid);
    const [renewalDate, setRenewalDate] = useState(dayjs(ocrTextObject.policyRenewalDate).format('YYYY-MM-DD'));
    const [policyName, setPolicyName] = useState(ocrTextObject.policyName);
    const [others, setOthers] = useState(ocrTextObject.others);
    const [totalSumInsured, setTotalSumInsured] = useState(ocrTextObject.totalSumInsured);
    // const [registration, setregistration] = useState(ocrTextObject.registration);
    const [registration, setRegistration] = useState(ocrTextObject.registration);
const commonItemStyle = { maxWidth: 900, width: "100%", paddingLeft: "10px !important" };
  const commonInputStyle = { height: 48, fontSize: "1.222rem", borderRadius: 42, paddingLeft: "20px", width: "100%", color: "white" , borderColor: "grey"};

    const [consumables, setConsumables] = useState(ocrTextObject.consumables);
    const [coPayment, setCoPayment] = useState(ocrTextObject.coPayment);
    const [filledFields, setFilledFields] = useState(0);
    const [totalFields, setTotalFields] = useState(0);
    const [progress, setProgress] = useState(0);
    const [previous, setPrevious] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //useEffect
    useEffect(() => {

        const nonNullFields = Object.values(ocrTextObject).filter(value => value !== null);
        setFilledFields(nonNullFields.length);

        let total = 0;
        if (PolicyType === 'health' || PolicyType === 'other_health') {
            total = 17;
        } else if (PolicyType === 'car_policy' || PolicyType === 'bike_policy' || PolicyType === 'other_vehicle') {
            total = 17;
        } else {
            total = 19;
        }
        setTotalFields(total);
    }, [responseData]);


    // Update progress percentage when filledFields or totalFields change
    useEffect(() => {
        const percentage = Math.min((filledFields / totalFields) * 100, 100);

        setProgress(percentage);
    }, [filledFields, totalFields]);

    // Update filledFields when any input field is changed start
    const handleInputChange = (e) => {
        let { name, value } = e.target;

        if (typeof value === 'string' || typeof value === 'number') {
            value = value.trim();
        }


        if (name === 'dob' || name === 'startDate' || name === 'endDate') {
            const formattedDate = moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD');
            if (moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
                value = formattedDate;
            } else {
                console.error(`Invalid date format for ${name}: ${value}`);
                // Handle the invalid date case (e.g., set to empty string or show an error)
                value = ''; // Or handle it appropriately
            }
        }
        // Update state for the specific input field
        switch (name) {
            case 'policyNumber':
                setPolicyNumber(value);
                break;
            case 'registrationNumber':
                setRegistrationNumber(value);
                break;
            case 'startDate':
                setStartDate(value);
                break;
            case 'endDate':
                setEndDate(value);
                break;
            case 'insuredName':
                setInsuredName(value);
                break;
            case 'netPremium':
                setNetPremium(value);
                break;
            case 'tpPremium':
                setTpPremium(value);
                break;
            case 'totalPremium':
                setTotalPremium(value);
                break;
            case 'engineCC':
                setEngineCC(value);
                break;
            case 'registrationYear':
                setRegistrationYear(value);
                break;
            case 'idv':
                setIdv(value);
                break;
            case 'model':
                setModel(value);
                break;
            case 'assetType':
                setAssetType(value);
                break;
            case 'odPremium':
                setOdPremium(value);
                break;
            case 'insuranceCompany':
                setInsuranceCompany(value);
                break;
            case 'terminalIllness':
                setTerminalIllness(value);
                break;
            case 'hospitalCare':
                setHospitalCare(value);
                break;
            case 'waiverPremium':
                setWaiverPremium(value);
                break;
            case 'disability':
                setDisability(value);
                break;
            case 'illness':
                setIllness(value);
                break;
            case 'pa':
                setPa(value);
                break;
            case 'type':
                setType(value);
                break;
            case 'dayRenewal':
                setDayRenewal(value);
                break;
            case 'maturityDate':
                setMaturityDate(value);
                break;
            case 'sumInsured':
                setSumInsured(value);
                break;
            case 'vehicleType':
                setVehicleType(value);
                break;
            case 'dob':
                setDob(value);
                break;
            case 'premiumPaid':
                setPremiumPaid(value);
                break;
            case 'renewalDate':
                setRenewalDate(value);
                break;
            case 'policyName':
                setPolicyName(value);
                break;
            case 'others':
                setOthers(value);
                break;
            case 'totalSumInsured':
                setTotalSumInsured(value);
                break;
            case 'registration':
                setRegistration(value);
                break;
            case 'consumables':
                setConsumables(value);
                break;
            case 'coPayment':
                setCoPayment(value);
                break;
            case 'ncb':
                setNcb(value);
                break;
            // Add cases for other input fields
            default:
                break;
        }


        // Check if the input field is filled
        // const isFilled = value.trim().length === 1;
        const isFilled = typeof value === 'string' || value === 'number' ? value.length === 1 : value !== '';
        // setPrevious(value.trim().length > 0);
        setPrevious(value.length > 0);
        setFilledFields((prevCount) => {
            if (isFilled) {

                return prevCount + 1;
            } else if (value.trim() === '') {

                return Math.max(prevCount - 1, 0);
            } else {

                return prevCount;
            }
        });

    };
    // Update filledFields when any input field is changed end

    //save api for health insurance form 
    const handleHealthInsurance = () => {
        const userId = sessionStorage.getItem('userId');
        const documentId = sessionStorage.getItem('documentId');
        // if (
        //     userId &&
        //     documentId &&
        //     PolicyType &&
        //     dob &&
        //     policyNumber && policyName && startDate && endDate && insuredName && sumInsured && insuranceCompany && totalSumInsured &&
        //     type && idv && netPremium && totalPremium && premiumPaid && registration && consumables && coPayment
        // ) {
        const formData = new FormData();

        formData.append('userId', userId);
        formData.append('documentId', documentId);
        formData.append('policyType', PolicyType);
        formData.append('dob', dob);
        formData.append('policyNumber', policyNumber);
        formData.append('policyName', policyName);
        formData.append('policyStartDate', startDate);
        formData.append('policyEndDate', endDate);
        formData.append('insuredName', insuredName);
        formData.append('sumInsured', sumInsured);
        formData.append('insuranceCompany', insuranceCompany);
        formData.append('totalSumInsured', totalSumInsured);
        formData.append('type', type);
        formData.append('idv', idv);
        formData.append('netPremium', netPremium);
        formData.append('totalPremium', totalPremium);
        formData.append('premiumPaid', premiumPaid);
        formData.append('registration', registration);
        formData.append('consumables', consumables);
        formData.append('coPayment', coPayment);
        dispatch(saveDocument(API_URL, formData));
        navigate('/vault')
        // }
        // else {
        //     toast.error("Please fill all required fields", {
        //         position: "top-center",
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //     });
        // }
    }

    //save api for life insurance
    const handleLifeInsurance = () => {
        const userId = sessionStorage.getItem('userId');
        const documentId = sessionStorage.getItem('documentId');
        // if (
        //     userId &&
        //     documentId &&
        //     PolicyType &&
        //     startDate &&
        //     renewalDate && policyName && maturityDate && insuredName && dayRenewal && insuranceCompany && dob &&
        //     sumInsured && others && type && pa && netPremium && totalPremium && illness && disability &&
        //     waiverPremium && hospitalCare && terminalIllness
        // ) {
        const formData = new FormData();

        formData.append('userId', userId);
        formData.append('documentId', documentId);
        formData.append('policyType', PolicyType);
        formData.append('policyName', policyName);
        formData.append('policyStartDate', startDate);
        formData.append('renewalDate', renewalDate);
        formData.append('insuredName', insuredName);
        formData.append('maturityDate', maturityDate);
        formData.append('dayRenewal', dayRenewal);
        formData.append('dob', dob);
        formData.append('insuranceCompany', insuranceCompany);
        formData.append('sumInsured', sumInsured);
        formData.append('others', others);
        formData.append('type', type);
        formData.append('pa', pa);
        formData.append('netPremium', netPremium);
        formData.append('totalPremium', totalPremium);
        formData.append('criticalIllness', illness);
        formData.append('accidentalIllness', disability);
        formData.append('waiverOfPremium', waiverPremium);
        formData.append('hospitalCare', hospitalCare);
        formData.append('terminalIllness', terminalIllness);
        dispatch(saveDocument(API_URL, formData))
        navigate('/vault')
        // } else {
        //     toast.error("Please fill all required fields", {
        //         position: "top-center",
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //     });
        // }
    }

    //save api for motor insurance
    const handleMotorInsurance = () => {
        const userId = sessionStorage.getItem('userId');
        const documentId = sessionStorage.getItem('documentId');
        // if (
        //     userId &&
        //     documentId &&
        //     PolicyType &&
        //     startDate &&
        //     endDate && policyNumber && ncb && insuredName && tpPremium && insuranceCompany && odPremium &&
        //     assetType && model && registrationYear && registrationNumber && netPremium && totalPremium && engineCC && idv &&
        //     vehicleType
        // ) {
        const formData = new FormData();

        formData.append('userId', userId);
        formData.append('documentId', documentId);
        formData.append('policyType', PolicyType);
        formData.append('policyNumber', policyNumber);
        formData.append('policyStartDate', startDate);
        formData.append('policyEndDate', endDate);
        formData.append('insuredName', insuredName);
        formData.append('netPremium', netPremium);
        formData.append('ncpPercentage', ncb);
        formData.append('tpPremium', tpPremium);
        formData.append('odPremium', odPremium);
        formData.append('totalPremium', totalPremium);
        formData.append('insuranceCompany', insuranceCompany);
        formData.append('assetType', assetType);
        formData.append('make_Model', model);
        formData.append('registrationYear', registrationYear);
        formData.append('registrationNumber', registrationNumber);
        formData.append('vechileEngineNumber', engineCC);
        formData.append('idv', idv);
        formData.append('vehicleType', vehicleType);

        dispatch(saveDocument(API_URL, formData))
        navigate('/vault')
        // } else {

        //     toast.error("Please fill all required fields", {
        //         position: "top-center",
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //     });
        // }

        // if (mode === 'add') {
        //     dispatch(saveDocument(API_URL, formData));
        // } else if (mode === 'edit') {
        //     dispatch(updateDocument(API_URL, formData)); 
        // }
    }


    return (
        <div>
            <Navbar />
            <ToastContainer />
            <Grid container justifyContent="center" alignItems='center' sx={{ backgroundColor: '#F9F9F9' }}>
                <Grid item xs={12} sm={10} md={8}>
                    <Card className='border  my-4' style={{ padding: '40px 90px', boxShadow: ' rgba(17, 17, 26, 0.1) 0px 0px 16px', borderRadius: '20px' }}>
                        <div className='d-flex justify-content-between'>
                            <Typography variant="h4" component="h2" className='fw-bold'>{headingText}</Typography>
                            <CircularProgressWithLabel value={progress} />
                        </div>
                        <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}> Details</p>
                        <div>
                            {PolicyType === 'car_policy' || PolicyType === 'bike_policy' || PolicyType === 'other_vehicle' ? (

                                <>
                                    {/* motor insurance */}
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={6}>
                                            <CustomInput
                                                type="text"
                                                label="Policy Number"
                                                // placeholder="policy number"
                                                value={policyNumber}
                                                onChange={(e) => {
                                                    setPolicyNumber(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />

                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    {/* <CustomInput
                                                        type="date"
                                                        label=" Start Date"
                                                        value={startDate}
                                                        onChange={(e) => {
                                                            setStartDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    /> */}
                                                    <label className="form-label fw-bold" htmlFor="inputField">
                                                        Start date <span className='text-danger'>*</span>
                                                    </label>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>
                                                            <DatePicker

                                                                defaultValue={dayjs(startDate)}
                                                                selected={startDate}
                                                                onChange={(newValue) => {
                                                                    setStartDate(newValue); // Set the new date directly
                                                                    handleInputChange({ target: { name: 'startDate', value: newValue } });
                                                                }}
                                                                selectsStart
                                                                startDate={startDate}
                                                                placeholderText="MM/DD/YYYY"
                                                                style={{ width: '100%' }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    {/* <CustomInput
                                                        type="text"
                                                        label=" End Date"
                                                        value={endDate}
                                                        onChange={(e) => {
                                                            setEndDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    /> */}
                                                    <label className="form-label fw-bold" htmlFor="inputField">
                                                        End date <span className='text-danger'>*</span>
                                                    </label>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>
                                                            <DatePicker
                                                                defaultValue={dayjs(endDate)}
                                                                selected={endDate}
                                                                onChange={(newValue) => {
                                                                    setEndDate(newValue); // Set the new date directly
                                                                    handleInputChange({ target: { name: 'endDate', value: newValue } });
                                                                }}
                                                                selectsStart
                                                                startDate={endDate}
                                                                placeholderText="MM/DD/YYYY"
                                                                style={{ width: '100%' }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            <CustomInput
                                                type="text"
                                                label="Insured Name"
                                                value={insuredName}
                                                onChange={(e) => {
                                                    setInsuredName(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                                      inputStyle={commonInputStyle}

                                            />
                                            <CustomInput
                                                type="number"
                                                label="Net Premium"
                                                value={netPremium}
                                                onChange={(e) => {
                                                    setNetPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                                      inputStyle={commonInputStyle}

                                            />
                                            <CustomInput
                                                type="number"
                                                label="NCB %"
                                                value={ncb}
                                                onChange={(e) => {
                                                    setNcb(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="TP Premium"
                                                value={tpPremium}
                                                onChange={(e) => {
                                                    setTpPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="OD Premium"
                                                value={odPremium}
                                                onChange={(e) => {
                                                    setOdPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Total Premium"
                                                value={totalPremium}
                                                onChange={(e) => {
                                                    setTotalPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <Button
                                                text='Save'
                                                size="lg"
                                                block={true}
                                                onClick={handleMotorInsurance}

                                            />


                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {/* <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}>Vehicle Details</p> */}

                                            <CustomInput
                                                type="text"
                                                label="Insurance Company"
                                                value={insuranceCompany}
                                                onChange={(e) => {
                                                    setInsuranceCompany(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Asset Type"
                                                value={assetType}
                                                onChange={(e) => {
                                                    setAssetType(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Make / Model"
                                                value={model}
                                                onChange={(e) => {
                                                    setModel(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Registration Year"
                                                value={registrationYear}
                                                onChange={(e) => {
                                                    setRegistrationYear(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Registration Number"
                                                value={registrationNumber}
                                                onChange={(e) => {
                                                    setRegistrationNumber(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Engine CC"
                                                value={engineCC}
                                                onChange={(e) => {
                                                    setEngineCC(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="IDV"
                                                value={idv}
                                                onChange={(e) => {
                                                    setIdv(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Vehicle Type"
                                                value={vehicleType}
                                                onChange={(e) => {
                                                    setVehicleType(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />



                                        </Grid>
                                    </Grid>
                                </>
                            ) : PolicyType === 'health' || PolicyType === 'other_health' ? (
                                // Render health insurance form fields
                                <>
                                    {/* health insurance */}
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={6}>
                                            <CustomInput
                                                type="text"
                                                label="Policy Number"
                                                // placeholder="policy number"
                                                value={policyNumber}
                                                onChange={(e) => {
                                                    setPolicyNumber(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            {/* <CustomInput
                                                type="date"
                                                label=" DOB"
                                                value={dob}
                                                onChange={(e) => {
                                                    setDob(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}<label className="form-label fw-bold" htmlFor="inputField">
                                                DOB <span className='text-danger'>*</span>
                                            </label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        defaultValue={dayjs(dob)}
                                                        selected={dob}
                                                        onChange={(newValue) => {
                                                            setDob(newValue); // Set the new date directly
                                                            handleInputChange({ target: { name: 'dob', value: newValue } });
                                                        }}
                                                        selectsStart
                                                        startDate={dob}
                                                        placeholderText="MM/DD/YYYY"
                                                        style={{ width: '100%' }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                            <Grid container spacing={3} className='mt-2'>
                                                <Grid item xs={12} md={6}>
                                                    {/* <CustomInput
                                                        type="date"
                                                        label=" Start Date"
                                                        value={startDate}
                                                        onChange={(e) => {
                                                            setStartDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    /> */}
                                                    <label className="form-label fw-bold" htmlFor="inputField">
                                                        Start date <span className='text-danger'>*</span>
                                                    </label>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>
                                                            <DatePicker
                                                                defaultValue={dayjs(startDate)}
                                                                selected={startDate}
                                                                onChange={(newValue) => {
                                                                    setStartDate(newValue); // Set the new date directly
                                                                    handleInputChange({ target: { name: 'startDate', value: newValue } });
                                                                }}
                                                                selectsStart
                                                                startDate={startDate}
                                                                placeholderText="MM/DD/YYYY"
                                                                style={{ width: '100%' }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    {/* <CustomInput
                                                        type="date"
                                                        label=" End Date"
                                                        value={endDate}
                                                        onChange={(e) => {
                                                            setEndDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    /> */}
                                                    <label className="form-label fw-bold" htmlFor="inputField">
                                                        End date <span className='text-danger'>*</span>
                                                    </label>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>
                                                            <DatePicker
                                                                defaultValue={dayjs(endDate)}
                                                                selected={endDate}
                                                                onChange={(newValue) => {
                                                                    setEndDate(newValue); // Set the new date directly
                                                                    handleInputChange({ target: { name: 'endDate', value: newValue } });
                                                                }}
                                                                selectsStart
                                                                startDate={endDate}
                                                                placeholderText="MM/DD/YYYY"
                                                                style={{ width: '100%' }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            <CustomInput
                                                type="text"
                                                label="Insured Name"
                                                value={insuredName}
                                                onChange={(e) => {
                                                    setInsuredName(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Insurance Company"
                                                value={insuranceCompany}
                                                onChange={(e) => {
                                                    setInsuranceCompany(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Policy Name"
                                                value={policyName}
                                                onChange={(e) => {
                                                    setPolicyName(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Sum Insured"
                                                value={sumInsured}
                                                onChange={(e) => {
                                                    setSumInsured(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Total Sum Insured"
                                                value={totalSumInsured}
                                                onChange={(e) => {
                                                    setTotalSumInsured(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />

                                            <Button
                                                text='Save'
                                                size="lg"
                                                block={true}
                                                onClick={handleHealthInsurance}

                                            />

                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {/* <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}>Vehicle Details</p> */}


                                            <CustomInput
                                                type="text"
                                                label="Type"
                                                value={type}
                                                onChange={(e) => {
                                                    setType(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />


                                            <CustomInput
                                                type="number"
                                                label="IDV"
                                                value={idv}
                                                onChange={(e) => {
                                                    setIdv(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Net Premium"
                                                value={netPremium}
                                                onChange={(e) => {
                                                    setNetPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Total Premium"
                                                value={totalPremium}
                                                onChange={(e) => {
                                                    setTotalPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label=" Premium  Paid"
                                                value={premiumPaid}
                                                onChange={(e) => {
                                                    setPremiumPaid(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            {/* <CustomInput
                                                type="text"
                                                label="registration"
                                                value={registration}
                                                onChange={(e) => {
                                                    setregistration(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}

                                            {/* <CustomInput
                                                type="text" // Change to 'select' for dropdown
                                                label="registration"
                                                name="registration" // Add name attribute to identify the input
                                                value={registration} // Convert boolean to string for select value
                                                onChange={handleInputChange} // Use custom handler for dropdown
                                                required
                                            >
                                                <option value="true">True</option>
                                                <option value="false">False</option>
                                            </CustomInput> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Registration <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={registration}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setRegistration(booleanValue);
                                                            handleInputChange({ target: { name: 'registration', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            {/* <CustomInput
                                                type="text"
                                                label="Consumables"
                                                value={consumables}
                                                onChange={(e) => {
                                                    setConsumables(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Consumables <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={consumables}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setConsumables(booleanValue);
                                                            handleInputChange({ target: { name: 'consumables', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            {/* <CustomInput
                                                type="text"
                                                label="Co-Payment"
                                                value={coPayment}
                                                onChange={(e) => {
                                                    setCoPayment(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Co Payment <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={coPayment}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setCoPayment(booleanValue);
                                                            handleInputChange({ target: { name: 'coPayment', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </>
                            ) : PolicyType === 'life' || PolicyType === 'accident' ? (
                                // Render life insurance form fields
                                <>
                                    {/* life insurance */}
                                    <Grid container spacing={6}>
                                        <Grid item xs={12} md={6}>

                                            <CustomInput
                                                type="text"
                                                label=" Policy Name"
                                                value={policyName}
                                                onChange={(e) => {
                                                    setPolicyName(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    {/* <CustomInput
                                                        type="date"
                                                        label=" Start Date"
                                                        value={startDate}
                                                        onChange={(e) => {
                                                            setStartDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    /> */}
                                                    <label className="form-label fw-bold" htmlFor="inputField">
                                                        Start date <span className='text-danger'>*</span>
                                                    </label>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>
                                                            <DatePicker
                                                                defaultValue={dayjs(startDate)}
                                                                selected={startDate}
                                                                onChange={(newValue) => {
                                                                    setStartDate(newValue); // Set the new date directly
                                                                    handleInputChange({ target: { name: 'startDate', value: newValue } });
                                                                }}
                                                                selectsStart
                                                                startDate={startDate}
                                                                placeholderText="MM/DD/YYYY"
                                                                style={{ width: '100%' }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    {/* <CustomInput
                                                        type="date"
                                                        label=" Renewal Date"
                                                        value={renewalDate}
                                                        onChange={(e) => {
                                                            setRenewalDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    /> */}
                                                    <label className="form-label fw-bold" htmlFor="inputField">
                                                        Renewal date <span className='text-danger'>*</span>
                                                    </label>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>
                                                            <DatePicker
                                                                defaultValue={dayjs(renewalDate)}
                                                                selected={renewalDate}
                                                                onChange={(newValue) => {
                                                                    setRenewalDate(newValue); // Set the new date directly
                                                                    handleInputChange({ target: { name: 'renewalDate', value: newValue } });
                                                                }}
                                                                selectsStart
                                                                startDate={renewalDate}
                                                                placeholderText="MM/DD/YYYY"
                                                                style={{ width: '100%' }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            {/* <CustomInput
                                                type="date"
                                                label=" Maturity Date"
                                                value={maturityDate}
                                                onChange={(e) => {
                                                    setMaturityDate(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Maturity date <span className='text-danger'>*</span>
                                            </label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        defaultValue={dayjs(maturityDate)}
                                                        selected={maturityDate}
                                                        onChange={(newValue) => {
                                                            setMaturityDate(newValue); // Set the new date directly
                                                            handleInputChange({ target: { name: 'maturityDate', value: newValue } });
                                                        }}
                                                        selectsStart
                                                        startDate={maturityDate}
                                                        placeholderText="MM/DD/YYYY"
                                                        style={{ width: '100%' }}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                            <CustomInput
                                                type="text"
                                                label="  Days to Renewal"
                                                value={dayRenewal}
                                                onChange={(e) => {
                                                    setDayRenewal(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Insured Name"
                                                value={insuredName}
                                                onChange={(e) => {
                                                    setInsuredName(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Insurance Company"
                                                value={insuranceCompany}
                                                onChange={(e) => {
                                                    setInsuranceCompany(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            {/* <CustomInput
                                                type="date"
                                                label="Dob"
                                                value={dob}
                                                onChange={(e) => {
                                                    setDob(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                DOB <span className='text-danger'>*</span>
                                            </label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']}>
                                                    <DatePicker
                                                        defaultValue={dayjs(dob)}
                                                        selected={dob}
                                                        onChange={(newValue) => {
                                                            setDob(newValue); // Set the new date directly
                                                            handleInputChange({ target: { name: 'dob', value: newValue } });
                                                        }}
                                                        selectsStart
                                                        startDate={dob}
                                                        placeholderText="MM/DD/YYYY"
                                                        style={{ width: '100%' }}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                            <CustomInput
                                                type="number"
                                                label="Sum Insured"
                                                value={sumInsured}
                                                onChange={(e) => {
                                                    setSumInsured(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />

                                            <CustomInput
                                                type="text"
                                                label="Others"
                                                value={others}
                                                onChange={(e) => {
                                                    setOthers(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <Button
                                                text='Save'
                                                size="lg"
                                                block={true}
                                                onClick={handleLifeInsurance}
                                            />

                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {/* <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}>Vehicle Details</p> */}


                                            <CustomInput
                                                type="text"
                                                label="Type"
                                                value={type}
                                                onChange={(e) => {
                                                    setType(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />


                                            {/* <CustomInput
                                                type="text"
                                                label="PA"
                                                value={pa}
                                                onChange={(e) => {
                                                    setPa(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                PA <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={pa}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setPa(pa);
                                                            handleInputChange({ target: { name: 'pa', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <CustomInput
                                                type="number"
                                                label="Net Premium"
                                                value={netPremium}
                                                onChange={(e) => {
                                                    setNetPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Total Premium"
                                                value={totalPremium}
                                                onChange={(e) => {
                                                    setTotalPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                      inputStyle={commonInputStyle}

                                                required
                                            />
                                            {/* <CustomInput
                                                type="text"
                                                label="Critical Illness"
                                                value={illness}
                                                onChange={(e) => {
                                                    setIllness(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Critical Illness <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={illness}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setIllness(illness);
                                                            handleInputChange({ target: { name: 'illness', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            {/* <CustomInput
                                                type="text"
                                                label="Accidental Disability"
                                                value={disability}
                                                onChange={(e) => {
                                                    setDisability(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Accidental Illness <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={disability}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setDisability(disability);
                                                            handleInputChange({ target: { name: 'disability', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            {/* <CustomInput
                                                type="text"
                                                label="Waiver of Premium"
                                                value={waiverPremium}
                                                onChange={(e) => {
                                                    setWaiverPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Waiver of premium <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={waiverPremium}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setWaiverPremium(booleanValue);
                                                            handleInputChange({ target: { name: 'waiverPremium', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            {/* <CustomInput
                                                type="text"
                                                label="Hospital Care"
                                                value={hospitalCare}
                                                onChange={(e) => {
                                                    setHospitalCare(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Hospital Care <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={hospitalCare}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setHospitalCare(booleanValue);
                                                            handleInputChange({ target: { name: 'hospitalCare', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            {/* <CustomInput
                                                type="text"
                                                label="Terminal Illness"
                                                value={terminalIllness}
                                                onChange={(e) => {
                                                    setTerminalIllness(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            /> */}
                                            <label className="form-label fw-bold" htmlFor="inputField">
                                                Terminal Illness <span className='text-danger'>*</span>
                                            </label>
                                            <Box sx={{ minWidth: 120, mb: 2 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={terminalIllness}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            const booleanValue = value === 'true';
                                                            setTerminalIllness(booleanValue);
                                                            handleInputChange({ target: { name: 'terminalIllness', value: booleanValue } });
                                                        }}
                                                    >
                                                        <MenuItem value={'true'}>True</MenuItem>
                                                        <MenuItem value={'false'}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>

                                        </Grid>
                                    </Grid>
                                </>
                            ) : (
                                <Vault />
                            )}
                        </div>
                    </Card>
                </Grid>
            </Grid>
            <Footer />
        </div >
    )
}

export default AddPolicy
