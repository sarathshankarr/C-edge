import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import FabricProcessInListUI from './FabricProcessInListUI';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';

const FabricProcessInList = ({route}) => {
  const navigation = useNavigation();

  const [itemsArray, set_itemsArray] = useState();
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {
    getInitialData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getInitialData();
    }, []),
  );

  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInitialData = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    set_isLoading(true);
    let obj = {
      username: userName,
      password: userPsd,
      menuId: 587,
      fromRecord: 0,
      toRecord: 999,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
    };
    let LISTAPIOBJ = await APIServiceCall.loadAllFabricProcessInList(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        set_itemsArray(LISTAPIOBJ.responseData);
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

  const handlePdf = async item => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    set_isLoading(true);

    let obj = {
      menuId: 587,
      so_style_id: item.so_style_id,
      username: userName,
      password: userPsd,
    };

    const apiUrl = APIServiceCall.downloadPdf();

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
          : '';
      // const pdfPath = `${downloadFolder}/${item.so_style_id}.pdf`;
      const pdfPath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/${item.so_style_id}_${Date.now()}.pdf`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${item.so_style_id}_${Date.now()}.pdf`;

      await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');

      // Alert.alert('PDF Downloaded', `PDF saved successfully at ${pdfPath}`);
      popUpAction(
        `PDF saved successfully at ${pdfPath}`,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
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

  const handleScan = async item => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    set_isLoading(true);

    let obj = {
      menuId: 587,
      so_style_id: item.so_style_id,
      username: userName,
      password: userPsd,
    };

    const apiUrl = APIServiceCall.downloadQrPdf();

    try {
      const response = await axios.post(apiUrl, obj, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      });

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


      const pdfPath =
      Platform.OS === 'android'
        ? `/storage/emulated/0/Download/${item.so_style_id}_${Date.now()}.pdf`
        : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${item.so_style_id}_${Date.now()}.pdf`;

      await ReactNativeBlobUtil.fs.writeFile(pdfPath, base64Data, 'base64');

      Alert.alert('QR Scan Downloaded', `PDF saved successfully at ${pdfPath}`);
    } catch (error) {
      console.error('Error generating or saving PDF:', error);
      Alert.alert('Error', `Failed to generate or save PDF: ${error.message}`);
    } finally {
      set_isLoading(false);
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
    // console.log("selected item ===>  ", item)
    navigation.navigate('SaveFabricProcessIn', {id: item?.so_style_id});
  };
  const actionOnCreate = () => {
    navigation.navigate('CreateInProcess');
  };

  return (
    <FabricProcessInListUI
      itemsArray={itemsArray}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      actionOnRow={actionOnRow}
      handlePdf={handlePdf}
      handleScan={handleScan}
      actionOnCreate={actionOnCreate}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
    />
  );
};

export default FabricProcessInList;
