import React, {useState, useCallback, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as GrnChkAPI from '../../../utils/apiCalls/grnCheckingApiCalls';
import * as Constant from '../../../utils/constants/constant';
import {showGrnAlert} from '../common/GrnAlert';

import GrnCheckingListUI from './GrnCheckingListUI';

// The GRN Checking list menu id (menu_master_tbl.menu_id = 981, see
// AI/CED-1626/sql/03_grn_checking_menu.sql) -- required by /list per
// openapi.yaml (used server-side for the "Last 30 Days" day-limit lookup).
const GRN_CHECKING_MENU_ID = 981;
const PAGE_LENGTH = 20;

const GrnCheckingList = ({navigation, route, ...props}) => {
  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [MainLoading, set_MainLoading] = useState(false);
  const [page, set_page] = useState(0);
  const [hasMore, set_hasMore] = useState(true);

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

  useEffect(() => {
    loadCredentials().then(() => getInitialData(0, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (route?.params?.refresh) {
      getInitialData(0, true);
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

  const popOkBtnAction = useCallback(() => {
    popUpAction(undefined, undefined, '', false, false);
  }, [popUpAction]);

  // page 0 + reload=true always means "start over" (pull-to-refresh, initial
  // mount, external refresh param); any other page is an onEndReached
  // continuation that APPENDS to itemsArray instead of replacing it.
  const getInitialData = useCallback(
    async (page = 0, reload = true, searchField, searchValue, dataFilter) => {
      const {userName, userPsd, companyId} = await loadCredentials();
      set_isLoading(!reload);
      set_MainLoading(reload);
      try {
        const start = reload ? 0 : page * PAGE_LENGTH;
        const obj = {
          userName,
          userPwd: userPsd,
          companyId: Number(companyId),
          menuId: GRN_CHECKING_MENU_ID,
          start,
          length: PAGE_LENGTH,
          searchField: searchField || undefined,
          searchValue: searchValue || undefined,
          dataFilter: dataFilter || undefined,
        };
        const listApiObj = await GrnChkAPI.grnCheckingListApi(obj);
        if (listApiObj?.statusData && listApiObj?.responseData?.data) {
          const rows = listApiObj.responseData.data;
          set_itemsArray(prev => (reload ? rows : [...prev, ...rows]));
          set_hasMore(rows.length >= PAGE_LENGTH);
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
        console.log('GrnCheckingList getInitialData error ==>', error);
        popUpAction(
          Constant.SERVICE_FAIL_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } finally {
        set_isLoading(false);
        set_MainLoading(false);
      }
    },
    [loadCredentials, popUpAction],
  );

  // Exposed to the UI as `fetchMore` -- `more=true` is an onEndReached
  // continuation (advances `page`, appends); `more=false`/omitted is a
  // full reload from page 0 (pull-to-refresh), matching
  // GoodsReceiptNoteList.js's own fetchMore(more) convention.
  const fetchMore = useCallback(
    more => {
      if (more) {
        if (!hasMore || isLoading || MainLoading) return;
        const next = page + 1;
        set_page(next);
        getInitialData(next, false);
      } else {
        set_page(0);
        set_hasMore(true);
        getInitialData(0, true);
      }
    },
    [hasMore, isLoading, MainLoading, page, getInitialData],
  );

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
      itemsArray={itemsArray}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      actionOnRow={actionOnRow}
      popOkBtnAction={popOkBtnAction}
      fetchMore={fetchMore}
      MainLoading={MainLoading}
      downloadOverallPdf={downloadOverallPdf}
      downloadBarcodePdf={downloadBarcodePdf}
    />
  );
};

export default GrnCheckingList;
