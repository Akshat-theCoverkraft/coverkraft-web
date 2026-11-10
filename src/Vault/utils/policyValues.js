// The API has used both `sumInsured` and `sumAssured`, and receipt imports
// keep the extracted value under `latestReceiptJson`. Keep UI reads tolerant
// of each supported response shape.
const hasValue = (value) => value !== undefined && value !== null && value !== "";

export const getSumAssured = (policy = {}) => {
  const details = policy?.policyDetails || {};
  const receipt = details?.latestReceiptJson || {};

  return [
    policy?.sumAssured,
    policy?.sumInsured,
    details?.sumAssured,
    details?.sumInsured,
    receipt?.sumAssured,
    receipt?.sumInsured,
  ].find(hasValue) || "";
};
