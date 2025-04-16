import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import WorkOrderStyleListUI from './WorkOrderStyleListUI';

const WorkOrderStyleList = ({route}) => {
  const navigation = useNavigation();
  const ListSize = 10;

  const [itemsArray, set_itemsArray] = useState();
  const [isLoading, set_isLoading] = useState(false);
  const [MainLoading, set_MainLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [page, setpage] = useState(0);

  const [hasMore, setHasMore] = useState(true);

  React.useEffect(() => {
    getInitialData(0, true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getInitialData(0, true);
    }, [])
  );

  const backBtnAction = () => {
    navigation.goBack();
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

  const getInitialData = async (page = 0, reload = false) => {
    if (reload) {
      setpage(0);
      setHasMore(true);
    }

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(!reload);
    set_MainLoading(reload);

    const fromRecord = reload ? 0 : page * ListSize;
    const toRecord = fromRecord + ListSize - 1;

    console.log('from : ', fromRecord, 'to : ', toRecord);
    try {
      let obj = {
        username: userName,
        password: userPsd,
        menuId: 144,
        fromRecord: fromRecord,
        toRecord: toRecord,
        compIds: usercompanyId,
        company: JSON.parse(companyObj),
        locIds: '0',
        brandIds: '0',
        searchKeyValue: '',
        styleSearchDropdown: '-1',
        dataFilter: '0',
        vendorLogin: 'Admin',
        vendorId: 0,
        dateFilter: 'olderDays',
      };
      let LISTAPIOBJ = await APIServiceCall.LoadAllWorkOrderStylesList(obj);
      set_isLoading(false);

      if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
        if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
          set_itemsArray(prevItems =>
            reload
              ? LISTAPIOBJ.responseData
              : [...prevItems, ...LISTAPIOBJ.responseData],
          );
          if (LISTAPIOBJ?.responseData?.length < ListSize - 1) {
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

      if (LISTAPIOBJ && LISTAPIOBJ.error) {
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
      menuId: 587,
      fromRecord: 0,
      toRecord: 999,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      categoryType: types,
      categoryIds: Ids,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    //  console.log("requested filtered body ==> ", obj)

    let stichingOutAPIObj = await APIServiceCall.getFilteredListFBI(obj);
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
    navigation.navigate('SaveWorkOrderStyle', {item: item});
  };

  const handleNavigation = () => {
    navigation.navigate('SavePartProcessing');
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

  const handlePdf = async (item) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    set_isLoading(true);
  
    let obj = {
        "menuId":144,
        "username": userName,
        "password": userPsd,
        "compIds": usercompanyId,
        "company":JSON.parse(companyObj),
        "styleId":item.wostyleId,
        "woId":item.woId,
        "soId":item.soNumber,
    }
  
    const apiUrl = APIServiceCall.downloadPdfWorkOrderStyle();
  
    try {
        const response = await axios.post(
            apiUrl,
            obj,
            {
                headers: {
                    'Content-Type': 'application/json', 
                },
                responseType: 'arraybuffer', 
            }
        );
  
        console.log("Response for pdf API ==> ",typeof response?.request?._response);
  
        // Ensure the data is in binary form
        let base64Data = response?.request?._response;
  
        if (Platform.OS === 'android') {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                Alert.alert(
                    'Permission Denied',
                    'Storage permission is required to save the PDF.'
                );
                return;
            }
        }
  
        const downloadFolder = Platform.OS === 'android' 
        ? ReactNativeBlobUtil.fs.dirs.DownloadDir 
        : ReactNativeBlobUtil.fs.dirs.DocumentDir; 
              // const pdfPath = `${downloadFolder}/${item.so_style_id}.pdf`;
        // const pdfPath = `/storage/emulated/0/Download/${item.so_style_id}_${Date.now()}.pdf`;
  
        const pdfPath = Platform.OS === 'android' 
      ? `/storage/emulated/0/Download/${item.so_style_id}_${Date.now()}.pdf` 
      : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${item.wostyleId}_${Date.now()}.pdf`;
  
        await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');
  
        // Alert.alert('PDF Downloaded', `PDF saved successfully at ${pdfPath}`);
        // popUpAction(`PDF saved successfully at ${pdfPath}`,Constant.DefaultAlert_MSG,'OK', true,false)
  
        if (Platform.OS === 'android') {
          popUpAction(`PDF saved successfully at ${pdfPath}`, Constant.DefaultAlert_MSG, 'OK', true, false);
      } else {
          popUpAction('PDF saved successfully', Constant.DefaultAlert_MSG, 'OK', true, false);
      }
      
    } catch (error) {
        console.error('Error generating or saving PDF:', error);
        // Alert.alert('Error', `Failed to generate or save PDF: ${error.message}`);
        popUpAction(Constant.SERVICE_FAIL_PDF_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
  
    }finally {
      set_isLoading(false);
    }
  };

  return (
    <WorkOrderStyleListUI
      itemsArray={itemsArray}
      isLoading={isLoading}
      MainLoading={MainLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      actionOnRow={actionOnRow}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      fetchMore={fetchMore}
      handlePdf = {handlePdf}
      applyFilterFxn={getFilteredList}
      handleNavigation={handleNavigation}
    />
  );
};
export default WorkOrderStyleList;
