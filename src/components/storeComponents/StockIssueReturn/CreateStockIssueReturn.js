import React, {useState} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import CreateStockIssueReturnUI from './CreateStockIssueReturnUI';

const CreateStockIssueReturn = ({route}) => {
  const navigation = useNavigation();

  
  // mode: 'create' (default) | 'edit' | 'approve' | 'view' — set by the list
  // screen based on sird_saveType (0=Approve, 1=Edit, >=2=View).
  const mode = route?.params?.mode || 'create';
  const viewObject = route?.params?.viewObject || null;

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  const backBtnAction = () => {
    navigation.navigate('StockIssueReturnList');
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

  const getAuth = async () => {
    const [userName, userPsd] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
    ]);
    return {username: userName, password: userPsd};
  };


  const showServiceError = () =>
    popUpAction(
      Constant.SERVICE_FAIL_MSG,
      Constant.DefaultAlert_MSG,
      'OK',
      true,
      false,
    );

  // fabricTypes: 1 = RM, 2 = Fabric — fetched on demand once the user picks a type.
  // `silent` skips the internal loader toggle so a caller can wrap several of
  // these calls under a single loader instead of flickering it per-call.
  const getFabricRmsByType = async (fabricTypes, silent = false) => {
    const auth = await getAuth();
    if (!silent) set_isLoading(true);
    try {
      const res = await APIServiceCall.getFabricRmsForStockIssueReturn({
        ...auth,
        fabricTypes,
      });
      if (res?.statusData && res?.responseData) {
        return res.responseData;
      }
      showServiceError();
      return [];
    } catch (error) {
      console.log('getFabricRmsByType error ==>', error);
      showServiceError();
      return [];
    } finally {
      if (!silent) set_isLoading(false);
    }
  };

  const getBarcodeDetails = async (barcode, silent = false) => {
    const auth = await getAuth();
    console.log(
      '[StockIssueReturn] container.getBarcodeDetails called. barcode =',
      barcode,
      'username present =',
      !!auth.username,
      'password present =',
      !!auth.password,
    );
    if (!silent) set_isLoading(true);
    try {
      const res = await APIServiceCall.getBarcodeDetailsForStockIssueReturn({
        ...auth,
        barcode,
      });
      console.log('[StockIssueReturn] getBarcodeDetailsForStockIssueReturn raw result =', JSON.stringify(res));
      if (res?.statusData && res?.responseData) {
        return res.responseData;
      }
      showServiceError();
      return null;
    } catch (error) {
      console.log('getBarcodeDetails error ==>', error);
      showServiceError();
      return null;
    } finally {
      if (!silent) set_isLoading(false);
    }
  };

  const getStockIds = async (fabricId, silent = false) => {
    const auth = await getAuth();
    if (!silent) set_isLoading(true);
    try {
      const res = await APIServiceCall.getStockIdsForStockIssueReturn({
        ...auth,
        fabricId,
      });
      if (res?.statusData && res?.responseData) {
        return res.responseData;
      }
      showServiceError();
      return [];
    } catch (error) {
      console.log('getStockIds error ==>', error);
      showServiceError();
      return [];
    } finally {
      if (!silent) set_isLoading(false);
    }
  };

  const getStockApproveQty = async (stockId, rmFabricId, silent = false) => {
    const auth = await getAuth();
    if (!silent) set_isLoading(true);
    try {
      const res = await APIServiceCall.getStockApproveQtyForStockIssueReturn({
        ...auth,
        stockId,
        rmFabricId,
      });
      if (res?.statusData && res?.responseData !== undefined) {
        return res.responseData;
      }
      showServiceError();
      return null;
    } catch (error) {
      console.log('getStockApproveQty error ==>', error);
      showServiceError();
      return null;
    } finally {
      if (!silent) set_isLoading(false);
    }
  };

  const getFabricRolls = async (params, silent = false) => {
    const auth = await getAuth();
    if (!silent) set_isLoading(true);
    try {
      const res = await APIServiceCall.getFabricRollsForStockIssueReturn({
        ...auth,
        rollIds: '0',
        buyerRollIds: '0',
        str: '',
        returnRoll: '',
        ...params,
      });
      if (res?.statusData && res?.responseData) {
        return res.responseData;
      }
      showServiceError();
      return [];
    } catch (error) {
      console.log('getFabricRolls error ==>', error);
      showServiceError();
      return [];
    } finally {
      if (!silent) set_isLoading(false);
    }
  };

  // Validates the entered return qty against qty already returned for this stock/fabric/roll.
  const getAlreadyReturnQty = async (stockId, rmFabricId, rollId) => {
    const auth = await getAuth();
    try {
      const res = await APIServiceCall.getAlreadyReturnQtyForStockIssueReturn({
        ...auth,
        stockId,
        rmFabricId,
        rollId,
      });
      if (res?.statusData && res?.responseData !== undefined) {
        return res.responseData;
      }
      return 0;
    } catch (error) {
      console.log('getAlreadyReturnQty error ==>', error);
      return 0;
    }
  };

  // Shared success/failure handling for save/editSave/approve — the server
  // can return HTTP 200/500 either way, so the real signal is the response
  // body's own `status` field, not just "did we get JSON back".
  const submitToEndpoint = async (label, apiFn, payload) => {
    const auth = await getAuth();
    const fullPayload = {...auth, ...payload};
    console.log(`[StockIssueReturn][${label}] posting. payload =`, JSON.stringify(fullPayload));
    set_isLoading(true);
    try {
      const res = await apiFn(fullPayload);
      console.log(`[StockIssueReturn][${label}] raw result =`, JSON.stringify(res));
      const bodyStatus = res?.responseData?.status;
      const isSuccess =
        res?.statusData && res?.responseData && bodyStatus !== 'false' && bodyStatus !== false;
      if (isSuccess) {
        console.log(`[StockIssueReturn][${label}] treated as SUCCESS — navigating back to list.`);
        navigation.navigate('StockIssueReturnList', {refresh: Date.now()});
      } else {
        console.log(`[StockIssueReturn][${label}] treated as FAILURE.`);
        popUpAction(
          res?.responseData?.message || Constant.Fail_Save_Dtls_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
      }
    } finally {
      set_isLoading(false);
    }
  };

  const submitAction = saveObj =>
    submitToEndpoint('submitAction', APIServiceCall.saveStockIssueReturn, saveObj);

  const editSaveAction = saveObj =>
    submitToEndpoint('editSaveAction', APIServiceCall.editSaveStockIssueReturn, saveObj);

  const approveAction = approveObj =>
    submitToEndpoint('approveAction', APIServiceCall.approveStockIssueReturn, approveObj);

  return (
    <CreateStockIssueReturnUI
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      mode={mode}
      viewObject={viewObject}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      submitAction={submitAction}
      editSaveAction={editSaveAction}
      approveAction={approveAction}
      setLoading={set_isLoading}
      getBarcodeDetails={getBarcodeDetails}
      getFabricRmsByType={getFabricRmsByType}
      getStockIds={getStockIds}
      getStockApproveQty={getStockApproveQty}
      getFabricRolls={getFabricRolls}
      getAlreadyReturnQty={getAlreadyReturnQty}
    />
  );
};

export default CreateStockIssueReturn;
