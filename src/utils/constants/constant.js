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
export const SERVICE_FAIL_XL_MSG = "Failed to generate or save EXCEL";
export const LOGIN_FAIL_MSG = "Please check your username or password and try again!";
export const DefaultAlert_MSG = 'Alert';
export const Fail_Save_Dtls_MSG = 'Unable to save the details at this moment! Please try after sometime.';
export const Fail_ProcessFlow_Not_Configured_MSG = 'No next process step is configured for this fabric/batch/printing combination. Please check the process flow setup for this fabric before retrying.';
export const Fail_Validate_RMT_MSG = 'Entered RM Type  already exist !!';
export const Fail_Validate_VENDORMASTER_MSG = 'Entered Vendor Name already exist !!';
export const Fail_Validate_CREATE_STYLE_MSG = 'Entered Style  already exist !!';
export const SuccessAlert_MSG = 'Success';
export const PO_Approve_MSG = 'Purchase order approved successfully';
export const PO_Rejected_MSG = 'Purchase order Rejected';
export const Thankyou_Alert_MSG = 'Thank you!';
export const noRecFound = 'No records found';
export const noNotifications = 'You have no notifications !';
export const validate_Fields_Msg = 'Please fill all the mandatory field before submitting';
export const validate_Fields_ = 'Please fill atleast one size field before submitting';
export const validate_total_consump_ = 'Total consumption should be less than the fabric Issued';
export const validate_total_consump_fabNfoRecQty = 'Total consumption should be less than the Fab NFO Rec Qty';
export const validate_location_ = 'Please select the location before submitting !';
export const validate_EnterQty =(check)=> `Please enter the quantity of ${check} less than remaining quantity`;
export const Wrong_Code_Msg="Invalid Code', 'Please enter a valid customer code."
export const PO_Rejected_MSG_WITHOUT_REMARKS = 'Please enter the remarks before Rejecting ';
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
export const Fail_Validate_RMM_MSG = 'Entered RM  is already exist !!';

// ==================== GRN Checking (CED-1626) ====================
// Wording matches AI/CED-1626/mobile-api/business-rules-and-flows.md verbatim
// so a mobile user sees the same guidance a web user does.
export const GRNCHK_NO_APPROVED_BATCHES = 'No approved GRN batches yet';
export const GRNCHK_BALENO_REQUIRED = 'Bale No is required.';
export const GRNCHK_TOTALPCS_MIN = 'Total Pcs must be at least 1.';
export const GRNCHK_BALE_ADDED = 'Bale added -- fill in Total In Mtrs / Checked Mtrs per piece below, then Submit as usual.';
export const GRNCHK_CHOOSE_DEST_LOT = 'Choose a destination lot first.';
export const GRNCHK_BALE_MOVED = 'Bale moved.';
export const GRNCHK_MOVE_FAILED = 'Move failed.';
export const GRNCHK_REVERT_CONFIRM = 'Revert this bale to Draft? Its fields will unlock so you can fix and resubmit it.';
export const GRNCHK_REMOVE_PIECE_CONFIRM = (pcNo) => `Remove Pc No ${pcNo} from this bale? This cannot be undone.`;
export const GRNCHK_PIECE_REMOVED = 'Piece removed.';
export const GRNCHK_REMOVE_PIECE_FAILED = 'Could not remove piece.';
export const GRNCHK_NO_CHECKED_MTRS = 'Cannot select this bale for approval: no Checked Mtrs recorded yet.';
export const GRNCHK_SAVE_BEFORE_APPROVE_FAILED = 'Could not save this bale -- not selected for approval.';
export const GRNCHK_NO_DRAFT_BALES = 'No draft bales to submit.';
export const GRNCHK_NO_DRAFT_RM_ITEMS = 'No draft RM items with a Checked Qty to submit.';
export const GRNCHK_SAVE_FAILED_SUBMIT_CANCELLED = 'Save failed for one or more sections -- submit cancelled.';
export const GRNCHK_SAVE_FAILED_SUBMIT_CANCELLED_RM = 'Save failed for one or more items -- submit cancelled.';
export const GRNCHK_SUBMIT_FAILED_RM = 'Submit failed for one or more items.';
export const GRNCHK_SUBMITTED = 'Submitted.';
export const GRNCHK_APPROVE_CONFIRM = (n) => `Approve ${n} selected bale(s)? This will add their checked quantity to inventory, generate one GRN No for all of them together, and cannot be undone.`;
export const GRNCHK_APPROVE_CONFIRM_RM = 'Approve all checked RM items? This will add their checked quantity to inventory, generate one GRN No for all of them together, and cannot be undone.';
export const GRNCHK_APPROVED = (grnNo) => `Approved. GRN No: ${grnNo}`;
export const GRNCHK_APPROVE_FAILED = 'Approve failed.';
export const GRNCHK_NOTHING_ELIGIBLE_RM = 'Nothing eligible to approve -- enter a Checked Qty first.';
export const GRNCHK_EXTRACTION_FAILED = 'Extraction failed.';
export const GRNCHK_EXTRACTION_CANCELLED = 'Extraction cancelled.';
export const GRNCHK_CANCEL_CONFIRM = 'Cancel this extraction? Pages already read will still be kept -- only pages not yet processed will be skipped.';
export const GRNCHK_DOC_READ_SUCCESS = 'Document read successfully.';
export const GRNCHK_MISMATCH_HINT = 'The extracted data has still been loaded below -- please verify before approving.';
export const GRNCHK_FABRIC_MISMATCH_CONFIRM = (extracted, expected) => `This document's fabric ('${extracted}') doesn't match this PO line's fabric ('${expected}'). Still do you want to process it?`;
export const GRNCHK_UPLOAD_PROCESSING = 'Upload complete -- processing document, please wait...';
export const GRNCHK_EXTRACTING_PROGRESS = (completed, total) => `Extracting, please wait... ${total} page(s) detected. Extracted ${completed} out of ${total} page(s).`;




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

