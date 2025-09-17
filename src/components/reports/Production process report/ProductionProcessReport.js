import React, {useState} from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductionProcessReportUI from './ProductionProcessReportUI';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import XLSX from 'xlsx';
import {Buffer} from 'buffer';

const ProductionProcessReport = ({navigation, route, ...props}) => {
  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [ctrFlag, set_ctrFlag] = useState('0');
  const [lists, set_lists] = useState({
    productionlist: [],
    brandsMap: [],
    companyLocationsMap: [],
    productionlist1: [],
  });

  React.useEffect(() => {
    getInitialData();
  }, []);

  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    let STOREDETAILSAPIObj = await APIServiceCall.LoadProductionProcessReport(
      obj,
    );
    console.log('datat ==> ', STOREDETAILSAPIObj.responseData);
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      if (STOREDETAILSAPIObj?.responseData?.brandsMap) {
        const brandsMapList = Object.keys(
          STOREDETAILSAPIObj.responseData.brandsMap,
        ).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.brandsMap[key],
        }));
        set_lists(prevLists => ({
          ...prevLists,
          brandsMap: brandsMapList,
        }));
      }
      if (STOREDETAILSAPIObj?.responseData?.companyLocationsMap) {
        const companyLocationsMapList = Object.keys(
          STOREDETAILSAPIObj.responseData.companyLocationsMap,
        ).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.companyLocationsMap[key],
        }));
        set_lists(prevLists => ({
          ...prevLists,
          companyLocationsMap: companyLocationsMapList,
        }));
      }
      if (STOREDETAILSAPIObj?.responseData?.productionlist) {
        const productionlistList = Object.keys(
          STOREDETAILSAPIObj.responseData.productionlist,
        ).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.productionlist[key],
        }));
        set_lists(prevLists => ({
          ...prevLists,
          productionlist: productionlistList,
        }));
      }
      if (STOREDETAILSAPIObj?.responseData?.productionlist1) {
        const productionlist1 = Object.keys(
          STOREDETAILSAPIObj.responseData.productionlist1,
        ).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.productionlist1[key],
        }));
        set_lists(prevLists => ({
          ...prevLists,
          productionlist1: productionlist1,
        }));
      }

      if (STOREDETAILSAPIObj?.responseData?.ctrFlag) {
        set_ctrFlag(STOREDETAILSAPIObj?.responseData?.ctrFlag || '0');
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

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  const actionOnRow = (item, index) => {
    console.log('Clicked on the row');
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

  const submitAction = async tempObj => {
    try {
      let userName = await AsyncStorage.getItem('userName');
      let userPsd = await AsyncStorage.getItem('userPsd');
      let usercompanyId = await AsyncStorage.getItem('companyId');
      let companyObj = await AsyncStorage.getItem('companyObj');
      set_isLoading(true);

      let obj = {
        username: userName,
        password: userPsd,
        compIds: usercompanyId,
        company: JSON.parse(companyObj),
        startDate: tempObj.startDate,
        endDate: tempObj.startDate,
        brandId: tempObj.brandId || '0',
        menuId: tempObj.menuId || '0',
        batchId: tempObj.batchId,
        location: tempObj.location || '0',
      };

      let apiUrl;
      if (tempObj.menuId=='9' && ctrFlag == '2') {
        apiUrl = APIServiceCall.downloadProductionProcessReportCtr2();
      } else if (tempObj.menuId=='9' && ctrFlag == '3') {
        apiUrl = APIServiceCall.downloadProductionProcessReportCtr3();
      } else {
        apiUrl = APIServiceCall.downloadProductionProcessReportCtrOff();
      }

      console.log('API URL:  ==> ',tempObj.menuId, ctrFlag, "url   ",  apiUrl, obj);

      const response = await axios.post(apiUrl, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // Get binary Excel file
      });

      console.log('Binary Excel file received, converting to base64...');

      // Convert binary response to base64
      const base64Excel = Buffer.from(response.data).toString('base64');

      // Android storage permission
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Alert.alert(
            'Permission Denied',
            'Storage permission is required to save the XLSX file.',
          );
          return;
        }
      }

      // File path
      const filePath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/ProductionProcessReport_${Date.now()}.xlsx`
          : `${
              ReactNativeBlobUtil.fs.dirs.DocumentDir
            }/ProductionProcessReport_${Date.now()}.xlsx`;

      // Save base64 file
      await ReactNativeBlobUtil.fs.writeFile(filePath, base64Excel, 'base64');

      // Success
      popUpAction(
        `Excel file saved successfully at ${filePath}`,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    } catch (error) {
      console.error('Error generating or saving Excel file:', error);
      popUpAction(
        Constant.SERVICE_FAIL_PDF_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    } finally {
      set_isLoading(false);
    }
  };

  const setLoad = val => {
    set_isLoading(val);
  };

  return (
    <ProductionProcessReportUI
      lists={lists}
      isLoading={isLoading}
      setLoad={setLoad}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      actionOnRow={actionOnRow}
      popOkBtnAction={popOkBtnAction}
      submitAction={submitAction}
    />
  );
};

export default ProductionProcessReport;
