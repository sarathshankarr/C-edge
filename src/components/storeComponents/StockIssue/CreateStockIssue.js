import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import CreateStockIssueUI from './CreateStockIssueUI';

const CreateStockIssue = ({route}) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists, set_lists] = useState([]);
  const [woList, setWoList] = useState([]);
  const [tableLists, set_tableLists] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const backBtnAction = () => {
    navigation.navigate('StockIssueList');
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

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /** Reads common auth fields from AsyncStorage in one call */
  const getAuthObj = async () => {
    const [userName, userPsd, compIds, companyObj] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
      AsyncStorage.getItem('companyId'),
      AsyncStorage.getItem('companyObj'),
    ]);
    return {
      username: userName,
      password: userPsd,
      compIds,
      company: JSON.parse(companyObj),
    };
  };

  const showServiceError = () =>
    popUpAction(
      Constant.SERVICE_FAIL_MSG,
      Constant.DefaultAlert_MSG,
      'OK',
      true,
      false,
    );

  // ─── API calls ───────────────────────────────────────────────────────────────

  const getData = async () => {
    const auth = await getAuthObj();
    set_isLoading(true);
    const obj = {
      username: auth.username,
      password: auth.password,
      menuId: 750,
      woId: 0,
      woLocId: 0,
      woStyleId: 0,
      company: auth.company
    }
    const res = await APIServiceCall.getStockIssueCreateData(obj);
    set_isLoading(false);

    if (res?.statusData && res?.responseData) {
      set_lists(res.responseData);
    } else {
      showServiceError();
    }
  };


  const getBarcodeDetails = async (postData) => {
    

    try {
      let username = await AsyncStorage.getItem('userName');
    let password = await AsyncStorage.getItem('userPsd');
    postData.username = username;
    postData.password = password;
    set_isLoading(true);
    const res = await APIServiceCall.getfabricRollbasedOnBarcode(postData);
    set_isLoading(false);
      if (res?.statusData && res?.responseData) {
        const barcodeDetails = res.responseData || {}
        return barcodeDetails;
      } else {
        showServiceError();
        return {};
      }
    } catch (error) {
      console.log('getBarcodeDetails error ==>', error);
      showServiceError();
      return [];
    } finally {
      set_isLoading(false);
    }
  };

  const getDuplicateInvoiceStatus = async tempObj => {
    const auth = await getAuthObj();
    set_isLoading(true);
    const res = await APIServiceCall.getDuplicateInvoiceStatusBGB({
      ...auth,
      companyInvoice: tempObj.prefix,
      postInvoice: tempObj.suffix,
      invoiceNo: tempObj.invoiceNo,
      itemId: 0,
    });
    set_isLoading(false);

    if (res?.error) {
      showServiceError();
      return 'error';
    }
    if (res?.statusData && res?.responseData) {
      return res.responseData;
    }
    showServiceError();
    return 'error';
  };

  const submitAction = async saveObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');
    saveObj.username = userName;
    saveObj.password = userPsd;
    saveObj.userId = Number(userId);
    set_isLoading(true);
    console.log('submitAction saveObj ==>', saveObj);
    const res = await APIServiceCall.saveStockIssue(saveObj);
    set_isLoading(false);

    if (res?.statusData && res?.responseData !== 0) {
      navigation.navigate('StockIssueList', {refresh: Date.now()});
    } else {
      popUpAction(
        Constant.Fail_Save_Dtls_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  /**
   * Fetches work orders for the given locationId.
   * Returns the list so the UI can use it directly.
   */
  const getTrimValuesByWo = async (wo, locationId) => {
    // Guard before parsing
    const [userName, userPsd, companyObj] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
      AsyncStorage.getItem('companyObj'),
    ]);
  
    if (!companyObj) {
      console.log('companyObj is null');
      return [];
    }
  
    // Guard wo before splitting
    if (!wo) {
      console.log('wo is null or undefined');
      return [];
    }
  
    const parts = wo.toString().split('_');
    const styleId = parts[0]?.trim();
    const woId = parts[1]?.trim();
  
    // Guard parsed values
    if (!styleId || !woId) {
      console.log('Could not parse styleId/woId from wo ==>', wo);
      return [];
    }
  
    set_isLoading(true);
  
    try {
      const obj = {
        username: userName,
        password: userPsd,
        styleId,
        woId,
        locId: locationId,
        flag: 1,
        transferTypeId: 1,
        menuId: 750,
        sono: 0,
        trimid: 0,
        bpId: 0,
        dmgedqty: 0,
        woIds: '',
        company: JSON.parse(companyObj),  // safe now — guarded above
      };
  
      console.log('getTrimValuesByWo req ==>', obj);
  
      const res = await APIServiceCall.getTrimValuesApi(obj);
  
      if (res?.statusData && res?.responseData) {
        const list = res.responseData?.data ?? [];
        return list;
      } else {
        showServiceError();
        return [];
      }
    } catch (error) {
      console.log('getTrimValuesByWo error ==>', error);
      showServiceError();
      return [];
    } finally {
      set_isLoading(false);
    }
  };


  const getWosByLocApi = async locationId => {
    const [userName, userPsd] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
    ]);

    set_isLoading(true);
    try {
      const res = await APIServiceCall.getWosByLocApi({
        username: userName,
        password: userPsd,
        locId: locationId,
        flag: 1,
        newm: 0,
      });
      set_isLoading(false);

      if (res?.statusData && res?.responseData) {
        const list = res.responseData?.woList ?? [];
        setWoList(list);
        return list;          // ← return so UI can consume immediately
      } else {
        showServiceError();
        return [];
      }
    } catch (error) {
      console.log('getWosByLocApi error:', error);
      set_isLoading(false);
      showServiceError();
      return [];
    }
  };
  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <CreateStockIssueUI
      isLoading={isLoading}
      popUpAction={popUpAction}
      set_isLoading={set_isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      lists={lists}
      tableLists={tableLists}
      submitAction={submitAction}
      getData={getData}
      // validateBarCode={validateBarCode}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      onLocationChanges={getWosByLocApi}
      getTrimValuesByWo={getTrimValuesByWo}
      getBarcodeDetails={getBarcodeDetails}
      getDuplicateInvoiceStatus={getDuplicateInvoiceStatus}
    />
  );
};

export default CreateStockIssue;