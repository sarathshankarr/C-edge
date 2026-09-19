import React, {useState, useEffect, useCallback} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import CreateBatchCreationUI from './CreateBatchCreationUI';

// saveFlag: 0 = Save (draft), 1 = Submit (locks the batch in, creates real
// stock via batch_inventory), 2 = Save & Add New. Only ever send 0/1/2 —
// see BatchCreation-Mobile-Integration-Report.md §4.
const CreateBatchCreation = ({route}) => {
  const navigation = useNavigation();

  const mode = route?.params?.mode || 'create';
  const initialBatchId = route?.params?.batchId;
  const initialBatchDetailsId = route?.params?.batchDetailsId;

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  const [locationsMap, set_locationsMap] = useState({});
  const [fabricFlowConfigMap, set_fabricFlowConfigMap] = useState({});
  const [defaultFlowId, set_defaultFlowId] = useState(undefined);
  const [fabricsMap, set_fabricsMap] = useState({});
  const [lotNosMap, set_lotNosMap] = useState({});
  const [editViewDTO, set_editViewDTO] = useState(null);

  const backBtnAction = useCallback(() => {
    navigation.navigate('BatchCreationList');
  }, [navigation]);

  const popUpAction = useCallback(
    (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
      set_popUpMessage(popMsg);
      set_popUpAlert(popAlert);
      set_popUpRBtnTitle(rBtnTitle);
      set_isPopupLeft(isPopLeft);
      set_isPopUp(isPopup);
    },
    [],
  );

  const popOkBtnAction = useCallback(() => {
    popUpAction(undefined, undefined, '', false, false);
  }, [popUpAction]);

  const showServiceError = useCallback(
    () =>
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      ),
    [popUpAction],
  );

  const getAuth = async () => {
    const [userName, userPsd] = await Promise.all([
      AsyncStorage.getItem('userName'),
      AsyncStorage.getItem('userPsd'),
    ]);
    return {username: userName, password: userPsd};
  };

  const loadLocations = useCallback(async () => {
    const auth = await getAuth();
    try {
      const res = await APIServiceCall.batchCreationLocationsApi(auth);
      if (res?.statusData && res?.responseData) {
        set_locationsMap(res.responseData);
      }
    } catch (error) {
      console.log('loadLocations error ==>', error);
    }
  }, []);

  const loadFabricProcessFlow = useCallback(async () => {
    const auth = await getAuth();
    try {
      const res = await APIServiceCall.batchCreationFabricProcessFlowApi(auth);
      if (res?.statusData && res?.responseData) {
        set_fabricFlowConfigMap(res.responseData.fabricFlowConfigMap || {});
        set_defaultFlowId(res.responseData.defaultFlowId);
      }
    } catch (error) {
      console.log('loadFabricProcessFlow error ==>', error);
    }
  }, []);

  const loadFabricsByLocation = useCallback(async locationId => {
    if (!locationId) {
      set_fabricsMap({});
      return;
    }
    const auth = await getAuth();
    try {
      const res = await APIServiceCall.batchCreationFabricsByLocationApi({
        ...auth,
        locationId,
      });
      if (res?.statusData && res?.responseData) {
        set_fabricsMap(res.responseData);
      } else {
        set_fabricsMap({});
      }
    } catch (error) {
      console.log('loadFabricsByLocation error ==>', error);
      set_fabricsMap({});
    }
  }, []);

  const loadLotNos = useCallback(async fabricId => {
    if (!fabricId) {
      set_lotNosMap({});
      return;
    }
    const auth = await getAuth();
    try {
      const res = await APIServiceCall.batchCreationLotNosApi({
        ...auth,
        fabricId,
      });
      if (res?.statusData && res?.responseData) {
        set_lotNosMap(res.responseData);
      } else {
        set_lotNosMap({});
      }
    } catch (error) {
      console.log('loadLotNos error ==>', error);
      set_lotNosMap({});
    }
  }, []);

  const checkBatchNo = useCallback(async (batch_name, batchId) => {
    const auth = await getAuth();
    try {
      const res = await APIServiceCall.batchCreationCheckBatchNoApi({
        ...auth,
        batch_name,
        batchId: batchId || 0,
      });
      if (res?.statusData && res?.responseData) {
        return !!res.responseData.exists;
      }
      return false;
    } catch (error) {
      console.log('checkBatchNo error ==>', error);
      return false;
    }
  }, []);

  const loadEditData = useCallback(async () => {
    const auth = await getAuth();
    set_isLoading(true);
    try {
      const res = await APIServiceCall.editBatchCreationApi({
        ...auth,
        batchId: initialBatchId,
        batchDetailsId: initialBatchDetailsId,
      });
      if (res?.statusData && res?.responseData) {
        const data = res.responseData;
        set_editViewDTO(data.viewDTO || null);
        set_locationsMap(data.locationsMap || {});
        set_fabricsMap(data.fabricMap || {});
        set_fabricFlowConfigMap(data.fabricFlowConfigMap || {});
        set_lotNosMap(data.rollsMap || {});
      } else {
        showServiceError();
      }
    } catch (error) {
      console.log('loadEditData error ==>', error);
      showServiceError();
    } finally {
      set_isLoading(false);
    }
  }, [initialBatchId, initialBatchDetailsId, showServiceError]);

  useEffect(() => {
    if (mode === 'edit') {
      loadEditData();
    } else {
      loadLocations();
      loadFabricProcessFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const resetForNewEntry = useCallback(() => {
    set_fabricsMap({});
    set_lotNosMap({});
    loadLocations();
    loadFabricProcessFlow();
  }, [loadLocations, loadFabricProcessFlow]);

  const submit = useCallback(
    async formPayload => {
      const auth = await getAuth();
      const isEdit = mode === 'edit';
      const apiFn = isEdit
        ? APIServiceCall.updateBatchCreationApi
        : APIServiceCall.createBatchCreationApi;
      const payload = {...auth, ...formPayload};
      if (isEdit) payload.batchId = initialBatchId;

      set_isLoading(true);
      try {
        const res = await apiFn(payload);
        const bodyStatus = res?.responseData?.status;
        const isSuccess =
          res?.statusData &&
          res?.responseData &&
          bodyStatus !== 'false' &&
          bodyStatus !== false;
        if (isSuccess) {
          if (Number(formPayload.saveFlag) === 2) {
            popUpAction(
              res?.responseData?.message || 'Batch saved. Add the next one.',
              Constant.SuccessAlert_MSG,
              'OK',
              true,
              false,
            );
            resetForNewEntry();
            return true;
          }
          navigation.navigate('BatchCreationList', {refresh: Date.now()});
          return true;
        }
        popUpAction(
          res?.responseData?.message || Constant.Fail_Save_Dtls_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
        return false;
      } catch (error) {
        console.log('submit error ==>', error);
        showServiceError();
        return false;
      } finally {
        set_isLoading(false);
      }
    },
    [mode, initialBatchId, navigation, popUpAction, resetForNewEntry, showServiceError],
  );

  return (
    <CreateBatchCreationUI
      mode={mode}
      isLoading={isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      locationsMap={locationsMap}
      fabricFlowConfigMap={fabricFlowConfigMap}
      defaultFlowId={defaultFlowId}
      fabricsMap={fabricsMap}
      lotNosMap={lotNosMap}
      editViewDTO={editViewDTO}
      loadFabricsByLocation={loadFabricsByLocation}
      loadLotNos={loadLotNos}
      checkBatchNo={checkBatchNo}
      submit={submit}
    />
  );
};

export default CreateBatchCreation;
