import React, {useState, useCallback, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import axios from 'axios';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as GrnChkAPI from '../../../utils/apiCalls/grnCheckingApiCalls';
import * as Constant from '../../../utils/constants/constant';
import useAiUploadJob from '../AiUpload/useAiUploadJob';

import GrnCheckingFabricUI from './GrnCheckingFabricUI';

// Sum of a bale's own pieces[].checkedMtrs -- bale/save-draft's checkedMtrs
// is NOT auto-summed server-side (confirmed asymmetry, openapi.yaml's
// SaveDraftRequest schema / README.md), so every save-draft call from this
// screen must compute and send this sum itself.
const sumCheckedMtrs = pieces => (pieces || []).reduce((s, p) => s + (Number(p.checkedMtrs) || 0), 0);

const GrnCheckingFabric = ({navigation, route}) => {
  const {poNumber, headerId: routeHeaderId, itemType} = route?.params || {};

  const [header, set_header] = useState(null);
  const [fabricLineItems, set_fabricLineItems] = useState([]);
  const [lots, set_lots] = useState([]);
  const [vendorDetails, set_vendorDetails] = useState(null);
  const [grnNumbers, set_grnNumbers] = useState([]);
  const [availableRollsByLineItem, set_availableRollsByLineItem] = useState({});
  const [auditHistoryRows, set_auditHistoryRows] = useState([]);
  const [selectedBaleIds, set_selectedBaleIds] = useState([]);
  const [MainLoading, set_MainLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  const credentialsRef = useRef(null);
  const headerIdRef = useRef(routeHeaderId);

  const loadCredentials = useCallback(async () => {
    if (credentialsRef.current) return credentialsRef.current;
    const [userName, userPsd, companyId, userId] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
      AsyncStorage.getItem('companyId'),
      AsyncStorage.getItem('userId'),
    ]);
    credentialsRef.current = {userName, userPwd: userPsd, companyId: Number(companyId), userId: userId ? Number(userId) : undefined};
    return credentialsRef.current;
  }, []);

  const popUpAction = useCallback((popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  }, []);

  const popOkBtnAction = useCallback(() => {
    popUpAction(undefined, undefined, '', false, false);
  }, [popUpAction]);

  const backBtnAction = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // ---- /state ----

  const loadState = useCallback(
    async (showLoader = true) => {
      const creds = await loadCredentials();
      if (showLoader) set_MainLoading(true);
      try {
        const res = await GrnChkAPI.grnCheckingStateApi({
          poNumber,
          companyId: creds.companyId,
          userId: creds.userId,
          userName: creds.userName,
          userPwd: creds.userPwd,
        });
        if (res?.statusData && res?.responseData) {
          const data = res.responseData;
          // DEBUG: temporary -- inspect this in `adb logcat` (or Metro's
          // terminal) to confirm the real field names /state returns for
          // vendor details.
          console.log('GRNCHK_DEBUG /state vendorDetails:', JSON.stringify(data.vendorDetails));
          set_header(data.header);
          headerIdRef.current = data.header?.id;
          set_fabricLineItems(data.fabricLineItems || []);
          set_lots(data.lots || []);
          set_vendorDetails(data.vendorDetails || null);
          set_grnNumbers(data.grnNumbers || []);
        } else {
          popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
        }
      } catch (error) {
        console.log('GrnCheckingFabric loadState error ==>', error);
        popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      } finally {
        set_MainLoading(false);
      }
    },
    [loadCredentials, poNumber, popUpAction],
  );

  useEffect(() => {
    loadState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- in-place state mutation helpers ----

  const mergeLot = useCallback(lot => {
    if (!lot) return;
    set_lots(prev => {
      const idx = prev.findIndex(l => l.id === lot.id);
      if (idx === -1) return [...prev, lot];
      const next = [...prev];
      next[idx] = lot;
      return next;
    });
  }, []);

  const mergeBale = useCallback((lotId, bale) => {
    if (!bale) return;
    set_lots(prev =>
      prev.map(lot => {
        if (lot.id !== lotId && lot.id !== bale.lotId) return lot;
        const bales = lot.bales || [];
        const idx = bales.findIndex(b => b.id === bale.id);
        const nextBales = idx === -1 ? [...bales, bale] : bales.map((b, i) => (i === idx ? bale : b));
        return {...lot, bales: nextBales};
      }),
    );
  }, []);

  const updateBaleLocal = useCallback((lotId, baleId, updater) => {
    set_lots(prev =>
      prev.map(lot => {
        if (lot.id !== lotId) return lot;
        return {
          ...lot,
          bales: (lot.bales || []).map(b => (b.id === baleId ? updater(b) : b)),
        };
      }),
    );
  }, []);

  // Single source of truth for every piece-level edit (Total In Mtrs,
  // Checked Mtrs) -- so the "sum for approval"/save-draft checks always
  // read the latest on-screen values straight from `lots` state.
  const updatePieceField = useCallback((lotId, baleId, pcNo, field, value) => {
    updateBaleLocal(lotId, baleId, b => ({
      ...b,
      pieces: (b.pieces || []).map(p => (p.pcNo === pcNo ? {...p, [field]: value} : p)),
    }));
  }, [updateBaleLocal]);

  const updateBaleField = useCallback((lotId, baleId, field, value) => {
    updateBaleLocal(lotId, baleId, b => ({...b, [field]: value}));
  }, [updateBaleLocal]);

  // ---- header meta ----

  const saveHeaderMeta = useCallback(
    async (remarks, checkingDate) => {
      const creds = await loadCredentials();
      if (!headerIdRef.current) return;
      await GrnChkAPI.grnCheckingSaveHeaderMetaApi({
        ...creds,
        headerId: headerIdRef.current,
        remarks,
        checkingDate,
      });
    },
    [loadCredentials],
  );

  // ---- lot ----

  const fetchAvailableRolls = useCallback(
    async lineItem => {
      const creds = await loadCredentials();
      const res = await GrnChkAPI.grnCheckingAvailableRollsApi({
        ...creds,
        poNumber,
        poLineitemId: lineItem.lineitemId,
      });
      // DEBUG: temporary -- inspect this in `adb logcat` (or Metro's
      // terminal) to confirm the real shape/field names of each roll.
      console.log('GRNCHK_DEBUG /lot/available-rolls raw:', JSON.stringify(res?.responseData));
      if (res?.statusData && Array.isArray(res?.responseData)) {
        set_availableRollsByLineItem(prev => ({...prev, [lineItem.lineitemId]: res.responseData}));
      } else {
        console.log('GRNCHK_DEBUG /lot/available-rolls: statusData or array check failed', res?.statusData, res?.error);
      }
    },
    [loadCredentials, poNumber],
  );

  const openLot = useCallback(
    async (lineItem, rollNo) => {
      const creds = await loadCredentials();
      set_MainLoading(true);
      try {
        const res = await GrnChkAPI.grnCheckingOpenLotApi({
          ...creds,
          headerId: headerIdRef.current,
          poLineitemId: lineItem.lineitemId,
          fabricId: lineItem.fabricId,
          rollNo,
        });
        if (res?.statusData && res?.responseData) {
          mergeLot(res.responseData);
        } else {
          popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
        }
      } finally {
        set_MainLoading(false);
      }
    },
    [loadCredentials, mergeLot, popUpAction],
  );

  // ---- bale ----

  const saveBaleDraft = useCallback(
    async bale => {
      const creds = await loadCredentials();
      const checkedMtrs = sumCheckedMtrs(bale.pieces);
      const res = await GrnChkAPI.grnCheckingBaleSaveDraftApi({
        ...creds,
        baleId: bale.id,
        lotId: bale.lotId,
        baleNo: bale.baleNo,
        checkedMtrs,
        damageMtrs: bale.damageMtrs,
        pieces: (bale.pieces || []).map(p => ({
          pcNo: p.pcNo,
          totalInMtrs: p.totalInMtrs,
          checkedMtrs: p.checkedMtrs,
        })),
      });
      return res?.statusData && res?.responseData?.success !== false;
    },
    [loadCredentials],
  );

  const saveBaleDraftWithFeedback = useCallback(
    async bale => {
      set_MainLoading(true);
      try {
        const ok = await saveBaleDraft(bale);
        popUpAction(
          ok ? 'Saved.' : Constant.Fail_Save_Dtls_MSG,
          ok ? Constant.SuccessAlert_MSG : Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } finally {
        set_MainLoading(false);
      }
    },
    [popUpAction, saveBaleDraft],
  );

  const addBaleManual = useCallback(
    async (lot, baleNo, totalPcsStr) => {
      const totalPcs = parseInt(totalPcsStr, 10);
      if (!baleNo || !baleNo.trim()) {
        popUpAction(Constant.GRNCHK_BALENO_REQUIRED, Constant.DefaultAlert_MSG, 'OK', true, false);
        return false;
      }
      if (!totalPcs || totalPcs < 1) {
        popUpAction(Constant.GRNCHK_TOTALPCS_MIN, Constant.DefaultAlert_MSG, 'OK', true, false);
        return false;
      }
      const creds = await loadCredentials();
      set_MainLoading(true);
      try {
        const res = await GrnChkAPI.grnCheckingBaleAddApi({
          ...creds,
          lotId: lot.id,
          baleNo: baleNo.trim(),
          totalPcs,
        });
        if (res?.statusData && res?.responseData?.success !== false) {
          mergeBale(lot.id, res.responseData.bale);
          popUpAction(Constant.GRNCHK_BALE_ADDED, Constant.SuccessAlert_MSG, 'OK', true, false);
          return true;
        }
        popUpAction(
          res?.responseData?.errorMessage || Constant.SERVICE_FAIL_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
        return false;
      } finally {
        set_MainLoading(false);
      }
    },
    [loadCredentials, mergeBale, popUpAction],
  );

  const removePiece = useCallback(
    (lot, bale, pcNo) => {
      Alert.alert('Confirm', Constant.GRNCHK_REMOVE_PIECE_CONFIRM(pcNo), [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          onPress: async () => {
            const creds = await loadCredentials();
            const res = await GrnChkAPI.grnCheckingBaleRemovePieceApi({
              ...creds,
              baleId: bale.id,
              pcNo,
            });
            if (res?.statusData && res?.responseData?.success !== false) {
              mergeBale(lot.id, res.responseData.bale);
              popUpAction(Constant.GRNCHK_PIECE_REMOVED, Constant.SuccessAlert_MSG, 'OK', true, false);
            } else {
              popUpAction(
                res?.responseData?.errorMessage || Constant.GRNCHK_REMOVE_PIECE_FAILED,
                Constant.DefaultAlert_MSG,
                'OK',
                true,
                false,
              );
            }
          },
        },
      ]);
    },
    [loadCredentials, mergeBale, popUpAction],
  );

  const submitBale = useCallback(
    async (lot, bale) => {
      const creds = await loadCredentials();
      set_MainLoading(true);
      try {
        const saved = await saveBaleDraft(bale);
        if (!saved) {
          popUpAction(Constant.GRNCHK_SAVE_FAILED_SUBMIT_CANCELLED, Constant.DefaultAlert_MSG, 'OK', true, false);
          return;
        }
        const res = await GrnChkAPI.grnCheckingBaleSubmitApi({...creds, baleId: bale.id});
        if (res?.statusData && res?.responseData?.success !== false) {
          updateBaleLocal(lot.id, bale.id, b => ({...b, status: 'SUBMITTED'}));
          const warnings = res.responseData.warnings || [];
          popUpAction(
            warnings.length ? [Constant.GRNCHK_SUBMITTED, ...warnings].join('\n') : Constant.GRNCHK_SUBMITTED,
            Constant.SuccessAlert_MSG,
            'OK',
            true,
            false,
          );
        } else {
          popUpAction(
            res?.responseData?.errorMessage || Constant.SERVICE_FAIL_MSG,
            Constant.DefaultAlert_MSG,
            'OK',
            true,
            false,
          );
        }
      } finally {
        set_MainLoading(false);
      }
    },
    [loadCredentials, popUpAction, saveBaleDraft, updateBaleLocal],
  );

  const unsubmitBale = useCallback(
    (lot, bale) => {
      Alert.alert('Confirm', Constant.GRNCHK_REVERT_CONFIRM, [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          onPress: async () => {
            const creds = await loadCredentials();
            const res = await GrnChkAPI.grnCheckingBaleUnsubmitApi({...creds, baleId: bale.id});
            if (res?.statusData && res?.responseData?.success !== false) {
              mergeBale(lot.id, res.responseData.bale || {...bale, status: 'DRAFT'});
            } else {
              popUpAction(
                res?.responseData?.errorMessage || Constant.SERVICE_FAIL_MSG,
                Constant.DefaultAlert_MSG,
                'OK',
                true,
                false,
              );
            }
          },
        },
      ]);
    },
    [loadCredentials, mergeBale, popUpAction],
  );

  const moveBaleToLot = useCallback(
    async (bale, newLotId) => {
      if (!newLotId) {
        popUpAction(Constant.GRNCHK_CHOOSE_DEST_LOT, Constant.DefaultAlert_MSG, 'OK', true, false);
        return;
      }
      const creds = await loadCredentials();
      set_MainLoading(true);
      try {
        const res = await GrnChkAPI.grnCheckingBaleMoveToLotApi({...creds, baleId: bale.id, newLotId});
        if (res?.statusData && res?.responseData?.success !== false) {
          popUpAction(Constant.GRNCHK_BALE_MOVED, Constant.SuccessAlert_MSG, 'OK', true, false);
          await loadState(false);
        } else {
          popUpAction(
            res?.responseData?.errorMessage || Constant.GRNCHK_MOVE_FAILED,
            Constant.DefaultAlert_MSG,
            'OK',
            true,
            false,
          );
        }
      } finally {
        set_MainLoading(false);
      }
    },
    [loadCredentials, loadState, popUpAction],
  );

  // ---- submit-all (page-level Submit) ----

  const saveAllDrafts = useCallback(async () => {
    const draftBales = [];
    lots.forEach(lot => (lot.bales || []).forEach(b => b.status === 'DRAFT' && draftBales.push(b)));
    if (draftBales.length === 0) {
      popUpAction(Constant.GRNCHK_NO_DRAFT_BALES, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }
    set_MainLoading(true);
    try {
      const results = await Promise.all(draftBales.map(saveBaleDraft));
      const ok = results.every(Boolean);
      popUpAction(
        ok ? 'Saved.' : Constant.Fail_Save_Dtls_MSG,
        ok ? Constant.SuccessAlert_MSG : Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    } finally {
      set_MainLoading(false);
    }
  }, [lots, popUpAction, saveBaleDraft]);

  const submitAllDraftBales = useCallback(async () => {
    const draftBales = [];
    lots.forEach(lot => (lot.bales || []).forEach(b => b.status === 'DRAFT' && draftBales.push({lot, bale: b})));
    if (draftBales.length === 0) {
      popUpAction(Constant.GRNCHK_NO_DRAFT_BALES, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }
    set_MainLoading(true);
    try {
      const saveResults = await Promise.all(draftBales.map(({bale}) => saveBaleDraft(bale)));
      if (saveResults.some(ok => !ok)) {
        popUpAction(Constant.GRNCHK_SAVE_FAILED_SUBMIT_CANCELLED, Constant.DefaultAlert_MSG, 'OK', true, false);
        return;
      }
      const creds = await loadCredentials();
      const submitResults = await Promise.all(
        draftBales.map(({bale}) => GrnChkAPI.grnCheckingBaleSubmitApi({...creds, baleId: bale.id})),
      );
      const failures = [];
      const warnings = [];
      submitResults.forEach((res, i) => {
        if (!res?.statusData || res?.responseData?.success === false) {
          failures.push(res?.responseData?.errorMessage || `Bale ${draftBales[i].bale.baleNo}: submit failed`);
        } else {
          (res?.responseData?.warnings || []).forEach(w => warnings.push(w));
        }
      });
      if (failures.length) {
        popUpAction(failures.join('\n'), Constant.DefaultAlert_MSG, 'OK', true, false);
      } else {
        popUpAction(
          warnings.length ? [Constant.GRNCHK_SUBMITTED, ...warnings].join('\n') : Constant.GRNCHK_SUBMITTED,
          Constant.SuccessAlert_MSG,
          'OK',
          true,
          false,
        );
      }
      setTimeout(() => loadState(false), warnings.length ? 4000 : 800);
    } finally {
      set_MainLoading(false);
    }
  }, [lots, loadCredentials, loadState, popUpAction, saveBaleDraft]);

  // ---- select-for-approval / approve batch ----

  const toggleSelectForApproval = useCallback(
    async (lot, bale, nextChecked) => {
      if (!nextChecked) {
        set_selectedBaleIds(prev => prev.filter(id => id !== bale.id));
        return;
      }
      const sum = sumCheckedMtrs(bale.pieces);
      if (sum <= 0) {
        popUpAction(Constant.GRNCHK_NO_CHECKED_MTRS, Constant.DefaultAlert_MSG, 'OK', true, false);
        return;
      }
      const saved = await saveBaleDraft(bale);
      if (!saved) {
        popUpAction(Constant.GRNCHK_SAVE_BEFORE_APPROVE_FAILED, Constant.DefaultAlert_MSG, 'OK', true, false);
        return;
      }
      set_selectedBaleIds(prev => (prev.includes(bale.id) ? prev : [...prev, bale.id]));
    },
    [popUpAction, saveBaleDraft],
  );

  const approveSelectedBales = useCallback(() => {
    if (selectedBaleIds.length === 0) return;
    Alert.alert('Confirm', Constant.GRNCHK_APPROVE_CONFIRM(selectedBaleIds.length), [
      {text: 'No', style: 'cancel'},
      {
        text: 'Yes',
        onPress: async () => {
          const creds = await loadCredentials();
          set_MainLoading(true);
          try {
            const res = await GrnChkAPI.grnCheckingBaleApproveBatchApi({...creds, baleIds: selectedBaleIds});
            const data = res?.responseData;
            if (res?.statusData && data?.success !== false) {
              (data.updatedLots || []).forEach(mergeLot);
              set_selectedBaleIds([]);
              const warnings = data.warnings || [];
              popUpAction(
                warnings.length
                  ? [Constant.GRNCHK_APPROVED(data.grnNo), ...warnings].join('\n')
                  : Constant.GRNCHK_APPROVED(data.grnNo),
                Constant.SuccessAlert_MSG,
                'OK',
                true,
                false,
              );
            } else {
              popUpAction(data?.errorMessage || Constant.GRNCHK_APPROVE_FAILED, Constant.DefaultAlert_MSG, 'OK', true, false);
            }
          } finally {
            set_MainLoading(false);
          }
        },
      },
    ]);
  }, [selectedBaleIds, loadCredentials, mergeLot, popUpAction]);

  // ---- audit history ----

  const fetchAuditHistory = useCallback(async () => {
    const creds = await loadCredentials();
    if (!headerIdRef.current) return;
    const res = await GrnChkAPI.grnCheckingAuditHistoryApi({...creds, headerId: headerIdRef.current});
    if (res?.statusData && res?.responseData?.rows) {
      set_auditHistoryRows(res.responseData.rows);
    }
  }, [loadCredentials]);

  // ---- AI upload result routing ----

  const onLotUploadResult = useCallback(
    data => {
      if (data?.lot) mergeLot(data.lot);
    },
    [mergeLot],
  );

  const onBaleUploadResult = useCallback(
    data => {
      if (data?.bale) mergeBale(data.bale.lotId, data.bale);
    },
    [mergeBale],
  );

  const lotUploadJob = useAiUploadJob({
    uploadApi: GrnChkAPI.grnCheckingLotUploadApi,
    uploadAsyncApi: GrnChkAPI.grnCheckingLotUploadAsyncApi,
    statusApi: GrnChkAPI.grnCheckingLotUploadStatusApi,
    cancelApi: GrnChkAPI.grnCheckingLotUploadCancelApi,
    resumeApi: GrnChkAPI.grnCheckingLotUploadResumeApi,
    hasFabricMismatch: true,
    onResult: onLotUploadResult,
    getCreds: loadCredentials,
  });

  const baleUploadJob = useAiUploadJob({
    uploadApi: GrnChkAPI.grnCheckingBaleUploadApi,
    uploadAsyncApi: GrnChkAPI.grnCheckingBaleUploadAsyncApi,
    statusApi: GrnChkAPI.grnCheckingBaleUploadStatusApi,
    cancelApi: GrnChkAPI.grnCheckingBaleUploadCancelApi,
    resumeApi: GrnChkAPI.grnCheckingBaleUploadResumeApi,
    hasFabricMismatch: true,
    onResult: onBaleUploadResult,
    getCreds: loadCredentials,
  });

  // ---- PDF downloads ----

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    const perm =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const granted = await PermissionsAndroid.request(perm, {
      title: 'Storage Permission Required',
      message: 'This app needs access to your storage to download PDF',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const downloadPdf = useCallback(async (apiUrl, fileName) => {
    const creds = await loadCredentials();
    set_MainLoading(true);
    try {
      const response = await axios.get(apiUrl, {
        headers: {'X-User-Name': creds.userName, 'X-User-Pwd': creds.userPwd},
        responseType: 'arraybuffer',
      });
      const base64Data = response?.request?._response;
      if (Platform.OS === 'android') {
        const ok = await requestStoragePermission();
        if (!ok) {
          Alert.alert('Permission Denied', 'Storage permission is required to save the PDF.');
          return;
        }
      }
      const pdfPath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/${fileName}`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;
      await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');
      popUpAction(
        Platform.OS === 'android' ? `PDF saved successfully at ${pdfPath}` : 'PDF saved successfully',
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    } catch (error) {
      console.error('GrnCheckingFabric PDF download error:', error);
      popUpAction(Constant.SERVICE_FAIL_PDF_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    } finally {
      set_MainLoading(false);
    }
  }, [loadCredentials, popUpAction]);

  const downloadGrnPdf = useCallback(
    async grnNo => {
      const creds = await loadCredentials();
      const url = GrnChkAPI.grnCheckingPdfUrl({grnNo, poNumber, itemType: 'Fabric', companyId: creds.companyId});
      downloadPdf(url, `GRN_${grnNo}.pdf`);
    },
    [loadCredentials, poNumber, downloadPdf],
  );

  const downloadWorksheetPdf = useCallback(
    async (lotId, cols = 2, draftOnly = false) => {
      const creds = await loadCredentials();
      const url = GrnChkAPI.grnCheckingWorksheetPdfUrl({lotId, cols, companyId: creds.companyId, draftOnly});
      downloadPdf(url, `Worksheet_Lot${lotId}${draftOnly ? '_DraftOnly' : ''}.pdf`);
    },
    [loadCredentials, downloadPdf],
  );

  return (
    <GrnCheckingFabricUI
      header={header}
      fabricLineItems={fabricLineItems}
      lots={lots}
      vendorDetails={vendorDetails}
      grnNumbers={grnNumbers}
      availableRollsByLineItem={availableRollsByLineItem}
      auditHistoryRows={auditHistoryRows}
      selectedBaleIds={selectedBaleIds}
      MainLoading={MainLoading}
      isPopUp={isPopUp}
      popUpMessage={popUpMessage}
      popUpAlert={popUpAlert}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      popOkBtnAction={popOkBtnAction}
      backBtnAction={backBtnAction}
      onRefresh={() => loadState(false)}
      saveHeaderMeta={saveHeaderMeta}
      fetchAvailableRolls={fetchAvailableRolls}
      openLot={openLot}
      updateBaleLocal={updateBaleLocal}
      updatePieceField={updatePieceField}
      updateBaleField={updateBaleField}
      saveBaleDraft={saveBaleDraftWithFeedback}
      addBaleManual={addBaleManual}
      removePiece={removePiece}
      submitBale={submitBale}
      unsubmitBale={unsubmitBale}
      moveBaleToLot={moveBaleToLot}
      saveAllDrafts={saveAllDrafts}
      submitAllDraftBales={submitAllDraftBales}
      toggleSelectForApproval={toggleSelectForApproval}
      approveSelectedBales={approveSelectedBales}
      fetchAuditHistory={fetchAuditHistory}
      lotUploadJob={lotUploadJob}
      baleUploadJob={baleUploadJob}
      downloadGrnPdf={downloadGrnPdf}
      downloadWorksheetPdf={downloadWorksheetPdf}
    />
  );
};

export default GrnCheckingFabric;
