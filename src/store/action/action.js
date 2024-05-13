//action.js
import axios from "axios";

// Add REGISTER 
export const REGISTER_DATA_REQUEST = "REGISTER_DATA_REQEUST"
export const REGISTER_DATA_SUCCESS = "REGISTER_DATA_SUCCESS"
export const REGISTER_DATA_FAILURE = "REGISTER_DATA_FAILURE"

//Verify user
export const VERIFY_DATA_REQUEST = "VERIFY_DATA_REQUEST"
export const VERIFY_DATA_SUCCESS = "VERIFY_DATA_SUCCESS"
export const VERIFY_DATA_FAILURE = "VERIFY_DATA_FAILURE"

//OCR extract data
export const OCR_DATA_REQUEST = "OCR_DATA_REQUEST"
export const OCR_DATA_SUCCESS = "OCR_DATA_SUCCESS"
export const OCR_DATA_FAILURE = "OCR_DATA_FAILURE"

//save doucment
export const SAVE_DATA_REQUEST = "SAVE_DATA_REQUEST"
export const SAVE_DATA_SUCCESS = "SAVE_DATA_SUCCESS"
export const SAVE_DATA_FAILURE = "SAVE_DATA_FAILURE"

//getall policytype doucment
export const GETPOLICYTYPE_DATA_REQUEST = "GETPOLICYTYPE_DATA_REQUEST"
export const GETPOLICYTYPE_DATA_SUCCESS = "GETPOLICYTYPE_DATA_SUCCESS"
export const GETPOLICYTYPE_DATA_FAILURE = "GETPOLICYTYPE_DATA_FAILURE"

//getall policylist 
export const GETPOLICYLIST_DATA_REQUEST = "GETPOLICYLIST_DATA_REQUEST"
export const GETPOLICYLIST_DATA_SUCCESS = "GETPOLICYLIST_DATA_SUCCESS"
export const GETPOLICYLIST_DATA_FAILURE = "GETPOLICYLIST_DATA_FAILURE"

// register start
export const registrationCustomer = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: REGISTER_DATA_REQUEST});
        axios
          .post(API_URL + "user/createUser", data)
          .then((response) => {
            dispatch({ type: REGISTER_DATA_SUCCESS, payload: response.data });
            return response.data;
          })
          .catch((error) => {
            dispatch({ type: REGISTER_DATA_FAILURE, payload: error.message });
          });
      };
}

//VERIFY USER
export const verifyUser = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: VERIFY_DATA_REQUEST });
        axios
            .post(API_URL + `user/loginUser`,data)
            .then((response) => {
                dispatch({ type: VERIFY_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: VERIFY_DATA_FAILURE, payload: error.message });
            });
    };
}

//OCR data extract
export const extractData = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: OCR_DATA_REQUEST });
        axios
            .post(API_URL + `document/ocrExtractData`,data)
            .then((response) => {
                dispatch({ type: OCR_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: OCR_DATA_FAILURE, payload: error.message });
            });
    };
}

//Save data 
export const saveDocument = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: SAVE_DATA_REQUEST });
        return axios
            .post(API_URL + `policy/create`,data)
            .then((response) => {
                dispatch({ type: SAVE_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: SAVE_DATA_FAILURE, payload: error.message });
            });
    };
}

// get all Policytype data 
export const getAllPolicyType = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: GETPOLICYTYPE_DATA_REQUEST });
        axios
            .get(API_URL + `policyType/getAll`,data)
            .then((response) => {
                dispatch({ type: GETPOLICYTYPE_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: GETPOLICYTYPE_DATA_FAILURE, payload: error.message });
            });
    };
}

// get all policylist data 
export const getAllPolicyList = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: GETPOLICYLIST_DATA_REQUEST });
        axios
            .get(API_URL + `policy/getAll`,data)
            .then((response) => {
                dispatch({ type: GETPOLICYLIST_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: GETPOLICYLIST_DATA_FAILURE, payload: error.message });
            });
    };
}



