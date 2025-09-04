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
import Vault from "../Vault";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../../ServiceModule/Service";
import { saveDocument, updateDocument } from "../../store/action/action";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Footer from "../../Landing/component/Footer";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProgressBarCircle from "../../component/ProgressBarCircle";
import { dateformat, formatDate } from "../../utils/dateUtils";
import DateTimePicker from "../../component/DateTimePicker";
import { THEME_COLOR } from "../../constants";
import InsuranceDropdown from "../../component/InsurannceCompanyDropDown";
const HealthPolicyForm = () => {
  const location = useLocation();
  const responseData = location.state?.responseData;
  const mode = location.state?.mode;
  const policyDetails = location.state?.policyDetails;

  // Now you can use the responseData and mode in your component
  let headingText;
  if (mode === "edit") {
    headingText = "Edit Policy";
  } else {
    headingText = "Add Policy";
  }
  // const responseData = JSON.parse(responseData.ocrText);
  // const PolicyType = responseData.policyType.toLowerCase();

  const [policyNumber, setPolicyNumber] = useState(
    responseData?.policyNumber || policyDetails?.policyNumber || ""
  );
  const [policyStartDate, setPolicyStartDate] = useState(
    responseData?.policyStartDate || policyDetails?.policyStartDate || ""
  );
  const [policyEndDate, setPolicyEndDate] = useState(
    responseData?.policyEndDate || policyDetails?.policyEndDate || ""
  );
  const [sumAssured, setSumAssured] = useState(
    responseData?.sumInsured || policyDetails?.policyDetails?.sumInsured || ""
  );
  const [totalSumAssured, setTotalSumAssured] = useState(
    responseData?.totalSumInsured ||
      policyDetails?.policyDetails?.totalSumInsured ||
      ""
  );
  const [premiumPaid, setPremiumPaid] = useState(
    responseData?.premiumPaid || policyDetails?.premiumPaid || ""
  );
  const [netPremium, setNetPremium] = useState(
    responseData?.netPremium || policyDetails?.policyDetails?.netPremium || ""
  );
  const [insuredName, setInsuredName] = useState(
    responseData?.insuredName || policyDetails?.insuredName || ""
  );
  const [insuredCompany, setInsuredCompany] = useState(
    responseData?.insuranceCompany || policyDetails?.insuredCompany || ""
  );
  const [dob, setDob] = useState(responseData?.dob || "");
  const [policyName, setPolicyName] = useState(
    responseData?.policyName || policyDetails?.policyDetails?.policyName || ""
  );
  // const [idv, setIdv] = useState(responseData.idv || "");
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
    sumAssured,
    premiumPaid,
    insuredName,
    insuredCompany,
    policyName,
  ];
  const calculateProgress = () => {
    const filledFields = inputFields.filter((field) => field !== "").length;
    const totalFields = inputFields.length;
    return (filledFields / totalFields) * 100;
  };
  const handleDobChange = (date) => {
    setDob(date);
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
    sumAssured,
    premiumPaid,
    insuredName,
    insuredCompany,
    policyName,
  ]);
  const handleSubmit = async () => {
    try {
      setLoading(true); // Set loading state to true to disable the button
      const payload = {
        policyNumber,
        policyStartDate,
        policyEndDate,
        sumAssured,
        premiumPaid,
        insuredName,
        insuredCompany,
        policyName,
      };
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
    // Implement your validation logic here
    return (
      payload.policyNumber &&
      payload.policyStartDate &&
      payload.policyEndDate &&
      payload.sumAssured &&
      payload.premiumPaid &&
      payload.insuredName &&
      payload.insuredCompany &&
      payload.policyName
    );
  };

  const createPolicy = (payload) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("documentId", documentId);
    formData.append("policyType", responseData?.policyType.toLowerCase());
    formData.append("policyNumber", policyNumber);
    formData.append("policyStartDate", policyStartDate);
    formData.append("policyEndDate", policyEndDate);
    formData.append("sumInsured", sumAssured);
    formData.append("totalSumInsured", totalSumAssured);
    formData.append("premiumPaid", premiumPaid);
    formData.append("netPremium", netPremium);
    formData.append("insuredName", insuredName);
    formData.append("insuranceCompany", insuredCompany);
    formData.append("dob", dob);
    formData.append("policyName", policyName);
    dispatch(saveDocument(API_URL, formData))
      .then(() => {
        toast.success("Successfully Created");
        navigate("/vault");
      })
      .catch((error) => {
        toast.error("Error creating policy");
      });
  };
  const updatePolicy = (payload) => {
    // console.log("================");
    const formData = new FormData();
    formData.append("_id", policyId);
    formData.append("userId", userId);
    formData.append("documentId", documentId);
    formData.append("policyType", policyDetails?.policyType.toLowerCase());
    formData.append("policyNumber", policyNumber);
    formData.append("policyStartDate", policyStartDate);
    formData.append("policyEndDate", policyEndDate);
    formData.append("sumInsured", sumAssured);
    formData.append("totalSumInsured", totalSumAssured);
    formData.append("totalPremium", premiumPaid);
    formData.append("netPremium", netPremium);
    formData.append("insuredName", insuredName);
    formData.append("insuranceCompany", insuredCompany);
    formData.append("dob", dob);
    formData.append("policyName", policyName);

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
              <Grid container spacing={8}>
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
                    inputStyle={commonInputStyle}
                    />
                    <div className="">
                    <label className="form-label fw-bold" htmlFor="dob-picker">
                      DOB <span className="text-danger">*</span>
                    </label>
                    <div className="mb-1">
                      </div>
                    <DateTimePicker
                      id="dob-picker"
                      isIcon={false}
                      label="DD/MM/YYYY"
                      value={formatDate(dob)}
                      onChange={handleDobChange}
                      className="w-100 mb-0"
                    />
                    </div>
                    <Grid container spacing={3} className="mt-2 mb-2">
                    <Grid item xs={12} md={6}>
                      <div className="mb-3">
                      <label
                        className="form-label fw-bold"
                        htmlFor="start-date-picker"
                      >
                        Start date <span className="text-danger">*</span>
                      </label>
                      <DateTimePicker
                        id="start-date-picker"
                        isIcon={false}
                        label="DD/MM/YYYY"
                        value={formatDate(policyStartDate)}
                        onChange={handleStartDateChange}
                        className="w-100"
                      />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <div className="mb-3">
                      <label
                        className="form-label fw-bold"
                        htmlFor="end-date-picker"
                      >
                        End date <span className="text-danger">*</span>
                      </label>
                      <DateTimePicker
                        id="end-date-picker"
                        className="w-100"
                        isIcon={false}
                        label="DD/MM/YYYY"
                        value={formatDate(policyEndDate)}
                        onChange={handleEndDateChange}
                      />
                      </div>
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
                  {policyDetails?.insuredCompany ||
                  responseData?.insuranceCompany ? (
                    // If backend has provided it, show read-only field
                    <CustomInput
                      type="text"
                      label="Insurance Company"
                      value={insuredCompany}
                      onChange={() => {}}
                      readOnly
                      disabled
                      required
                      inputStyle={commonInputStyle}
                    />
                  ) : (
                    // Else show dropdown to let user select
                    <InsuranceDropdown
                      onCompanySelect={(companyId) =>
                        setInsuredCompany(companyId)
                      }
                      initialValue={insuredCompany}
                    />
                  )}
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
                    inputStyle = { commonInputStyle }
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
                    label="Policy Name"
                    value={policyName}
                    onChange={(e) => {
                      setPolicyName(e.target.value);
                    }}
                    required
                    inputStyle={commonInputStyle}
                  />
                  <CustomInput
                    type="text"
                    label="Sum Insured"
                    value={sumAssured}
                    onChange={(e) => {
                      setSumAssured(e.target.value);
                    }}
                    required
                    inputStyle={commonInputStyle}
                  />
                  <CustomInput
                    type="text"
                    label="Total Sum Insured"
                    value={totalSumAssured}
                    onChange={(e) => {
                      setTotalSumAssured(e.target.value);
                    }}
                    inputStyle = { commonInputStyle }
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

export default HealthPolicyForm;
