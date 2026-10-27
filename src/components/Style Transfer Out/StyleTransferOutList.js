import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import StyleTransferOutListUI from './StyleTransferOutListUI';
import useSearchablePagedList from '../../utils/Hooks/useSearchablePagedList';
import {MOBILE_LIST_CONFIG} from '../../utils/constants/mobileListConfig';

const StyleTransferOutList = ({route}) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const isSessionExpired = useRef(false);
  const isFirstFocus = useRef(true);

  const list = useSearchablePagedList(MOBILE_LIST_CONFIG.STYLE_TRANSFER_RECEIVE, {
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

  // Coming back from receive/create: reload page 1, keeping search and filter.
  useFocusEffect(
    React.useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      list.retry();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const backBtnAction = () => {
    navigation.goBack();
  };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = async () => {
    popUpAction(undefined, undefined, '', false, false);
    if (isSessionExpired.current) {
      isSessionExpired.current = false;
      await AsyncStorage.removeItem('userDisplayName');
      await AsyncStorage.removeItem('admin');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userPsd');
      navigation.reset({index: 0, routes: [{name: 'LoginComponent'}]});
    }
  };

  const actionOnRow = (item, index) => {
    navigation.navigate('SaveStyleTransferOut', {item: item});
  };

  const handlePdf = async (item, id) => {
    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      hiddenTransferId: item.styletransferId,
      typeofPdf: id,
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    const apiUrl = APIServiceCall.downloadPdfStyleTransferOut();

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
      const fileType = id === 1 ? 'Indc' : id === 2 ? 'Outdc' : 'Unknown';
      const pdfPath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/${fileType}_${Date.now()}.pdf`
          : `${
              ReactNativeBlobUtil.fs.dirs.DocumentDir
            }/${fileType}_${Date.now()}.pdf`;

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

   const requestStoragePermission = async () => {
      try {
        if (Platform.OS === 'android') {
          if (Platform.Version >= 33) {
            // Android 13 and above
            // Android 13+: saving the app's own files to Downloads needs no permission
            return true;
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
    <StyleTransferOutListUI
      list={list}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      actionOnRow={actionOnRow}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      handlePdf={handlePdf}
    />
  );
};
export default StyleTransferOutList;
