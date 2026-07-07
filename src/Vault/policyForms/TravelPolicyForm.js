import React, { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import { ToastContainer, toast } from "react-toastify";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CustomInput from "../../component/CustomInput";
import Button from "../../component/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../../ServiceModule/Service";
import { saveDocument, updateDocument } from "../../store/action/action";
import Footer from "../../Landing/component/Footer";
import ProgressBarCircle from "../../component/ProgressBarCircle";
import DateTimePicker from "../../component/DateTimePicker";
import { formatDate } from "../../utils/dateUtils";
import { THEME_COLOR } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TravelPolicyForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const responseData = location.state?.responseData;
  const mode = location.state?.mode;
  const policyDetails = location.state?.policyDetails;
  const record = responseData?.policyDetails ? responseData : policyDetails || responseData || {};
  const getTravelOcrValue = (source, keys, fallback = "") => {
    for (const key of keys) {
      const value = source?.[key];
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
    return fallback;
  };

  const parsedOcrText = (() => {
    try {
      const ocrSource =
        record?.documentDetails?.ocrText ||
        record?.policyDetails?.rawTravelDetails ||
        record?.rawTravelDetails ||
        responseData?.ocrText;
      if (!ocrSource) return {};
      const parsed = typeof ocrSource === "string" ? JSON.parse(ocrSource) : ocrSource;

      return {
        ...parsed,
        insuredName: getTravelOcrValue(parsed, ["insuredName", "proposerName"]),
        insuredCompany: getTravelOcrValue(parsed, ["insuredCompany", "insuranceCompany"]),
        policyNumber: getTravelOcrValue(parsed, ["policyNumber"]),
        policyStartDate: getTravelOcrValue(parsed, ["policyStartDate"]),
        policyEndDate: getTravelOcrValue(parsed, ["policyEndDate"]),
        sumInsured: getTravelOcrValue(parsed, ["sumInsured", "totalSumInsured"]),
        premiumPaid: getTravelOcrValue(parsed, ["premiumPaid", "totalPremium"]),
        countryVisited: getTravelOcrValue(parsed, ["countryVisited", "countriesVisited"]),
        travelType: getTravelOcrValue(parsed, ["travelType"]),
        tripType: getTravelOcrValue(parsed, ["tripType"]),
        planName: getTravelOcrValue(parsed, ["planName"]),
        geographicalScope: getTravelOcrValue(parsed, ["geographicalScope", "countryVisited"]),
        nomineeName: getTravelOcrValue(parsed, ["nomineeName"]),
        nomineeRelationship: getTravelOcrValue(parsed, ["nomineeRelationship"]),
        travellers: Array.isArray(parsed?.travellers) ? parsed.travellers : [],
      };
    } catch (error) {
      return {};
    }
  })();

  const headingText = mode === "edit" ? "Edit Travel Policy" : "Add Travel Policy";

  const [policyNumber, setPolicyNumber] = useState(
    record?.policyNumber || parsedOcrText?.policyNumber || ""
  );
  const [policyStartDate, setPolicyStartDate] = useState(
    record?.policyStartDate || parsedOcrText?.policyStartDate || ""
  );
  const [policyEndDate, setPolicyEndDate] = useState(
    record?.policyEndDate || parsedOcrText?.policyEndDate || ""
  );
  const [premiumPaid, setPremiumPaid] = useState(
    record?.premiumPaid || parsedOcrText?.premiumPaid || ""
  );
  const [insuredCompany, setInsuredCompany] = useState(
    record?.insuredCompany || parsedOcrText?.insuredCompany || ""
  );
  const [policyCoverAmount, setPolicyCoverAmount] = useState(
    record?.policyCoverAmount || record?.policyDetails?.sumInsured || parsedOcrText?.sumInsured || ""
  );
  const [travelType, setTravelType] = useState(
    record?.policyDetails?.travelType || parsedOcrText?.travelType || ""
  );
  const [countryVisited, setCountryVisited] = useState(
    record?.policyDetails?.countryVisited || parsedOcrText?.countryVisited || ""
  );
  const [tripType, setTripType] = useState(
    record?.policyDetails?.tripType || parsedOcrText?.tripType || ""
  );
  const [planName, setPlanName] = useState(
    record?.policyDetails?.planName || parsedOcrText?.planName || ""
  );
  const [geographicalScope, setGeographicalScope] = useState(
    record?.policyDetails?.geographicalScope || parsedOcrText?.geographicalScope || ""
  );
  const [nomineeName, setNomineeName] = useState(
    record?.policyDetails?.nomineeName || parsedOcrText?.nomineeName || ""
  );
  const [nomineeRelationship, setNomineeRelationship] = useState(
    record?.policyDetails?.nomineeRelationship || parsedOcrText?.nomineeRelationship || ""
  );
  const [travellers, setTravellers] = useState(
    record?.policyDetails?.travellers?.length
      ? record.policyDetails.travellers
      : parsedOcrText?.travellers?.length
      ? parsedOcrText.travellers
      : [
          {
            relationship: "Self",
            sumInsured: policyCoverAmount || "",
            preExistingDisease: "",
          },
        ]
  );
  const [loading, setLoading] = useState(false);

  const userId = sessionStorage.getItem("userId");

  const inputFields = [
    policyNumber,
    policyStartDate,
    policyEndDate,
    premiumPaid,
    insuredCompany,
    policyCoverAmount,
    travelType,
    countryVisited,
    tripType,
    planName,
    geographicalScope,
    nomineeName,
    nomineeRelationship,
  ];

  const calculateProgress = () => {
    const filledFields = inputFields.filter((field) => field !== "").length;
    return (filledFields / inputFields.length) * 100;
  };

  useEffect(() => {
    calculateProgress();
  }, [
    policyNumber,
    policyStartDate,
    policyEndDate,
    premiumPaid,
    insuredCompany,
    policyCoverAmount,
    travelType,
    countryVisited,
    tripType,
    planName,
  ]);

  const validateFields = () => {
    return (
      policyNumber &&
      policyStartDate &&
      policyEndDate &&
      premiumPaid &&
      insuredCompany &&
      policyCoverAmount &&
      travelType &&
      countryVisited &&
      tripType &&
      planName &&
      travellers.length > 0 &&
      travellers.every((traveller) => traveller?.relationship)
    );
  };

  const createPolicy = async () => {
    const formData = new FormData();
    formData.append("userId", userId || "");
    formData.append("documentId", sessionStorage.getItem("documentId") || "");
    formData.append("policyType", (record?.policyType || parsedOcrText?.policyType || "travel").toLowerCase());
    formData.append("policyNumber", policyNumber);
    formData.append("policyStartDate", policyStartDate);
    formData.append("policyEndDate", policyEndDate);
    formData.append("premiumPaid", premiumPaid);
    formData.append("insuredCompany", insuredCompany);
    formData.append("sumInsured", policyCoverAmount);
    formData.append("totalSumInsured", policyCoverAmount);
    formData.append("policyCoverAmount", policyCoverAmount);
    formData.append("travelType", travelType);
    formData.append("countryVisited", countryVisited);
    formData.append("tripType", tripType);
    formData.append("planName", planName);
    formData.append("geographicalScope", geographicalScope);
    formData.append("nomineeName", nomineeName);
    formData.append("nomineeRelationship", nomineeRelationship);
    formData.append("travellers", JSON.stringify(travellers));

    const response = await dispatch(saveDocument(API_URL, formData));
    return response;
  };

  const updateTravelPolicy = async () => {
    const formData = new FormData();
    formData.append("_id", sessionStorage.getItem("policyId") || "");
    formData.append("userId", userId || "");
    formData.append("documentId", sessionStorage.getItem("documentId") || "");
    formData.append("policyType", (record?.policyType || parsedOcrText?.policyType || "travel").toLowerCase());
    formData.append("policyNumber", policyNumber);
    formData.append("policyStartDate", policyStartDate);
    formData.append("policyEndDate", policyEndDate);
    formData.append("premiumPaid", premiumPaid);
    formData.append("insuredCompany", insuredCompany);
    formData.append("sumInsured", policyCoverAmount);
    formData.append("totalSumInsured", policyCoverAmount);
    formData.append("policyCoverAmount", policyCoverAmount);
    formData.append("travelType", travelType);
    formData.append("countryVisited", countryVisited);
    formData.append("tripType", tripType);
    formData.append("planName", planName);
    formData.append("geographicalScope", geographicalScope);
    formData.append("nomineeName", nomineeName);
    formData.append("nomineeRelationship", nomineeRelationship);
    formData.append("travellers", JSON.stringify(travellers));

    const response = await dispatch(updateDocument(API_URL, formData));
    return response;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!validateFields()) {
        toast.error("Please fill all required fields!");
        return;
      }

      if (mode === "edit") {
        await updateTravelPolicy();
        toast.success("Travel policy updated successfully");
      } else {
        await createPolicy();
        toast.success("Travel policy created successfully");
      }
      navigate("/vault");
    } catch (error) {
      toast.error("Error saving travel policy");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/vault");
  };

  const fieldStyle = {
    height: 48,
    fontSize: "1.05rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "white",
    borderColor: "grey",
  };

  const updateTraveller = (index, key, value) => {
    setTravellers((prev) =>
      prev.map((traveller, currentIndex) =>
        currentIndex === index ? { ...traveller, [key]: value } : traveller
      )
    );
  };

  const addTraveller = () => {
      setTravellers((prev) => [
        ...prev,
        {
          relationship: "",
          sumInsured: policyCoverAmount || "",
          preExistingDisease: "",
        },
      ]);
  };

  const removeTraveller = (index) => {
    setTravellers((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: THEME_COLOR.BACKGROUND, minHeight: "100vh" }}
      >
        <Grid item xs={12} sm={10} md={8}>
          <Card
            className="my-4"
            style={{
              padding: "40px 90px",
              backgroundColor: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.COLOR,
              boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
              borderRadius: "20px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
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
              <ProgressBarCircle progress={calculateProgress()} color="#8AC642" />
            </div>

            <p className="custom-color my-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              Travel Policy Details
            </p>

            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                <CustomInput
                  type="text"
                  label="Policy Number"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  required
                  inputStyle={fieldStyle}
                />
                <div className="mt-2">
                  <label className="form-label fw-bold text-light mb-2 d-block">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <DateTimePicker
                    id="start-date"
                    type="date"
                    isIcon={false}
                    label="DD/MM/YYYY"
                    value={formatDate(policyStartDate)}
                    onChange={(date) => setPolicyStartDate(date)}
                    className={"w-100"}
                  />
                </div>
                <div className="mt-2">
                  <label className="form-label fw-bold text-light mb-2 d-block">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <DateTimePicker
                    id="end-date"
                    type="date"
                    isIcon={false}
                    label="DD/MM/YYYY"
                    value={formatDate(policyEndDate)}
                    onChange={(date) => setPolicyEndDate(date)}
                    className={"w-100"}
                  />
                </div>
                <CustomInput
                  type="text"
                  label="Policy Cover Amount"
                  value={policyCoverAmount}
                  onChange={(e) => setPolicyCoverAmount(e.target.value)}
                  required
                  inputStyle={fieldStyle}
                  className="mt-2"
                />
                <CustomInput
                  type="text"
                  label="Country Visited"
                  value={countryVisited}
                  onChange={(e) => setCountryVisited(e.target.value)}
                  required
                  inputStyle={fieldStyle}
                  className="mt-2"
                />
                <CustomInput
                  type="text"
                  label="Travel Type"
                  value={travelType}
                  onChange={(e) => setTravelType(e.target.value)}
                  required
                  inputStyle={fieldStyle}
                  className="mt-2"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomInput
                  type="text"
                  label="Premium Paid"
                  value={premiumPaid}
                  onChange={(e) => setPremiumPaid(e.target.value)}
                  required
                  inputStyle={fieldStyle}
                />
                <CustomInput
                  type="text"
                  label="Trip Type"
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                  required
                  inputStyle={fieldStyle}
                  className="mt-2"
                />
                <CustomInput
                  type="text"
                  label="Plan Name"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  required
                  inputStyle={fieldStyle}
                  className="mt-2"
                />
                <CustomInput
                  type="text"
                  label="Geographical Scope"
                  value={geographicalScope}
                  onChange={(e) => setGeographicalScope(e.target.value)}
                  inputStyle={fieldStyle}
                  className="mt-2"
                />
              </Grid>

              <Box
                flex={1}
                display="flex"
                justifyContent="center"
                gap={2}
                mt={2}
                width="100%"
                flexWrap="wrap"
              >
                <Button
                  text={loading ? "Saving..." : mode === "edit" ? "Update" : "Save"}
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

              <Grid item xs={12}>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 1, flexWrap: "wrap", gap: 2 }}>
                  <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
                    Family Members / Travelers
                  </Typography>
                  <Button
                    text="Add Family Member"
                    size="lg"
                    onClick={addTraveller}
                    style={{
                      backgroundColor: "transparent",
                      color: "#8AC642",
                      border: "2px solid #8AC642",
                      padding: "8px 18px",
                      fontWeight: 600,
                      borderRadius: "8px",
                      fontSize: "14px",
                      textTransform: "none",
                    }}
                  />
                </Box>
                <Grid container spacing={3}>
                  {travellers.map((traveller, index) => (
                    <Grid item xs={12} key={`${traveller.name || "traveller"}-${index}`}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          backgroundColor: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                          <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                            Traveler {index + 1}
                          </Typography>
                          {travellers.length > 1 && (
                            <Button
                              text="Remove"
                              size="lg"
                              onClick={() => removeTraveller(index)}
                              style={{
                                backgroundColor: "transparent",
                                color: "#ff8a80",
                                border: "1px solid #ff8a80",
                                padding: "6px 14px",
                                fontWeight: 600,
                                borderRadius: "8px",
                                fontSize: "13px",
                                textTransform: "none",
                              }}
                            />
                          )}
                        </Box>
                        <Grid container spacing={2}>
                          {[
                            ["relationship", "Relationship"],
                            ["sumInsured", "Sum Insured"],
                            ["preExistingDisease", "Pre Existing Disease"],
                          ].map(([key, label]) => (
                            <Grid item xs={12} md={6} key={key}>
                              <CustomInput
                                type="text"
                                label={label}
                                value={traveller?.[key] || ""}
                                onChange={(e) => updateTraveller(index, key, e.target.value)}
                                inputStyle={fieldStyle}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomInput
                  type="text"
                  label="Nominee Name"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  inputStyle={fieldStyle}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomInput
                  type="text"
                  label="Nominee Relationship"
                  value={nomineeRelationship}
                  onChange={(e) => setNomineeRelationship(e.target.value)}
                  inputStyle={fieldStyle}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default TravelPolicyForm;
