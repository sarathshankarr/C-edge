import React, {useState, useCallback, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import axios from 'axios';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as GrnChkAPI from '../../../utils/apiCalls/grnCheckingApiCalls';
import * as Constant from '../../../utils/constants/constant';
import useAiUploadJob from '../AiUpload/useAiUploadJob';

import GrnCheckingRmUI from './GrnCheckingRmUI';

const GrnCheckingRm = ({navigation, route}) => {
  const {poNumber} = route?.params || {};

  const [header, set_header] = useState(null);
  const [rmItems, set_rmItems] = useState([]);
  const [rmUploadHistory, set_rmUploadHistory] = useState([]);
  const [vendorDetails, set_vendorDetails] = useState(null);
  const [grnNumbers, set_grnNumbers] = useState([]);
  const [MainLoading, set_MainLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  const credentialsRef = useRef(null);
  const headerIdRef = useRef(null);

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
          set_rmItems(data.rmItems || []);
          set_rmUploadHistory(data.rmUploadHistory || []);
          set_vendorDetails(data.vendorDetails || null);
          set_grnNumbers(data.grnNumbers || []);
        } else {
          popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
        }
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

  const updateItemField = useCallback((poLineitemId, field, value) => {
    set_rmItems(prev => prev.map(it => (it.poLineitemId === poLineitemId ? {...it, [field]: value} : it)));
  }, []);

  const mergeRmItem = useCallback(item => {
    if (!item) return;
    set_rmItems(prev => {
      const idx = prev.findIndex(it => it.poLineitemId === item.poLineitemId);
      if (idx === -1) return [...prev, item];
      return prev.map((it, i) => (i === idx ? item : it));
    });
  }, []);

  const saveDraft = useCallback(
    async item => {
      const creds = await loadCredentials();
      const res = await GrnChkAPI.grnCheckingRmSaveDraftApi({
        ...creds,
        headerId: headerIdRef.current,
        poLineitemId: item.poLineitemId,
        checkedQty: item.checkedQty,
        damageQty: item.damageQty,
      });
      if (res?.statusData && res?.responseData?.item) mergeRmItem(res.responseData.item);
      return res?.statusData && res?.responseData?.success !== false;
    },
    [loadCredentials, mergeRmItem],
  );

  const submitOne = useCallback(
    async item => {
      const creds = await loadCredentials();
      set_MainLoading(true);
      try {
        const saved = await saveDraft(item);
        if (!saved) {
          popUpAction(Constant.GRNCHK_SAVE_FAILED_SUBMIT_CANCELLED_RM, Constant.DefaultAlert_MSG, 'OK', true, false);
          return;
        }
        const res = await GrnChkAPI.grnCheckingRmSubmitApi({
          ...creds,
          headerId: headerIdRef.current,
          poLineitemId: item.poLineitemId,
        });
        if (res?.statusData && res?.responseData?.success !== false) {
          if (res.responseData.item) mergeRmItem(res.responseData.item);
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
            res?.responseData?.errorMessage || Constant.GRNCHK_SUBMIT_FAILED_RM,
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
    [loadCredentials, mergeRmItem, popUpAction, saveDraft],
  );

  const submitAll = useCallback(async () => {
    const eligible = rmItems.filter(
      it => it.status === 'DRAFT' && !(it.totalReceivedQty <= 0) && it.checkedQty !== null && it.checkedQty !== undefined && it.checkedQty !== '',
    );
    if (eligible.length === 0) {
      popUpAction(Constant.GRNCHK_NO_DRAFT_RM_ITEMS, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }
    const creds = await loadCredentials();
    set_MainLoading(true);
    try {
      const saveResults = await Promise.all(eligible.map(saveDraft));
      if (saveResults.some(ok => !ok)) {
        popUpAction(Constant.GRNCHK_SAVE_FAILED_SUBMIT_CANCELLED_RM, Constant.DefaultAlert_MSG, 'OK', true, false);
        return;
      }
      const submitResults = await Promise.all(
        eligible.map(it =>
          GrnChkAPI.grnCheckingRmSubmitApi({...creds, headerId: headerIdRef.current, poLineitemId: it.poLineitemId}),
        ),
      );
      const warnings = [];
      let anyFail = false;
      submitResults.forEach(res => {
        if (!res?.statusData || res?.responseData?.success === false) anyFail = true;
        if (res?.responseData?.item) mergeRmItem(res.responseData.item);
        (res?.responseData?.warnings || []).forEach(w => warnings.push(w));
      });
      if (anyFail) {
        popUpAction(Constant.GRNCHK_SUBMIT_FAILED_RM, Constant.DefaultAlert_MSG, 'OK', true, false);
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
  }, [rmItems, loadCredentials, loadState, mergeRmItem, popUpAction, saveDraft]);

  const approveAll = useCallback(() => {
    Alert.alert('Confirm', Constant.GRNCHK_APPROVE_CONFIRM_RM, [
      {text: 'No', style: 'cancel'},
      {
        text: 'Yes',
        onPress: async () => {
          const creds = await loadCredentials();
          set_MainLoading(true);
          try {
            const res = await GrnChkAPI.grnCheckingRmApproveBatchApi({...creds, headerId: headerIdRef.current});
            const data = res?.responseData;
            if (res?.statusData && data?.success !== false) {
              if (!data.updatedItems || data.updatedItems.length === 0) {
                popUpAction(Constant.GRNCHK_NOTHING_ELIGIBLE_RM, Constant.DefaultAlert_MSG, 'OK', true, false);
                return;
              }
              data.updatedItems.forEach(mergeRmItem);
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
              loadState(false);
            } else {
              popUpAction(data?.errorMessage || Constant.GRNCHK_APPROVE_FAILED, Constant.DefaultAlert_MSG, 'OK', true, false);
            }
          } finally {
            set_MainLoading(false);
          }
        },
      },
    ]);
  }, [loadCredentials, loadState, mergeRmItem, popUpAction]);

  const onRmUploadResult = useCallback(
    data => {
      (data?.rmItems || []).forEach(mergeRmItem);
      if (data?.rmUploadHistory) set_rmUploadHistory(data.rmUploadHistory);
    },
    [mergeRmItem],
  );

  // RM has no fabric-mismatch concept and no /resume endpoint.
  const rmUploadJob = useAiUploadJob({
    uploadApi: GrnChkAPI.grnCheckingRmUploadAsyncApi,
    uploadAsyncApi: GrnChkAPI.grnCheckingRmUploadAsyncApi,
    statusApi: GrnChkAPI.grnCheckingRmUploadStatusApi,
    cancelApi: GrnChkAPI.grnCheckingRmUploadCancelApi,
    resumeApi: undefined,
    hasFabricMismatch: false,
    onResult: onRmUploadResult,
    getCreds: loadCredentials,
  });

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

  const downloadGrnPdf = useCallback(
    async grnNo => {
      const creds = await loadCredentials();
      set_MainLoading(true);
      try {
        const url = GrnChkAPI.grnCheckingPdfUrl({grnNo, poNumber, itemType: 'RM', companyId: creds.companyId});
        const response = await axios.get(url, {
          headers: {'X-User-Name': creds.userName, 'X-User-Pwd': creds.userPwd},
          responseType: 'arraybuffer',
        });
        const base64Data = response?.request?._response;
        if (Platform.OS === 'android') {
          const ok = await requestStoragePermission();
          if (!ok) return;
        }
        const pdfPath =
          Platform.OS === 'android'
            ? `/storage/emulated/0/Download/GRN_${grnNo}.pdf`
            : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/GRN_${grnNo}.pdf`;
        await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');
        popUpAction(
          Platform.OS === 'android' ? `PDF saved successfully at ${pdfPath}` : 'PDF saved successfully',
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } catch (error) {
        console.error('GrnCheckingRm PDF download error:', error);
        popUpAction(Constant.SERVICE_FAIL_PDF_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      } finally {
        set_MainLoading(false);
      }
    },
    [loadCredentials, poNumber, popUpAction],
  );

  return (
    <GrnCheckingRmUI
      header={header}
      rmItems={rmItems}
      rmUploadHistory={rmUploadHistory}
      vendorDetails={vendorDetails}
      grnNumbers={grnNumbers}
      MainLoading={MainLoading}
      isPopUp={isPopUp}
      popUpMessage={popUpMessage}
      popUpAlert={popUpAlert}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      popOkBtnAction={popOkBtnAction}
      backBtnAction={backBtnAction}
      onRefresh={() => loadState(false)}
      updateItemField={updateItemField}
      saveDraft={saveDraft}
      submitOne={submitOne}
      submitAll={submitAll}
      approveAll={approveAll}
      rmUploadJob={rmUploadJob}
      downloadGrnPdf={downloadGrnPdf}
    />
  );
};

export default GrnCheckingRm;
