//action.js
import { toast } from 'react-toastify'; 
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

//update doucment
export const UPDATEDOCUMENT_DATA_REQUEST = "UPDATEDOCUMENT_DATA_REQUEST"
export const UPDATEDOCUMENT_DATA_SUCCESS = "UPDATEDOCUMENT_DATA_SUCCESS"
export const UPDATEDOCUMENT_DATA_FAILURE = "UPDATEDOCUMENT_DATA_FAILURE"

//getall notification 
export const GETALLNOTIFICATION_DATA_REQUEST = "GETALLNOTIFICATION_DATA_REQUEST"
export const GETALLNOTIFICATION_DATA_SUCCESS = "GETALLNOTIFICATION_DATA_SUCCESS"
export const GETALLNOTIFICATION_DATA_FAILURE = "GETALLNOTIFICATION_DATA_FAILURE"

//getall policytype doucment
export const GETPOLICYTYPE_DATA_REQUEST = "GETPOLICYTYPE_DATA_REQUEST"
export const GETPOLICYTYPE_DATA_SUCCESS = "GETPOLICYTYPE_DATA_SUCCESS"
export const GETPOLICYTYPE_DATA_FAILURE = "GETPOLICYTYPE_DATA_FAILURE"

//getbyId Users 
export const GETBYID_USERS_DATA_REQUEST = "GETBYID_USERS_DATA_REQUEST"
export const GETBYID_USERS_DATA_SUCCESS = "GETBYID_USERS_DATA_SUCCESS"
export const GETBYID_USERS_DATA_FAILURE = "GETBYID_USERS_DATA_FAILURE"

//update user 
export const UPDATEUSER_DATA_REQUEST = "UPDATEUSER_DATA_REQUEST"
export const UPDATEUSER_DATA_SUCCESS = "UPDATEUSER_DATA_SUCCESS"
export const UPDATEUSER_DATA_FAILURE = "UPDATEUSER_DATA_FAILURE"

//state 
export const STATE_DATA_REQUEST = "STATE_DATA_REQUEST"
export const STATE_DATA_SUCCESS = "STATE_DATA_SUCCESS"
export const STATE_DATA_FAILURE = "STATE_DATA_FAILURE"


// get all NOTIFICATION data 
export const getAllNotification = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: GETALLNOTIFICATION_DATA_REQUEST });
        axios
            .get(API_URL + `notification/getAll`,data)
            .then((response) => {
                dispatch({ type: GETALLNOTIFICATION_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: GETALLNOTIFICATION_DATA_FAILURE, payload: error.message });
            });
    };
}

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
        const token = localStorage.getItem('token');
        axios
            .post(
                API_URL + 'document/ocrExtractData',
                data, // Pass the data directly as the body of the POST request
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the headers
                    }
                }
            )
            .then((response) => {
                dispatch({ type: OCR_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: OCR_DATA_FAILURE, payload: error.message });
            });
    };
};
//Save data 
// export const saveDocument = (API_URL, data) => {
//     return (dispatch) => {
//         dispatch({ type: SAVE_DATA_REQUEST });
//         const token = localStorage.getItem('token');
//         return axios
//             .post(API_URL + `policy/create`,
//             data,{
//                 headers: {
//                     Authorization: `Bearer ${token}`, // Include the token in the headers
//                 },
//              })
//             .then((response) => {
//                 dispatch({ type: SAVE_DATA_SUCCESS, payload: response.data });
//                 return response.data;
//             })
//             .catch((error) => {
//                 dispatch({ type: SAVE_DATA_FAILURE, payload: error.message });
//             });
//     };
// }
export const saveDocument = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: SAVE_DATA_REQUEST });
        const token = localStorage.getItem('token');
        return axios
            .post(`${API_URL}policy/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            })
            .then((response) => {
                dispatch({ type: SAVE_DATA_SUCCESS, payload: response.data });
                return response; // Return the full response here
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || "Error in creating policy details";
                dispatch({ type: SAVE_DATA_FAILURE, payload: errorMessage });
                return Promise.reject({ status: error.response?.status, message: errorMessage }); 
                        });
    };
};
//update data 
export const updateDocument = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: UPDATEDOCUMENT_DATA_REQUEST });
        const token = localStorage.getItem('token');
        return axios
            .post(API_URL + `policy/update`, data,{
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
             })
            .then((response) => {
                dispatch({ type: UPDATEDOCUMENT_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: UPDATEDOCUMENT_DATA_FAILURE, payload: error.message });
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

//get by Id user data
export const getBYIDUsers = (API_URL, userId) => {
    return (dispatch) => {
        dispatch({ type: GETBYID_USERS_DATA_REQUEST });
        axios
            .get(API_URL + `user/getUserById`, {
                params: { _id: userId }
            })
            .then((response) => {
                dispatch({ type: GETBYID_USERS_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: GETBYID_USERS_DATA_FAILURE, payload: error.message });
            });
    };
}


//update user 
export const updateUser = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: UPDATEUSER_DATA_REQUEST });
        const token = localStorage.getItem('token');
        return axios
            .post(API_URL + `user/updateUser`, data)
            .then((response) => {
                dispatch({ type: UPDATEUSER_DATA_SUCCESS, payload: response.data });
                const userId = data.get('_id');
                return dispatch(getBYIDUsers(API_URL, userId));           })
            .catch((error) => {
                dispatch({ type: UPDATEUSER_DATA_FAILURE, payload: error.message });
            });
    };
}


// get all state data 
export const getAllState = (API_URL, data) => {
    return (dispatch) => {
        dispatch({ type: STATE_DATA_REQUEST });
        axios
            .get(API_URL + `state/getAll`,data)
            .then((response) => {
                dispatch({ type: STATE_DATA_SUCCESS, payload: response.data });
                return response.data;
            })
            .catch((error) => {
                dispatch({ type: STATE_DATA_FAILURE, payload: error.message });
            });
    };
}