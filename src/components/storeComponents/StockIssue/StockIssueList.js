import React, {useState} from 'react';
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

  React.useEffect(() => {
    getInitialData(0, true);
  }, []);

  const backBtnAction = () => {
    navigation.navigate('Main');
  };

  const actionOnRow = async (item) => {

    const [userName, userPsd, companyObj] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
      AsyncStorage.getItem('companyObj'),
    ]);
  
    set_isLoading(true);
    set_MainLoading(true);
  
    let viewObject = {};  // ← declare OUTSIDE try so navigate can access it
  
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
      } else if (stockissessViewObj?.error) {          // ← fixed variable name
        popUpAction(
          Constant.SERVICE_FAIL_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
        return;  // ← stop here, don't navigate on error
      } else {
        popUpAction(
          Constant.SERVICE_FAIL_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
        return;  // ← stop here, don't navigate on error
      }
  
      navigation.navigate('ViewStockIssue', {viewObject});  
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
      set_isLoading(false);   // ← always runs
      set_MainLoading(false);
    }
  };

  const getInitialData = async (page = 0, reload = false) => {
    if (reload) {
      setpage(0);
      setHasMore(true);
    }
    const [userName, userPsd] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
    ]);

    set_isLoading(!reload);
    set_MainLoading(reload);

    try {
      let obj = {
        searchKeyValue: '',
        styleSearchDropdown: '-1',
        dataFilter: '10',
        start: 0,
        length: 10,
        menuId:750,
        username: userName,
        password: userPsd,
        // compIds: usercompanyId,
        // company: JSON.parse(companyObj),
      };

      let stockissessAPIObj = await APIServiceCall.stockIssuesListApi(obj);
      
      if (stockissessAPIObj && stockissessAPIObj.statusData) {
        if (stockissessAPIObj && stockissessAPIObj.responseData?.aaData) {
          set_itemsArray(prevItems =>
            reload
              ? stockissessAPIObj?.responseData?.aaData
              : [...prevItems, ...stockissessAPIObj?.responseData?.aaData],
          );
          console.log(
            'setting false',
            stockissessAPIObj?.responseData?.aaData?.length,
            ListSize - 1,
          );

          if (stockissessAPIObj?.responseData?.aaData?.length < ListSize - 1) {
            setHasMore(false);
          }
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

      if (stockissessAPIObj && stockissessAPIObj.error) {
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
  };

  const getFilteredList = async (types, Ids) => {
    set_MainLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');

    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      username: userName,
      password: userPsd,
      categoryType: types,
      categoryIds: Ids,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    //  console.log("requested filtered body ==> ", obj);

    let stichingOutAPIObj = await APIServiceCall.getFiltered_StockRecieve(obj);
    set_MainLoading(false);

    if (stichingOutAPIObj && stichingOutAPIObj.statusData) {
      if (stichingOutAPIObj && stichingOutAPIObj.responseData) {
        set_itemsArray(stichingOutAPIObj.responseData);
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

    if (stichingOutAPIObj && stichingOutAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };


  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false);
  };

  const fetchMore = more => {
    console.log('fetch more ==> ', hasMore, isLoading);

    if (more) {
      if (!hasMore || MainLoading || isLoading) return;
      const next = page + 1;
      setpage(next);
      getInitialData(next, false);
    } else {
      getInitialData(0, true);
      // setpage(0);
      // setHasMore(true);
    }
  };

  const downloadStockIssuePDF = async (item) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    const company = JSON.parse(companyObj);

    set_MainLoading(true);

    const obj = {
      username: userName,
      password: userPsd,
      gId: item?.g_id,
      companyDetails: {
        companyLogo: company.company_logo || "",
        companyName: company.company_name || "",
        companyAddress: company.company_addr || "",
        companyPhone: company.company_phone || "",
        companyEmail: company.company_email || "",
      }
    };


    let apiUrl = await APIServiceCall.downloadStockIssuePdf();
   
    console.log('downloadStockIssuePdf obj =====> ', obj);

    try {
      console.log('api url for pdf download ==> ', apiUrl);
      const response = await axios.post(apiUrl, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      });

      console.log(
        'Response for pdf API ==> ',
        typeof response?.request?._response,
      );

      // Ensure the data is in binary form
      let base64Data = response?.request?._response;

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

      const downloadFolder =
        Platform.OS === 'android'
          ? ReactNativeBlobUtil.fs.dirs.DownloadDir
          : ReactNativeBlobUtil.fs.dirs.DocumentDir;

      const pdfPath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/StockIssue_${item?.g_id}.pdf`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/StockIssue_${item?.g_id}.pdf`;

      await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');

      if (Platform.OS === 'android') {
        popUpAction(
          `PDF saved successfully at ${pdfPath}`,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } else {
        popUpAction(
          'PDF saved successfully',
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      }
    } catch (error) {
      console.error('Error generating or saving PDF:', error);
      // Alert.alert('Error', `Failed to generate or save PDF: ${error.message}`);
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
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // Android 13 and above
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
        } else if (Platform.Version >= 30) {
          // Android 11 - 12 (Scoped Storage)
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
        } else {
          // Below Android 11
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
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
