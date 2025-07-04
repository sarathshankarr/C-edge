import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useFocusEffect} from '@react-navigation/native';
import NewOutInProcessListUi from './NewOutInProcessListUi';
import axios from 'axios';
import {Buffer} from 'buffer';

import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

const NewOutInProcessList = ({navigation, route, ...props}) => {
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

  useFocusEffect(
    React.useCallback(() => {
      getInitialData(0, true);
    }, []),
  );

  const backBtnAction = () => {
    navigation.navigate('Main');
  };

  const handleNavigation = () => {
    navigation.navigate('VendorOrCustomerMasterEdit');
  };

  const getInitialData = async (page = 0, reload = false) => {
    if (reload) {
      setpage(0);
      setHasMore(true);
    }

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    const fromRecord = reload ? 0 : page * ListSize;
    const toRecord = fromRecord + ListSize - 1;

    set_isLoading(!reload);
    set_MainLoading(reload);

    try {
      let obj = {
        searchKeyValue: '',
        styleSearchDropdown: '-1',
        fromRecord: fromRecord,
        toRecord: toRecord,
        username: userName,
        password: userPsd,
        compIds: usercompanyId,
        company: JSON.parse(companyObj),
        dataFilter: '60Days',
      };

      let DDAListAPIObj = await APIServiceCall.loadAllNewInOutProcessList(obj);

      if (DDAListAPIObj && DDAListAPIObj.statusData) {
        if (DDAListAPIObj && DDAListAPIObj.responseData) {
          set_itemsArray(prevItems =>
            reload
              ? DDAListAPIObj.responseData
              : [...prevItems, ...DDAListAPIObj.responseData],
          );

          if (DDAListAPIObj?.responseData?.length < ListSize - 1) {
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

      if (DDAListAPIObj && DDAListAPIObj.error) {
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
      menuId: 40,
      designId: 24,
      menuId: 728,
      userName: userName,
      userPwd: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      categoryType: types,
      categoryIds: Ids,
      approvedStatus: 1,
    };
    //  console.log("requested filtered body ==> ", obj);

    let stichingOutAPIObj = await APIServiceCall.getFiltered_DDA(obj);
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

  const actionOnRow = (item, index) => {
    navigation.navigate('NewOutInProcessEdit', {item: item});
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

  const sendWhatsApp = async item => {
    set_MainLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');

    let obj = {
      password: userPsd,
      username: userName,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      outprocessId: item.outprocessId,
      userId: userId,
      mobile: '9390236675',
      typeofPdf: 1,
      // mobile: item.mobile,
    };

    // console.log('modal req body ===> ', item);

    // return;
    let stichingOutAPIObj =
      await APIServiceCall.sendWhatsAppOutProNewInProcessComponent(obj);
    set_MainLoading(false);

    if (stichingOutAPIObj && stichingOutAPIObj.statusData) {
      console.log(
        'response from api ==> ',
        stichingOutAPIObj.responseData,
        typeof stichingOutAPIObj.responseData,
      );
      if (stichingOutAPIObj && stichingOutAPIObj.responseData !== 'false') {
        popUpAction(
          'WhatsApp Sent',
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      } else {
        popUpAction(
          'WhatsApp Message not sent,something goes wrong..!!',
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
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

  const handleInDcPdf = async item => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');
    let outprocessdc = JSON.parse(companyObj)?.go_outprocessdc;


    set_MainLoading(true);

    let obj = {
      outprocessId: item.outprocessId,
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      typeofPdf: 2,
      typeofPdfs: 1,
      userId: userId,
      inMenuId: 247,
    };

    let apiUrl;
    if (!outprocessdc) {
      apiUrl = await APIServiceCall.downloadOutProcessNewInProcessInDcFormat1();
    } else {
      apiUrl = await APIServiceCall.downloadOutProcessNewInProcessInDcFormat2();
    }
    console.log("apiUrl =====> ", apiUrl );

    try {
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
          ? `/storage/emulated/0/Download/Outprocess_IN_DC_${item.outprocessId}.pdf`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/Outprocess_IN_DC_${item.outprocessId}.pdf`;

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
  const handleOutDcPdf = async item => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    set_MainLoading(true);

    let obj = {
      outprocessId: item.outprocessId,
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      typeofPdf: 1,
    };

    try {
      let apiUrl = await APIServiceCall.downloadOutProcessNewInProcessOutDc();
      const response = await axios.post(apiUrl, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      });

      // Ensure the data is in binary form
      const base64Data = Buffer.from(response.data, 'binary').toString(
        'base64',
      );

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
          ? `/storage/emulated/0/Download/PO_${
              item.outprocessId
            }_${Date.now()}.zip`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/PO_${
              item.outprocessId
            }_${Date.now()}.zip`;

      await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');

      // Alert.alert('PDF Downloaded', `PDF saved successfully at ${pdfPath}`);
      // popUpAction(`PDF saved successfully at ${pdfPath}`,Constant.DefaultAlert_MSG,'OK', true,false)

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

  return (
    <NewOutInProcessListUi
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
      handleNavigation={handleNavigation}
      sendWhatsApp={sendWhatsApp}
      handleOutDcPdf={handleOutDcPdf}
      handleInDcPdf={handleInDcPdf}
    />
  );
};

export default NewOutInProcessList;
