import React, {useState, useCallback, useRef, useEffect} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSearchablePagedList from './../../../utils/Hooks/useSearchablePagedList';
import {MOBILE_LIST_CONFIG} from './../../../utils/constants/mobileListConfig';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import StockIssueListUI from './StockIssueListUI';

const StockIssueList = ({navigation, route, ...props}) => {
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [MainLoading, set_MainLoading] = useState(false);

  // Load credentials once; avoid 4x AsyncStorage reads on every operation
  const credentialsRef = useRef(null);

  const loadCredentials = useCallback(async () => {
    if (credentialsRef.current) return credentialsRef.current;
    const [userName, userPsd, companyId, companyObj] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
      AsyncStorage.getItem('companyId'),
      AsyncStorage.getItem('companyObj'),
    ]);
    credentialsRef.current = {userName, userPsd, companyId, companyObj};
    return credentialsRef.current;
  }, []);

  const isSessionExpired = useRef(false);

  const list = useSearchablePagedList(MOBILE_LIST_CONFIG.STOCK_ISSUE, {
    mapRow: row => ({
      ...row,
      // Old row UI shows View when status === 1, else Approve.
      status:
        row.approveStatus === undefined ||
        row.approveStatus === null ||
        Number(row.approveStatus) === 0
          ? 0
          : 1,
    }),
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
      await AsyncStorage.removeItem('userDisplayName');
      await AsyncStorage.removeItem('admin');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userPsd');
      credentialsRef.current = null;
      navigation.reset({index: 0, routes: [{name: 'LoginComponent'}]});
    }
  }, [popUpAction, navigation]);

  const actionOnRow = useCallback(
    async item => {
      const {userName, userPsd, companyObj} = await loadCredentials();
      set_isLoading(true);
      set_MainLoading(true);
      let viewObject = {};
      try {
        const obj = {
          username: userName,
          password: userPsd,
          stockId: item?.g_id,
          languageId: 1,
          companyDetails: JSON.parse(companyObj),
        };
        const stockissessViewObj = await APIServiceCall.stockIssueViewApi(obj);
        if (stockissessViewObj?.statusData && stockissessViewObj?.responseData) {
          viewObject = stockissessViewObj.responseData?.viewDTO;
          navigation.navigate('ViewStockIssue', {viewObject});
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
        console.log('actionOnRow error ==>', error);
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
    [loadCredentials, navigation, popUpAction],
  );

  const downloadStockIssuePDF = useCallback(
    async item => {
      const {userName, userPsd, companyObj} = await loadCredentials();
      const company = JSON.parse(companyObj);
      set_MainLoading(true);
      const obj = {
        username: userName,
        password: userPsd,
        gId: item?.g_id,
        companyDetails: {
          companyLogo: company.company_logo || '',
          companyName: company.company_name || '',
          companyAddress: company.company_addr || '',
          companyPhone: company.company_phone || '',
          companyEmail: company.company_email || '',
        },
      };
      const apiUrl = await APIServiceCall.downloadStockIssuePdf();
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
            ? `/storage/emulated/0/Download/StockIssue_${item?.g_id}.pdf`
            : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/StockIssue_${item?.g_id}.pdf`;
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

  return (
    <StockIssueListUI
      list={list}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      actionOnRow={actionOnRow}
      popOkBtnAction={popOkBtnAction}
      MainLoading={MainLoading}
      downloadStockIssuePDF={downloadStockIssuePDF}
    />
  );
};

export default StockIssueList;
