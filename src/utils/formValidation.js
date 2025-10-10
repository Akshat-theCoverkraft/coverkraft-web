export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  return { valid: true, error: "" };
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  if (!phone) {
    return { valid: false, error: "Contact number is required" };
  }
  if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
    return { valid: false, error: "Please enter a valid 10-digit phone number" };
  }
  return { valid: true, error: "" };
};

export const validatePinCode = (pinCode) => {
  const pinCodeRegex = /^[0-9]{6}$/;
  if (!pinCode) {
    return { valid: false, error: "Pin code is required" };
  }
  if (!pinCodeRegex.test(pinCode)) {
    return { valid: false, error: "Please enter a valid 6-digit pin code" };
  }
  return { valid: true, error: "" };
};

export const validateFullName = (fullName) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!fullName) {
    return { valid: false, error: "Full name is required" };
  }
  if (!nameRegex.test(fullName)) {
    return {
      valid: false,
      error: "Full name should contain only letters and be 2-50 characters",
    };
  }
  return { valid: true, error: "" };
};

export const validateDOB = (dob) => {
  if (!dob) {
    return { valid: false, error: "Date of birth is required" };
  }
  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();

  if (age < 18) {
    return { valid: false, error: "You must be at least 18 years old" };
  }
  if (age > 100) {
    return { valid: false, error: "Please enter a valid date of birth" };
  }
  return { valid: true, error: "" };
};

export const validateAddress = (address) => {
  if (!address) {
    return { valid: false, error: "Address is required" };
  }
  if (address.length < 5) {
    return {
      valid: false,
      error: "Address should be at least 5 characters long",
    };
  }
  if (address.length > 100) {
    return {
      valid: false,
      error: "Address should not exceed 100 characters",
    };
  }
  return { valid: true, error: "" };
};

export const validateState = (state) => {
  const stateRegex = /^[a-zA-Z\s]{2,30}$/;
  if (!state) {
    return { valid: false, error: "State is required" };
  }
  if (!stateRegex.test(state)) {
    return {
      valid: false,
      error: "Please enter a valid state name",
    };
  }
  return { valid: true, error: "" };
};

export const validateGender = (gender) => {
  if (!gender) {
    return { valid: false, error: "Gender is required" };
  }
  if (!["Male", "Female", "Others"].includes(gender)) {
    return { valid: false, error: "Please select a valid gender" };
  }
  return { valid: true, error: "" };
};

export const validateApplyingFor = (applyingFor) => {
  if (!applyingFor) {
    return { valid: false, error: "Please select what you're applying for" };
  }
  if (!["Employee", "POS"].includes(applyingFor)) {
    return { valid: false, error: "Please select a valid option" };
  }
  return { valid: true, error: "" };
};

export const validateFile = (file) => {
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    return { valid: false, error: "Resume is required" };
  }

  const fileExtension = "." + file.name.split(".").pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: "Only PDF, DOC, and DOCX files are allowed",
    };
  }

  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: "File size should not exceed 5MB",
    };
  }

  return { valid: true, error: "" };
};

// Validate password strength
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      valid: false,
      error: "Password must contain uppercase, lowercase, numbers, and special characters (!@#$%^&*)",
    };
  }
  return { valid: true, error: "" };
};

// Validate username
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!username) {
    return { valid: false, error: "Username is required" };
  }
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      error: "Username must be 3-20 characters (letters, numbers, underscore only)",
    };
  }
  return { valid: true, error: "" };
};

// Validate URL
export const validateURL = (url) => {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!url) {
    return { valid: false, error: "URL is required" };
  }
  if (!urlRegex.test(url)) {
    return { valid: false, error: "Please enter a valid URL" };
  }
  return { valid: true, error: "" };
};

// Validate number range
export const validateNumberRange = (number, min, max) => {
  const num = Number(number);
  if (isNaN(num)) {
    return { valid: false, error: "Please enter a valid number" };
  }
  if (num < min || num > max) {
    return {
      valid: false,
      error: `Number must be between ${min} and ${max}`,
    };
  }
  return { valid: true, error: "" };
};

// Validate required field
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true, error: "" };
};

// Validate entire form for JoinUs component
export const validateForm = (formData, file) => {
  const errors = {};

  const fullNameValidation = validateFullName(formData.fullName);
  if (!fullNameValidation.valid) {
    errors.fullName = fullNameValidation.error;
  }

  const genderValidation = validateGender(formData.gender);
  if (!genderValidation.valid) {
    errors.gender = genderValidation.error;
  }

  const dobValidation = validateDOB(formData.dob);
  if (!dobValidation.valid) {
    errors.dob = dobValidation.error;
  }

  const addressValidation = validateAddress(formData.address);
  if (!addressValidation.valid) {
    errors.address = addressValidation.error;
  }

  const stateValidation = validateState(formData.stateAgent);
  if (!stateValidation.valid) {
    errors.stateAgent = stateValidation.error;
  }

  const pinCodeValidation = validatePinCode(formData.pinCode);
  if (!pinCodeValidation.valid) {
    errors.pinCode = pinCodeValidation.error;
  }

  const phoneValidation = validatePhoneNumber(formData.contactNumber);
  if (!phoneValidation.valid) {
    errors.contactNumber = phoneValidation.error;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error;
  }

  const applyingForValidation = validateApplyingFor(formData.applyingFor);
  if (!applyingForValidation.valid) {
    errors.applyingFor = applyingForValidation.error;
  }

  const fileValidation = validateFile(file);
  if (!fileValidation.valid) {
    errors.resume = fileValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Generic form validator - validates multiple fields at once
export const validateMultipleFields = (data, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const rule = validationRules[field];
    if (rule.type && typeof rule.validator === "function") {
      const result = rule.validator(data[field]);
      if (!result.valid) {
        errors[field] = result.error;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};