import React, {useState, useCallback, useRef, useEffect} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import BatchCreationListUI from './BatchCreationListUI';

// Debug helper: first bytes of an arraybuffer response as text, so a JSON
// error body (or an HTML error page) is readable in the logs.
const decodeArrayBufferStart = (data, max = 500) => {
  try {
    if (!data) return data;
    if (typeof data === 'string') return data.slice(0, max);
    const bytes = new Uint8Array(data).slice(0, max);
    let text = '';
    for (let i = 0; i < bytes.length; i++) {
      text += String.fromCharCode(bytes[i]);
    }
    return text;
  } catch (e) {
    return `<could not decode: ${e?.message}>`;
  }
};

const BatchCreationList = ({navigation, route, ...props}) => {
  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [MainLoading, set_MainLoading] = useState(false);
  const [pendingDeleteItem, set_pendingDeleteItem] = useState(null);

  // Load credentials once; avoid repeated AsyncStorage reads on every operation
  const credentialsRef = useRef(null);

  const loadCredentials = useCallback(async () => {
    if (credentialsRef.current) return credentialsRef.current;
    const [userName, userPsd] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
    ]);
    credentialsRef.current = {userName, userPsd};
    return credentialsRef.current;
  }, []);

  const popUpAction = useCallback(
    (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
      set_popUpMessage(popMsg);
      set_popUpAlert(popAlert);
      set_popUpRBtnTitle(rBtnTitle);
      set_isPopupLeft(isPopLeft);
      set_isPopUp(isPopup);
    },
    [],
  );

  const popOkBtnAction = useCallback(() => {
    // A pending delete means the popup was the "are you sure?" confirm,
    // and the user just tapped its right button ("Delete") to confirm it.
    if (pendingDeleteItem) {
      const item = pendingDeleteItem;
      set_pendingDeleteItem(null);
      popUpAction(undefined, undefined, '', false, false);
      confirmDelete(item);
      return;
    }
    popUpAction(undefined, undefined, '', false, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingDeleteItem, popUpAction]);

  const getInitialData = useCallback(
    async (searchParams = {}, reload = true) => {
      const {userName, userPsd} = await loadCredentials();
      set_isLoading(!reload);
      set_MainLoading(reload);
      try {
        const obj = {
          username: userName,
          password: userPsd,
          start: 0,
          length: 100,
          searchKeyValue: '',
          styleSearchDropdown: '-1',
          dataFilter: '',
          ...searchParams,
        };
        const listApiObj = await APIServiceCall.batchCreationListApi(obj);
        if (listApiObj?.statusData && listApiObj?.responseData?.aaData) {
          set_itemsArray(listApiObj.responseData.aaData);
        } else if (listApiObj?.statusData) {
          set_itemsArray([]);
        } else {
          popUpAction(
            Constant.SERVICE_FAIL_MSG,
            Constant.DefaultAlert_MSG,
            'OK',
            true,
            false,
          );
        }
      } finally {
        set_isLoading(false);
        set_MainLoading(false);
      }
    },
    [loadCredentials, popUpAction],
  );

  useEffect(() => {
    loadCredentials().then(() => getInitialData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (route?.params?.refresh) {
      getInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.refresh]);

  const backBtnAction = useCallback(() => {
    navigation.navigate('Main');
  }, [navigation]);

  const editRow = useCallback(
    item => {
      navigation.navigate('CreateBatchCreation', {
        mode: 'edit',
        batchId: item?.id,
        batchDetailsId: item?.batchDetailsId,
      });
    },
    [navigation],
  );

  // View re-uses the Create/Edit screen in a fully-disabled "view" mode, so
  // it shares the exact same field mapping/prefill (no separate, drift-prone
  // read-only layout) — it loads via the same `edit` API, keyed off batchId.
  const viewRow = useCallback(
    item => {
      navigation.navigate('CreateBatchCreation', {
        mode: 'view',
        batchId: item?.id,
        batchDetailsId: item?.batchDetailsId,
      });
    },
    [navigation],
  );

  // The backend delete API enforces nothing server-side — it will delete
  // unconditionally if called with valid IDs. isProductionProcess is the
  // web's own client-side-only safety check (fabricflowstatus already
  // gates whether the Delete icon shows at all in BatchCreationListUI), so
  // it must be re-checked here before ever calling the API.
  const deleteRow = useCallback(
    item => {
      if (Number(item?.isProductionProcess) !== 0) {
        set_pendingDeleteItem(null);
        popUpAction(
          'Selected batch is in another process, will not able to delete.',
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
        return;
      }
      set_pendingDeleteItem(item);
      popUpAction(
        'Do you want to delete this batch?',
        Constant.DefaultAlert_MSG,
        'Delete',
        true,
        true,
      );
    },
    [popUpAction],
  );

  const confirmDelete = useCallback(
    async item => {
      const {userName, userPsd} = await loadCredentials();
      set_MainLoading(true);
      try {
        const obj = {
          username: userName,
          password: userPsd,
          batchId: item?.id,
          batchDetailsId: item?.batchDetailsId,
          fabricId: item?.fabricId,
          locationId: item?.bcLocationId,
        };
        const deleteApiObj = await APIServiceCall.deleteBatchCreationApi(obj);
        if (
          deleteApiObj?.statusData &&
          deleteApiObj?.responseData?.status !== 'false'
        ) {
          getInitialData();
        } else {
          popUpAction(
            Constant.SERVICE_FAIL_MSG,
            Constant.DefaultAlert_MSG,
            'OK',
            true,
            false,
          );
        }
      } catch (error) {
        console.log('confirmDelete error ==>', error);
        popUpAction(
          Constant.SERVICE_FAIL_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } finally {
        set_MainLoading(false);
      }
    },
    [loadCredentials, getInitialData, popUpAction],
  );

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Storage Permission Required',
              message: 'This app needs access to your storage to download PDF',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message: 'This app needs access to your storage to download PDF',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
      return false;
    } catch (err) {
      console.warn('Error requesting storage permission:', err);
      return false;
    }
  };

  // Shared by the PDF and Barcode actions — both endpoints take the same
  // body (plus extraBody) and return raw PDF bytes.
  const downloadBatchFile = useCallback(
    async (item, apiUrl, filePrefix, extraBody = {}) => {
      const {userName, userPsd} = await loadCredentials();
      set_MainLoading(true);
      const obj = {
        username: userName,
        password: userPsd,
        batchDetailsId: item?.batchDetailsId,
        ...extraBody,
      };
      const logTag = `[BatchCreation][${filePrefix}]`;
      // Which step we're on, so the catch block can say where it failed.
      let stage = 'request';
      try {
        console.log(
          `${logTag} POST`,
          apiUrl,
          'body =',
          JSON.stringify({...obj, password: obj.password ? '***' : obj.password}),
        );
        const response = await axios.post(apiUrl, obj, {
          headers: {'Content-Type': 'application/json'},
          responseType: 'arraybuffer',
        });
        stage = 'read-response';
        console.log(
          `${logTag} response status =`,
          response?.status,
          'content-type =',
          response?.headers?.['content-type'],
          'content-disposition =',
          response?.headers?.['content-disposition'],
          'data byteLength =',
          response?.data?.byteLength,
        );
        const base64Data = response?.request?._response;
        console.log(
          `${logTag} base64 (request._response) typeof =`,
          typeof base64Data,
          'length =',
          base64Data?.length,
          'first 60 chars =',
          typeof base64Data === 'string' ? base64Data.slice(0, 60) : base64Data,
        );
        // A real PDF's base64 starts with "JVBERi" ("%PDF-").
        if (typeof base64Data !== 'string' || !base64Data.startsWith('JVBERi')) {
          console.log(
            `${logTag} WARNING: response does not look like a PDF — decoded start =`,
            decodeArrayBufferStart(response?.data),
          );
        }
        if (Platform.OS === 'android') {
          stage = 'permission';
          const hasPermission = await requestStoragePermission();
          console.log(
            `${logTag} storage permission granted =`,
            hasPermission,
            'Platform.Version =',
            Platform.Version,
          );
          if (!hasPermission) {
            Alert.alert(
              'Permission Denied',
              'Storage permission is required to save the PDF.',
            );
            return;
          }
        }
        const fileName = `${filePrefix}_${item?.batchDetailsId}.pdf`;
        let savedLocation;
        stage = 'write-file';
        if (Platform.OS === 'android' && Platform.Version >= 29) {
          // Scoped storage (Android 10+): a raw write to
          // /storage/emulated/0/Download fails with ENOENT when a file of
          // that name already exists but isn't owned by this install. Write
          // to the app cache, then copy into Downloads through MediaStore
          // (which picks a free name instead of failing).
          const cachePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`;
          console.log(`${logTag} writing temp file to`, cachePath);
          await ReactNativeBlobUtil.fs.writeFile(cachePath, base64Data, 'base64');
          stage = 'copy-to-mediastore';
          const contentUri =
            await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
              {name: fileName, parentFolder: '', mimeType: 'application/pdf'},
              'Download',
              cachePath,
            );
          console.log(`${logTag} copied to MediaStore Downloads, uri =`, contentUri);
          ReactNativeBlobUtil.fs
            .unlink(cachePath)
            .catch(e => console.log(`${logTag} temp file cleanup failed`, e?.message));
          savedLocation = `Downloads (${fileName})`;
        } else {
          const pdfPath =
            Platform.OS === 'android'
              ? `/storage/emulated/0/Download/${fileName}`
              : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;
          console.log(`${logTag} writing file to`, pdfPath);
          await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');
          console.log(`${logTag} file written OK`, pdfPath);
          savedLocation = pdfPath;
        }
        popUpAction(
          Platform.OS === 'android'
            ? `PDF saved successfully at ${savedLocation}`
            : 'PDF saved successfully',
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } catch (error) {
        console.error(`${logTag} Error generating or saving PDF at stage "${stage}":`, error);
        console.log(`${logTag} error.message =`, error?.message, 'error.code =', error?.code);
        if (error?.response) {
          // HTTP error from the server (401/400/500) — the body is an
          // ArrayBuffer because of responseType, so decode it to read the
          // server's {status,message}.
          console.log(
            `${logTag} error.response.status =`,
            error.response.status,
            'content-type =',
            error.response.headers?.['content-type'],
            'body =',
            decodeArrayBufferStart(error.response.data),
          );
        } else if (error?.request) {
          console.log(
            `${logTag} no response received (network/timeout/cleartext?) — request status =`,
            error.request?.status,
          );
        }
        popUpAction(
          Constant.SERVICE_FAIL_PDF_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } finally {
        set_MainLoading(false);
      }
    },
    [loadCredentials, popUpAction],
  );

  const downloadBatchCreationPDF = useCallback(
    item =>
      downloadBatchFile(
        item,
        APIServiceCall.downloadBatchCreationPdf(),
        'BatchCreation',
      ),
    [downloadBatchFile],
  );

  const downloadBatchCreationBarcode = useCallback(
    item =>
      downloadBatchFile(
        item,
        APIServiceCall.downloadBatchCreationBarcode(),
        'BC_Barcode',
        {menuId: 571},
      ),
    [downloadBatchFile],
  );

  return (
    <BatchCreationListUI
      itemsArray={itemsArray}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      editRow={editRow}
      viewRow={viewRow}
      deleteRow={deleteRow}
      popOkBtnAction={popOkBtnAction}
      fetchMore={getInitialData}
      MainLoading={MainLoading}
      downloadBatchCreationPDF={downloadBatchCreationPDF}
      downloadBatchCreationBarcode={downloadBatchCreationBarcode}
    />
  );
};

export default BatchCreationList;
