import React, { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import { ToastContainer, toast } from "react-toastify";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomInput from "../../component/CustomInput";
import Button from "../../component/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../../ServiceModule/Service";
import { saveDocument, updateDocument } from "../../store/action/action";
import Footer from "../../Landing/component/Footer";
import dayjs from "dayjs";
import ProgressBarCircle from "../../component/ProgressBarCircle";
import DateTimePicker from "../../component/DateTimePicker";
import { formatDate } from "../../utils/dateUtils";
import InsuranceDropdown from "../../component/InsurannceCompanyDropDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LifePolicyForm = () => {
  const location = useLocation();
  const responseData = location.state?.responseData;
  const mode = location.state?.mode;
  const policyDetails = location.state?.policyDetails;
  const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();

  let headingText = mode === "edit" ? "Edit Policy" : "Add Policy";

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
  const [documentId, setdocumentId] = useState(
    () => sessionStorage.getItem("documentId") || policyDetails?.documentDetails?._id || ""
);

useEffect(() => {
    sessionStorage.setItem("documentId", documentId);
}, [documentId]);

  const [loading, setLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]); // NEW

  const userId = sessionStorage.getItem("userId");
  const policyId = sessionStorage.getItem("policyId");
  const token = sessionStorage.getItem("token");

const safeJsonParse = (str) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch (err) {
    console.warn("Failed to parse OCR text:", err);
    return null;
  }
};

const ocrData = safeJsonParse(responseData?.ocrText);
const ocrCompany = ocrData?.insuredCompany || "";

const [insuredCompany, setInsuredCompany] = useState("");      // stores ID for submission
const [insuredCompanyName, setInsuredCompanyName] = useState(ocrCompany); // label for dropdown

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const commonInputStyle = {
    height: 48,
    fontSize: "1.222rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "white",
    borderColor: "grey",
  };

  const inputFields = [
    policyNumber,
    policyStartDate,
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

useEffect(() => {
  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch("https://api.thecoverkraft.com/api/dropdown?q=");
      const data = await response.json();
      if (Array.isArray(data)) setDropdownOptions(data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchDropdownOptions();
}, []);


useEffect(() => {
  if (ocrCompany && dropdownOptions.length > 0) {
    const normalize = (str) => str?.replace(/\s+/g, " ").trim().toLowerCase();
    const match = dropdownOptions.find(opt => normalize(opt.label) === normalize(ocrCompany));

    if (match) {
      setInsuredCompany(match._id);       // store ID
      setInsuredCompanyName(match.label); // store label to display
    }
  }
}, [ocrCompany, dropdownOptions]);


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        policyNumber,
        policyStartDate,
        sumAssured,
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
    navigate("/vault");
  };

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
              <div className="d-flex justify-content-between">
                <Typography
                  onClick={() => navigate(-1)}
                  variant="h4"
                  component="h2"
                  className="fw-bold d-flex align-items-center gap-2"
                >
                  <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <ArrowBackIcon style={{ color: "#fff", fontSize: "28px" }} />
                  </span>
                  {headingText}
                </Typography>
                <ProgressBarCircle progress={calculateProgress()} color="#8AC642" />
              </div>

              <Typography
                variant="h6"
                sx={{
                  color: "#4FC3F7",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: 3,
                  letterSpacing: "0.5px",
                }}
              >
                Policy Details
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                      <CustomInput
                        type="text"
                        label="Policy Number"
                        value={policyNumber}
                        disabled={true}
                        required
                        inputStyle={commonInputStyle}
                      />
                    </Box>

                    <Grid container spacing={10}>
                      <Grid item xs={12} md={6}>
                        <label className="form-label fw-bold mb-2 text-white fs-6">
                          Start date <span className="text-danger">*</span>
                        </label>
                        <DateTimePicker
                          type="date"
                          isIcon={false}
                          label="DD/MM/YYYY"
                          value={formatDate(policyStartDate)}
                          onChange={(val) => setPolicyStartDate(val)}
                          className="w-100"
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography component="label" className="fw-bold mb-2 text-white fs-6">
                            Next premium due date <span style={{ color: "#f44336" }}>*</span>
                          </Typography>
                          <DateTimePicker
                            type="date"
                            value={policyRenewalDate}
                            onChange={(value) => setPolicyRenewalDate(value)}
                            label="DD/MM/YYYY"
                            isIcon={false}
                            className="w-100"
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography
                            component="label"
                            className="fw-bold mb-2 text-white font-size-16 ml-4"
                          >
                            Policy Maturity Date <span style={{ color: "#f44336" }}>*</span>
                          </Typography>
                          <DateTimePicker
                            type="date"
                            value={maturityDate}
                            onChange={(value) => setMaturityDate(value)}
                            label="DD/MM/YYYY"
                            isIcon={false}
                            className="w-100 ml-4"
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    <Box className="mt-4">
                      <CustomInput
                        type="text"
                        label="Insured Name"
                        value={insuredName}
                        onChange={(e) => setInsuredName(e.target.value)}
                        required
                        inputStyle={commonInputStyle}
                      />
                    </Box>

                    <Box>
                      <InsuranceDropdown
  options={dropdownOptions}
  onCompanySelect={(id) => setInsuredCompany(id)}
  initialValue={insuredCompanyName}  // shows the label
/>

                    </Box>
                  </Box>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} lg={6}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                      <CustomInput
                        type="text"
                        label="Net Premium"
                        value={netPremium}
                        onChange={(e) => setNetPremium(e.target.value)}
                        inputStyle={commonInputStyle}
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        type="text"
                        label="Total Premium"
                        value={premiumPaid}
                        onChange={(e) => setPremiumPaid(e.target.value)}
                        inputStyle={commonInputStyle}
                        required
                      />
                    </Box>

                    <Box>
                      <CustomInput
                        type="text"
                        label="Sum Assured"
                        value={sumAssured}
                        inputStyle={commonInputStyle}
                        onChange={(e) => setSumAssured(e.target.value)}
                        required
                      />
                    </Box>
                    <Box>
                      <CustomInput
                        type="text"
                        label="Personal Accident Coverage"
                        value={pa}
                        onChange={(e) => setPa(e.target.value)}
                        inputStyle={commonInputStyle}
                      />
                    </Box>
                    <Box>
                      <CustomInput
                        type="text"
                        label="Policy Name"
                        value={policyName}
                        inputStyle={commonInputStyle}
                        onChange={(e) => setPolicyName(e.target.value)}
                        required
                      />
                    </Box>
                  </Box>
                  <Box flex={1} display="flex" justifyContent="center" gap={2} mt={2} width="100%">
                    <Button
                      text={mode === "edit" ? "Update" : "Save"}
                      size="lg"
                      onClick={handleSubmit}
                      style={{
                        backgroundColor: "#8AC642",
                        color: "#fff !important",
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
