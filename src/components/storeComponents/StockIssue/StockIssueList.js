import React, {useState, useCallback, useRef, useEffect} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import StockIssueListUI from './StockIssueListUI';

const StockIssueList = ({navigation, route, ...props}) => {
  const ListSize = 10;

  const [itemsArray, set_itemsArray] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [MainLoading, set_MainLoading] = useState(false);
  const [page, setpage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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

  const getInitialData = useCallback(
    async (currentPage = 0, reload = false) => {
      if (reload) {
        setpage(0);
        setHasMore(true);
      }
      const {userName, userPsd} = await loadCredentials();
      set_isLoading(!reload);
      set_MainLoading(reload);
      try {
        const obj = {
          searchKeyValue: '',
          styleSearchDropdown: '-1',
          dataFilter: '10',
          start: currentPage * ListSize,
          length: ListSize,
          menuId: 750,
          username: userName,
          password: userPsd,
        };
        const stockissessAPIObj = await APIServiceCall.stockIssuesListApi(obj);
        if (
          stockissessAPIObj?.statusData &&
          stockissessAPIObj?.responseData?.aaData
        ) {
          const newData = stockissessAPIObj.responseData.aaData;
          set_itemsArray(prev => (reload ? newData : [...prev, ...newData]));
          if (newData.length < ListSize) {
            setHasMore(false);
          }
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

  const getFilteredList = useCallback(
    async (types, Ids) => {
      set_MainLoading(true);
      const {userName, userPsd, companyId, companyObj} =
        await loadCredentials();
      const obj = {
        username: userName,
        password: userPsd,
        categoryType: types,
        categoryIds: Ids,
        compIds: companyId,
        company: JSON.parse(companyObj),
      };
      const stichingOutAPIObj =
        await APIServiceCall.getFiltered_StockRecieve(obj);
      set_MainLoading(false);
      if (stichingOutAPIObj?.statusData && stichingOutAPIObj?.responseData) {
        set_itemsArray(stichingOutAPIObj.responseData);
      } else {
        popUpAction(
          Constant.SERVICE_FAIL_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      }
    },
    [loadCredentials, popUpAction],
  );

  const fetchMore = useCallback(
    more => {
      if (more) {
        if (!hasMore || MainLoading || isLoading) return;
        const next = page + 1;
        setpage(next);
        getInitialData(next, false);
      } else {
        getInitialData(0, true);
      }
    },
    [hasMore, MainLoading, isLoading, page, getInitialData],
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

  return (
    <StockIssueListUI
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
      applyFilterFxn={getFilteredList}
      downloadStockIssuePDF={downloadStockIssuePDF}
    />
  );
};

export default StockIssueList;
