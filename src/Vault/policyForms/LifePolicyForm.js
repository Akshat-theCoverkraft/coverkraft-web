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
import dayjs from "dayjs";
import ProgressBarCircle from "../../component/ProgressBarCircle";
import DateTimePicker from "../../component/DateTimePicker";
import { formatDate } from "../../utils/dateUtils";

const LifePolicyForm = () => {
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
  
  // State variables
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
  const [premiumPaid, setPremiumPaid] = useState(
    responseData?.totalPremium || policyDetails?.premiumPaid || ""
  );
  const [insuredName, setInsuredName] = useState(
    responseData?.insuredName || policyDetails?.insuredName || ""
  );
  const [insuredCompany, setInsuredCompany] = useState(
    responseData?.insuranceCompany || policyDetails?.insuredCompany || ""
  );
  const [netPremium, setNetPremium] = useState(
    responseData?.netPremium || policyDetails?.policyDetails?.netPremium || ""
  );
  const [criticalIllness, setCriticalIllness] = useState(
    responseData?.criticalIllness ||
    policyDetails?.policyDetails?.criticalIllness ||
    ""
  );
  const [accidentalDisability, setAccidentalDisability] = useState(
    responseData?.accidentalDisability ||
    policyDetails?.policyDetails?.accidentalDisability ||
    ""
  );
  const [terminalIllness, setTerminalIllness] = useState(
    responseData?.terminalIllness ||
    policyDetails?.policyDetails?.terminalIllness ||
    ""
  );
  const [pa, setPa] = useState(responseData?.pa || "");
  const [policyRenewalDate, setPolicyRenewalDate] = useState(
    responseData?.policyRenewalDate || ""
  );
  const [maturityDate, setMaturityDate] = useState(
    responseData?.maturityDate || ""
  );
  const [others, setOthers] = useState(
    responseData?.others || policyDetails?.others || ""
  );
  const [dob, setDob] = useState(responseData?.dob || "");
  const [policyName, setPolicyName] = useState(
    responseData?.policyName || policyDetails?.policyDetails?.policyName || ""
  );

  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const documentId = localStorage.getItem("documentId");
  const policyId = localStorage.getItem("policyId");

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputFields = [
    policyNumber,
    policyStartDate,
    policyEndDate,
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

  const handleStartDateChange = (date) => {
    setPolicyStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setPolicyEndDate(date);
  };
  const handleRenewalDate = (date) => {
    setPolicyRenewalDate(date);
  };
  const handleMaturityDate = (date) => {
    setMaturityDate(date);
  };
  const handleDob = (date) => {
    setDob(date);
  };

  useEffect(() => {
    const progress = calculateProgress();
  }, [
    policyNumber,
    policyStartDate,
    sumAssured,
    policyEndDate,
    premiumPaid,
    insuredName,
    insuredCompany,
    policyName,
  ]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        policyNumber,
        policyStartDate,
        sumAssured,
        policyEndDate,
        premiumPaid,
        insuredName,
        insuredCompany,
        policyName,
      };

      if (validateFields(payload)) {
        if (mode === "edit") {
          await updatePolicy(payload);
        } else {
          await createPolicy(payload);
        }
      } else {
        toast.error("Please fill all required fields!");
      }
    } catch (error) {
      console.error("Failed to save policy:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateFields = (payload) => {
    return (
      payload.policyNumber &&
      payload.policyStartDate &&
      payload.policyEndDate &&
      payload.premiumPaid &&
      payload.insuredName &&
      payload.insuredCompany &&
      payload.sumAssured &&
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
    formData.append("premiumPaid", premiumPaid);
    formData.append("netPremium", netPremium);
    formData.append("insuredName", insuredName);
    formData.append("insuranceCompany", insuredCompany);
    formData.append("criticalIllness", criticalIllness);
    formData.append("accidentalDisability", accidentalDisability);
    formData.append("terminalIllness", terminalIllness);
    formData.append("pa", pa);
    formData.append("policyRenewalDate", policyRenewalDate);
    formData.append("maturityDate", maturityDate);
    formData.append("others", others);
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
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("documentId", documentId);
    formData.append("_id", policyId);
    formData.append("policyType", policyDetails?.policyType.toLowerCase());
    formData.append("policyNumber", policyNumber);
    formData.append("policyStartDate", policyStartDate);
    formData.append("policyEndDate", policyEndDate);
    formData.append("sumInsured", sumAssured);
    formData.append("premiumPaid", premiumPaid);
    formData.append("netPremium", netPremium);
    formData.append("insuredName", insuredName);
    formData.append("insuranceCompany", insuredCompany);
    formData.append("criticalIllness", criticalIllness);
    formData.append("accidentalDisability", accidentalDisability);
    formData.append("terminalIllness", terminalIllness);
    formData.append("pa", pa);
    formData.append("policyRenewalDate", policyRenewalDate);
    formData.append("maturityDate", maturityDate);
    formData.append("others", others);
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
    navigate('/vault')
  }

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <Navbar />
      <ToastContainer />
      
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={10} xl={8}>
            <Card
              sx={{
                padding: { xs: 3, sm: 4, md: 6 },
                boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                borderRadius: 3,
                backgroundColor: "#212121",
                border: "1px solid #333",
              }}
            >
              {/* Header Section */}
              <Box 
                sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: 4,
                  flexWrap: "wrap",
                  gap: 2
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" }
                  }}
                >
                  {headingText}
                </Typography>
                <ProgressBarCircle progress={calculateProgress()} />
              </Box>

              {/* Section Title */}
              <Typography
                variant="h6"
                sx={{
                  color: "#4FC3F7",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: 3,
                  letterSpacing: "0.5px"
                }}
              >
                Policy Details
              </Typography>

              {/* Form Content */}
              <Grid container spacing={4}>
                {/* Left Column */}
                <Grid item xs={12} lg={6}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Policy Number */}
                    <Box>
                      <CustomInput
                        type="text"
                        label="Policy Number"
                        value={policyNumber}
                        disabled={true}
                        required
                      />
                    </Box>

                    {/* Date Fields Row */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography
                            component="label"
                            sx={{
                              display: "block",
                              fontWeight: 600,
                              color: "#fff",
                              marginBottom: 1,
                              fontSize: "0.95rem"
                            }}
                          >
                            Start Date <span style={{ color: "#f44336" }}>*</span>
                          </Typography>
                          <DateTimePicker
                            height={50}
                            isIcon={false}
                            label="DD/MM/YYYY"
                            value={formatDate(policyStartDate)}
                            onChange={handleStartDateChange}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography
                            component="label"
                            sx={{
                              display: "block",
                              fontWeight: 600,
                              color: "#fff",
                              marginBottom: 1,
                              fontSize: "0.95rem"
                            }}
                          >
                            End Date <span style={{ color: "#f44336" }}>*</span>
                          </Typography>
                          <DateTimePicker
                            height={50}
                            isIcon={false}
                            label="DD/MM/YYYY"
                            value={formatDate(policyEndDate)}
                            onChange={handleEndDateChange}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Renewal and Maturity Date Row */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography
                            component="label"
                            sx={{
                              display: "block",
                              fontWeight: 600,
                              color: "#fff",
                              marginBottom: 1,
                              fontSize: "0.95rem"
                            }}
                          >
                            Policy Renewal Date
                          </Typography>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker
                                defaultValue={dayjs(policyRenewalDate)}
                                selected={policyRenewalDate}
                                onChange={(newValue) => {
                                  setPolicyRenewalDate(newValue);
                                }}
                                selectsStart
                                startDate={policyRenewalDate}
                                placeholderText="MM/DD/YYYY"
                                sx={{ width: "100%" }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography
                            component="label"
                            sx={{
                              display: "block",
                              fontWeight: 600,
                              color: "#fff",
                              marginBottom: 1,
                              fontSize: "0.95rem"
                            }}
                          >
                            Maturity Date
                          </Typography>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker
                                defaultValue={dayjs(maturityDate)}
                                selected={maturityDate}
                                onChange={(newValue) => {
                                  setMaturityDate(newValue);
                                }}
                                selectsStart
                                startDate={maturityDate}
                                placeholderText="MM/DD/YYYY"
                                sx={{ width: "100%" }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* DOB Field */}
                    <Box>
                      <Typography
                        component="label"
                        sx={{
                          display: "block",
                          fontWeight: 600,
                          color: "#fff",
                          marginBottom: 1,
                          fontSize: "0.95rem"
                        }}
                      >
                        Date of Birth
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            defaultValue={dayjs(dob)}
                            selected={dob}
                            onChange={(newValue) => {
                              setDob(newValue);
                            }}
                            selectsStart
                            startDate={dob}
                            placeholderText="MM/DD/YYYY"
                            sx={{ width: "100%" }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Box>

                    {/* Personal Details */}
                    <Box>
                      <CustomInput
                        type="text"
                        label="Insured Name"
                        value={insuredName}
                        onChange={(e) => setInsuredName(e.target.value)}
                        required
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        type="text"
                        label="Insurance Company"
                        value={insuredCompany}
                        onChange={(e) => setInsuredCompany(e.target.value)}
                        required
                      />
                    </Box>

                    {/* Coverage Details */}
                    <Box>
                      <CustomInput
                        type="text"
                        label="Critical Illness Coverage"
                        value={criticalIllness}
                        onChange={(e) => setCriticalIllness(e.target.value)}
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        type="number"
                        label="Accidental Disability Coverage"
                        value={accidentalDisability}
                        onChange={(e) => setAccidentalDisability(e.target.value)}
                      />
                    </Box>

                    {/* Action Buttons - Left Column */}
                    <Box sx={{ marginTop: 4 }}>
                      <Button
                        text={mode === "edit" ? "Update Policy" : "Save Policy"}
                        size="lg"
                        block={true}
                        onClick={handleSubmit}
                        disabled={loading}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} lg={6}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Premium Details */}
                    <Box>
                      <CustomInput
                        type="number"
                        label="Net Premium"
                        value={netPremium}
                        onChange={(e) => setNetPremium(e.target.value)}
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        type="number"
                        label="Total Premium"
                        value={premiumPaid}
                        onChange={(e) => setPremiumPaid(e.target.value)}
                        required
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        type="text"
                        label="Sum Assured"
                        value={sumAssured}
                        onChange={(e) => setSumAssured(e.target.value)}
                        required
                      />
                    </Box>

                    {/* Additional Coverage */}
                    <Box>
                      <CustomInput
                        type="number"
                        label="Personal Accident Coverage"
                        value={pa}
                        onChange={(e) => setPa(e.target.value)}
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        type="number"
                        label="Terminal Illness Coverage"
                        value={terminalIllness}
                        onChange={(e) => setTerminalIllness(e.target.value)}
                      />
                    </Box>

                    {/* Policy Information */}
                    <Box>
                      <CustomInput
                        type="text"
                        label="Policy Name"
                        value={policyName}
                        onChange={(e) => setPolicyName(e.target.value)}
                        required
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        type="text"
                        label="Additional Notes"
                        value={others}
                        onChange={(e) => setOthers(e.target.value)}
                      />
                    </Box>

                    {/* Action Buttons - Right Column */}
                    <Box sx={{ marginTop: 9}}>
                      <Button
                        text="Cancel"
                        size="lg"
                        block={true}
                        onClick={handleCancel}
                        style={{ 
                          backgroundColor: "transparent", 
                          border: "2px solid #666",
                          color: "#fff"
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default LifePolicyForm;