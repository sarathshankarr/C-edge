import React, {useState, useCallback, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as GrnChkAPI from '../../../utils/apiCalls/grnCheckingApiCalls';
import * as Constant from '../../../utils/constants/constant';
import {showGrnAlert} from '../common/GrnAlert';

import GrnCheckingListUI from './GrnCheckingListUI';
import useSearchablePagedList from '../../../utils/Hooks/useSearchablePagedList';
import {MOBILE_LIST_CONFIG} from '../../../utils/constants/mobileListConfig';

// The GRN Checking list menu id (menu_master_tbl.menu_id = 981, see
// AI/CED-1626/sql/03_grn_checking_menu.sql) -- required by /list per
// openapi.yaml (used server-side for the "Last 30 Days" day-limit lookup).
const GRN_CHECKING_MENU_ID = 981;

// One PO can have one row per item type (keyExtractor below), so de-duplicate
// pages by PO + item type instead of poNumber alone.
const LIST_CONFIG = {
  ...MOBILE_LIST_CONFIG.GRN_CHECKING,
  menuId: GRN_CHECKING_MENU_ID,
  uniqueKey: '_rowKey',
};
const mapRow = row => ({...row, _rowKey: `${row?.poNumber}_${row?.itemType}`});

const GrnCheckingList = ({navigation, route, ...props}) => {
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [MainLoading, set_MainLoading] = useState(false);
  const isSessionExpired = useRef(false);

  const credentialsRef = useRef(null);

  const loadCredentials = useCallback(async () => {
    if (credentialsRef.current) return credentialsRef.current;
    const [userName, userPsd, companyId, userId] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
      AsyncStorage.getItem('companyId'),
      AsyncStorage.getItem('userId'),
    ]);
    credentialsRef.current = {userName, userPsd, companyId, userId};
    return credentialsRef.current;
  }, []);

  const list = useSearchablePagedList(LIST_CONFIG, {
    mapRow,
    onInvalidLogin: () => {
      isSessionExpired.current = true;
      popUpAction(
        'Session expired / invalid credentials. Please login again.',
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    },
  });

  // Returning from a check screen with {refresh}: reload page 1, keeping search and filter.
  useEffect(() => {
    if (route?.params?.refresh) {
      list.retry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.refresh]);

  const backBtnAction = useCallback(() => {
    navigation.navigate('Main');
  }, [navigation]);

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

  const popOkBtnAction = useCallback(async () => {
    popUpAction(undefined, undefined, '', false, false);
    if (isSessionExpired.current) {
      isSessionExpired.current = false;
      credentialsRef.current = null;
      await AsyncStorage.removeItem('userDisplayName');
      await AsyncStorage.removeItem('admin');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userPsd');
      navigation.reset({index: 0, routes: [{name: 'LoginComponent'}]});
    }
  }, [popUpAction, navigation]);

  // Routes to the Fabric (lot/bale/piece) screen or the flat RM screen
  // depending on the row's own itemType -- both read the same /state bundle.
  const actionOnRow = useCallback(
    item => {
      const targetRoute = item?.itemType === 'RM' ? 'GrnCheckingRm' : 'GrnCheckingFabric';
      navigation.navigate(targetRoute, {
        poNumber: item?.poNumber,
        headerId: item?.headerId,
        itemType: item?.itemType,
      });
    },
    [navigation],
  );

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // Android 13+: saving the app's own files to Downloads needs no permission
          return true;
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

  const downloadPdfFile = useCallback(
    async (apiUrl, fileName) => {
      const {userName, userPsd} = await loadCredentials();
      set_MainLoading(true);
      try {
        const response = await axios.get(apiUrl, {
          headers: {'X-User-Name': userName, 'X-User-Pwd': userPsd},
          responseType: 'arraybuffer',
        });
        const base64Data = response?.request?._response;
        if (Platform.OS === 'android') {
          const hasPermission = await requestStoragePermission();
          if (!hasPermission) {
            showGrnAlert(
              'Permission Denied',
              'Storage permission is required to save the PDF.',
            );
            return;
          }
        }
        const pdfPath =
          Platform.OS === 'android'
            ? `/storage/emulated/0/Download/${fileName}`
            : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;
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
        console.error('Error generating or saving GRN Checking PDF:', error);
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

  // Overall PO PDF -- list page's single "PDF" button, only enabled per-row
  // when hasApprovedBatches is true (business-rules-and-flows.md, List page).
  const downloadOverallPdf = useCallback(
    async item => {
      const {companyId} = await loadCredentials();
      const apiUrl = GrnChkAPI.grnCheckingOverallPdfUrl({poNumber: item?.poNumber, companyId});
      downloadPdfFile(apiUrl, `GrnChecking_${item?.poNumber}.pdf`);
    },
    [loadCredentials, downloadPdfFile],
  );

  // Barcode PDF (added 2026-09-18) -- Fabric-only, list page's "Barcode"
  // link next to "PDF". Barcodes are generated automatically on bale
  // approval; this only ever downloads what already exists.
  const downloadBarcodePdf = useCallback(
    async item => {
      const {companyId} = await loadCredentials();
      const apiUrl = GrnChkAPI.grnCheckingBarcodePoUrl({poNumber: item?.poNumber, companyId});
      downloadPdfFile(apiUrl, `Barcodes-PO-${item?.poNumber}.pdf`);
    },
    [loadCredentials, downloadPdfFile],
  );

  return (
    <GrnCheckingListUI
      list={list}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      actionOnRow={actionOnRow}
      popOkBtnAction={popOkBtnAction}
      MainLoading={MainLoading}
      downloadOverallPdf={downloadOverallPdf}
      downloadBarcodePdf={downloadBarcodePdf}
    />
  );
};

export default GrnCheckingList;
