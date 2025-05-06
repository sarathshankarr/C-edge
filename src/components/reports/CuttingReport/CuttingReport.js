import React, {useState} from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CuttingReportUI from './CuttingReportUI';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {writeXLSX} from 'xlsx';
import axios from 'axios';
import ReactNativeBlobUtil from 'react-native-blob-util';
import XLSX from 'xlsx';


const CuttingReport = ({navigation, route, ...props}) => {
  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {
    getinitialData();
  }, []);

  const backBtnAction = () => {
    navigation.goBack();
  };

  const getinitialData = async () => {
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
    // console.log('req body ====> ', obj);

    let STOREDETAILSAPIObj = await APIServiceCall.loadCuttingReportStylesList(
      obj,
    );
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_itemsObj(STOREDETAILSAPIObj.responseData);
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

  const submitAction1 = async ids => {
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
        styleIds: ids,
      };

      const apiUrl = APIServiceCall.downloadCuttingReport();
      console.log('API URL:', apiUrl);

      const response = await axios.post(apiUrl, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      });

      console.log('Response received, processing file...');

      // Convert the received binary data into a readable format
      let workbook = XLSX.read(response.data, {type: 'array'});
      let excelData = writeXLSX(workbook, {bookType: 'xlsx', type: 'base64'});

      // Request storage permission on Android
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

      // Define the file path for saving the Excel file
      const filePath1 = `/storage/emulated/0/Download/${Date.now()}.xlsx`;

      const filePath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/${Date.now()}.xlsx`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${Date.now()}.xlsx`;

      // Save the file using ReactNativeBlobUtil
      await ReactNativeBlobUtil.fs.writeFile(filePath, excelData, 'base64');

      // Show success message
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

  const submitAction = async (ids) => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      const userPsd = await AsyncStorage.getItem('userPsd');
      const usercompanyId = await AsyncStorage.getItem('companyId');
      const companyObj = await AsyncStorage.getItem('companyObj');
      set_isLoading(true);
  
      const obj = {
        username: userName,
        password: userPsd,
        compIds: usercompanyId,
        company: JSON.parse(companyObj),
        styleIds: ids,
      };

      console.log("style ids ===> ", ids)
  
      const apiUrl = APIServiceCall.downloadCuttingReport();
      console.log('API URL:', apiUrl);
  
      const response = await axios.post(apiUrl, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'text',
      });
  
      console.log('Response received, processing base64 Excel...');
  
      // Parse base64 Excel data
      const workbook = XLSX.read(response.data, { type: 'base64' });
      const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
  
      // Request storage permission on Android
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Alert.alert(
            'Permission Denied',
            'Storage permission is required to save the XLSX file.'
          );
          return;
        }
      }
  
      // Define the file path for saving the Excel file
      const filePath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/${Date.now()}.xlsx`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${Date.now()}.xlsx`;
  
      // Save the file using ReactNativeBlobUtil
      await ReactNativeBlobUtil.fs.writeFile(filePath, excelData, 'base64');
  
      // Show success message
      popUpAction(
        `Excel file saved successfully at ${filePath}`,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false
      );
    } catch (error) {
      console.error('Error generating or saving Excel file:', error);
      popUpAction(
        Constant.SERVICE_FAIL_PDF_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false
      );
    } finally {
      set_isLoading(false);
    }
  };

  const setLoad = val => {
    set_isLoading(val);
  };

  return (
    <CuttingReportUI
      itemsObj={itemsObj}
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

export default CuttingReport;
