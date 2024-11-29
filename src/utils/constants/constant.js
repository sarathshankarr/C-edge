export const Login_HEADER = "Sign in to continue";
export const PSWD_LABEL_HEADER = "Password";
export const SAVE_LABEL = "SAVE";
export const SET_NEW_PSWD = "Set New Password";
export const CONFIRM_NEW_PSWD = "Confirm New Password";
export const CODE_LABEL_HEADER = "Code";
export const CODE_VALIDATE_HEADER = "Invalid Code";
export const CODE_VALIDATE_MSG = "Please enter a valid  code.";
export const LOGIN_LABEL_HEADER = "Email";
export const EMAIL_LABEL_HEADER = "Email";
export const LOGIN_BTN_LABEL = "SIGN IN";
export const GET_OTP_BTN_LABEL = "GET OTP";
export const VERIFY_OTP_BTN_LABEL = "Submit";
export const LOGIN_FORGOT_BTN_LABEL = "Forgot Password ? ";
export const OTP_VERIFICATION_LABEL = "Verify OTP ";
export const SET_NEW_PASSWORD_LABEL = "Set New Password";
export const LOADER_MESSAGE = 'Please wait..'
export const SERVICE_FAIL_MSG = "Woof! There seems to be a problem. Please try after sometime.";
export const SERVICE_FAIL_PDF_MSG = "Failed to generate or save PDF";
export const LOGIN_FAIL_MSG = "Please check your username or password and try again!";
export const DefaultAlert_MSG = 'Alert';
export const Fail_Save_Dtls_MSG = 'Unable to save the details at this moment! Please try after sometime.';
export const SuccessAlert_MSG = 'Success';
export const PO_Approve_MSG = 'Purchase order approved successfull';
export const PO_Rejected_MSG = 'Purchase order Rejected';
export const Thankyou_Alert_MSG = 'Thank you!';
export const noRecFound = 'No records found';
export const noNotifications = 'You have no notifications !';
export const validate_Fields_Msg = 'Please fill all the mandatory field before submiting';
export const validate_Fields_ = 'Please fill atleast one size field before submiting';
export const validate_location_ = 'Please Select the Location before Submitting !';
export const validate_EnterQty =(check)=> `Please enter the Quatity of ${check} less than remaining Quantity`;
export const Wrong_Code_Msg="Invalid Code', 'Please enter a valid customer code."
export const PO_Rejected_MSG_WITHOUT_REMARKS = 'Please fill the Remarks Before Rejecting ';
export const SELECT_STATUS = 'Please Select the Status to Proceed';
export const ONLINE_STATUS = 'Please check your internet connection !!';
export const ALL_FIELDS = 'Please fill all the fields';
export const ERROR_OCCURED = "An error occurred while processing your request. Please try again.";
export const EXPIRED_OTP = 'The OTP you entered is invalid / expired';
export const OTP_SENT = 'The OTP has been successfully sent to the registered email address.';
export const MAIL_NOT_FOUND = 'The provided email address is not found in the system.';
export const PSWD_NOT_MATCH = 'Passwords do not match. Please try again.';
export const PSWD_MIN_LENG = 'Password must be at least 8 characters long.';
export const PSWD_SET_SUCC = 'New password set successfully.';



// export const formatPrice = (price) => {
//   // Check if price contains a currency suffix
//   const match = price.match(/^(.*?)(\([A-Za-z]+\))$/);
  
//   if (match) {
//     let numericPart = match[1]; // Extract numeric part
//     let currencyPart = match[2]; // Extract currency part

//     // Format numeric part to 4 decimal places and remove trailing zeros
//     const formattedNumericPart = parseFloat(numericPart).toFixed(4).replace(/\.?0*$/, '');

//     // Check if the currency part is exactly "(USD)" or "(usd)"
//     if(currencyPart.toUpperCase() === "(USD)") {
//       currencyPart = '($)';
//     } else {
//       // If currency part is not "(USD)" or "(usd)", retain it as is
//       currencyPart = match[2];
//     }

//     // Return formatted price
//     return `${formattedNumericPart}${currencyPart}`;
//   } else {
//     // If no currency suffix, just format the number
//     return parseFloat(price).toFixed(4).replace(/\.?0*$/, '');
//   }
// };


export const formatPrice = (price) => {
  // Check if price contains a currency suffix
  const match = price.match(/^(.*?)(\([A-Za-z]+\))$/);
  
  if (match) {
    let numericPart = match[1]; 
    let currencyPart = match[2]; 

    const formattedNumericPart = parseFloat(numericPart).toFixed(2).replace(/\.?0*$/, '');

    let currencySymbol = '';
    const currencyCode = currencyPart.toUpperCase();

    switch (currencyCode) {
      case '(USD)':
        currencySymbol = '$';
        break;
      case '(EUR)':
        currencySymbol = '€';
        break;
      case '(INR)':
        currencySymbol = '₹';
        break;
      case '(POUND)':
        currencySymbol = '£';
        break;
      case '(YER)':
        currencySymbol = '﷼'; // Yemeni Riyal symbol
        break;
      case '(JPY)':
        currencySymbol = '¥'; // Japanese Yen symbol
        break;
      default:
        currencySymbol = currencyPart; 
        break;
    }

    const formattedPrice = formatNumberWithLocale(formattedNumericPart, currencyCode);

    return `${currencySymbol} ${formattedPrice}`;
  } else {
    // If no currency suffix, format the price normally
    // const formattedPrice = parseFloat(price).toFixed(2).replace(/\.?0*$/, '');
    // return formattedPrice;


    // If no currency suffix, format the price as INR
    const formattedNumericPart = parseFloat(price).toFixed(2).replace(/\.?0*$/, '');
    const formattedPrice = formatNumberWithLocale(formattedNumericPart, '(INR)');
    return `₹ ${formattedPrice}`;
  }
};

// Function to format number with commas based on locale
const formatNumberWithLocale = (numericString, currencyCode) => {
  let locale = 'en-US'; 

  switch (currencyCode) {
    case '(USD)':
      locale = 'en-US';
      break;
    case '(EUR)':
      locale = 'en-GB'; 
      break;
    case '(INR)':
      locale = 'en-IN'; 
      break;
    case '(GBP)':
      locale = 'en-GB';  
      break;
    case '(YER)':
      locale = 'ar-YE';  
      break;
    case '(JPY)':
      locale = 'ja-JP';  
      break;
  }

  const number = parseFloat(numericString);

  return number.toLocaleString(locale, { maximumFractionDigits: 2 });
};


export function formatDateIntoDMY(formattedDate) {
  // console.log(" ==>" , formattedDate)
  const parts = formattedDate.split('-');
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  return `${day}-${month}-${year}`;
}


export  const extractLocationIds = (compids, a) => {
  const abc = compids
    .split(",")
    .map(pair => pair.trim().split("_"))
    .filter(([key]) => Number(key) === a)
    .map(([, value]) => value)
    .join(",");

  return abc ? abc : "0";
}

