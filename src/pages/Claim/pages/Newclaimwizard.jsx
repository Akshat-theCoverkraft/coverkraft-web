import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import CustomInput from "../../../component/CustomInput";
import Button from "../../../component/Button";
import {
  validateEmail,
  validatePhoneNumber,
  validateRequired,
} from "../../../utils/formValidation";
import { T, inputSx, stepNav } from "../tokens";
import { TypeCard, PolicyItem, OcrZone } from "../ui";
import {
  submitClaim,
  fetchInsuranceCompanies,
  fetchPoliciesByType,
  extractData,
} from "../../../store/action/action";
import API_URL from "../../../ServiceModule/Service";

// ─── Insurance type → API category / policyTypes map ─────────────────────────
const INSURANCE_TYPE_MAP = {
  Motor: {
    apiKey: "motor",
    policyTypes: [
      "car_policy", "bike_policy", "other_vehicle", "motor",
    ],
  },
  Health: {
    apiKey: "health",
    policyTypes: [
      "health", "other_health", "health/other_health", "accident",
    ],
  },
  Life: {
    apiKey: "life",
    policyTypes: ["life"],
  },
};

// ─── Required docs per type ───────────────────────────────────────────────────
const REQUIRED_DOCS = {
  Motor: [
    { key: "policyCopy",          label: "Policy Copy",               hint: "Your motor insurance policy document",                  required: true  },
    { key: "idProof",             label: "ID Proof",                  hint: "Aadhaar, PAN, Passport or Driving Licence",             required: true  },
    { key: "repairEstimate",      label: "Repair Estimate",           hint: "Estimate letter from garage / authorised repair shop",   required: false },
    { key: "firCopy",             label: "FIR Copy",                  hint: "Police FIR — required if FIR was lodged",               required: false },
    { key: "supportingDocuments", label: "Claim Form",                hint: "Photos of damage, RC copy or any other relevant docs",  required: true  },
  ],
  Health: [
    { key: "policyCopy",          label: "Policy Copy",               hint: "Your health insurance policy document",                 required: true  },
    { key: "idProof",             label: "ID Proof",                  hint: "Aadhaar, PAN, Passport or Voter ID",                   required: true  },
    { key: "hospitalEstimate",    label: "Hospital Estimate / Bills", hint: "Pre-auth letter, discharge summary or hospital bills",  required: true  },
    { key: "supportingDocuments", label: "Claim Form",                hint: "Lab reports, prescriptions or doctor's certificates",   required: true  },
  ],
  Life: [
    { key: "policyCopy",          label: "Policy Copy",               hint: "Original or attested copy of your life policy",         required: true  },
    { key: "idProof",             label: "ID Proof of Nominee",       hint: "Aadhaar, PAN or Passport of the nominee",              required: true  },
    { key: "supportingDocuments", label: "Claim Form",                hint: "Death certificate, legal heir certificate, etc.",       required: true  },
  ],
};

const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_FILE_MB  = 10;

// ─── NewClaimWizard ───────────────────────────────────────────────────────────
export default function NewClaimWizard({ navigate, showToast }) {
  const dispatch = useDispatch();
  const token    = sessionStorage.getItem("token");

  const ocrInputRef = useRef(null);

  const [step,            setStep]            = useState(1);
  const [category,        setCategory]        = useState("");
  const [selectedPolicy,  setSelectedPolicy]  = useState(null);
  const [isManual,        setIsManual]        = useState(false);
  const [ocrScanning,     setOcrScanning]     = useState(false);
  const [ocrDone,         setOcrDone]         = useState(false);
  const [refNum,          setRefNum]          = useState("");
  const [decl,            setDecl]            = useState(false);
  const [errors,          setErrors]          = useState({});
  const [submitting,      setSubmitting]      = useState(false);
  const [companies,       setCompanies]       = useState([]);
  const [policies,        setPolicies]        = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(false);
  const [uploadedFiles,   setUploadedFiles]   = useState({});
  const [dragOver,        setDragOver]        = useState({});

  const [form2, setForm2] = useState({
    policy: "", company: "", type: "Motor", holder: "", mobile: "", email: "",
  });

  const [form3, setForm3] = useState({
    date: "", time: "", place: "", desc: "", estimatedClaimAmount: "",
    // Motor
    vehicleDrivable: "", vehicleDrivenAtAccident: "",
    driverName: "", drivingLicenseNumber: "",
    typeOfLoss: "", firLodged: "", vehicleAtGarage: "",
    garageName: "", garageAddress: "", garageCity: "",
    garageDistrict: "", garageState: "", garageContact: "", garageContactPerson: "",
    surveyAddress: "", surveyCity: "", surveyDistrict: "",
    surveyState: "", surveyContact: "", surveyContactPerson: "",
    // ── NEW: surveyor availability ────────────────────────────────────────────
    surveyAvailableDate: "", surveyAvailableTime: "",
    // Health
    patientName: "", hospitalName: "", hospitalAddress: "",
    hospitalContact: "", city: "", hospitalizationType: "",
    dateOfAdmission: "", diagnosis: "",
  });

  // ── Load companies ────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchInsuranceCompanies(API_URL)).then((res) => {
      if (res?.success && Array.isArray(res.data)) setCompanies(res.data);
    });
  }, []);

  // ── Fetch policies when category changes ──────────────────────────────────
  useEffect(() => {
    if (!category) return;
    const apiKey = INSURANCE_TYPE_MAP[category]?.apiKey || category.toLowerCase();
    setPoliciesLoading(true);
    setPolicies([]);
    setSelectedPolicy(null);
    dispatch(fetchPoliciesByType(API_URL, apiKey, token))
      .then((res) => {
        if (res?.success && Array.isArray(res.data?.policies))
          setPolicies(res.data.policies);
      })
      .finally(() => setPoliciesLoading(false));
  }, [category]);

  // ── Utilities ─────────────────────────────────────────────────────────────
  const clearErr = (field) => setErrors((p) => ({ ...p, [field]: "" }));
  const f3Set    = (field, value) => { setForm3((p) => ({ ...p, [field]: value })); clearErr(field); };

  /** Map a raw policyType string → display label ("Motor" / "Health" / "Life") */
  function normalizeInsuranceType(raw) {
    const s = (raw || "").toLowerCase().trim();
    for (const [label, cfg] of Object.entries(INSURANCE_TYPE_MAP)) {
      if (
        cfg.policyTypes.includes(s) ||
        cfg.apiKey === s             ||
        label.toLowerCase() === s
      ) return label;
    }
    return "Motor";
  }

  function resetWizard() {
    setStep(1); setCategory(""); setSelectedPolicy(null); setIsManual(false);
    setOcrScanning(false); setOcrDone(false); setDecl(false);
    setErrors({}); setSubmitting(false); setPolicies([]);
    setUploadedFiles({}); setDragOver({});
    setForm2({ policy: "", company: "", type: "Motor", holder: "", mobile: "", email: "" });
    setForm3({
      date: "", time: "", place: "", desc: "", estimatedClaimAmount: "",
      vehicleDrivable: "", vehicleDrivenAtAccident: "",
      driverName: "", drivingLicenseNumber: "",
      typeOfLoss: "", firLodged: "", vehicleAtGarage: "",
      garageName: "", garageAddress: "", garageCity: "",
      garageDistrict: "", garageState: "", garageContact: "", garageContactPerson: "",
      surveyAddress: "", surveyCity: "", surveyDistrict: "",
      surveyState: "", surveyContact: "", surveyContactPerson: "",
      surveyAvailableDate: "", surveyAvailableTime: "",       // ← reset too
      patientName: "", hospitalName: "", hospitalAddress: "",
      hospitalContact: "", city: "", hospitalizationType: "",
      dateOfAdmission: "", diagnosis: "",
    });
  }

 // ── Replace these two functions ───────────────────────────────────────────────
function pickCategory(cat) {
  if (cat !== category) {
    setSelectedPolicy(null);
    setIsManual(false);
  }
  setCategory(cat);
}

function selectPolicy(p) {
  setSelectedPolicy(p);
  setIsManual(false);
}

// AFTER — correct
function goToStep2WithPolicy(policy) {
  setOcrDone(false); setErrors({});
  setForm2({
    policy:  policy.policyNumber     || policy.policy_number || "",
    company: policy.insuranceCompany || policy.company       || "",
    type:    normalizeInsuranceType(policy.insuranceType || policy.type || category || "Motor"),
    holder:  policy.insuredName      || policy.holderName    || policy.proposerName || "",
    mobile:  policy.registeredMobile || policy.mobile        || "",
    email:   policy.registeredEmail  || policy.email         || "",
  });
  setOcrDone(true);
  setStep(2);
}

  function goStep(n) {
    if (n === 2 && selectedPolicy) { goToStep2WithPolicy(selectedPolicy); return; }
    if (n === 2 && isManual) {
      setForm2({ policy: "", company: "", type: category || "Motor", holder: "", mobile: "", email: "" });
      setOcrDone(false);
    }
    setErrors({});
    setStep(n);
  }

  // ── OCR ───────────────────────────────────────────────────────────────────
  function handleOcrClick() { if (!ocrScanning) ocrInputRef.current?.click(); }

  async function handleOcrFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED_MIME.includes(file.type)) {
      showToast("Unsupported file type. Please upload a PDF or image.", "err"); return;
    }
    setOcrScanning(true); setOcrDone(false);
    const fd = new FormData();
    fd.append("ocrText", file);
    fd.append("policyFile", file);
    try {
      const res          = await dispatch(extractData(API_URL, fd));
      const isSuccess    = res?.success ?? res?.data?.success ?? false;
      const responseData = res?.data ?? res ?? {};
      if (!isSuccess) { showToast(res?.message || "File processing failed!", "err"); return; }
      const rawOcrText = responseData.ocrText ?? res?.ocrText ?? "";
      let fields = {};
      if (rawOcrText) {
        try { fields = typeof rawOcrText === "string" ? JSON.parse(rawOcrText) : rawOcrText; }
        catch (err) { console.error("OCR JSON parse error:", err); }
      }
      if (!fields || !Object.keys(fields).length) {
        showToast("Could not read document fields. Please fill in manually.", "err"); return;
      }
      const ocrCompany = fields.insuredCompany || responseData.insuredCompany || "";
      const matched    = companies.find((c) => {
        const name = typeof c === "object" ? c.name : c;
        return name?.trim().toLowerCase() === ocrCompany.trim().toLowerCase();
      });
      const resolvedCompany = matched
        ? (typeof matched === "object" ? matched.name : matched)
        : ocrCompany;
      setForm2((prev) => ({
        policy:  fields.policyNumber || responseData.policyNumber || prev.policy,
        company: resolvedCompany,
        type:    normalizeInsuranceType(fields.policyType || prev.type),
        holder:  fields.insuredName  || responseData.proposerName || prev.holder,
        mobile:  prev.mobile,
        email:   prev.email,
      }));
      setOcrDone(true);
      showToast("Scan complete — please verify the details.");
    } catch (err) {
      console.error("OCR error:", err);
      showToast("OCR scan failed. Please fill in manually.", "err");
    } finally { setOcrScanning(false); }
  }

  // ── Document helpers ──────────────────────────────────────────────────────
  function validateDocFile(file) {
    if (!ALLOWED_MIME.includes(file.type))
      return `${file.name}: unsupported format. Use PDF, JPG, PNG or WEBP.`;
    if (file.size > MAX_FILE_MB * 1024 * 1024)
      return `${file.name}: exceeds ${MAX_FILE_MB} MB limit.`;
    return null;
  }

  function handleFileSelect(docKey, file) {
    const err = validateDocFile(file);
    if (err) { showToast(err, "err"); return; }
    setUploadedFiles((prev) => ({ ...prev, [docKey]: file }));
    clearErr(`doc_${docKey}`);
  }

  function removeFile(docKey) {
    setUploadedFiles((prev) => { const n = { ...prev }; delete n[docKey]; return n; });
  }

  function handleDrop(docKey, e) {
    e.preventDefault();
    setDragOver((p) => ({ ...p, [docKey]: false }));
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(docKey, file);
  }

  function fmtSize(bytes) {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function fileIcon(mime) {
    if (mime === "application/pdf") return "fa-file-pdf";
    if (mime?.startsWith("image/")) return "fa-file-image";
    return "fa-file";
  }

  // ── Validation ────────────────────────────────────────────────────────────
  function validateStep2() {
    const errs = {};
    const checks = {
      policy:  validateRequired(form2.policy,  "Policy number"),
      company: validateRequired(form2.company, "Insurance company"),
      holder:  validateRequired(form2.holder,  "Proposer name"),
      mobile:  validatePhoneNumber(form2.mobile),
      email:   validateEmail(form2.email),
    };
    Object.entries(checks).forEach(([f, r]) => { if (!r.valid) errs[f] = r.error; });
    return errs;
  }

  function validateStep3() {
    const errs = {};
    const req  = (val, key, label) => { if (!val?.trim()) errs[key] = `${label} is required`; };
    req(form3.date,  "date",  "Date of incident");
    req(form3.place, "place", "Place of incident");
    req(form3.desc,  "desc",  "Description of loss");

    if (form2.type === "Motor") {
      if (!form3.vehicleDrivable)         errs.vehicleDrivable         = "Please indicate if the vehicle is drivable";
      if (!form3.vehicleDrivenAtAccident) errs.vehicleDrivenAtAccident = "Please indicate if vehicle was being driven";
      if (form3.vehicleDrivenAtAccident === "yes") {
        req(form3.driverName,           "driverName",           "Driver name");
        req(form3.drivingLicenseNumber, "drivingLicenseNumber", "Driving licence number");
      }
      if (!form3.typeOfLoss)      errs.typeOfLoss      = "Please select the type of loss";
      if (!form3.firLodged)       errs.firLodged       = "Please indicate FIR status";
      if (!form3.vehicleAtGarage) errs.vehicleAtGarage = "Please indicate vehicle location";
      if (form3.vehicleAtGarage === "yes") {
        req(form3.garageName,    "garageName",    "Garage name");
        req(form3.garageCity,    "garageCity",    "Garage city");
        req(form3.garageState,   "garageState",   "Garage state");
        req(form3.garageContact, "garageContact", "Garage contact number");
      }
      if (form3.vehicleAtGarage === "no") {
        req(form3.surveyCity,    "surveyCity",    "City");
        req(form3.surveyState,   "surveyState",   "State");
        req(form3.surveyContact, "surveyContact", "Contact number at vehicle location");
        req(form3.surveyAvailableDate, "surveyAvailableDate", "Available date");
        req(form3.surveyAvailableTime, "surveyAvailableTime", "Available time");
      }
    }

    if (form2.type === "Health") {
      req(form3.patientName,     "patientName",     "Patient name");
      req(form3.hospitalName,    "hospitalName",    "Hospital name");
      req(form3.hospitalAddress, "hospitalAddress", "Hospital address");
      req(form3.hospitalContact, "hospitalContact", "Hospital contact number");
      req(form3.city,            "city",            "City");
      if (!form3.hospitalizationType) errs.hospitalizationType = "Please select hospitalization type";
      req(form3.dateOfAdmission, "dateOfAdmission", "Date of admission");
    }

    return errs;
  }

  function validateStep4() {
    const errs = {};
    const docs  = REQUIRED_DOCS[form2.type] || [];
    docs.filter((d) => d.required).forEach((d) => {
      if (!uploadedFiles[d.key]) errs[`doc_${d.key}`] = `${d.label} is required`;
    });
    return errs;
  }

  function handleContinueStep2() {
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    goStep(3);
  }

  function handleContinueStep3() {
    const errs = validateStep3();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    goStep(4);
  }

  function handleContinueStep4() {
    const errs = validateStep4();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    goStep(5);
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function submitFinal() {
    if (!decl) { showToast("Please accept the declaration to proceed.", "err"); return; }
    setSubmitting(true);
    const fd = new FormData();

    fd.append("policySource",     selectedPolicy ? "coverkraft" : "external");
// was: fd.append("policyId", selectedPolicy._id || selectedPolicy.policyId);
fd.append("policyId", selectedPolicy.policyId || selectedPolicy._id || selectedPolicy.id);
    fd.append("policyNumber",        form2.policy);
    fd.append("insuranceCompany",    form2.company);
    fd.append("insuranceType",       form2.type.toLowerCase());
    fd.append("proposerName",        form2.holder);
    fd.append("registeredMobile",    form2.mobile);
    fd.append("registeredEmail",     form2.email);
    fd.append("dateOfIncident",      form3.date);
    fd.append("timeOfIncident",      form3.time);
    fd.append("placeOfIncident",     form3.place);
    fd.append("descriptionOfLoss",   form3.desc);
    fd.append("declarationAccepted", "true");
    if (form3.estimatedClaimAmount)
      fd.append("estimatedClaimAmount", form3.estimatedClaimAmount);

    if (form2.type === "Motor") {
      fd.append("vehicleDrivable",         form3.vehicleDrivable);
      fd.append("vehicleDrivenAtAccident", form3.vehicleDrivenAtAccident);
      if (form3.vehicleDrivenAtAccident === "yes") {
        fd.append("driverName",           form3.driverName);
        fd.append("drivingLicenseNumber", form3.drivingLicenseNumber);
      }
      fd.append("typeOfLoss",      form3.typeOfLoss);
      fd.append("firLodged",       form3.firLodged);
      fd.append("vehicleAtGarage", form3.vehicleAtGarage);

      if (form3.vehicleAtGarage === "yes") {
        fd.append("garageName",          form3.garageName);
        fd.append("garageAddress",       form3.garageAddress);
        fd.append("garageCity",          form3.garageCity);
        fd.append("garageDistrict",      form3.garageDistrict);
        fd.append("garageState",         form3.garageState);
        fd.append("garageContact",       form3.garageContact);
        fd.append("garageContactPerson", form3.garageContactPerson);
      }

      if (form3.vehicleAtGarage === "no") {
        fd.append("surveyAddress",         form3.surveyAddress);
        fd.append("surveyCity",            form3.surveyCity);
        fd.append("surveyDistrict",        form3.surveyDistrict);
        fd.append("surveyState",           form3.surveyState);
        fd.append("surveyContact",         form3.surveyContact);
        fd.append("surveyContactPerson",   form3.surveyContactPerson);
        // ── NEW: surveyor availability ────────────────────────────────────
        if (form3.surveyAvailableDate)
          fd.append("surveyAvailableDate", form3.surveyAvailableDate);
        if (form3.surveyAvailableTime)
          fd.append("surveyAvailableTime", form3.surveyAvailableTime);
      }
    }

    if (form2.type === "Health") {
      fd.append("patientName",         form3.patientName);
      fd.append("hospitalName",        form3.hospitalName);
      fd.append("hospitalAddress",     form3.hospitalAddress);
      fd.append("hospitalContact",     form3.hospitalContact);
      fd.append("city",                form3.city);
      fd.append("hospitalizationType", form3.hospitalizationType);
      fd.append("dateOfAdmission",     form3.dateOfAdmission);
      if (form3.diagnosis) fd.append("diagnosis", form3.diagnosis);
    }

    Object.entries(uploadedFiles).forEach(([key, file]) => fd.append(key, file));

    try {
      const res = await dispatch(submitClaim(API_URL, fd));
      if (res?.success === true) {
        setRefNum(res.data?.claimRefNo || "");
        setStep("success");
      } else {
        showToast(res?.message || "Submission failed. Please try again.", "err");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Failed to submit. Please try again later.", "err");
    } finally { setSubmitting(false); }
  }

  // ── Locked field style ────────────────────────────────────────────────────
  const lockedSx = {
    ...inputSx,
    background: "rgba(255,179,0,0.04)",
    borderColor: "rgba(255,179,0,0.2)",
    color: T.text,
    cursor: "not-allowed",
    opacity: 0.85,
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  function ToggleGroup({ field, options, label, required: req, error }) {
    return (
      <div style={{ marginBottom: 16 }}>
        <label className="ck-label">
          {label}{req && <span style={{ color: T.danger }}> *</span>}
        </label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {options.map((opt) => (
            <Button
              key={opt.value}
              text={opt.label}
              onClick={() => f3Set(field, opt.value)}
              bgcolor={form3[field] === opt.value ? T.accent : "transparent"}
              color={form3[field] === opt.value ? "#000" : T.text}
              borderColor={form3[field] === opt.value ? "transparent" : T.border}
              padding="9px 22px"
              fontSize="13px"
            />
          ))}
        </div>
        {error && <span className="ck-err-msg">{error}</span>}
      </div>
    );
  }

  function SectionLabel({ text }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 16px" }}>
        <div style={{ height: 1, flex: 1, background: T.border }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>
          {text}
        </span>
        <div style={{ height: 1, flex: 1, background: T.border }} />
      </div>
    );
  }

  function DocUploadCard({ docKey, label, hint, required: req }) {
    const fileRef  = useRef(null);
    const file     = uploadedFiles[docKey];
    const isOver   = dragOver[docKey] || false;
    const hasError = errors[`doc_${docKey}`];

    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span className="ck-label" style={{ margin: 0 }}>{label}</span>
          {req
            ? <span style={{ color: T.danger, fontSize: 13 }}>*</span>
            : <span style={{ fontSize: 11, color: T.muted, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "1px 7px" }}>Optional</span>
          }
        </div>

        {file ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px",
            background: "rgba(255,179,0,0.04)",
            border: `1.5px solid ${T.accent}`,
            borderRadius: 12,
          }}>
            <i className={`fa-solid ${fileIcon(file.type)}`} style={{ fontSize: 22, color: T.accent, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: T.muted, marginTop: 2 }}>{fmtSize(file.size)}</p>
            </div>
            <button
              onClick={() => removeFile(docKey)}
              title="Remove file"
              style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 6, borderRadius: 6, lineHeight: 1 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.danger)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
            >
              <i className="fa-solid fa-xmark" style={{ fontSize: 14 }} />
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            onDrop={(e) => handleDrop(docKey, e)}
            onDragOver={(e) => { e.preventDefault(); setDragOver((p) => ({ ...p, [docKey]: true })); }}
            onDragLeave={() => setDragOver((p) => ({ ...p, [docKey]: false }))}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px",
              border: `1.5px dashed ${hasError ? T.danger : isOver ? T.accent : T.border}`,
              borderRadius: 12,
              cursor: "pointer",
              background: isOver ? "rgba(255,179,0,0.04)" : "transparent",
              transition: "border-color 0.15s, background 0.15s",
              outline: "none",
            }}
          >
            <i
              className="fa-solid fa-cloud-arrow-up"
              style={{ fontSize: 22, color: isOver ? T.accent : T.muted, flexShrink: 0, transition: "color 0.15s" }}
            />
            <div>
              <p style={{ margin: 0, fontSize: 13, color: T.text, fontWeight: 500 }}>
                <span style={{ color: T.accent }}>Click to upload</span> or drag & drop
              </p>
              <p style={{ margin: 0, fontSize: 11, color: T.muted, marginTop: 3 }}>
                {hint} · PDF, JPG, PNG, WEBP · max {MAX_FILE_MB} MB
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) handleFileSelect(docKey, f);
              }}
            />
          </div>
        )}
        {hasError && <span className="ck-err-msg">{hasError}</span>}
      </div>
    );
  }

  const STEPS = [
    { n: 1, label: "Type"   },
    { n: 2, label: "Policy" },
    { n: 3, label: "Claim"  },
    { n: 4, label: "Docs"   },
    { n: 5, label: "Finish" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>

      <input
        ref={ocrInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        style={{ display: "none" }}
        onChange={handleOcrFileChange}
      />

      {/* ── Progress bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, position: "relative" }}>
        {STEPS.map((s, idx) => {
          const isDone   = typeof step === "number" && s.n < step;
          const isActive = step === s.n;
          return (
            <div key={s.n} style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 2 }}>
              {idx < STEPS.length - 1 && (
                <div style={{ position: "absolute", top: 15, left: "50%", width: "100%", height: 1, background: T.border, zIndex: -1 }} />
              )}
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: isDone ? T.accent : T.bg, border: `1.5px solid ${isDone ? T.accent : isActive ? T.primary : T.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: isDone ? "#000" : isActive ? T.primary : T.muted, boxShadow: isActive ? `0 0 0 4px rgba(255,179,0,0.1)` : "none" }}>
                {isDone ? <i className="fa-solid fa-check" style={{ fontSize: 10 }} /> : s.n}
              </div>
              <div style={{ fontSize: 10, marginTop: 8, fontWeight: 700, color: T.muted, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 24, padding: 42 }}>

        {/* ════════════════════════════ STEP 1 — Type ═════════════════════════ */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Select Claim Type</h2>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 32 }}>Choose the insurance product you want to raise a claim for.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 32 }}>
              {[
                { id: "Health", icon: "fa-heart-pulse", label: "Health Insurance", sub: "Hospitalization expenses"  },
                { id: "Motor",  icon: "fa-car-burst",   label: "Motor Insurance",  sub: "Accident & vehicle damage" },
                { id: "Life",   icon: "fa-umbrella",    label: "Life Insurance",   sub: "Death & maturity claims"   },
              ].map((t) => (
                <TypeCard key={t.id} selected={category === t.id} onClick={() => pickCategory(t.id)}>
                  <i className={`fa-solid ${t.icon}`} style={{ fontSize: 28, color: T.primary, marginBottom: 12, display: "block" }} />
                  <h4 style={{ fontSize: 15, fontWeight: 700 }}>{t.label}</h4>
                  <p style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{t.sub}</p>
                </TypeCard>
              ))}
            </div>

      {category && (
  <div style={{ marginTop: 32, borderTop: `1px solid ${T.border}`, paddingTop: 32 }}>
    <label className="ck-label">Your Active {category} Policies</label>
    <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
      {policiesLoading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", color: T.muted, fontSize: 13 }}>
          <i className="fa-solid fa-spinner fa-spin" />
          <span>Loading your {category.toLowerCase()} policies…</span>
        </div>
      ) : policies.length > 0 ? (
       policies.map((p) => {
  const pId        = String(p.policyId || p._id || p.id || "");
  const selectedId = String(selectedPolicy?.policyId || selectedPolicy?._id || selectedPolicy?.id || "");
  const isSelected = pId !== "" && selectedId !== "" && pId === selectedId;

  return (
    <PolicyItem
      key={pId}
      policy={p}
      selected={isSelected}
      onClick={() => selectPolicy(p)}
    />
  );
})
      ) : (
        <p style={{ color: T.muted, fontSize: 13, padding: "12px 0" }}>
          No active {category.toLowerCase()} policies found in your account.
        </p>
      )}
    </div>
    <Button
      text="My policy isn't listed — add it manually"
      onClick={() => { setIsManual(true); setSelectedPolicy(null); goStep(2); }}
      bgcolor="transparent"
      color={T.muted}
      borderColor={T.border}
      width="100%"
      customStyle={{ borderStyle: "dashed", borderRadius: "14px" }}
    />
  </div>
)}
            <div style={stepNav()}>
              <Button text="Cancel"   onClick={() => navigate("home")} bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Continue" onClick={() => goStep(2)}        bgcolor={T.accent}    color="#000"    disabled={!selectedPolicy} />
            </div>
          </div>
        )}

        {/* ═══════════════════════════ STEP 2 — Policy ════════════════════════ */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Policy Details</h2>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 24 }}>
              {isManual
                ? "Upload your policy document to auto-fill, or enter the details manually below."
                : "Your policy details have been pre-filled. Edit mobile and email if needed."}
            </p>

            {isManual && (
              <>
                <OcrZone scanning={ocrScanning} onScan={handleOcrClick} />
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ height: 1, flex: 1, background: T.border }} />
                  <span style={{ fontSize: 10, color: T.muted, fontWeight: 800, textTransform: "uppercase" }}>or enter manually</span>
                  <div style={{ height: 1, flex: 1, background: T.border }} />
                </div>
              </>
            )}

            {ocrScanning && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: T.muted }}>
                <i className="fa-solid fa-spinner fa-spin" />
                <span>Scanning your document…</span>
              </div>
            )}

            {ocrDone && !ocrScanning && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.successBg, border: "1px solid rgba(196,237,63,.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: T.accent }}>
                <i className="fa-solid fa-circle-check" />
                <span>
                  {isManual
                    ? "Details auto-filled from your document. Locked fields are read-only — update mobile & email if needed."
                    : "Details loaded from your policy record."}
                </span>
              </div>
            )}

            <fieldset disabled={ocrScanning} style={{ border: "none", padding: 0, margin: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <CustomInput
                  label="Policy Number"
                  name="policy"
                  value={form2.policy}
                  onChange={(e) => { if (!ocrDone) { setForm2((f) => ({ ...f, policy: e.target.value })); clearErr("policy"); } }}
                  placeholder="e.g. POL-2024-001 or HDFC5748123"
                  validationMessage={errors.policy}
                  sx={ocrDone ? lockedSx : inputSx}
                  required
                  disabled={ocrDone}
                />

                {ocrDone && form2.company ? (
                  <div>
                    <CustomInput
                      label="Insurance Company"
                      name="company"
                      value={form2.company}
                      onChange={() => {}}
                      validationMessage={errors.company}
                      sx={lockedSx}
                      required
                      disabled
                    />
                    <p style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>
                      <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: 4, fontSize: 9 }} />
                      Auto-detected from your document
                    </p>
                  </div>
                ) : (
                  <CustomInput
                    type="select"
                    label="Insurance Company"
                    name="company"
                    value={form2.company}
                    onChange={(e) => { setForm2((f) => ({ ...f, company: e.target.value })); clearErr("company"); }}
                    validationMessage={errors.company}
                    sx={inputSx}
                    required
                  >
                    <option value="">
                      {companies.length === 0 ? "Loading companies…" : "Select your insurer"}
                    </option>
                    {companies.map((c) => (
                      <option
                        key={typeof c === "object" ? c._id || c.id : c}
                        value={typeof c === "object" ? c.name : c}
                      >
                        {typeof c === "object" ? c.name : c}
                      </option>
                    ))}
                  </CustomInput>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {ocrDone ? (
                  <CustomInput label="Insurance Type" name="type" value={form2.type} onChange={() => {}} sx={lockedSx} required disabled />
                ) : (
                  <CustomInput
                    type="select"
                    label="Insurance Type"
                    name="type"
                    value={form2.type}
                    onChange={(e) => setForm2((f) => ({ ...f, type: e.target.value }))}
                    sx={inputSx}
                    required
                  >
                    <option value="Motor">Motor</option>
                    <option value="Health">Health</option>
                    <option value="Life">Life</option>
                  </CustomInput>
                )}
                <CustomInput
                  label="Proposer / Insured Name"
                  name="holder"
                  value={form2.holder}
                  onChange={(e) => { if (!ocrDone) { setForm2((f) => ({ ...f, holder: e.target.value })); clearErr("holder"); } }}
                  placeholder="Full name as printed on the policy"
                  validationMessage={errors.holder}
                  sx={ocrDone ? lockedSx : inputSx}
                  required
                  disabled={ocrDone}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <CustomInput
                  type="tel"
                  label="Registered Mobile"
                  name="mobile"
                  value={form2.mobile}
                  onChange={(e) => { setForm2((f) => ({ ...f, mobile: e.target.value })); clearErr("mobile"); }}
                  placeholder="10-digit mobile number"
                  validationMessage={errors.mobile}
                  sx={inputSx}
                  required
                />
                <CustomInput
                  type="email"
                  label="Registered Email"
                  name="email"
                  value={form2.email}
                  onChange={(e) => { setForm2((f) => ({ ...f, email: e.target.value })); clearErr("email"); }}
                  placeholder="yourname@example.com"
                  validationMessage={errors.email}
                  sx={inputSx}
                  required
                />
              </div>
            </fieldset>

            <div style={stepNav()}>
              <Button text="Back"     onClick={() => goStep(1)}     bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Continue" onClick={handleContinueStep2} bgcolor={T.accent}    color="#000"    disabled={ocrScanning} />
            </div>
          </div>
        )}

        {/* ═══════════════════════════ STEP 3 — Claim ═════════════════════════ */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Incident Details</h2>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 24 }}>Tell us when, where and what happened.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
  
  {/* Date of Incident */}
  <div>
    <label className="ck-label">
      Date of Incident <span style={{ color: T.danger }}>*</span>
    </label>
    <input
      type="date"
      name="date"
      value={form3.date}
      max={new Date().toISOString().split("T")[0]}
      onKeyDown={(e) => e.preventDefault()}      
      onChange={(e) => {
        const chosen = e.target.value;
        const today  = new Date().toISOString().split("T")[0];
        if (chosen > today) return;                {/* hard block future */}
        f3Set("date", chosen);
        f3Set("time", "");                         {/* reset time on date change */}
      }}
      style={{
        ...inputSx,
        width: "100%",
        boxSizing: "border-box",
        colorScheme: "dark",
      }}
    />
    {errors.date && <span className="ck-err-msg">{errors.date}</span>}
  </div>

  {/* Time of Incident */}
  <div>
    <label className="ck-label">Time of Incident</label>
    <input
      type="time"
      name="time"
      value={form3.time}
      max={
        form3.date === new Date().toISOString().split("T")[0]
          ? new Date().toTimeString().slice(0, 5)
          : undefined
      }
      onKeyDown={(e) => e.preventDefault()}        
      onChange={(e) => {
        const chosen    = e.target.value;
        const today     = new Date().toISOString().split("T")[0];
        const liveNow   = new Date().toTimeString().slice(0, 5);
        if (form3.date === today && chosen > liveNow) return;  
        f3Set("time", chosen);
      }}
      style={{
        ...inputSx,
        width: "100%",
        boxSizing: "border-box",
        colorScheme: "dark",
      }}
    />
    {errors.time && <span className="ck-err-msg">{errors.time}</span>}
  </div>

</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <CustomInput
                label="Place of Incident"
                name="place"
                value={form3.place}
                onChange={(e) => f3Set("place", e.target.value)}
                placeholder="e.g. NH48 near Khopoli Toll, Mumbai"
                validationMessage={errors.place}
                sx={inputSx}
                required
              />
              <CustomInput
                type="number"
                label="Estimated Claim Amount (₹)"
                name="estimatedClaimAmount"
                value={form3.estimatedClaimAmount}
                onChange={(e) => f3Set("estimatedClaimAmount", e.target.value)}
                placeholder="e.g. 75000"
                sx={inputSx}
                min="0"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <CustomInput
                type="textarea"
                label="Description of Loss"
                name="desc"
                value={form3.desc}
                onChange={(e) => f3Set("desc", e.target.value)}
                placeholder="Describe what happened in detail — vehicle condition, cause of damage, injuries sustained, circumstances, etc."
                validationMessage={errors.desc}
                sx={{ ...inputSx, resize: "vertical", minHeight: 90 }}
                required
              />
            </div>

            {/* ── MOTOR ── */}
            {form2.type === "Motor" && (
              <>
                <SectionLabel text="Vehicle Condition" />

                <ToggleGroup
                  field="vehicleDrivable"
                  label="Is the vehicle drivable?"
                  required
                  error={errors.vehicleDrivable}
                  options={[
                    { value: "yes", label: "Yes — can be driven" },
                    { value: "no",  label: "No — not drivable"  },
                  ]}
                />

                <ToggleGroup
                  field="vehicleDrivenAtAccident"
                  label="Was the vehicle being driven at the time of the accident?"
                  required
                  error={errors.vehicleDrivenAtAccident}
                  options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                />

                {form3.vehicleDrivenAtAccident === "yes" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <CustomInput
                      label="Driver Name"
                      name="driverName"
                      value={form3.driverName}
                      onChange={(e) => f3Set("driverName", e.target.value)}
                      placeholder="Full name of the driver at the time"
                      validationMessage={errors.driverName}
                      sx={inputSx}
                      required
                    />
                    <CustomInput
                      label="Driving Licence Number"
                      name="drivingLicenseNumber"
                      value={form3.drivingLicenseNumber}
                      onChange={(e) => f3Set("drivingLicenseNumber", e.target.value)}
                      placeholder="e.g. MH0220200098765"
                      validationMessage={errors.drivingLicenseNumber}
                      sx={inputSx}
                      required
                    />
                  </div>
                )}

                <SectionLabel text="Claim Information" />

                <div style={{ marginBottom: 16 }}>
                  <label className="ck-label">Type of Loss <span style={{ color: T.danger }}>*</span></label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { value: "own damage",       label: "Own Damage"        },
                      { value: "third party",       label: "Third Party"       },
                      { value: "theft",             label: "Theft"             },
                      { value: "personal accident", label: "Personal Accident" },
                    ].map((opt) => (
                      <Button
                        key={opt.value}
                        text={opt.label}
                        onClick={() => f3Set("typeOfLoss", opt.value)}
                        bgcolor={form3.typeOfLoss === opt.value ? T.accent : "transparent"}
                        color={form3.typeOfLoss === opt.value ? "#000" : T.text}
                        borderColor={form3.typeOfLoss === opt.value ? "transparent" : T.border}
                        padding="9px 22px"
                        fontSize="13px"
                      />
                    ))}
                  </div>
                  {errors.typeOfLoss && <span className="ck-err-msg">{errors.typeOfLoss}</span>}
                </div>

                <ToggleGroup
                  field="firLodged"
                  label="Has an FIR been lodged with the police?"
                  required
                  error={errors.firLodged}
                  options={[
                    { value: "yes", label: "Yes — FIR filed" },
                    { value: "no",  label: "No FIR filed"    },
                  ]}
                />

                <SectionLabel text="Vehicle Current Location" />

                <ToggleGroup
                  field="vehicleAtGarage"
                  label="Is the vehicle currently at a garage?"
                  required
                  error={errors.vehicleAtGarage}
                  options={[
                    { value: "yes", label: "Yes — at a garage"         },
                    { value: "no",  label: "No — needs surveyor visit" },
                  ]}
                />

                {/* Garage details */}
                {form3.vehicleAtGarage === "yes" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <CustomInput
                        label="Garage Name"
                        name="garageName"
                        value={form3.garageName}
                        onChange={(e) => f3Set("garageName", e.target.value)}
                        placeholder="e.g. Krishna Auto Workshop"
                        validationMessage={errors.garageName}
                        sx={inputSx}
                        required
                      />
                      <CustomInput
                        label="Garage Contact Number"
                        name="garageContact"
                        value={form3.garageContact}
                        onChange={(e) => f3Set("garageContact", e.target.value)}
                        placeholder="Garage phone number"
                        validationMessage={errors.garageContact}
                        sx={inputSx}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <CustomInput
                        label="Garage Address"
                        name="garageAddress"
                        value={form3.garageAddress}
                        onChange={(e) => f3Set("garageAddress", e.target.value)}
                        placeholder="Street address or landmark near garage"
                        sx={inputSx}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <CustomInput
                        label="City"
                        name="garageCity"
                        value={form3.garageCity}
                        onChange={(e) => f3Set("garageCity", e.target.value)}
                        placeholder="e.g. Pune"
                        validationMessage={errors.garageCity}
                        sx={inputSx}
                        required
                      />
                      <CustomInput
                        label="District"
                        name="garageDistrict"
                        value={form3.garageDistrict}
                        onChange={(e) => f3Set("garageDistrict", e.target.value)}
                        placeholder="e.g. Pune"
                        sx={inputSx}
                      />
                      <CustomInput
                        label="State"
                        name="garageState"
                        value={form3.garageState}
                        onChange={(e) => f3Set("garageState", e.target.value)}
                        placeholder="e.g. Maharashtra"
                        validationMessage={errors.garageState}
                        sx={inputSx}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <CustomInput
                        label="Contact Person at Garage"
                        name="garageContactPerson"
                        value={form3.garageContactPerson}
                        onChange={(e) => f3Set("garageContactPerson", e.target.value)}
                        placeholder="Name of person to coordinate with at garage"
                        sx={inputSx}
                      />
                    </div>
                  </>
                )}

                {/* Survey location */}
                {form3.vehicleAtGarage === "no" && (
                  <>
                    <p style={{ fontSize: 13, color: T.muted, marginBottom: 14, lineHeight: 1.6, display: "flex", gap: 8 }}>
                      <i className="fa-solid fa-location-dot" style={{ color: T.primary, marginTop: 1 }} />
                      Provide the vehicle's current location so our surveyor can visit and assess the damage.
                    </p>
                    <div style={{ marginBottom: 16 }}>
                      <CustomInput
                        label="Vehicle Location / Address"
                        name="surveyAddress"
                        value={form3.surveyAddress}
                        onChange={(e) => f3Set("surveyAddress", e.target.value)}
                        placeholder="Street address, colony or GPS landmark"
                        sx={inputSx}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <CustomInput
                        label="City"
                        name="surveyCity"
                        value={form3.surveyCity}
                        onChange={(e) => f3Set("surveyCity", e.target.value)}
                        placeholder="e.g. Mumbai"
                        validationMessage={errors.surveyCity}
                        sx={inputSx}
                        required
                      />
                      <CustomInput
                        label="District"
                        name="surveyDistrict"
                        value={form3.surveyDistrict}
                        onChange={(e) => f3Set("surveyDistrict", e.target.value)}
                        placeholder="e.g. Mumbai Suburban"
                        sx={inputSx}
                      />
                      <CustomInput
                        label="State"
                        name="surveyState"
                        value={form3.surveyState}
                        onChange={(e) => f3Set("surveyState", e.target.value)}
                        placeholder="e.g. Maharashtra"
                        validationMessage={errors.surveyState}
                        sx={inputSx}
                        required
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <CustomInput
                        label="Contact Number at Location"
                        name="surveyContact"
                        value={form3.surveyContact}
                        onChange={(e) => f3Set("surveyContact", e.target.value)}
                        placeholder="Reachable number at vehicle's location"
                        validationMessage={errors.surveyContact}
                        sx={inputSx}
                        required
                      />
                      <CustomInput
                        label="Contact Person at Location"
                        name="surveyContactPerson"
                        value={form3.surveyContactPerson}
                        onChange={(e) => f3Set("surveyContactPerson", e.target.value)}
                        placeholder="Name of person available at location"
                        sx={inputSx}
                      />
                    </div>

                    {/* ── NEW: Surveyor availability ── */}
                    <SectionLabel text="Surveyor Availability" />
                    <p style={{ fontSize: 13, color: T.muted, marginBottom: 14, lineHeight: 1.6, display: "flex", gap: 8 }}>
                      <i className="fa-solid fa-calendar-check" style={{ color: T.primary, marginTop: 1 }} />
                      When will the vehicle be available for the surveyor to inspect?
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <CustomInput
                        type="date"
                        label="Available Date"
                        name="surveyAvailableDate"
                        value={form3.surveyAvailableDate}
                        onChange={(e) => f3Set("surveyAvailableDate", e.target.value)}
                        validationMessage={errors.surveyAvailableDate}
                        sx={inputSx}
                        required
                      />
                      <CustomInput
                        type="time"
                        label="Available Time"
                        name="surveyAvailableTime"
                        value={form3.surveyAvailableTime}
                        onChange={(e) => f3Set("surveyAvailableTime", e.target.value)}
                        validationMessage={errors.surveyAvailableTime}
                        sx={inputSx}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── HEALTH ── */}
            {form2.type === "Health" && (
              <>
                <SectionLabel text="Patient Details" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <CustomInput
                    label="Patient Name"
                    name="patientName"
                    value={form3.patientName}
                    onChange={(e) => f3Set("patientName", e.target.value)}
                    placeholder="Full name of the patient"
                    validationMessage={errors.patientName}
                    sx={inputSx}
                    required
                  />
                  <CustomInput
                    type="date"
                    label="Date of Admission"
                    name="dateOfAdmission"
                    value={form3.dateOfAdmission}
                    onChange={(e) => f3Set("dateOfAdmission", e.target.value)}
                    validationMessage={errors.dateOfAdmission}
                    sx={inputSx}
                    required
                  />
                </div>

                <ToggleGroup
                  field="hospitalizationType"
                  label="Hospitalization Type"
                  required
                  error={errors.hospitalizationType}
                  options={[
                    { value: "planned",   label: "Planned — scheduled in advance" },
                    { value: "emergency", label: "Emergency — sudden / unplanned"  },
                  ]}
                />

                <SectionLabel text="Hospital Details" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <CustomInput
                    label="Hospital Name"
                    name="hospitalName"
                    value={form3.hospitalName}
                    onChange={(e) => f3Set("hospitalName", e.target.value)}
                    placeholder="e.g. Kokilaben Dhirubhai Ambani Hospital"
                    validationMessage={errors.hospitalName}
                    sx={inputSx}
                    required
                  />
                  <CustomInput
                    label="Hospital Contact Number"
                    name="hospitalContact"
                    value={form3.hospitalContact}
                    onChange={(e) => f3Set("hospitalContact", e.target.value)}
                    placeholder="Hospital's main phone / helpdesk number"
                    validationMessage={errors.hospitalContact}
                    sx={inputSx}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
                  <CustomInput
                    label="Hospital Address"
                    name="hospitalAddress"
                    value={form3.hospitalAddress}
                    onChange={(e) => f3Set("hospitalAddress", e.target.value)}
                    placeholder="Full street address of the hospital"
                    validationMessage={errors.hospitalAddress}
                    sx={inputSx}
                    required
                  />
                  <CustomInput
                    label="City"
                    name="city"
                    value={form3.city}
                    onChange={(e) => f3Set("city", e.target.value)}
                    placeholder="e.g. Mumbai"
                    validationMessage={errors.city}
                    sx={inputSx}
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <CustomInput
                    label="Diagnosis / Reason for Admission"
                    name="diagnosis"
                    value={form3.diagnosis}
                    onChange={(e) => f3Set("diagnosis", e.target.value)}
                    placeholder="e.g. Acute appendicitis, fracture of femur, dengue fever with thrombocytopenia"
                    sx={inputSx}
                  />
                </div>
              </>
            )}

            {/* ── LIFE ── */}
            {form2.type === "Life" && (
              <>
                <SectionLabel text="Life Claim" />
                <div style={{ display: "flex", gap: 12, padding: "16px 20px", background: "rgba(255,179,0,0.04)", border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 16 }}>
                  <i className="fa-solid fa-circle-info" style={{ color: T.primary, fontSize: 16, flexShrink: 0, marginTop: 2 }} />
                  <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                    Our claims team will contact you to guide you through the life claim process and collect additional documentation such as a death certificate, legal heir certificate or discharge summary.
                  </p>
                </div>
              </>
            )}

            <div style={stepNav()}>
              <Button text="Back"     onClick={() => goStep(2)}     bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Continue" onClick={handleContinueStep3} bgcolor={T.accent}    color="#000" />
            </div>
          </div>
        )}

        {/* ═══════════════════════════ STEP 4 — Docs ══════════════════════════ */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Upload Documents</h2>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 28 }}>
              Upload supporting documents for your {form2.type.toLowerCase()} claim.
              Fields marked <span style={{ color: T.danger }}>*</span> are mandatory.
            </p>

            {(REQUIRED_DOCS[form2.type] || []).map((doc) => (
              <DocUploadCard
                key={doc.key}
                docKey={doc.key}
                label={doc.label}
                hint={doc.hint}
                required={doc.required}
              />
            ))}

            {Object.keys(uploadedFiles).length > 0 && (
              <div style={{ marginTop: 4, padding: "10px 14px", background: T.successBg, border: "1px solid rgba(196,237,63,.15)", borderRadius: 10, fontSize: 12, color: T.accent }}>
                <i className="fa-solid fa-circle-check" style={{ marginRight: 6 }} />
                {Object.keys(uploadedFiles).length} document{Object.keys(uploadedFiles).length !== 1 ? "s" : ""} attached
              </div>
            )}

            <div style={stepNav()}>
              <Button text="Back"   onClick={() => goStep(3)}     bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Review" onClick={handleContinueStep4} bgcolor={T.accent}    color="#000" />
            </div>
          </div>
        )}

        {/* ═══════════════════════════ STEP 5 — Finish ════════════════════════ */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Review & Submit</h2>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 24 }}>Verify your details before final submission.</p>

            <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 22px", marginBottom: 24 }}>
              {[
                { label: "Policy Number",    value: form2.policy  },
                { label: "Insurer",          value: form2.company },
                { label: "Insurance Type",   value: form2.type    },
                { label: "Proposer",         value: form2.holder  },
                { label: "Mobile",           value: form2.mobile  },
                { label: "Date of Incident", value: form3.date    },
                { label: "Place",            value: form3.place   },
                ...(form2.type === "Motor" && form3.vehicleAtGarage === "no" && form3.surveyAvailableDate
                  ? [{ label: "Survey Available", value: `${form3.surveyAvailableDate}${form3.surveyAvailableTime ? " at " + form3.surveyAvailableTime : ""}` }]
                  : []
                ),
                { label: "Documents",        value: `${Object.keys(uploadedFiles).length} file(s) attached` },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: T.muted, minWidth: 148, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ color: T.text, fontWeight: 500 }}>{row.value || "—"}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <input
                type="checkbox"
                id="ck-decl"
                checked={decl}
                onChange={(e) => setDecl(e.target.checked)}
                style={{ marginTop: 3, flexShrink: 0 }}
              />
              <label htmlFor="ck-decl" style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: T.text }}>
                I hereby declare that the information provided in this claim intimation is true and accurate to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my claim.
              </label>
            </div>

            <div style={stepNav()}>
              <Button text="Back" onClick={() => goStep(4)} bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button
                text={submitting ? "Submitting…" : "Submit Claim"}
                onClick={submitFinal}
                bgcolor={T.accent}
                color="#000"
                disabled={submitting || !decl}
              />
            </div>
          </div>
        )}

        {/* ═════════════════════════════ SUCCESS ══════════════════════════════ */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 64, height: 64, background: T.successBg, color: T.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>
              <i className="fa-solid fa-check" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700 }}>Claim Intimated!</h2>
            <p style={{ color: T.muted, fontSize: 14, marginTop: 8 }}>
              Your claim has been submitted. Our team will review it and contact you shortly.
            </p>
            {refNum && (
              <div style={{ margin: "24px auto 0", display: "inline-block", padding: "10px 28px", background: "rgba(255,179,0,0.08)", border: "1px solid rgba(255,179,0,0.2)", borderRadius: 12 }}>
                <p style={{ color: T.muted, fontSize: 11, margin: 0, letterSpacing: 1, textTransform: "uppercase" }}>Reference Number</p>
                <p style={{ color: T.primary, fontWeight: 800, fontSize: 20, margin: "4px 0 0" }}>{refNum}</p>
              </div>
            )}
            <div
              style={{
                background: "rgba(255, 179, 0, 0.05)",
                border: "1px solid rgba(255, 179, 0, 0.22)",
                borderRadius: 14,
                padding: "14px 16px",
                margin: "22px auto 0",
                textAlign: "left",
              }}
            >
              <p style={{ color: "#c9c9c9", fontSize: 12.5, lineHeight: 1.6, marginBottom: 0 }}>
                <strong style={{ color: T.text }}>Disclaimer: </strong>
                Claim intimation is registered based on the information and documents provided by the
                customer. Coverkraft Insurance Brokers Private Limited acts only as a facilitator and shall
                not be liable for any claim rejection, dispute, delay, or loss arising due to incorrect,
                incomplete, misleading, or subsequently changed information during insurer assessment.
              </p>
            </div>
            <div>
              <Button
                text="Return to Home"
                onClick={() => { resetWizard(); navigate("home"); }}
                bgcolor={T.accent}
                color="#000"
                customStyle={{ marginTop: 28 }}
              />
            </div>
          </div>
        )}

      </div>
      {step === 1 && (
        <div
          style={{
            background: "rgba(255, 179, 0, 0.05)",
            border: "1px solid rgba(255, 179, 0, 0.22)",
            borderRadius: 14,
            padding: "14px 16px",
            marginTop: 18,
            color: T.text,
          }}
        >
          <p style={{ color: "#c9c9c9", fontSize: 12.5, lineHeight: 1.6, marginBottom: 0 }}>
            <strong style={{ color: T.text }}>Disclaimer: </strong>
            Please ensure that all information and documents submitted for claim intimation are true,
            accurate, and complete. Any incorrect, incomplete, misleading, or subsequently changed
            information may result in delay, investigation, or rejection of the claim by the Insurance
            Company. Coverkraft Insurance Brokers Private Limited acts only as a facilitator for claim
            intimation and registers the claim strictly based on the details provided by the customer.
            Coverkraft shall not be liable for any claim rejection, dispute, or loss arising due to any
            change in facts, statements, or documents during the claim assessment or settlement process
            by the insurer.
          </p>
        </div>
      )}
    </div>
  );
}
