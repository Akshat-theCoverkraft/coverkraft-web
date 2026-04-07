import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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

// ─── NewClaimWizard ───────────────────────────────────────────────────────────
export default function NewClaimWizard({ navigate, showToast }) {
  const dispatch = useDispatch();
const token = sessionStorage.getItem("token");

  const ocrInputRef = useRef(null);

  const [step,            setStep]            = useState(1);
  const [category,        setCategory]        = useState("");
  const [selectedPolicy,  setSelectedPolicy]  = useState(null);
  const [isManual,        setIsManual]        = useState(false);
  const [ocrScanning,     setOcrScanning]     = useState(false);
  const [ocrDone,         setOcrDone]         = useState(false);
  const [prefilling,      setPrefilling]      = useState(false);
  const [refNum,          setRefNum]          = useState("");
  const [firVal,          setFirVal]          = useState("");
  const [decl,            setDecl]            = useState(false);
  const [errors,          setErrors]          = useState({});
  const [submitting,      setSubmitting]      = useState(false);
  const [companies,       setCompanies]       = useState([]);
  const [policies,        setPolicies]        = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(false);

  const [form2, setForm2] = useState({
    policy: "", company: "", type: "Motor", holder: "", mobile: "", email: "",
  });
  const [form3, setForm3] = useState({
    date: "", time: "", place: "", hospital: "", desc: "",
  });

  // ── Load insurance companies on mount ────────────────────────────────────
  useEffect(() => {
    dispatch(fetchInsuranceCompanies(API_URL)).then((res) => {
      if (res?.success && Array.isArray(res.data)) setCompanies(res.data);
    });
  }, []);

  // ── Fetch policies by type whenever category changes ──────────────────────
  useEffect(() => {
    if (!category) return;

    setPoliciesLoading(true);
    setPolicies([]);
    setSelectedPolicy(null);

    dispatch(fetchPoliciesByType(API_URL, category.toLowerCase(), token))
      .then((res) => {
        if (res?.success && Array.isArray(res.data?.policies)) {
          setPolicies(res.data.policies);
        }
      })
      .finally(() => setPoliciesLoading(false));
  }, [category]);

  const clearErr = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  function resetWizard() {
    setStep(1); setCategory(""); setSelectedPolicy(null); setIsManual(false);
    setOcrScanning(false); setOcrDone(false); setDecl(false);
    setFirVal(""); setErrors({}); setSubmitting(false); setPrefilling(false);
    setPolicies([]);
    setForm2({ policy: "", company: "", type: "Motor", holder: "", mobile: "", email: "" });
    setForm3({ date: "", time: "", place: "", hospital: "", desc: "" });
  }

  function pickCategory(cat) {
    setCategory(cat); setSelectedPolicy(null); setIsManual(false);
  }
  function selectPolicy(p) {
    setSelectedPolicy(p); setIsManual(false);
  }

  // ── Step 2 via selected policy → use data directly from policy object ─────
  function goToStep2WithPolicy(policy) {
    setOcrDone(false);
    setErrors({});

    // Use data directly from the policy object — no API call needed
    setForm2({
      policy:  policy.policyNumber     || policy.policy_number || "",
      company: policy.insuranceCompany || policy.company       || "",
      type:    policy.insuranceType    || policy.type          || category || "Motor",
      holder:  policy.insuredName      || policy.holderName    || policy.proposerName || "",
      mobile:  policy.registeredMobile || policy.mobile        || "",
      email:   policy.registeredEmail  || policy.email         || "",
    });

    setOcrDone(true);
    setStep(2);
  }

  // ── Step navigation ───────────────────────────────────────────────────────
  function goStep(n) {
    if (n === 2 && selectedPolicy) {
      goToStep2WithPolicy(selectedPolicy);
      return;
    }
    if (n === 2 && isManual) {
      setForm2({ policy: "", company: "", type: category || "Motor", holder: "", mobile: "", email: "" });
      setOcrDone(false);
    }
    setErrors({});
    setStep(n);
  }

  // ── OCR: open file picker ─────────────────────────────────────────────────
  function handleOcrClick() {
    if (ocrScanning) return;
    ocrInputRef.current?.click();
  }

  async function handleOcrFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      showToast("Unsupported file type. Please upload a PDF or image.", "err");
      return;
    }

    setOcrScanning(true);
    setOcrDone(false);

    const formData = new FormData();
    formData.append("ocrText", file);
    formData.append("policyFile", file);

    try {
      const res = await dispatch(extractData(API_URL, formData));

      // Normalize: support both flat { success, ocrText } and nested { success, data: { ocrText } }
      const isSuccess    = res?.success ?? res?.data?.success ?? false;
      const responseData = res?.data ?? res ?? {};

      if (!isSuccess) {
        showToast(res?.message || res?.data?.message || "File processing failed!", "err");
        return;
      }

      // ocrText may sit at root or inside data
      const rawOcrText = responseData.ocrText ?? res?.ocrText ?? "";

      let extractedFields = {};
      if (rawOcrText) {
        try {
          extractedFields = typeof rawOcrText === "string"
            ? JSON.parse(rawOcrText)
            : rawOcrText;
        } catch (err) {
          console.error("Failed to parse ocrText JSON:", err);
        }
      }

      if (!extractedFields || Object.keys(extractedFields).length === 0) {
        showToast("Could not read document fields. Please fill in manually.", "err");
        return;
      }

      // ── Match company name against loaded list (case-insensitive) ──────
      const ocrCompany     = extractedFields.insuredCompany || responseData.insuredCompany || "";
      const matchedCompany = companies.find((c) => {
        const name = typeof c === "object" ? c.name : c;
        return name?.trim().toLowerCase() === ocrCompany?.trim().toLowerCase();
      });
      const resolvedCompany = matchedCompany
        ? (typeof matchedCompany === "object" ? matchedCompany.name : matchedCompany)
        : ocrCompany;

      setForm2((prev) => ({
        policy:  extractedFields.policyNumber || responseData.policyNumber || prev.policy,
        company: resolvedCompany,
        type:    extractedFields.policyType === "other_vehicle"
                   ? "Motor"
                   : (extractedFields.policyType || prev.type || "Motor"),
        holder:  extractedFields.insuredName  || responseData.proposerName || prev.holder,
        mobile:  prev.mobile,
        email:   prev.email,
      }));

      setOcrDone(true);
      showToast("Scan complete — please verify the details.");

    } catch (error) {
      console.error("OCR extraction error:", error);
      showToast("OCR scan failed. Please fill in manually.", "err");
    } finally {
      setOcrScanning(false);
    }
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
    Object.entries(checks).forEach(([field, result]) => {
      if (!result.valid) errs[field] = result.error;
    });
    return errs;
  }

  function validateStep3() {
    const errs = {};
    const checks = {
      date:  validateRequired(form3.date,  "Date"),
      place: validateRequired(form3.place, "Place"),
      desc:  validateRequired(form3.desc,  "Description"),
    };
    Object.entries(checks).forEach(([field, result]) => {
      if (!result.valid) errs[field] = result.error;
    });
    if (form2.type === "Health" && !form3.hospital) errs.hospital = "Hospital name is required";
    if (form2.type === "Motor"  && !firVal)          errs.fir      = "Please select FIR status";
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

  // ── Submit Final ──────────────────────────────────────────────────────────
  async function submitFinal() {
    if (!decl) { showToast("Accept terms", "err"); return; }

    setSubmitting(true);
    const fd = new FormData();

    fd.append("policySource", selectedPolicy ? "coverkraft" : "external");
    if (selectedPolicy) {
      fd.append("policyId", selectedPolicy.policyId);
    } else {
      fd.append("policyNumber",     form2.policy);
      fd.append("insuranceCompany", form2.company);
    }

    fd.append("insuranceType",       form2.type);
    fd.append("proposerName",        form2.holder);
    fd.append("registeredMobile",    form2.mobile);
    fd.append("registeredEmail",     form2.email);
    fd.append("dateOfIncident",      form3.date);
    fd.append("timeOfIncident",      form3.time);
    fd.append("placeOfIncident",     form3.place);
    fd.append("descriptionOfLoss",   form3.desc);
    fd.append("declarationAccepted", "true");

    if (form2.type === "Motor")  fd.append("firLodged",    firVal);
    if (form2.type === "Health" && form3.hospital) fd.append("hospitalName", form3.hospital);

    try {
      const res = await dispatch(submitClaim(API_URL, fd));
      if (res?.success === true) {
        setRefNum(res.data?.claimRefNo || "");
        setStep("success");
      } else {
        showToast(res?.message || "Submission failed. Please try again.", "err");
      }
    } catch (error) {
      console.error("Claim submission error:", error);
      showToast("Failed to submit. Please try again later.", "err");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Locked field style (shown after OCR / prefill) ────────────────────────
  const lockedSx = {
    ...inputSx,
    background: "rgba(255,179,0,0.04)",
    borderColor: "rgba(255,179,0,0.2)",
    color: T.text,
    cursor: "not-allowed",
    opacity: 0.85,
  };

  const STEPS = [
    { n: 1, label: "Type"   },
    { n: 2, label: "Policy" },
    { n: 3, label: "Claim"  },
    { n: 4, label: "Docs"   },
    { n: 5, label: "Finish" },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>

      {/* Hidden file input triggered by OcrZone click */}
      <input
        ref={ocrInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        style={{ display: "none" }}
        onChange={handleOcrFileChange}
      />

      {/* ── Progress Bar ── */}
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

        {/* ── STEP 1: Claim Type ── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Select Claim Type</h2>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 32 }}>Choose the insurance product for your claim.</p>

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
                <label className="ck-label">Select Active Policy</label>
                <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                  {policiesLoading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", color: T.muted, fontSize: 13 }}>
                      <i className="fa-solid fa-spinner fa-spin" />
                      <span>Loading your policies…</span>
                    </div>
                  ) : policies.length > 0 ? (
                    policies.map((p) => (
                      <PolicyItem
                        key={p._id || p.id}
                        policy={p}
                        selected={(selectedPolicy?._id || selectedPolicy?.id) === (p._id || p.id)}
                        onClick={() => selectPolicy(p)}
                      />
                    ))
                  ) : (
                    <p style={{ color: T.muted, fontSize: 13, padding: "12px 0" }}>
                      No active {category} policies found.
                    </p>
                  )}
                </div>
                <Button
                  text="Not seeing your policy? Add it manually"
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

        {/* ── STEP 2: Policy Details ── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Policy Details</h2>

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

            {/* OCR loading indicator */}
            {ocrScanning && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: T.muted }}>
                <i className="fa-solid fa-spinner fa-spin" />
                <span>Scanning document…</span>
              </div>
            )}

            {/* Auto-fill success banner */}
            {ocrDone && !ocrScanning && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.successBg, border: "1px solid rgba(196,237,63,.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: T.accent }}>
                <i className="fa-solid fa-circle-check" />
                <span>
                  {isManual
                    ? "Details auto-filled from your document. Locked fields are read-only — edit mobile & email as needed."
                    : "Details auto-filled from your policy."}
                </span>
              </div>
            )}

            <fieldset disabled={ocrScanning} style={{ border: "none", padding: 0, margin: 0 }}>

              {/* Row 1: Policy Number + Insurance Company */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

                {/* Policy Number — locked after OCR / prefill */}
                <CustomInput
                  label="Policy Number"
                  name="policy"
                  value={form2.policy}
                  onChange={(e) => { if (!ocrDone) { setForm2((f) => ({ ...f, policy: e.target.value })); clearErr("policy"); } }}
                  placeholder="e.g. CK-9988123"
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
                      onChange={(e) => { setForm2((f) => ({ ...f, company: e.target.value })); clearErr("company"); }}
                      validationMessage={errors.company}
                      sx={lockedSx}
                      required
                      disabled={ocrDone}
                    />
                    <p style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>
                      <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: 4, fontSize: 9 }} />
                      Auto-detected from document
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
                      {companies.length === 0 ? "Loading companies…" : "Select Company"}
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

              {/* Row 2: Insurance Type + Proposer Name — both locked after prefill */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {ocrDone ? (
                  <CustomInput
                    label="Insurance Type"
                    name="type"
                    value={form2.type}
                    onChange={() => {}}
                    sx={lockedSx}
                    required
                    disabled
                  />
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
                    <option>Motor</option>
                    <option>Health</option>
                    <option>Life</option>
                  </CustomInput>
                )}

                <CustomInput
                  label="Proposer Name"
                  name="holder"
                  value={form2.holder}
                  onChange={(e) => { if (!ocrDone) { setForm2((f) => ({ ...f, holder: e.target.value })); clearErr("holder"); } }}
                  placeholder="Full name"
                  validationMessage={errors.holder}
                  sx={ocrDone ? lockedSx : inputSx}
                  required
                  disabled={ocrDone}
                />
              </div>

              {/* Row 3: Mobile + Email — always editable */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <CustomInput
                  type="tel"
                  label="Mobile"
                  name="mobile"
                  value={form2.mobile}
                  onChange={(e) => { setForm2((f) => ({ ...f, mobile: e.target.value })); clearErr("mobile"); }}
                  placeholder="10-digit number"
                  validationMessage={errors.mobile}
                  sx={inputSx}
                  required
                />
                <CustomInput
                  type="email"
                  label="Email"
                  name="email"
                  value={form2.email}
                  onChange={(e) => { setForm2((f) => ({ ...f, email: e.target.value })); clearErr("email"); }}
                  placeholder="you@email.com"
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

        {/* ── STEP 3: Incident Info ── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Incident Info</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <CustomInput type="date" placeholder="Enter date" label="Date" name="date" value={form3.date} onChange={(e) => { setForm3((f) => ({ ...f, date: e.target.value })); clearErr("date"); }} validationMessage={errors.date} sx={inputSx} required />
              <CustomInput type="time" label="Time" name="time" value={form3.time} onChange={(e) => setForm3((f) => ({ ...f, time: e.target.value }))} sx={inputSx} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <CustomInput label="Place" name="place" value={form3.place} onChange={(e) => { setForm3((f) => ({ ...f, place: e.target.value })); clearErr("place"); }} placeholder="City, State" validationMessage={errors.place} sx={inputSx} required />
            </div>

            {form2.type === "Motor" && (
              <div style={{ marginBottom: 16 }}>
                <label className="ck-label">FIR Lodged? <span style={{ color: T.danger }}>*</span></label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Yes", "No"].map((v) => (
                    <Button
                      key={v}
                      text={v}
                      onClick={() => { setFirVal(v); clearErr("fir"); }}
                      bgcolor={firVal === v ? T.accent : "transparent"}
                      color={firVal === v ? "#000" : T.text}
                      borderColor={firVal === v ? "transparent" : T.border}
                      padding="9px 22px"
                      fontSize="13px"
                    />
                  ))}
                </div>
                {errors.fir && <span className="ck-err-msg">{errors.fir}</span>}
              </div>
            )}

            {form2.type === "Health" && (
              <div style={{ marginBottom: 16 }}>
                <CustomInput label="Hospital Name" name="hospital" value={form3.hospital} onChange={(e) => { setForm3((f) => ({ ...f, hospital: e.target.value })); clearErr("hospital"); }} validationMessage={errors.hospital} sx={inputSx} required />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <CustomInput type="textarea" label="Description" placeholder="Enter description" name="desc" value={form3.desc} onChange={(e) => { setForm3((f) => ({ ...f, desc: e.target.value })); clearErr("desc"); }} validationMessage={errors.desc} sx={{ ...inputSx, resize: "vertical" }} required />
            </div>

            <div style={stepNav()}>
              <Button text="Back"     onClick={() => goStep(2)}     bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Continue" onClick={handleContinueStep3} bgcolor={T.accent}    color="#000" />
            </div>
          </div>
        )}

        {/* ── STEP 4: Upload Documents ── */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Upload Documents</h2>
            <div style={{ border: `2px dashed ${T.border}`, padding: 40, textAlign: "center", borderRadius: 16, cursor: "pointer" }}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 32, color: T.muted, display: "block", marginBottom: 12 }} />
              <p style={{ color: T.muted }}>Click to upload files</p>
            </div>
            <div style={stepNav()}>
              <Button text="Back"   onClick={() => goStep(3)} bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Review" onClick={() => goStep(5)} bgcolor={T.accent}    color="#000" />
            </div>
          </div>
        )}

        {/* ── STEP 5: Declaration ── */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Declaration</h2>
            <p style={{ color: T.muted, marginBottom: 24 }}>I declare that the information provided is true to the best of my knowledge.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="ck-decl" checked={decl} onChange={(e) => setDecl(e.target.checked)} />
              <label htmlFor="ck-decl" style={{ margin: 0, fontSize: 14, fontWeight: 400 }}>I accept the terms</label>
            </div>
            <div style={stepNav()}>
              <Button text="Back" onClick={() => goStep(4)} bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button
                text={submitting ? "Submitting…" : "Submit Claim"}
                onClick={submitFinal}
                bgcolor={T.accent}
                color="#000"
                disabled={submitting}
              />
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 60, height: 60, background: T.successBg, color: T.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22 }}>
              <i className="fa-solid fa-check" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700 }}>Claim Intimated!</h2>
            {refNum && (
              <p style={{ color: T.primary, fontWeight: 800, fontSize: 20, marginTop: 20 }}>{refNum}</p>
            )}
            <Button text="Return Home" onClick={() => { resetWizard(); navigate("home"); }} bgcolor={T.accent} color="#000" customStyle={{ marginTop: 30 }} />
          </div>
        )}

      </div>
    </div>
  );
}