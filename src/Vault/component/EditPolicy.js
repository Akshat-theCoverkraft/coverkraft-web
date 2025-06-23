import React, { useState, useEffect } from 'react'
import Navbar from '../../component/Navbar'
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Footer from '../../Landing/component/Footer';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CustomInput from '../../component/CustomInput';
import Button from '../../component/Button';
import { useLocation } from 'react-router-dom';
import Vault from '../Vault';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../ServiceModule/Service';
import { updateDocument } from '../../store/action/action';
import { useNavigate } from 'react-router-dom'

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

const EditPolicy = () => {
    //Get the data from policydetail  API using props
    const location = useLocation();

    const { policyDetails } = location.state;
    const responseData = policyDetails[0];
    console.log("responseData", responseData)

    // const responseData = JSON.parse(responseData.ocrText);
    const PolicyType = responseData.policyType.toLowerCase();
    console.log("PolicyType", PolicyType)


    //useState
    const [policyNumber, setPolicyNumber] = useState(responseData.policyNumber);
    const [registrationNumber, setRegistrationNumber] = useState(responseData.policyDetails.registrationNumber);
    const [startDate, setStartDate] = useState(responseData.policyStartDate);
    const [endDate, setEndDate] = useState(responseData.policyEndDate);
    const [insuredName, setInsuredName] = useState(responseData.insuredName);
    const [netPremium, setNetPremium] = useState(responseData.policyDetails.netPremium);
    const [ncb, setNcb] = useState(responseData.policyDetails.ncpPercentage);
    const [tpPremium, setTpPremium] = useState(responseData.policyDetails.tpPremium);
    const [totalPremium, setTotalPremium] = useState(responseData.policyDetails.totalPremium);
    const [engineCC, setEngineCC] = useState(responseData.policyDetails.vechileEngineNumber);
    const [registrationYear, setRegistrationYear] = useState(responseData.policyDetails.registrationYear);
    const [idv, setIdv] = useState(responseData.policyDetails.idv);
    const [model, setModel] = useState(responseData.policyDetails.make_Model);
    const [assetType, setAssetType] = useState(responseData.policyDetails.assetType);
    const [odPremium, setOdPremium] = useState(responseData.policyDetails.odPremium);
    const [insuranceCompany, setInsuranceCompany] = useState(responseData.policyDetails.insuranceCompany);
    const [terminalIllness, setTerminalIllness] = useState(responseData.policyDetails.terminalIllness);
    const [hospitalCare, setHospitalCare] = useState(responseData.policyDetails.hospitalCare);
    const [waiverPremium, setWaiverPremium] = useState(responseData.policyDetails.waiverOfPremium);
    const [disability, setDisability] = useState(responseData.accidentalIllness);
    const [illness, setIllness] = useState(responseData.policyDetails.criticalIllness);
    const [pa, setPa] = useState(responseData.policyDetails.pa);
    const [type, setType] = useState(responseData.policyDetails.type)
    const [dayRenewal, setDayRenewal] = useState(responseData.policyDetails.dayRenewal);
    const [maturityDate, setMaturityDate] = useState(responseData.policyDetails.maturityDate);
    const [sumInsured, setSumInsured] = useState(responseData.policyDetails.sumInsured);
    const [vehicleType, setVehicleType] = useState(responseData.policyDetails.vehicleType);
    const [dob, setDob] = useState(responseData.policyDetails.dob);
    const [premiumPaid, setPremiumPaid] = useState(responseData.policyDetails.premiumPaid);
    const [renewalDate, setRenewalDate] = useState(responseData.policyDetails.policyRenewalDate);
    const [policyName, setPolicyName] = useState(responseData.policyDetails.policyName);
    const [others, setOthers] = useState(responseData.policyDetails.others);
    const [totalSumInsured, setTotalSumInsured] = useState(responseData.policyDetails.totalSumInsured);
    const [restoration, setRestoration] = useState(responseData.policyDetails.restoration);
    const [consumables, setConsumables] = useState(responseData.policyDetails.consumables);
    const [coPayment, setCoPayment] = useState(responseData.policyDetails.coPayment);
    const [filledFields, setFilledFields] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Update filledFields when any input field is changed start
    const handleInputChange = (e) => {
        const { name, value } = e.target;

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
            case 'restoration':
                setRestoration(value);
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
        // const isFilled = value.trim().length === 1 ;
        // setPrevious(value.trim().length > 0);
        // setFilledFields((prevCount) => {
        //     if (isFilled) {

        //         return prevCount + 1;
        //     } else if (value.trim() === '') {

        //         return Math.max(prevCount - 1, 0);
        //     } else {

        //         return prevCount;
        //     }
        // });

    };
    // Update filledFields when any input field is changed end

    //save api for health insurance form 
    const handleHealthInsurance = () => {
        const userId = localStorage.getItem('userId');
        const policyId = localStorage.getItem('selectedPolicyId');
        const documentId = localStorage.getItem('documentId');
        if (
            userId &&
            documentId &&
            PolicyType &&
            dob &&
            policyNumber && policyName && startDate && endDate && insuredName && sumInsured && insuranceCompany && totalSumInsured &&
            type && idv && netPremium && totalPremium && premiumPaid && restoration && consumables && coPayment
        ) {
            const formData = new FormData();
            formData.append('_id', policyId)
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
            formData.append('restoration', restoration);
            formData.append('consumables', consumables);
            formData.append('coPayment', coPayment);
            dispatch(updateDocument(API_URL, formData));
            navigate('/coverkraft/vault')
        }
        else {
            toast.error("Please fill all required fields", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    //save api for life insurance
    const handleLifeInsurance = () => {
        const policyId = localStorage.getItem('selectedPolicyId');
        const userId = localStorage.getItem('userId');
        const documentId = localStorage.getItem('documentId');
        if (
            userId &&
            documentId &&
            PolicyType &&
            startDate &&
            renewalDate && policyName && maturityDate && insuredName && dayRenewal && insuranceCompany && dob &&
            sumInsured && others && type && pa && netPremium && totalPremium && illness && disability &&
            waiverPremium && hospitalCare && terminalIllness
        ) {
            const formData = new FormData();
            formData.append('_id', policyId)
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
            dispatch(updateDocument(API_URL, formData))
            navigate('/coverkraft/vault')
        } else {
            toast.error("Please fill all required fields", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    //save api for motor insurance
    const handleMotorInsurance = () => {
        const policyId = localStorage.getItem('selectedPolicyId');
        const userId = localStorage.getItem('userId');
        const documentId = localStorage.getItem('documentId');
        if (
            userId &&
            documentId &&
            PolicyType &&
            startDate &&
            endDate && policyNumber && ncb && insuredName && tpPremium && insuranceCompany && odPremium &&
            assetType && model && registrationYear && registrationNumber && netPremium && totalPremium && engineCC && idv &&
            vehicleType
        ) {
            const formData = new FormData();
            formData.append('_id', policyId)
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

            dispatch(updateDocument(API_URL, formData))
            navigate('/coverkraft/vault')
        } else {

            toast.error("Please fill all required fields", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

        // if (mode === 'add') {
        //     dispatch(saveDocument(API_URL, formData));
        // } else if (mode === 'edit') {
        //     dispatch(updateDocument(API_URL, formData)); 
        // }
    }

    const handleCancel = () => {
        navigate('/coverkraft/vault')
    }

    return (
        <div>
            <Navbar />
            <Grid container justifyContent="center" alignItems='center' sx={{ backgroundColor: '#F9F9F9' }}>
                <Grid item xs={12} sm={10} md={8}>
                    <Card className='border  my-4' style={{ padding: '40px 90px', boxShadow: ' rgba(17, 17, 26, 0.1) 0px 0px 16px', borderRadius: '20px' }}>
                        <div className='d-flex justify-content-between'>
                            <Typography variant="h4" component="h2" className='fw-bold'>Edit Policy</Typography>
                            {/* <CircularProgressWithLabel value={progress} /> */}
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
                    name="policyNumber"
                    value={policyNumber}
                    onChange={(e) => {
                        setPolicyNumber(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <CustomInput
                            type="text"
                            label="Start Date"
                            name="startDate"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                handleInputChange(e);
                            }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CustomInput
                            type="text"
                            label="End Date"
                            name="endDate"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                handleInputChange(e);
                            }}
                            required
                        />
                    </Grid>
                </Grid>

                <CustomInput
                    type="text"
                    label="Insured Name"
                    name="insuredName"
                    value={insuredName}
                    onChange={(e) => {
                        setInsuredName(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="number"
                    label="Net Premium"
                    name="netPremium"
                    value={netPremium}
                    onChange={(e) => {
                        setNetPremium(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="number"
                    label="NCB %"
                    name="ncb"
                    value={ncb}
                    onChange={(e) => {
                        setNcb(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="number"
                    label="TP Premium"
                    name="tpPremium"
                    value={tpPremium}
                    onChange={(e) => {
                        setTpPremium(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="number"
                    label="OD Premium"
                    name="odPremium"
                    value={odPremium}
                    onChange={(e) => {
                        setOdPremium(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="text"
                    label="Total Premium"
                    name="totalPremium"
                    value={totalPremium}
                    onChange={(e) => {
                        setTotalPremium(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <CustomInput
                    type="text"
                    label="Insurance Company"
                    name="insuranceCompany"
                    value={insuranceCompany}
                    onChange={(e) => {
                        setInsuranceCompany(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="text"
                    label="Asset Type"
                    name="assetType"
                    value={assetType}
                    onChange={(e) => {
                        setAssetType(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="text"
                    label="Make / Model"
                    name="model"
                    value={model}
                    onChange={(e) => {
                        setModel(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="number"
                    label="Registration Year"
                    name="registrationYear"
                    value={registrationYear}
                    onChange={(e) => {
                        setRegistrationYear(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="text"
                    label="Registration Number"
                    name="registrationNumber"
                    value={registrationNumber}
                    onChange={(e) => {
                        setRegistrationNumber(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="text"
                    label="Engine CC"
                    name="engineCC"
                    value={engineCC}
                    onChange={(e) => {
                        setEngineCC(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="text"
                    label="IDV"
                    name="idv"
                    value={idv}
                    onChange={(e) => {
                        setIdv(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
                <CustomInput
                    type="text"
                    label="Vehicle Type"
                    name="vehicleType"
                    value={vehicleType}
                    onChange={(e) => {
                        setVehicleType(e.target.value);
                        handleInputChange(e);
                    }}
                    required
                />
            </Grid>
        </Grid>

        {/* Buttons placed OUTSIDE the grid container */}
        <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginTop: '30px', 
            justifyContent: 'center' 
        }}>
            <Button
                text='Update'
                size="lg"
                block={false}
                onClick={handleMotorInsurance}
                customStyle={{ minWidth: '120px' }}
            />
            <Button
                text='Cancel'
                size="lg"
                block={false}
                onClick={handleCancel}
                bgcolor="transparent"
                color="#6c757d"
                borderColor="#6c757d"
                customStyle={{
                    minWidth: '120px',
                    border: '1px solid #6c757d'
                }}
            />
        </div>
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
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label=" DOB"
                                                value={dob}
                                                onChange={(e) => {
                                                    setDob(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <CustomInput
                                                        type="text"
                                                        label=" Start Date"
                                                        value={startDate}
                                                        onChange={(e) => {
                                                            setStartDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <CustomInput
                                                        type="text"
                                                        label=" End Date"
                                                        value={endDate}
                                                        onChange={(e) => {
                                                            setEndDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    />
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
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Insurance Company"
                                                value={insuranceCompany}
                                                onChange={(e) => {
                                                    setInsuranceCompany(e.target.value);
                                                    handleInputChange(e);
                                                }}
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
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Sum Insured"
                                                value={sumInsured}
                                                onChange={(e) => {
                                                    setSumInsured(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Total Sum Insured"
                                                value={totalSumInsured}
                                                onChange={(e) => {
                                                    setTotalSumInsured(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />

                                            <Button
                                                text='Update'
                                                size="lg"
                                                block={true}
                                                onClick={handleHealthInsurance}

                                            />
                                            <Button
                                                text='Cancel'
                                                size="lg"
                                                block={true}
                                                onClick={handleCancel}

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
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Restoration"
                                                value={restoration}
                                                onChange={(e) => {
                                                    setRestoration(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Consumables"
                                                value={consumables}
                                                onChange={(e) => {
                                                    setConsumables(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Co-Payment"
                                                value={coPayment}
                                                onChange={(e) => {
                                                    setCoPayment(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
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
                                                required
                                            />
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <CustomInput
                                                        type="text"
                                                        label=" Start Date"
                                                        value={startDate}
                                                        onChange={(e) => {
                                                            setStartDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <CustomInput
                                                        type="text"
                                                        label=" Renewal Date"
                                                        value={renewalDate}
                                                        onChange={(e) => {
                                                            setRenewalDate(e.target.value);
                                                            handleInputChange(e);
                                                        }}
                                                        required
                                                    />
                                                </Grid>
                                            </Grid>
                                            <CustomInput
                                                type="text"
                                                label=" Maturity Date"
                                                value={maturityDate}
                                                onChange={(e) => {
                                                    setMaturityDate(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="  Days to Renewal"
                                                value={dayRenewal}
                                                onChange={(e) => {
                                                    setDayRenewal(e.target.value);
                                                    handleInputChange(e);
                                                }}
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
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Dob"
                                                value={dob}
                                                onChange={(e) => {
                                                    setDob(e.target.value);
                                                    handleInputChange(e);
                                                }}
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
                                                required
                                            />
                                            <Button
                                                text='Update'
                                                size="lg"
                                                block={true}
                                                onClick={handleLifeInsurance}
                                            />
                                            <Button
                                                text='Cancel'
                                                size="lg"
                                                block={true}
                                                onClick={handleCancel}

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
                                                required
                                            />


                                            <CustomInput
                                                type="text"
                                                label="PA"
                                                value={pa}
                                                onChange={(e) => {
                                                    setPa(e.target.value);
                                                    handleInputChange(e);
                                                }}
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
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Critical Illness"
                                                value={illness}
                                                onChange={(e) => {
                                                    setIllness(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Accidental Disability"
                                                value={disability}
                                                onChange={(e) => {
                                                    setDisability(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Waiver of Premium"
                                                value={waiverPremium}
                                                onChange={(e) => {
                                                    setWaiverPremium(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Hospital Care"
                                                value={hospitalCare}
                                                onChange={(e) => {
                                                    setHospitalCare(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Terminal Illness"
                                                value={terminalIllness}
                                                onChange={(e) => {
                                                    setTerminalIllness(e.target.value);
                                                    handleInputChange(e);
                                                }}
                                                required
                                            />

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
        </div>
    )
}

export default EditPolicy
