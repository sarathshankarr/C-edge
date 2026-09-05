import React, {useState, useCallback, useRef, useEffect} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import StockIssueReturnListUI from './StockIssueReturnListUI';

const StockIssueReturnList = ({navigation, route, ...props}) => {
  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [MainLoading, set_MainLoading] = useState(false);

  // Load credentials once; avoid repeated AsyncStorage reads on every operation
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
    async (reload = true) => {
      const {userName, userPsd} = await loadCredentials();
      set_isLoading(!reload);
      set_MainLoading(reload);
      try {
        const obj = {
          username: userName,
          password: userPsd,
          days: '',
        };
        const stockReturnAPIObj =
          await APIServiceCall.stockIssueReturnListApi(obj);
        if (
          stockReturnAPIObj?.statusData &&
          stockReturnAPIObj?.responseData?.aaData
        ) {
          set_itemsArray(stockReturnAPIObj.responseData.aaData);
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

  const actionOnRow = useCallback(
    async item => {
      const {userName, userPsd} = await loadCredentials();
      set_isLoading(true);
      set_MainLoading(true);
      try {
        const obj = {
          username: userName,
          password: userPsd,
          stockId: item?.sird_id,
        };
        const stockReturnViewObj =
          await APIServiceCall.stockIssueReturnViewApi(obj);
        if (stockReturnViewObj?.statusData && stockReturnViewObj?.responseData) {
          navigation.navigate('ViewStockIssueReturn', {
            viewObject: stockReturnViewObj.responseData,
          });
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

  const downloadStockIssueReturnPDF = useCallback(
    async item => {
      const {userName, userPsd} = await loadCredentials();
      set_MainLoading(true);
      const obj = {
        username: userName,
        password: userPsd,
        stockId: item?.sird_id,
      };
      const apiUrl = APIServiceCall.downloadStockIssueReturnPdf();
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
            ? `/storage/emulated/0/Download/StockIssueReturn_${item?.sird_id}.pdf`
            : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/StockIssueReturn_${item?.sird_id}.pdf`;
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
    <StockIssueReturnListUI
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
      downloadStockIssueReturnPDF={downloadStockIssueReturnPDF}
    />
  );
};

export default StockIssueReturnList;
