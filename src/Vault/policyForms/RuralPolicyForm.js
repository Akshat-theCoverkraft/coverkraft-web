import React, { useMemo, useState } from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../component/Navbar";
import Footer from "../../Landing/component/Footer";
import CustomInput from "../../component/CustomInput";
import Button from "../../component/Button";
import ProgressBarCircle from "../../component/ProgressBarCircle";
import DateTimePicker from "../../component/DateTimePicker";
import InsuranceDropdown from "../../component/InsurannceCompanyDropDown";
import API_URL from "../../ServiceModule/Service";
import { saveDocument, updateDocument } from "../../store/action/action";
import { THEME_COLOR } from "../../constants";
import { formatDate } from "../../utils/dateUtils";

const FORM_CONFIG = {
  accident: {
    title: "Personal Accident Policy",
    policyType: "accident",
    successName: "Personal accident policy",
    sectionTitle: "Personal Accident Policy Details",
    required: [
      "policyNumber",
      "policyStartDate",
      "policyEndDate",
      "premiumPaid",
      "insuredCompany",
      "insuredName",
      "sumAssured",
      "policyName",
    ],
    fields: [
      { key: "policyNumber", label: "Policy Number", required: true },
      { key: "premiumPaid", label: "Premium Paid", required: true },
      { key: "totalPremium", label: "Total Premium" },
      { key: "insuredName", label: "Insured Name", required: true },
      { key: "policyName", label: "Policy Name", required: true },
      { key: "sumAssured", label: "Sum Insured", required: true },
      { key: "proposerName", label: "Proposer Name" },
      { key: "memberId", label: "Member ID" },
      { key: "primaryInsuredName", label: "Primary Insured Name" },
      { key: "gender", label: "Gender" },
      { key: "dob", label: "Date of Birth", type: "date" },
      { key: "age", label: "Age" },
      { key: "coverType", label: "Cover Type" },
      { key: "coverageProved", label: "Coverage Provided" },
      { key: "weeklyBenefit", label: "Weekly Benefit" },
      { key: "cumulativeBonus", label: "Cumulative Bonus" },
      { key: "servicingBranchOffice", label: "Servicing Branch Office" },
      { key: "intermediaryName", label: "Intermediary Name" },
      { key: "intermediaryCode", label: "Intermediary Code" },
      { key: "contactNo", label: "Contact Number" },
      { key: "emailId", label: "Email ID" },
      { key: "location", label: "Location" },
      { key: "state", label: "State" },
    ],
  },
  crop: {
    title: "Crop Policy",
    policyType: "crop_policy",
    successName: "Crop policy",
    sectionTitle: "Crop Policy Details",
    required: [
      "policyNumber",
      "policyStartDate",
      "policyEndDate",
      "premiumPaid",
      "insuredCompany",
      "policyName",
      "farmerName",
      "season",
      "sumAssured",
    ],
    fields: [
      { key: "policyNumber", label: "Policy Number", required: true },
      { key: "premiumPaid", label: "Premium Paid", required: true },
      { key: "netPremium", label: "Net Premium" },
      { key: "totalPremium", label: "Total Premium" },
      { key: "policyName", label: "Policy Name", required: true },
      { key: "farmerName", label: "Farmer Name", required: true },
      { key: "relativeName", label: "Relative Name" },
      { key: "season", label: "Season", required: true },
      { key: "sumAssured", label: "Sum Insured", required: true },
      { key: "issueDate", label: "Issue Date", type: "date" },
      { key: "district", label: "District" },
      { key: "state", label: "State" },
    ],
  },
  cattle: {
    title: "Cattle Policy",
    policyType: "cattle_policy",
    successName: "Cattle policy",
    sectionTitle: "Cattle Policy Details",
    required: [
      "policyNumber",
      "policyStartDate",
      "policyEndDate",
      "premiumPaid",
      "insuredCompany",
      "policyName",
      "ownerName",
      "cattleType",
      "sumAssured",
    ],
    fields: [
      { key: "policyNumber", label: "Policy Number", required: true },
      { key: "premiumPaid", label: "Premium Paid", required: true },
      { key: "netPremium", label: "Net Premium" },
      { key: "totalPremium", label: "Total Premium" },
      { key: "policyName", label: "Policy Name", required: true },
      { key: "ownerName", label: "Owner Name", required: true },
      { key: "relativeName", label: "Relative Name" },
      { key: "cattleType", label: "Cattle Type", required: true },
      { key: "breed", label: "Breed" },
      { key: "animalTagNumber", label: "Animal Tag Number" },
      { key: "registrationNumber", label: "Registration Number" },
      { key: "age", label: "Age" },
      { key: "countOfAnimals", label: "Count Of Animals" },
      { key: "sumAssured", label: "Sum Insured", required: true },
      { key: "issueDate", label: "Issue Date", type: "date" },
      { key: "location", label: "Location" },
      { key: "district", label: "District" },
      { key: "state", label: "State" },
    ],
  },
};

const getValue = (source, keys, fallback = "") => {
  for (const key of keys) {
    const value = source?.[key] ?? source?.policyDetails?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
};

const parseOcrText = (record, responseData) => {
  try {
    const ocrSource =
      record?.documentDetails?.ocrText ||
      record?.rawAccidentDetails ||
      record?.rawCropDetails ||
      record?.rawCattleDetails ||
      record?.policyDetails?.rawAccidentDetails ||
      record?.policyDetails?.rawCropDetails ||
      record?.policyDetails?.rawCattleDetails ||
      responseData?.ocrText;
    if (!ocrSource) return {};
    return typeof ocrSource === "string" ? JSON.parse(ocrSource) : ocrSource;
  } catch {
    return {};
  }
};

const RuralPolicyForm = ({ type }) => {
  const config = FORM_CONFIG[type] || FORM_CONFIG.accident;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const responseData = location.state?.responseData;
  const mode = location.state?.mode;
  const policyDetails = location.state?.policyDetails;
  const record = responseData?.policyDetails ? responseData : policyDetails || responseData || {};
  const parsedOcrText = useMemo(() => parseOcrText(record, responseData), [record, responseData]);

  const initialData = useMemo(() => {
    const source = { ...parsedOcrText, ...record, policyDetails: record?.policyDetails };
    return {
      policyNumber: getValue(source, ["policyNumber"]),
      policyStartDate: getValue(source, ["policyStartDate"]),
      policyEndDate: getValue(source, ["policyEndDate"]),
      premiumPaid: getValue(source, ["premiumPaid", "totalPremium"]),
      insuredName: getValue(source, ["insuredName", "proposerName", "ownerName", "farmerName"]),
      insuredCompany: getValue(source, ["insuredCompany", "insuranceCompany"]),
      netPremium: getValue(source, ["netPremium"]),
      totalPremium: getValue(source, ["totalPremium", "premiumPaid"]),
      sumAssured: getValue(source, ["sumAssured", "sumInsured", "totalSumInsured"]),
      policyName: getValue(source, ["policyName"]),
      proposerName: getValue(source, ["proposerName"]),
      memberId: getValue(source, ["memberId"]),
      primaryInsuredName: getValue(source, ["primaryInsuredName"]),
      gender: getValue(source, ["gender"]),
      dob: getValue(source, ["dob"]),
      age: getValue(source, ["age"]),
      coverType: getValue(source, ["coverType"]),
      coverageProved: getValue(source, ["coverageProved"]),
      weeklyBenefit: getValue(source, ["weeklyBenefit"]),
      cumulativeBonus: getValue(source, ["cumulativeBonus"]),
      servicingBranchOffice: getValue(source, ["servicingBranchOffice"]),
      intermediaryName: getValue(source, ["intermediaryName"]),
      intermediaryCode: getValue(source, ["intermediaryCode"]),
      contactNo: getValue(source, ["contactNo"]),
      emailId: getValue(source, ["emailId"]),
      farmerName: getValue(source, ["farmerName", "insuredName"]),
      relativeName: getValue(source, ["relativeName"]),
      season: getValue(source, ["season"]),
      ownerName: getValue(source, ["ownerName", "insuredName"]),
      cattleType: getValue(source, ["cattleType"]),
      breed: getValue(source, ["breed"]),
      animalTagNumber: getValue(source, ["animalTagNumber"]),
      registrationNumber: getValue(source, ["registrationNumber"]),
      countOfAnimals: getValue(source, ["countOfAnimals"]),
      issueDate: getValue(source, ["issueDate"]),
      location: getValue(source, ["location"]),
      district: getValue(source, ["district"]),
      state: getValue(source, ["state"]),
    };
  }, [parsedOcrText, record]);

  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const previousPolicyNo =
    record?.previous_policy_no ||
    record?.previousPolicyNumber ||
    record?.policyDetails?.previous_policy_no ||
    record?.policyDetails?.previousPolicyNumber ||
    parsedOcrText?.previous_policy_no ||
    parsedOcrText?.previousPolicyNumber ||
    "";

  const fieldStyle = {
    height: 48,
    fontSize: "1.05rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "white",
    borderColor: "grey",
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const requiredFilled = config.required.filter((key) => form[key]).length;
  const progress = (requiredFilled / config.required.length) * 100;

  const buildFormData = () => {
    const formData = new FormData();
    if (mode === "edit") formData.append("_id", sessionStorage.getItem("policyId") || record?._id || "");
    formData.append("userId", userId || "");
    formData.append("documentId", sessionStorage.getItem("documentId") || record?.documentDetails?._id || "");
    formData.append("policyType", config.policyType);
    formData.append("previous_policy_no", previousPolicyNo);
    formData.append("policyNumber", form.policyNumber || "");
    formData.append("policyStartDate", form.policyStartDate || "");
    formData.append("policyEndDate", form.policyEndDate || "");
    formData.append("premiumPaid", form.premiumPaid || "");
    formData.append("insuredName", form.insuredName || form.ownerName || form.farmerName || "");
    formData.append("insuredCompany", form.insuredCompany || "");
    formData.append("netPremium", form.netPremium || "");
    formData.append("totalPremium", form.totalPremium || form.premiumPaid || "");
    formData.append("sumInsured", form.sumAssured || "");

    const baseKeys = new Set([
      "policyNumber",
      "policyStartDate",
      "policyEndDate",
      "premiumPaid",
      "insuredName",
      "insuredCompany",
      "netPremium",
      "totalPremium",
      "sumAssured",
    ]);
    Object.entries(form).forEach(([key, value]) => {
      if (!baseKeys.has(key)) formData.append(key, value || "");
    });

    if (type === "accident") {
      formData.append("rawAccidentDetails", JSON.stringify(record || parsedOcrText || {}));
    }
    if (type === "crop") {
      formData.append("cropDetails", JSON.stringify(record?.cropDetails || record?.policyDetails?.cropDetails || []));
      formData.append("rawCropDetails", JSON.stringify(record || parsedOcrText || {}));
    }
    if (type === "cattle") {
      formData.append("cattleDetails", JSON.stringify(record?.cattleDetails || record?.policyDetails?.cattleDetails || []));
      formData.append("rawCattleDetails", JSON.stringify(record || parsedOcrText || {}));
    }

    return formData;
  };

  const handleSubmit = async () => {
    if (config.required.some((key) => !form[key])) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const action = mode === "edit" ? updateDocument : saveDocument;
      await dispatch(action(API_URL, buildFormData()));
      toast.success(`${config.successName} ${mode === "edit" ? "updated" : "created"} successfully`);
      navigate("/vault");
    } catch {
      toast.error(`Error saving ${config.successName.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    if (field.type === "date") {
      return (
        <div className="mt-2">
          <label className="form-label fw-bold text-light mb-2 d-block">
            {field.label} {field.required && <span className="text-danger">*</span>}
          </label>
          <DateTimePicker
            id={field.key}
            type="date"
            isIcon={false}
            label="DD/MM/YYYY"
            value={formatDate(form[field.key])}
            onChange={(date) => setField(field.key, date)}
            className="w-100"
          />
        </div>
      );
    }

    return (
      <CustomInput
        type="text"
        label={field.label}
        value={form[field.key] || ""}
        onChange={(e) => setField(field.key, e.target.value)}
        required={field.required}
        inputStyle={fieldStyle}
        className="mt-2"
      />
    );
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Grid container justifyContent="center" alignItems="center" sx={{ backgroundColor: THEME_COLOR.BACKGROUND, minHeight: "100vh" }}>
        <Grid item xs={12} sm={10} md={8}>
          <Card className="my-4" style={{ padding: "40px 90px", backgroundColor: THEME_COLOR.FADE_BACKGROUND, color: THEME_COLOR.COLOR, boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px", borderRadius: "20px" }}>
            <div className="d-flex justify-content-between align-items-center">
              <Typography onClick={() => navigate(-1)} variant="h4" component="h2" className="fw-bold d-flex align-items-center gap-2">
                <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <ArrowBackIcon style={{ color: "#fff", fontSize: "28px" }} />
                </span>
                {mode === "edit" ? `Edit ${config.title}` : `Add ${config.title}`}
              </Typography>
              <ProgressBarCircle progress={progress} color="#8AC642" />
            </div>

            <p className="custom-color my-4" style={{ fontSize: "18px", fontWeight: "700" }}>
              {config.sectionTitle}
            </p>

            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                {config.fields.filter((_, index) => index % 2 === 0).map((field) => (
                  <React.Fragment key={field.key}>{renderField(field)}</React.Fragment>
                ))}
              </Grid>
              <Grid item xs={12} md={6}>
                <InsuranceDropdown
                  onCompanySelect={(company) => setField("insuredCompany", company)}
                  initialValue={form.insuredCompany}
                />
                {config.fields.filter((_, index) => index % 2 === 1).map((field) => (
                  <React.Fragment key={field.key}>{renderField(field)}</React.Fragment>
                ))}
              </Grid>

              <Box flex={1} display="flex" justifyContent="center" gap={2} mt={2} width="100%" flexWrap="wrap">
                <Button text={loading ? "Saving..." : mode === "edit" ? "Update" : "Save"} size="lg" onClick={handleSubmit} style={{ backgroundColor: "#8AC642", color: "#fff", padding: "10px 40px", fontWeight: 600, borderRadius: "8px", fontSize: "16px", textTransform: "none" }} />
                <Button text="Cancel" size="lg" onClick={() => navigate("/vault")} style={{ backgroundColor: "transparent", color: "#8AC642", border: "2px solid #8AC642", padding: "10px 40px", fontWeight: 600, borderRadius: "8px", fontSize: "16px", textTransform: "none" }} />
              </Box>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default RuralPolicyForm;
