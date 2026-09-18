import React, {useState, useCallback, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as GrnChkAPI from '../../../utils/apiCalls/grnCheckingApiCalls';
import * as Constant from '../../../utils/constants/constant';

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

  const getInitialData = useCallback(
    async (reload = true, searchField, searchValue, dataFilter) => {
      const {userName, userPsd, companyId} = await loadCredentials();
      set_isLoading(!reload);
      set_MainLoading(reload);
      try {
        const obj = {
          userName,
          userPwd: userPsd,
          companyId: Number(companyId),
          menuId: GRN_CHECKING_MENU_ID,
          start: 0,
          length: PAGE_LENGTH,
          searchField: searchField || undefined,
          searchValue: searchValue || undefined,
          dataFilter: dataFilter || undefined,
        };
        const listApiObj = await GrnChkAPI.grnCheckingListApi(obj);
        if (listApiObj?.statusData && listApiObj?.responseData?.data) {
          set_itemsArray(listApiObj.responseData.data);
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

  // Overall PO PDF -- list page's single "PDF" button, only enabled per-row
  // when hasApprovedBatches is true (business-rules-and-flows.md, List page).
  const downloadOverallPdf = useCallback(
    async item => {
      const {userName, userPsd, companyId} = await loadCredentials();
      set_MainLoading(true);
      const apiUrl = GrnChkAPI.grnCheckingOverallPdfUrl({
        poNumber: item?.poNumber,
        companyId,
      });
      try {
        const response = await axios.get(apiUrl, {
          headers: {'X-User-Name': userName, 'X-User-Pwd': userPsd},
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
            ? `/storage/emulated/0/Download/GrnChecking_${item?.poNumber}.pdf`
            : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/GrnChecking_${item?.poNumber}.pdf`;
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
      fetchMore={getInitialData}
      MainLoading={MainLoading}
      downloadOverallPdf={downloadOverallPdf}
    />
  );
};

export default GrnCheckingList;
