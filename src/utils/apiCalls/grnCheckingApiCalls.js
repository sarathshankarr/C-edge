// ==================== GRN Checking (CED-1626) ====================
// Server contract: AI/CED-1626/mobile-api/openapi.yaml -- every endpoint
// below maps 1:1 to a path documented there (`/api/grncheck/...`). POST
// endpoints carry userName/userPwd/companyId/userId in the JSON body
// (mobileCredentialsBody); GET endpoints (state, upload/status, pdf/*)
// carry them as X-User-Name/X-User-Pwd headers (mobileCredentialsHeader)
// plus companyId/userId as query params, per the spec's securitySchemes.
import {internetCheck} from './apiCallsComponent';
import {getEnvironment} from './../../config/environment/environmentConfig';

const Environment = getEnvironment();

const GRNCHK_BASE = () => Environment.uri + 'api/grncheck';

async function grnCheckJsonPost(path, jsonValue) {
  let returnError, statusData, responseData;
  const internet = await internetCheck();
  if (!internet) {
    return {statusData, responseData, error: returnError, isInternet: internet};
  }
  try {
    const url = GRNCHK_BASE() + path;
    const isUploadRelated = path.includes('upload');
    if (isUploadRelated) console.log('GRNCHK_UPLOAD HTTP POST (json) ->', url, JSON.stringify(jsonValue));
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify(jsonValue),
    });
    const rawText = await response.text();
    if (isUploadRelated) {
      console.log('GRNCHK_UPLOAD HTTP response <-', url, 'status:', response.status, 'body:', rawText?.slice(0, 2000));
    }
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.log(`grnCheckJsonPost(${path}) non-JSON response `, rawText?.slice(0, 300));
      throw parseErr;
    }
    statusData = response.ok;
    responseData = data;
  } catch (error) {
    console.log(`grnCheckJsonPost(${path}) error `, error);
    returnError = error;
  }
  return {statusData, responseData, error: returnError, isInternet: internet};
}

async function grnCheckHeaderGet(path, queryParams, creds) {
  let returnError, statusData, responseData;
  const internet = await internetCheck();
  if (!internet) {
    return {statusData, responseData, error: returnError, isInternet: internet};
  }
  try {
    const qs = Object.entries(queryParams || {})
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    const url = GRNCHK_BASE() + path + (qs ? `?${qs}` : '');
    const isUploadRelated = path.includes('upload');
    if (isUploadRelated) console.log('GRNCHK_UPLOAD HTTP GET ->', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-User-Name': creds?.userName || '',
        'X-User-Pwd': creds?.userPwd || '',
      },
    });
    const rawText = await response.text();
    if (isUploadRelated) {
      console.log('GRNCHK_UPLOAD HTTP response <-', url, 'status:', response.status, 'body:', rawText?.slice(0, 2000));
    }
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.log(`grnCheckHeaderGet(${path}) non-JSON response `, rawText?.slice(0, 300));
      throw parseErr;
    }
    statusData = response.ok;
    responseData = data;
  } catch (error) {
    console.log(`grnCheckHeaderGet(${path}) error `, error);
    returnError = error;
  }
  return {statusData, responseData, error: returnError, isInternet: internet};
}

async function grnCheckMultipartPost(path, formData) {
  let returnError, statusData, responseData;
  const internet = await internetCheck();
  if (!internet) {
    return {statusData, responseData, error: returnError, isInternet: internet};
  }
  try {
    const url = GRNCHK_BASE() + path;
    console.log('GRNCHK_UPLOAD HTTP POST (multipart) ->', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {Accept: 'application/json'},
      body: formData,
    });
    const rawText = await response.text();
    console.log('GRNCHK_UPLOAD HTTP response <-', url, 'status:', response.status, 'body:', rawText?.slice(0, 2000));
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.log(`grnCheckMultipartPost(${path}) non-JSON response `, rawText?.slice(0, 300));
      throw parseErr;
    }
    statusData = response.ok;
    responseData = data;
  } catch (error) {
    console.log(`grnCheckMultipartPost(${path}) error `, error);
    returnError = error;
  }
  return {statusData, responseData, error: returnError, isInternet: internet};
}

// ---- List / state / audit history ----

export async function grnCheckingStateApi({poNumber, companyId, userId, userName, userPwd}) {
  return grnCheckHeaderGet('/state', {poNumber, companyId, userId}, {userName, userPwd});
}

export async function grnCheckingListApi(jsonValue) {
  return grnCheckJsonPost('/list', jsonValue);
}

export async function grnCheckingAuditHistoryApi(jsonValue) {
  return grnCheckJsonPost('/audit-history', jsonValue);
}

// ---- Header ----

export async function grnCheckingSaveHeaderMetaApi(jsonValue) {
  return grnCheckJsonPost('/header/save-meta', jsonValue);
}

// ---- Lot ----

export async function grnCheckingAvailableRollsApi(jsonValue) {
  return grnCheckJsonPost('/lot/available-rolls', jsonValue);
}

export async function grnCheckingOpenLotApi(jsonValue) {
  return grnCheckJsonPost('/lot/open', jsonValue);
}

// ---- Bale (Fabric) ----

export async function grnCheckingBaleSaveDraftApi(jsonValue) {
  return grnCheckJsonPost('/bale/save-draft', jsonValue);
}

export async function grnCheckingBaleAddApi(jsonValue) {
  return grnCheckJsonPost('/bale/add', jsonValue);
}

export async function grnCheckingBaleRemovePieceApi(jsonValue) {
  return grnCheckJsonPost('/bale/remove-piece', jsonValue);
}

export async function grnCheckingBaleSubmitApi(jsonValue) {
  return grnCheckJsonPost('/bale/submit', jsonValue);
}

export async function grnCheckingBaleUnsubmitApi(jsonValue) {
  return grnCheckJsonPost('/bale/unsubmit', jsonValue);
}

export async function grnCheckingBaleMoveToLotApi(jsonValue) {
  return grnCheckJsonPost('/bale/move-to-lot', jsonValue);
}

export async function grnCheckingBaleApproveBatchApi(jsonValue) {
  return grnCheckJsonPost('/bale/approve-batch', jsonValue);
}

// ---- RM ----

export async function grnCheckingRmSaveDraftApi(jsonValue) {
  return grnCheckJsonPost('/rm/save-draft', jsonValue);
}

export async function grnCheckingRmSubmitApi(jsonValue) {
  return grnCheckJsonPost('/rm/submit', jsonValue);
}

export async function grnCheckingRmApproveBatchApi(jsonValue) {
  return grnCheckJsonPost('/rm/approve-batch', jsonValue);
}

// ---- AI Upload: Lot ----

export async function grnCheckingLotUploadApi(formData) {
  return grnCheckMultipartPost('/lot/upload', formData);
}

export async function grnCheckingLotUploadAsyncApi(formData) {
  return grnCheckMultipartPost('/lot/upload/async', formData);
}

export async function grnCheckingLotUploadStatusApi(jobId, creds) {
  return grnCheckHeaderGet('/lot/upload/status', {jobId}, creds);
}

export async function grnCheckingLotUploadCancelApi(jsonValue) {
  return grnCheckJsonPost('/lot/upload/cancel', jsonValue);
}

export async function grnCheckingLotUploadResumeApi(jsonValue) {
  return grnCheckJsonPost('/lot/upload/resume', jsonValue);
}

// ---- AI Upload: Bale ----

export async function grnCheckingBaleUploadApi(formData) {
  return grnCheckMultipartPost('/bale/upload', formData);
}

export async function grnCheckingBaleUploadAsyncApi(formData) {
  return grnCheckMultipartPost('/bale/upload/async', formData);
}

export async function grnCheckingBaleUploadStatusApi(jobId, creds) {
  return grnCheckHeaderGet('/bale/upload/status', {jobId}, creds);
}

export async function grnCheckingBaleUploadCancelApi(jsonValue) {
  return grnCheckJsonPost('/bale/upload/cancel', jsonValue);
}

export async function grnCheckingBaleUploadResumeApi(jsonValue) {
  return grnCheckJsonPost('/bale/upload/resume', jsonValue);
}

// ---- AI Upload: RM (no fabric-mismatch / resume branch) ----

export async function grnCheckingRmUploadAsyncApi(formData) {
  return grnCheckMultipartPost('/rm/upload/async', formData);
}

export async function grnCheckingRmUploadStatusApi(jobId, creds) {
  return grnCheckHeaderGet('/rm/upload/status', {jobId}, creds);
}

export async function grnCheckingRmUploadCancelApi(jsonValue) {
  return grnCheckJsonPost('/rm/upload/cancel', jsonValue);
}

// ---- PDFs (GET, header auth + query params; caller downloads the URL) ----

export function grnCheckingPdfUrl({grnNo, poNumber, itemType, companyId}) {
  return `${GRNCHK_BASE()}/pdf/grn?grnNo=${encodeURIComponent(grnNo)}&poNumber=${encodeURIComponent(poNumber)}&itemType=${encodeURIComponent(itemType)}&companyId=${encodeURIComponent(companyId)}`;
}

export function grnCheckingOverallPdfUrl({poNumber, companyId}) {
  return `${GRNCHK_BASE()}/pdf/overall?poNumber=${encodeURIComponent(poNumber)}&companyId=${encodeURIComponent(companyId)}`;
}

export function grnCheckingWorksheetPdfUrl({lotId, cols, companyId, draftOnly}) {
  return `${GRNCHK_BASE()}/pdf/worksheet?lotId=${encodeURIComponent(lotId)}&cols=${encodeURIComponent(cols || 2)}&draftOnly=${draftOnly ? 'true' : 'false'}&companyId=${encodeURIComponent(companyId)}`;
}

// ---- Barcode PDFs (added 2026-09-18, Fabric-only) ----

export function grnCheckingBarcodePoUrl({poNumber, companyId}) {
  return `${GRNCHK_BASE()}/barcode/po?poNumber=${encodeURIComponent(poNumber)}&companyId=${encodeURIComponent(companyId)}`;
}

export function grnCheckingBarcodeFabricLotsUrl({lineitemId, companyId}) {
  return `${GRNCHK_BASE()}/barcode/fabric/lots?lineitemId=${encodeURIComponent(lineitemId)}&companyId=${encodeURIComponent(companyId)}`;
}

export function grnCheckingBarcodeLotBalesUrl({lotId, companyId}) {
  return `${GRNCHK_BASE()}/barcode/lot/bales?lotId=${encodeURIComponent(lotId)}&companyId=${encodeURIComponent(companyId)}`;
}

export function grnCheckingBarcodeBalePiecesUrl({baleId, companyId}) {
  return `${GRNCHK_BASE()}/barcode/bale/pieces?baleId=${encodeURIComponent(baleId)}&companyId=${encodeURIComponent(companyId)}`;
}
