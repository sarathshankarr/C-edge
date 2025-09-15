import React, {useState} from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import InventoryConsumptionReportUI from './InventoryConsumptionReportUI';

const InventoryConsumptionReport = ({navigation, route, ...props}) => {
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists, set_lists] = useState([]);
  const [rmTypeList, set_rmTypeList] = useState([]);

  React.useEffect(() => {
    getInventoryConsumptionReport();
  }, []);

  const backBtnAction = () => {
    navigation.goBack();
  };

  const getInventoryConsumptionReport = async () => {
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
      languageId: 1,
    };

    let STOREDETAILSAPIObj =
      await APIServiceCall.getInventoryConsumptionReportCreate(obj);
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
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
  const getICReportTrimTypeList = async (id) => {
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
      project: id,
    };

    let STOREDETAILSAPIObj =
      await APIServiceCall.getICReportTrimTypeList(obj);
    set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_rmTypeList(STOREDETAILSAPIObj.responseData);
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

  const submitAction = async tempObj => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      const userPsd = await AsyncStorage.getItem('userPsd');
      const usercompanyId = await AsyncStorage.getItem('companyId');
      const companyObjRaw = await AsyncStorage.getItem('companyObj');
      const companyObj = companyObjRaw ? JSON.parse(companyObjRaw) : {};

      set_isLoading(true);

      const obj = {
        username: userName,
        password: userPsd,
        compIds: usercompanyId,
        company: companyObj,
        startDate: tempObj.startDate,
        endDate: tempObj.endDate,
        fabricId: tempObj.fabricId,
        rawMaterialId: tempObj.rawMaterialId,
        rawMaterialTypeId: tempObj.rawMaterialTypeId,
        styleId: tempObj.styleId,
        itemType: tempObj.itemType,
        location: tempObj.location,
        multiStyle: '',
        multiRm: '',
        procuredOrSupplied:tempObj.procuredOrSupplied, 
        isCombo: tempObj.isCombo ,  
        comboSelectedStyleIds: tempObj.comboSelectedStyleIds, 
        nfsmBhairavFlag: companyObj?.newFlagSetupMasterDAO?.nfsm_bhairav_inv_consum_report_flag_rm || '0',
      };

      let apiUrl = APIServiceCall.downloadInventoryConsumptionReport();

      console.log('API URL:', tempObj.type, apiUrl);
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
          ? `/storage/emulated/0/Download/InventoryConsumptionReport_${Date.now()}.xlsx`
          : `${
              ReactNativeBlobUtil.fs.dirs.DocumentDir
            }/InventoryConsumptionReport_${Date.now()}.xlsx`;

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
      // backBtnAction()
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
    <InventoryConsumptionReportUI
      lists={lists}
      rmTypeList={rmTypeList}
      isLoading={isLoading}
      setLoad={setLoad}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      getICReportTrimTypeList={getICReportTrimTypeList}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      submitAction={submitAction}
    />
  );
};

export default InventoryConsumptionReport;
