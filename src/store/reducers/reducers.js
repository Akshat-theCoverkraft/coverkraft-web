const initialState = {
 
    customerregstionData:null,
    getPolicyType:[],
    getPolicyList:[],
    ocrData:null,
    saveData:null,
    loading: false,
    error: null,
  };
   
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      //customer registion start
      case "REGISTER_DATA_REQUEST":
        return {
          ...state,
          loading: true,
          error: null,
        };
      case "REGISTER_DATA_SUCCESS":
        return {
          ...state,
          customerregstionData: action.payload,
          loading: false,
          error: null,
        };
      case "REGISTER_DATA_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
   
        //customer registion end

        //verify user mobileno start
        case "VERIFY_DATA_REQUES":
        return {
          ...state,
          loading: true,
          error: null,
        };
      case "VERIFY_DATA_SUCCESS":
        return {
          ...state,
          customerregstionData: action.payload,
          loading: false,
          error: null,
        };
      case "VERIFY_DATA_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };        
        //verify user mobileno end

        //ocr extract data start
        case "OCR_DATA_REQUEST":
        return {
          ...state,
          loading: true,
          error: null,
        };
      case "OCR_DATA_SUCCESS":
        return {
          ...state,
          ocrData: action.payload,
          loading: false,
          error: null,
        };
      case "OCR_DATA_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };        
        //ocr extract data end

        //SAVE DOCUMENT
        case "SAVE_DATA_REQUEST":
          return {
            ...state,
            loading: true,
            error: null,
          };
        case "SAVE_DATA_SUCCESS":
          return {
            ...state,
            saveData: action.payload,
            loading: false,
            error: null,
          };
        case "SAVE_DATA_FAILURE":
          return {
            ...state,
            loading: false,
            error: action.payload,
          };        
          //SAVE DOCUMENT end

        //GETALLPOLICYTYPE 
        case "GETPOLICYTYPE_DATA_REQUEST":
          return {
            ...state,
            loading: true,
            error: null,
          };
        case "GETPOLICYTYPE_DATA_SUCCESS":
          return {
            ...state,
            getPolicyType: action.payload,
            loading: false,
            error: null,
          };
        case "GETPOLICYTYPE_DATA_FAILURE":
          return {
            ...state,
            loading: false,
            error: action.payload,
          };        
          //GETALLPOLICYTYPE DOCUMENT end

          //GETALLPOLICYLIST 
        case "GETPOLICYLIST_DATA_REQUEST":
          return {
            ...state,
            loading: true,
            error: null,
          };
        case "GETPOLICYLIST_DATA_SUCCESS":
          return {
            ...state,
            getPolicyList: action.payload,
            loading: false,
            error: null,
          };
        case "GETPOLICYLIST_DATA_FAILURE":
          return {
            ...state,
            loading: false,
            error: action.payload,
          };        
          //GETALLPOLICYLIST DOCUMENT end
      default:
        return state;
    }
  };
   
  export default userReducer;
   