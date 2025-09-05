import React, {useState} from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StyleBomReportUI from './StyleBomReportUI';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import axios from 'axios';
import XLSX from 'xlsx';
import {Buffer} from 'buffer';
import ReactNativeBlobUtil from 'react-native-blob-util';

const StyleBomReport = ({navigation, route, ...props}) => {
  const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists, set_lists] = useState([]);
  const [stylelist, set_styleList] = useState([]);

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
    // console.log("req body createa====> ", obj)
    let STOREDETAILSAPIObj = await APIServiceCall.GetCreateStyleBomReportList(
      obj,
    );
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      // console.log("response from api ==>", STOREDETAILSAPIObj.responseData)
      set_lists(STOREDETAILSAPIObj.responseData);
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
  const getStyleListFromBuyerPo = async id => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      username: userName,
      password: userPsd,
      soId: id,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    console.log('req body createa====> ', obj);
    let STOREDETAILSAPIObj =
      await APIServiceCall.GetCreateStyleBomReportStyleFBuyerPOList(obj);
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      // console.log("response from api ==>", STOREDETAILSAPIObj.responseData)
      set_styleList(STOREDETAILSAPIObj.responseData);
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

  const submitAction1 = async tempObj => {
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
        multistyle: tempObj.multistyle,
        QtyVal: tempObj.QtyVal,
        soId: tempObj.soId,
      };

      const apiUrl = APIServiceCall.downloadStyleBomReport();

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
      let excelData = XLSX.write(workbook, {bookType: 'xlsx', type: 'base64'});

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
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${Date.now()}}.xlsx`;

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

  const submitActionXl = async tempObj => {
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

        // multistyle: tempObj.multistyle,
        // QtyVal: tempObj.QtyVal,
        // soId: tempObj.soId,

        multistyle: tempObj.multistyle,
        qtys: tempObj.QtyVal,
        soId: tempObj.soId,
      };
      console.log('submitAction obj', obj);

      console.log('req for excel ===> ', obj);
      const apiUrl = APIServiceCall.downloadStyleBomReport();
      console.log('API URL:', apiUrl);

      const response = await axios.post(apiUrl, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
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
          ? `/storage/emulated/0/Download/StyleBomReport_${Date.now()}.xlsx`
          : `${
              ReactNativeBlobUtil.fs.dirs.DocumentDir
            }/StyleBomReport_${Date.now()}.xlsx`;

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
  const submitAction2 = async tempObj => {
    try {
      console.log('submitAction obj', obj);

      console.log('req for excel ===> ', obj);
      const apiUrl = APIServiceCall.downloadStyleBomReport();
      console.log('API URL:', apiUrl);

      const response = await axios.post(apiUrl, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
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
          ? `/storage/emulated/0/Download/StyleBomReport_${Date.now()}.xlsx`
          : `${
              ReactNativeBlobUtil.fs.dirs.DocumentDir
            }/StyleBomReport_${Date.now()}.xlsx`;

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

  const submitAction = async tempObj => {
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

      // multistyle: tempObj.multistyle,
      // QtyVal: tempObj.QtyVal,
      // soId: tempObj.soId,

      multistyle: tempObj.multistyle,
      qtys: tempObj.QtyVal,
      soId: tempObj.soId,
    };

    const apiUrl = APIServiceCall.downloadStyleBomReport();

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
      // const pdfPath = `${downloadFolder}/${item.so_style_id}.pdf`;
      // const pdfPath = `/storage/emulated/0/Download/${item.so_style_id}_${Date.now()}.pdf`;

      const pdfPath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/StyleBomReport_${Date.now()}.pdf`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/StyleBomReport_${Date.now()}.pdf`;


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
      set_isLoading(false);
    }
  };

  const setLoad = val => {
    set_isLoading(val);
  };

  return (
    <StyleBomReportUI
      lists={lists}
      stylelist={stylelist}
      isLoading={isLoading}
      setLoad={setLoad}
      getStyleListFromBuyerPo={getStyleListFromBuyerPo}
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

export default StyleBomReport;
