import React, { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import { ToastContainer, toast } from "react-toastify";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CustomInput from "../../component/CustomInput";
import Button from "../../component/Button";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../../ServiceModule/Service";
import { updateDocument } from "../../store/action/action";
import { useNavigate } from "react-router-dom";
import Footer from "../../Landing/component/Footer";
import ProgressBarCircle from "../../component/ProgressBarCircle";
import DateTimePicker from "../../component/DateTimePicker";
import { formatDate } from "../../utils/dateUtils";
import axios from "axios";
import { THEME_COLOR } from "../../constants";
import InsuranceDropdown from "../../component/InsurannceCompanyDropDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SessionExpiredModal from "../../utils/sessionExpireModal";
import GlobalDatePicker from "../../component/GlobalDatePicker";
const MotorPolicyForm = () => {
  const location = useLocation();
  const [showSessionExpired, setShowSessionExpired] = useState(false);


  const responseData = location.state?.responseData;
  const mode = location.state?.mode;
  const policyDetails = location.state?.policyDetails;
  console.log("responsethedata", responseData);
  console.log("policydetails", policyDetails);
  // Now you can use the responseData and mode in your component
  let headingText;
  if (mode === "edit") {
    headingText = "Edit Policy";
  } else {
    headingText = "Add Policy";
  }
  const PolicyType = policyDetails?.policyType.toLowerCase();
  console.log("policythe tpe", PolicyType);
  const [policyNumber, setPolicyNumber] = useState(
    responseData?.policyNumber || policyDetails?.policyNumber || ""
  );
  const [policyStartDate, setPolicyStartDate] = useState(
    responseData?.policyStartDate || policyDetails?.policyStartDate || ""
  );
  const [policyEndDate, setPolicyEndDate] = useState(
    responseData?.policyEndDate || policyDetails?.policyEndDate || ""
  );
  const [assetType, setAssetType] = useState(
    responseData?.assetType || policyDetails?.policyDetails?.assetType || ""
  );
  const [vehicleEngineNumber, setVehicleEngineNumber] = useState(
    responseData?.vehicleEngineNumber ||
    policyDetails?.policyDetails?.vehicleEngineNumber ||
    ""
  );
  const [idv, setIdv] = useState(
    responseData?.idv || policyDetails?.policyDetails?.idv || ""
  );
  const [netPremium, setNetPremium] = useState(
    responseData?.netPremium || policyDetails?.policyDetails?.netPremium || ""
  );
  // const [sumAssured, setSumAssured] = useState(responseData?.sumInsured || policyDetails?.policyDetails?.sumInsured || "");
  const [premiumPaid, setPremiumPaid] = useState(
    responseData?.totalPremium || policyDetails?.premiumPaid || ""
  );
  const [ncb, setNcb] = useState(
    responseData?.ncpPercentage ||
    policyDetails?.policyDetails?.ncpPercentage ||
    ""
  );
  const [tpPremium, setTpPremium] = useState(
    responseData?.tpPremium || policyDetails?.policyDetails?.tpPremium || ""
  );
  const [odPremium, setOdpremium] = useState(
    responseData?.odPremium || policyDetails?.policyDetails?.odPremium || ""
  );
  const [insuredName, setInsuredName] = useState(
    responseData?.insuredName || policyDetails?.insuredName || ""
  );
  const normalizeCompanyName = (name) => {
    console.log('name', name ? name.replace('.', '') : 'oo', name)
    return name ? name.replace('.', '') : "";
  };

  const [insuredCompany, setInsuredCompany] = useState(
    normalizeCompanyName(responseData?.insuredCompany) ||
    normalizeCompanyName(policyDetails?.insuredCompany) ||
    ""
  );

  const isAlphanumeric = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d -]+$/;
  const [registrationNumber, setRegistrationNumber] = useState(
    responseData?.registrationNumber ||
    policyDetails?.policyDetails?.registrationNumber ||
    ""
  );
  const [registrationYear, setRegistrationYear] = useState(
    responseData?.registrationYear ||
    policyDetails?.policyDetails?.registrationYear ||
    ""
  );
  const [make, setMake] = useState(
    responseData?.make || policyDetails?.policyDetails?.make || ""
  );
  const [model, setModel] = useState(
    responseData?.model || policyDetails?.policyDetails?.model || ""
  );
  const commonItemStyle = {
    maxWidth: 900,
    width: "100%",
    paddingLeft: "10px !important",
  };
  const commonInputStyle = {
    height: 48,
    fontSize: "1.222rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "white",
    borderColor: "grey",
  };

  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const documentId = sessionStorage.getItem("documentId");
  const policyId = sessionStorage.getItem("policyId");

  const token = sessionStorage.getItem("token");
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
    idv,
  ];
  const calculateProgress = () => {
    const filledFields = inputFields.filter((field) => field !== "").length;
    const totalFields = inputFields.length;
    return (filledFields / totalFields) * 100;
  };

  const handleStartDateChange = (date) => {
    console.log("Start date changed:", date);

    setPolicyStartDate(date);
  };
  const handleEndDateChange = (date) => {
    console.log("End date changed:", date);
    setPolicyEndDate(date);
  };
  useEffect(() => {
    const progress = calculateProgress();
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
    idv,
  ]);
  const handleSubmit = async () => {
    try {
      setLoading(true);

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
        idv,
      };
      if (!isAlphanumeric.test(registrationNumber)) {
        toast.error("Registration number must contain letters and numbers.");
        return;
      }

      if (validateFields(payload)) {
        if (mode === "edit") {
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
      console.error("Failed to save policy:", error);
    } finally {
      setLoading(false); // Reset loading state to false after API call completes
    }
  };

  const validateFields = (payload) => {
    return (
      payload.policyNumber &&
      payload.policyStartDate &&
      payload.policyEndDate &&
      payload.insuredName &&
      payload.insuredCompany &&
      payload.registrationNumber &&
      isAlphanumeric.test(payload.registrationNumber) &&
      payload.make &&
      payload.model &&
      payload.assetType &&
      payload.premiumPaid &&
      payload.vehicleEngineNumber &&
      payload.idv
    );
  };

  const createPolicy = async (payload) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("documentId", documentId);
    formData.append("policyType", responseData?.policyType.toLowerCase());
    formData.append("policyNumber", policyNumber);
    formData.append("policyStartDate", policyStartDate);
    formData.append("policyEndDate", policyEndDate);
    formData.append("premiumPaid", premiumPaid);
    formData.append("netPremium", netPremium);
    formData.append("insuredName", insuredName);
    formData.append("insuredCompany", normalizeCompanyName(insuredCompany));
    formData.append("registrationNumber", registrationNumber);
    formData.append("registrationYear", registrationYear);
    formData.append("assetType", assetType);
    formData.append("vehicleEngineNumber", vehicleEngineNumber);
    formData.append("make", make);
    formData.append("model", model);
    formData.append("ncpPercentage", ncb);
    formData.append("tpPremium", tpPremium);
    formData.append("odPremium", odPremium);
    formData.append("idv", idv);
    try {
      const response = await axios.post(`${API_URL}policy/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.status === 200) {
        toast.success("Successfully Created");
        navigate("/vault");
      } else {
        console.log("hello error", response.status);
        toast.error("Error creating policy");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error creating policy";
      toast.error(`Error: ${errorMessage}`);
      if (error.response?.status === 401) {
        setShowSessionExpired(true);
      }
      console.error("Error:", errorMessage);
    }
  };
  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate('/login');
    localStorage.clear();
    sessionStorage.clear();
  };

  const updatePolicy = (payload) => {
    const formData = new FormData();
    formData.append("_id", policyId);
    formData.append("userId", userId);
    formData.append("documentId", documentId);
    formData.append("policyType", PolicyType);
    formData.append("policyNumber", policyNumber);
    formData.append("policyStartDate", policyStartDate);
    formData.append("policyEndDate", policyEndDate);
    formData.append("premiumPaid", premiumPaid);
    formData.append("netPremium", netPremium);
    formData.append("insuredName", insuredName);
    formData.append("insuranceCompany", insuredCompany);
    formData.append("registrationNumber", registrationNumber);
    formData.append("registrationYear", registrationYear);
    formData.append("assetType", assetType);
    formData.append("vehicleEngineNumber", vehicleEngineNumber);
    formData.append("make", make);
    formData.append("model", model);
    formData.append("ncpPercentage", ncb);
    formData.append("tpPremium", tpPremium);
    formData.append("odPremium", odPremium);
    formData.append("idv", idv);
    dispatch(updateDocument(API_URL, formData))
      .then(() => {
        toast.success("Successfully Updated");
        navigate("/vault");
      })
      .catch((error) => {
        toast.error("Error updating policy");
      });
  };
  const handleCancel = () => {
    navigate("/vault");
  };
  return (
    <div>
      <Navbar />
      <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      <ToastContainer />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: THEME_COLOR.BACKGROUND }}
      >
        <Grid item xs={12} sm={10} md={8}>
          <Card
            className="my-4"
            style={{
              padding: "40px 90px",
              backgroundColor: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.COLOR,
              boxShadow: " rgba(17, 17, 26, 0.1) 0px 0px 16px",
              borderRadius: "20px",
            }}
          >
            <div className="d-flex justify-content-between">
              <Typography
                onClick={() => navigate(-1)}
                variant="h4"
                component="h2"
                className="fw-bold d-flex align-items-center gap-2"
              >
                <span
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowBackIcon style={{ color: "#fff", fontSize: "28px" }} />
                </span>
                {headingText}
              </Typography>
              <ProgressBarCircle
                progress={calculateProgress()}
                color="#8AC642"
              />{" "}
            </div>
            <p
              className="custom-color my-4"
              style={{ fontSize: "18px", fontWeight: "700" }}
            >
              {" "}
              Policy Details
            </p>
            <div>
              <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    type="text"
                    label="Policy Number"
                    // placeholder="policy number"
                    value={policyNumber}
                    onChange={(e) => {
                      setPolicyNumber(e.target.value);
                    }}
                    inputStyle={commonInputStyle}
                    required
                  />


                  <Grid container spacing={1} className="mb-2">
                    <Grid item xs={12} md={6} margin={0} >
                      <label
                        className="form-label fw-bold mb-0" // ensure tight spacing
                        htmlFor="start-date"
                      >
                        Start date <span className="text-danger">*</span>
                      </label>
                      <DateTimePicker
                        id="start-date"
                        type="date"
                        isIcon={false}
                        label="DD/MM/YYYY"
                        value={formatDate(policyStartDate)}
                        onChange={handleStartDateChange}
                        className="w-100" // full width and dark bg
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <label
                        className="form-label fw-bold mb-0"
                        htmlFor="end-date"
                      >
                        End date <span className="text-danger">*</span>
                      </label>
                      <DateTimePicker
                        id="end-date"
                        type="date"
                        isIcon={false}
                        label="DD/MM/YYYY"
                        value={formatDate(policyEndDate)}
                        onChange={handleEndDateChange}
                        className="w-100"
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
                    inputStyle={commonInputStyle}
                  />
                  <Box>

                    <CustomInput
                      type="text"
                      label="Insurance Company"
                      value={normalizeCompanyName(insuredCompany)}
                      readOnly
                      disabled
                      required
                      inputStyle={commonInputStyle}
                    />

                  </Box>

                  <CustomInput
                    type="text"
                    label="Registration Number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    required

                    inputStyle={commonInputStyle}
                    validationMessage={
                      registrationNumber && !isAlphanumeric.test(registrationNumber)
                        ? "Registration number must contain letters and numbers. No special characters other than - and space allowed."
                        : ""
                    }
                  />

                  <CustomInput
                    type="text"
                    label="Registration Year"
                    value={registrationYear}
                    onChange={(e) => {
                      setRegistrationYear(e.target.value);
                    }}
                    inputStyle={commonInputStyle}
                  />
                  <CustomInput
                    type="text"
                    label="IDV"
                    value={idv}
                    onChange={(e) => {
                      setIdv(e.target.value);
                    }}
                    required
                    inputStyle={commonInputStyle}
                  />

                  <CustomInput
                    type="text"
                    label="NCB%"
                    value={ncb}
                    onChange={(e) => {
                      setNcb(e.target.value);
                    }}
                    inputStyle={commonInputStyle}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}>Vehicle Details</p> */}

                  <CustomInput
                    type="text"
                    label="Net Premium"
                    value={netPremium}
                    onChange={(e) => {
                      setNetPremium(e.target.value);
                    }}
                    inputStyle={commonInputStyle}
                  />
                  <CustomInput
                    type="text"
                    label="Total Premium"
                    value={premiumPaid}
                    onChange={(e) => {
                      setPremiumPaid(e.target.value);
                    }}
                    required
                    inputStyle={commonInputStyle}
                  />

                  <CustomInput
                    type="text"
                    label="Asset type"
                    value={assetType}
                    onChange={(e) => {
                      setAssetType(e.target.value);
                    }}
                    inputStyle={commonInputStyle}
                    required
                  />
                  <CustomInput
                    type="text"
                    label="Vehicle Engine Number"
                    value={vehicleEngineNumber}
                    inputStyle={commonInputStyle}
                    onChange={(e) => {
                      setVehicleEngineNumber(e.target.value);
                    }}
                    required
                  />
                  <CustomInput
                    type="text"
                    label="Make "
                    value={make}
                    inputStyle={commonInputStyle}
                    onChange={(e) => {
                      setMake(e.target.value);
                    }}
                    required
                  />
                  <CustomInput
                    type="text"
                    label="Model "
                    value={model}
                    inputStyle={commonInputStyle}
                    onChange={(e) => {
                      setModel(e.target.value);
                    }}
                    required
                  />
                  <CustomInput
                    type="text"
                    label="Liability Premium"
                    value={tpPremium}
                    inputStyle={commonInputStyle}
                    onChange={(e) => {
                      setTpPremium(e.target.value);
                    }}
                  />
                  <CustomInput
                    type="text"
                    label="OD Premium"
                    value={odPremium}
                    onChange={(e) => {
                      setOdpremium(e.target.value);
                    }}
                    inputStyle={commonInputStyle}
                  />
                </Grid>
                <Box
                  flex={1}
                  display="flex"
                  justifyContent="center"
                  gap={2}
                  mt={2}
                  width="100%"
                >
                  <Button
                    text={mode === "edit" ? "Update" : "Save"}
                    size="lg"
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: "#8AC642",
                      color: "#fff",
                      padding: "10px 40px",
                      fontWeight: 600,
                      borderRadius: "8px",
                      fontSize: "16px",
                      textTransform: "none",
                    }}
                  />
                  <Button
                    text="Cancel"
                    size="lg"
                    onClick={handleCancel}
                    style={{
                      width: "500px",
                      backgroundColor: "transparent",
                      color: "#8AC642",
                      border: "2px solid #8AC642",
                      padding: "10px 40px",
                      fontWeight: 600,
                      borderRadius: "8px",
                      fontSize: "16px",
                      textTransform: "none",
                    }}
                  />
                </Box>
              </Grid>
            </div>
          </Card>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default MotorPolicyForm;
