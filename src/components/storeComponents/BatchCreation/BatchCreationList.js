import React, {useState, useCallback, useRef, useEffect} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import BatchCreationListUI from './BatchCreationListUI';

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

  const downloadBatchCreationPDF = useCallback(
    async item => {
      const {userName, userPsd} = await loadCredentials();
      set_MainLoading(true);
      const obj = {
        username: userName,
        password: userPsd,
        batchDetailsId: item?.batchDetailsId,
      };
      const apiUrl = APIServiceCall.downloadBatchCreationPdf();
      try {
        const response = await axios.post(apiUrl, obj, {
          headers: {'Content-Type': 'application/json'},
          responseType: 'arraybuffer',
        });
        const base64Data = response?.request?._response;
        if (Platform.OS === 'android') {
          const hasPermission = await requestStoragePermission();
          if (!hasPermission) {
            Alert.alert(
              'Permission Denied',
              'Storage permission is required to save the PDF.',
            );
            return;
          }
        }
        const pdfPath =
          Platform.OS === 'android'
            ? `/storage/emulated/0/Download/BatchCreation_${item?.batchDetailsId}.pdf`
            : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/BatchCreation_${item?.batchDetailsId}.pdf`;
        await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');
        popUpAction(
          Platform.OS === 'android'
            ? `PDF saved successfully at ${pdfPath}`
            : 'PDF saved successfully',
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } catch (error) {
        console.error('Error generating or saving PDF:', error);
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
    />
  );
};

export default BatchCreationList;
