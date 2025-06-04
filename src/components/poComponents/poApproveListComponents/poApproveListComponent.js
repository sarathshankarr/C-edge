import React, {useState, useEffect, useRef} from 'react';
import POApproveUI from './poApproveListUI';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useFocusEffect} from '@react-navigation/native';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import axios from 'axios';
import ReactNativeBlobUtil from 'react-native-blob-util';
import XLSX from 'xlsx';
import {Buffer} from 'buffer';

const POApproveListComponent = ({navigation, route, ...props}) => {
  const ListSize = 10;

  const [itemsArray, set_itemsArray] = useState();
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [modalList, set_modalList] = useState([]);

  const [MainLoading, set_MainLoading] = useState(false);

  const [page, setpage] = useState(0);

  const [hasMore, setHasMore] = useState(true);

  // React.useEffect(() => {
  //   getInitialData();
  //   console.log("props ===>", props )
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getInitialData(0, true);
    }, []),
  );

  const backBtnAction = () => {
    navigation.navigate('Main');
  };

  const getInitialData = async (page = 0, reload = false) => {
    if (reload) {
      setpage(0);
      setHasMore(true);
    }

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let locIds = await AsyncStorage.getItem('CurrentCompanyLocations');
    let brandIds = await AsyncStorage.getItem('brandIds');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    const fromRecord = reload ? 0 : page * ListSize;
    const toRecord = fromRecord + ListSize - 1;

    set_isLoading(!reload);
    set_MainLoading(reload);

    console.log('from : ', fromRecord, 'to : ', toRecord);

    try {
      //   let obj = {
      //     "menuId": '4',
      //     "searchKeyValue": "Not Approved",
      //     "styleSearchDropdown": "Po_status",
      //     "dataFilter": "120Days",
      //     "locIds": locIds ? locIds : 0,
      //     "brandIds":brandIds ? brandIds: 0 ,
      //     "fromRecord": fromRecord,
      //     "toRecord": toRecord,
      //     "userName":userName,
      //     "userPwd": userPsd,
      //     "compIds": usercompanyId,
      //     "company":JSON.parse(companyObj),
      // }

      let obj = {
        menuId: 145,
        searchKeyValue: '',
        styleSearchDropdown: '-1',
        dataFilter: '0',
        locIds: 0,
        brandIds: 0,
        compIds: usercompanyId,
        company: JSON.parse(companyObj),
        fromRecord: fromRecord,
        toRecord: toRecord,
        userName: userName,
        userPwd: userPsd,
      };

      let poEditAPIObj = await APIServiceCall.allPOAPIService(obj);
      set_isLoading(false);

      if (poEditAPIObj && poEditAPIObj.statusData) {
        if (poEditAPIObj && poEditAPIObj.responseData) {
          // set_itemsArray(poEditAPIObj.responseData);
          set_itemsArray(prevItems =>
            reload
              ? poEditAPIObj.responseData
              : [...prevItems, ...poEditAPIObj.responseData],
          );

          if (poEditAPIObj?.responseData?.length < ListSize - 1) {
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

      if (poEditAPIObj && poEditAPIObj.error) {
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
      menuId: 4,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      dataFilter: '0',
      locIds: 0,
      brandIds: 0,
      compIds: 1,
      fromRecord: 0,
      toRecord: 25,
      userName: userName,
      userPwd: userPsd,
      categoryType: types,
      categoryIds: Ids,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    //  console.log("requested filtered body ==> ", obj);

    let stichingOutAPIObj = await APIServiceCall.getFiltered_poApproval(obj);
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

  const getModalList = async item => {
    set_MainLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let obj = {
      ids: item.vendorId,
      userPwd: userPsd,
      userName: userName,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    // console.log('modal req body ===> ', obj);

    let stichingOutAPIObj;
    if (item.approvalStatus === 'Approved') {
      stichingOutAPIObj = await APIServiceCall.getModalListPoComponent(obj);
    } else {
      stichingOutAPIObj =
        await APIServiceCall.getModalListPoComponentNotApproved(obj);
        console.log("calling not approved" ,stichingOutAPIObj)
    }
    set_MainLoading(false);

    if (stichingOutAPIObj && stichingOutAPIObj.statusData) {
      console.log(
        'po modal list calling ==>  ',
        item.poNumber,
        '  <== response from api ==> ',
        stichingOutAPIObj.responseData,
      );
      if (stichingOutAPIObj && stichingOutAPIObj.responseData) {
        set_modalList(stichingOutAPIObj.responseData);
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
    if (item.poSave === 2) {
      navigation.navigate('SavePurchaseOrderDraft', {item: item});
    } else {
      navigation.navigate('POApprovalComponent', {item: item});
    }
  };

  const fetchMore = more => {
    if (more) {
      console.log('fetch more ==> ', hasMore, isLoading);
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

  const sendMail = async (item, po) => {
    set_MainLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let obj = {
      poNumber: po,
      userPwd: userPsd,
      userName: userName,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      mailQtys: item,
    };
    console.log('modal req body ===> ', obj);
    let stichingOutAPIObj = await APIServiceCall.sendMailPoComponent(obj);
    set_MainLoading(false);

    if (stichingOutAPIObj && stichingOutAPIObj.statusData) {
      if (stichingOutAPIObj && stichingOutAPIObj.responseData) {
        popUpAction('Mail Sent', Constant.DefaultAlert_MSG, 'OK', true, false);
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

  const sendWhatsApp = async item => {
    set_MainLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');

    let obj = {
      userPwd: userPsd,
      userName: userName,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      poNumber: item.poNumber,
      userId: userId,
      mobile: item.mobile,
    };
    console.log('modal req body ===> ', obj);
    let stichingOutAPIObj = await APIServiceCall.sendWhatsAppPoComponent(obj);
    set_MainLoading(false);

    if (stichingOutAPIObj && stichingOutAPIObj.statusData) {
      console.log('response from api ==> ', stichingOutAPIObj.responseData);
      if (stichingOutAPIObj && stichingOutAPIObj.responseData) {
        popUpAction(
          'WhatsApp Sent',
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

  const handleExcel = async po => {
    set_MainLoading(true);
    console.log('handleExcel');

    const userName = await AsyncStorage.getItem('userName');
    const userPsd = await AsyncStorage.getItem('userPsd');
    const usercompanyId = await AsyncStorage.getItem('companyId');
    const companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      poNumber: po.poNumber,
      userName: userName,
      userPwd: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    console.log('req body ===> ', obj);
    try {
      let apiUrl;
      if (po.rmFabric === 'FG') {
        apiUrl = await APIServiceCall.downloadPOFGExcel();
      } else {
        apiUrl = await APIServiceCall.downloadPOExcel();
      }

      // console.log('API URL:===>>> ', apiUrl);

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
          ? `/storage/emulated/0/Download/PO_${po.poNumber}_${Date.now()}.xlsx`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/PO_${
              po.poNumber
            }_${Date.now()}.xlsx`;

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
        Constant.SERVICE_FAIL_XL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    } finally {
      set_MainLoading(false);
    }
  };

  const handlePdf = async po => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    set_MainLoading(true);

    let obj = {
      poNumber: po.poNumber,
      userName: userName,
      userPwd: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    let apiUrl;
    if (po.rmFabric === 'FG') {
      apiUrl = await APIServiceCall.downloadPoPdfFg();
    } else if (companyObj.popdf === 4) {
      apiUrl = await APIServiceCall.downloadPoPdfgeneratePdf();
    } else {
      apiUrl = await APIServiceCall.downloadPoPdf1();
    }
    console.log("apiUrl =====> ", apiUrl,obj );

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
          ? `/storage/emulated/0/Download/PO_${po.poNumber}_${Date.now()}.pdf`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/PO_${
              po.poNumber
            }_${Date.now()}.pdf`;

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
    <POApproveUI
      itemsArray={itemsArray}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      actionOnRow={actionOnRow}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      fetchMore={fetchMore}
      MainLoading={MainLoading}
      applyFilterFxn={getFilteredList}
      getModalList={getModalList}
      modalList={modalList}
      sendMail={sendMail}
      sendWhatsApp={sendWhatsApp}
      handlePdf={handlePdf}
      handleExcel={handleExcel}
    />
  );
};

export default POApproveListComponent;
