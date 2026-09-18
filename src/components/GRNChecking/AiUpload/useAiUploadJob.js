import {useState, useRef, useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import * as Constant from '../../../utils/constants/constant';

// Shared AI-upload state machine (sync + async job/poll/cancel/resume),
// identical for Lot, Bale, and RM uploads -- see
// AI/CED-1626/mobile-api/sequence-diagrams.md #1 and
// business-rules-and-flows.md's "AI Doc Upload" section for the exact
// branches/wording this implements.
//
// `hasFabricMismatch` is false for RM (an invoice has no per-line fabric
// match gate, so it never receives fabricMismatchStopped and has no
// matching /resume endpoint -- pass resumeApi: undefined for RM callers).
const POLL_INTERVAL_MS = 1500;

// Every request/response in the AI-upload flow is logged under this tag so
// it can be tracked end-to-end while testing, e.g.:
//   adb logcat -s ReactNativeJS:V | grep GRNCHK_UPLOAD
const LOG = (...args) => console.log('GRNCHK_UPLOAD', ...args);

export default function useAiUploadJob({
  uploadApi,
  uploadAsyncApi,
  statusApi,
  cancelApi,
  resumeApi,
  hasFabricMismatch = true,
  onResult,
  getCreds,
}) {
  const [uploading, set_uploading] = useState(false);
  const [progress, set_progress] = useState(null);
  const jobIdRef = useRef(null);
  const pollTimerRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const resumeJob = useCallback(async () => {
    if (!jobIdRef.current || !resumeApi) return;
    const creds = await getCreds();
    const jobId = jobIdRef.current;
    set_uploading(true);
    LOG('RESUME request ->', JSON.stringify({jobId, companyId: creds.companyId, userName: creds.userName}));
    const res = await resumeApi({...creds, jobId});
    LOG('RESUME response <-', JSON.stringify({statusData: res?.statusData, error: res?.error, responseData: res?.responseData}));
    if (res?.statusData && res?.responseData?.success !== false) {
      // eslint-disable-next-line no-use-before-define
      poll(jobId);
    } else {
      set_uploading(false);
      Alert.alert(
        Constant.DefaultAlert_MSG,
        res?.responseData?.errorMessage || Constant.GRNCHK_EXTRACTION_FAILED,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCreds, resumeApi]);

  const finishTerminal = useCallback(
    (result, knownJobId) => {
      LOG('TERMINAL result ->', JSON.stringify(result));
      stopPolling();
      set_uploading(false);
      set_progress(null);
      jobIdRef.current = null;

      if (result?.jobStatus === 'cancelled') {
        Alert.alert(
          Constant.DefaultAlert_MSG,
          result?.errorMessage || Constant.GRNCHK_EXTRACTION_CANCELLED,
        );
        onResult && onResult(result);
        return;
      }

      if (hasFabricMismatch && result?.fabricMismatchStopped) {
        // Render the partial/audit data immediately, THEN ask -- a hard
        // fabric mismatch already recorded an audit row and returned a
        // fully populated lot/bale even though success is false.
        onResult && onResult(result);
        // The terminal status response doesn't reliably echo `jobId` back
        // (confirmed live: it comes back null here) -- fall back to the
        // jobId we already knew from when this poll loop started, or
        // resume would silently no-op.
        jobIdRef.current = result?.jobId || knownJobId || null;
        LOG('MISMATCH stop -- jobId for resume:', jobIdRef.current);
        Alert.alert(
          Constant.DefaultAlert_MSG,
          Constant.GRNCHK_FABRIC_MISMATCH_CONFIRM(
            result?.extractedFabricDescription,
            result?.expectedFabricDescription,
          ),
          [
            {text: 'No', style: 'cancel', onPress: () => (jobIdRef.current = null)},
            {text: 'Yes', onPress: () => resumeJob()},
          ],
        );
        return;
      }

      if (result?.success === false) {
        if (result?.lot || result?.bale) {
          onResult && onResult(result);
        }
        Alert.alert(
          Constant.DefaultAlert_MSG,
          result?.errorMessage || Constant.GRNCHK_EXTRACTION_FAILED,
        );
        return;
      }

      // Terminal success.
      if (result?.mismatched) {
        Alert.alert(
          Constant.DefaultAlert_MSG,
          `${result?.mismatchMessage || ''}\n${Constant.GRNCHK_MISMATCH_HINT}`,
        );
      } else if (result?.errorMessage) {
        Alert.alert(
          Constant.DefaultAlert_MSG,
          `Document read with some issues: ${result.errorMessage}`,
        );
      } else {
        Alert.alert(Constant.SuccessAlert_MSG, Constant.GRNCHK_DOC_READ_SUCCESS);
      }
      onResult && onResult(result);
    },
    [hasFabricMismatch, onResult, resumeJob, stopPolling],
  );

  const poll = useCallback(
    jobId => {
      LOG('POLL loop started for jobId', jobId);
      stopPolling();
      pollTimerRef.current = setInterval(async () => {
        const creds = await getCreds();
        LOG('POLL request ->', JSON.stringify({jobId}));
        const res = await statusApi(jobId, creds);
        const data = res?.responseData;
        LOG('POLL response <-', JSON.stringify({statusData: res?.statusData, error: res?.error, responseData: data}));
        if (!res?.statusData || !data) {
          return; // transient network hiccup -- try again next tick
        }
        if (data.jobStatus === 'running') {
          set_progress({totalPages: data.totalPages, completedPages: data.completedPages});
          return;
        }
        finishTerminal(data, jobId);
      }, POLL_INTERVAL_MS);
    },
    [statusApi, getCreds, finishTerminal, stopPolling],
  );

  const cancelJob = useCallback(() => {
    if (!jobIdRef.current || !cancelApi) return;
    Alert.alert(Constant.DefaultAlert_MSG, Constant.GRNCHK_CANCEL_CONFIRM, [
      {text: 'No', style: 'cancel'},
      {
        text: 'Yes',
        onPress: async () => {
          const creds = await getCreds();
          const jobId = jobIdRef.current;
          LOG('CANCEL request ->', JSON.stringify({jobId}));
          // Only flips a flag server-side -- the next poll tick picks up
          // jobStatus="cancelled" on its own; we don't stop polling here.
          const res = await cancelApi({...creds, jobId});
          LOG('CANCEL response <-', JSON.stringify({statusData: res?.statusData, error: res?.error, responseData: res?.responseData}));
        },
      },
    ]);
  }, [getCreds, cancelApi]);

  // file: {uri, type, name} (RN file object). extraFields: entity-specific
  // ids (lotId/baleId/headerId, expectedPoNumber, expectedVendorName).
  const upload = useCallback(
    async (file, extraFields, {forceAsync = false} = {}) => {
      const creds = await getCreds();
      const isMultiPage = forceAsync || file?.type === 'application/pdf';
      set_uploading(true);
      set_progress(null);

      const formData = new FormData();
      formData.append('file', file);
      Object.entries(extraFields || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v));
      });
      formData.append('userName', creds.userName || '');
      formData.append('userPwd', creds.userPwd || '');
      formData.append('companyId', String(creds.companyId || ''));
      if (creds.userId) formData.append('userId', String(creds.userId));

      LOG(
        isMultiPage ? 'UPLOAD (async) request ->' : 'UPLOAD (sync) request ->',
        JSON.stringify({
          file: {uri: file?.uri, type: file?.type, name: file?.name},
          extraFields,
          companyId: creds.companyId,
          userName: creds.userName,
        }),
      );

      if (!isMultiPage) {
        const res = await uploadApi(formData);
        LOG('UPLOAD (sync) response <-', JSON.stringify({statusData: res?.statusData, error: res?.error, responseData: res?.responseData}));
        set_uploading(false);
        const data = res?.responseData;
        if (!res?.statusData || !data) {
          Alert.alert(Constant.DefaultAlert_MSG, Constant.GRNCHK_EXTRACTION_FAILED);
          return;
        }
        if (data.success === false) {
          Alert.alert(Constant.DefaultAlert_MSG, data.errorMessage || Constant.GRNCHK_EXTRACTION_FAILED);
        } else if (data.mismatched) {
          Alert.alert(
            Constant.DefaultAlert_MSG,
            `${data.mismatchMessage || ''}\n${Constant.GRNCHK_MISMATCH_HINT}`,
          );
        } else if (data.errorMessage) {
          Alert.alert(
            Constant.DefaultAlert_MSG,
            `Document read with some issues: ${data.errorMessage}`,
          );
        } else {
          Alert.alert(Constant.SuccessAlert_MSG, Constant.GRNCHK_DOC_READ_SUCCESS);
        }
        onResult && onResult(data);
        return;
      }

      const res = await uploadAsyncApi(formData);
      LOG('UPLOAD (async) response <-', JSON.stringify({statusData: res?.statusData, error: res?.error, responseData: res?.responseData}));
      const data = res?.responseData;
      if (!res?.statusData || !data || data.success === false) {
        set_uploading(false);
        Alert.alert(Constant.DefaultAlert_MSG, data?.errorMessage || Constant.GRNCHK_EXTRACTION_FAILED);
        return;
      }
      jobIdRef.current = data.jobId;
      set_progress({totalPages: data.totalPages, completedPages: data.completedPages});
      poll(data.jobId);
    },
    [getCreds, uploadApi, uploadAsyncApi, onResult, poll],
  );

  return {
    uploading,
    progress,
    upload,
    cancelJob,
    isAsyncJobRunning: !!jobIdRef.current,
  };
}
