import React, {useState, useEffect, useCallback} from 'react';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import * as Constant from './../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {getEnvironment} from './../../../config/environment/environmentConfig';
import CreateBatchCreationUI from './CreateBatchCreationUI';

// saveFlag: 0 = Save (draft), 1 = Submit (locks the batch in, creates real
// stock via batch_inventory), 2 = Save & Add New. Only ever send 0/1/2 —
// see BatchCreation-Mobile-Integration-Report.md §4.
const LOG = (...args) => console.log('[BatchCreation:Create]', ...args);

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
    navigation.navigate('BatchCreationList', {refresh: Date.now()});
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
    // Trim — a stray trailing space has been observed in stored credentials.
    return {username: (userName || '').trim(), password: (userPsd || '').trim()};
  };

  // Dropdown endpoints have been observed returning the id->label map either
  // flat (`data:{<id>:<name>}`) or nested under a named key (`data:{<key>:
  // {<id>:<name>}}`, matching every other module's `locationsMap`/`fabricMap`
  // convention) — and occasionally double-wrapped in another `data`. Try the
  // named key first, then an inner `data`, then fall back to the object
  // itself, but never fall back to an auth-failure envelope
  // (`{status:"false",message:...}`) — that would otherwise render as two
  // bogus dropdown options ("status"/"message").
  const extractDropdownMap = (responseData, key) => {
    if (!responseData || typeof responseData !== 'object') return {};
    if (responseData[key] && typeof responseData[key] === 'object') {
      return responseData[key];
    }
    if (responseData.data && typeof responseData.data === 'object') {
      return extractDropdownMap(responseData.data, key);
    }
    if (responseData.status === 'false' || responseData.message) {
      console.log(`extractDropdownMap(${key}) — got a failure envelope, not a map:`, responseData);
      return {};
    }
    return responseData;
  };

  const loadLocations = useCallback(async () => {
    const auth = await getAuth();
    LOG('locations — request:', {...auth, password: '***'});
    try {
      const res = await APIServiceCall.batchCreationLocationsApi(auth);
      LOG('locations — statusData:', res?.statusData, 'responseData:', JSON.stringify(res?.responseData));
      if (res?.statusData && res?.responseData) {
        const map = extractDropdownMap(res.responseData, 'locationsMap');
        LOG('locations — resolved map:', JSON.stringify(map));
        set_locationsMap(map);
      } else {
        LOG('locations — no usable response, clearing map');
        set_locationsMap({});
      }
    } catch (error) {
      LOG('locations — error:', error);
      set_locationsMap({});
    }
  }, []);

  const loadFabricProcessFlow = useCallback(async () => {
    const auth = await getAuth();
    LOG('fabricProcessFlow — request:', {...auth, password: '***'});
    try {
      const res = await APIServiceCall.batchCreationFabricProcessFlowApi(auth);
      LOG('fabricProcessFlow — statusData:', res?.statusData, 'responseData:', JSON.stringify(res?.responseData));
      if (res?.statusData && res?.responseData) {
        set_fabricFlowConfigMap(res.responseData.fabricFlowConfigMap || {});
        set_defaultFlowId(res.responseData.defaultFlowId);
      } else {
        LOG('fabricProcessFlow — no usable response');
      }
    } catch (error) {
      LOG('fabricProcessFlow — error:', error);
    }
  }, []);

  const loadFabricsByLocation = useCallback(async locationId => {
    if (!locationId) {
      set_fabricsMap({});
      return;
    }
    const auth = await getAuth();
    LOG('fabricsByLocation — request:', {...auth, password: '***', locationId});
    try {
      const res = await APIServiceCall.batchCreationFabricsByLocationApi({
        ...auth,
        locationId,
      });
      LOG('fabricsByLocation — statusData:', res?.statusData, 'responseData:', JSON.stringify(res?.responseData));
      if (res?.statusData && res?.responseData) {
        const map = extractDropdownMap(res.responseData, 'fabricMap');
        LOG('fabricsByLocation — resolved map:', JSON.stringify(map));
        set_fabricsMap(map);
      } else {
        LOG('fabricsByLocation — no usable response, clearing map');
        set_fabricsMap({});
      }
    } catch (error) {
      LOG('fabricsByLocation — error:', error);
      set_fabricsMap({});
    }
  }, []);

  const loadLotNos = useCallback(async fabricId => {
    if (!fabricId) {
      set_lotNosMap({});
      return;
    }
    const auth = await getAuth();
    LOG('lotNos — request:', {...auth, password: '***', fabricId});
    try {
      const res = await APIServiceCall.batchCreationLotNosApi({
        ...auth,
        fabricId,
      });
      LOG('lotNos — statusData:', res?.statusData, 'responseData:', JSON.stringify(res?.responseData));
      if (res?.statusData && res?.responseData) {
        const map = extractDropdownMap(res.responseData, 'rollsMap');
        LOG('lotNos — resolved map:', JSON.stringify(map));
        set_lotNosMap(map);
      } else {
        LOG('lotNos — no usable response, clearing map');
        set_lotNosMap({});
      }
    } catch (error) {
      LOG('lotNos — error:', error);
      set_lotNosMap({});
    }
  }, []);

  // Fetches GRN/roll details for the selected Lot No, used to auto-populate
  // Quality Name, PO No, Vendor, and Grey Received on the row (matches the
  // web app's behavior). Returns the `grnDetails` object, or null if the
  // roll/fabric/location combo has nothing to return.
  const loadRollDetails = useCallback(async (rollNo, fabricId, locationId) => {
    const auth = await getAuth();
    LOG('rollDetails — request:', {...auth, password: '***', rollNo, fabricId, locationId});
    try {
      const res = await APIServiceCall.batchCreationRollDetailsApi({
        ...auth,
        rollNo,
        fabricId,
        locationId,
      });
      LOG('rollDetails — statusData:', res?.statusData, 'responseData:', JSON.stringify(res?.responseData));
      const grnDetails = res?.statusData && res?.responseData ? res.responseData.grnDetails : null;
      LOG('rollDetails — grnDetails:', JSON.stringify(grnDetails));
      return grnDetails || null;
    } catch (error) {
      LOG('rollDetails — error:', error);
      return null;
    }
  }, []);

  const checkBatchNo = useCallback(async (batch_name, batchId) => {
    const auth = await getAuth();
    LOG('checkBatchNo — request:', {...auth, password: '***', batch_name, batchId: batchId || 0});
    try {
      const res = await APIServiceCall.batchCreationCheckBatchNoApi({
        ...auth,
        batch_name,
        batchId: batchId || 0,
      });
      LOG('checkBatchNo — statusData:', res?.statusData, 'responseData:', JSON.stringify(res?.responseData));
      if (res?.statusData && res?.responseData) {
        return !!res.responseData.exists;
      }
      return false;
    } catch (error) {
      LOG('checkBatchNo — error:', error);
      return false;
    }
  }, []);

  const loadEditData = useCallback(async () => {
    const auth = await getAuth();
    LOG('edit — request:', {...auth, password: '***', batchId: initialBatchId, batchDetailsId: initialBatchDetailsId});
    set_isLoading(true);
    try {
      const res = await APIServiceCall.editBatchCreationApi({
        ...auth,
        batchId: initialBatchId,
        batchDetailsId: initialBatchDetailsId,
      });
      LOG('edit — statusData:', res?.statusData, 'responseData:', JSON.stringify(res?.responseData));
      if (res?.statusData && res?.responseData) {
        const data = res.responseData;
        LOG('edit — viewDTO:', JSON.stringify(data.viewDTO), 'locationsMap:', JSON.stringify(data.locationsMap), 'fabricMap:', JSON.stringify(data.fabricMap), 'fabricFlowConfigMap:', JSON.stringify(data.fabricFlowConfigMap), 'rollsMap:', JSON.stringify(data.rollsMap));
        set_editViewDTO(data.viewDTO || null);
        set_locationsMap(data.locationsMap || {});
        set_fabricsMap(data.fabricMap || {});
        set_fabricFlowConfigMap(data.fabricFlowConfigMap || {});
        set_lotNosMap(data.rollsMap || {});
      } else {
        LOG('edit — no usable response, showing service error');
        showServiceError();
      }
    } catch (error) {
      LOG('edit — error:', error);
      showServiceError();
    } finally {
      set_isLoading(false);
    }
  }, [initialBatchId, initialBatchDetailsId, showServiceError]);

  useEffect(() => {
    LOG('mounted — mode:', mode, 'batchId:', initialBatchId, 'batchDetailsId:', initialBatchDetailsId);
    // View re-uses the exact same `edit` load path (and field mapping) as
    // Edit — it just renders everything disabled, see CreateBatchCreationUI.
    if (mode === 'edit' || mode === 'view') {
      loadEditData();
    } else {
      loadLocations();
      loadFabricProcessFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const submit = useCallback(
    async formPayload => {
      const auth = await getAuth();
      const isEdit = mode === 'edit';
      const apiFn = isEdit
        ? APIServiceCall.updateBatchCreationApi
        : APIServiceCall.createBatchCreationApi;
      const payload = {...auth, ...formPayload};
      if (isEdit) payload.batchId = initialBatchId;

      const endpoint = isEdit ? 'update' : 'create';
      const url = getEnvironment().uri + 'batchCreation/' + endpoint;
      LOG(`${formPayload.saveFlag === 1 ? 'SUBMIT' : 'SAVE'} pressed — calling`, endpoint, 'API');
      LOG('URL:', url);
      LOG('Request payload:', JSON.stringify(payload));
      set_isLoading(true);
      try {
        const res = await apiFn(payload);
        LOG(endpoint, '— statusData:', res?.statusData, 'responseData:', JSON.stringify(res?.responseData));
        const bodyStatus = res?.responseData?.status;
        const isSuccess =
          res?.statusData &&
          res?.responseData &&
          bodyStatus !== 'false' &&
          bodyStatus !== false;
        if (isSuccess) {
          LOG(endpoint, '— success, navigating back to list');
          navigation.navigate('BatchCreationList', {refresh: Date.now()});
          return true;
        }
        LOG(endpoint, '— failed:', res?.responseData?.message);
        popUpAction(
          res?.responseData?.message || Constant.Fail_Save_Dtls_MSG,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
        return false;
      } catch (error) {
        LOG(endpoint, '— error:', error);
        showServiceError();
        return false;
      } finally {
        set_isLoading(false);
      }
    },
    [mode, initialBatchId, navigation, popUpAction, showServiceError],
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
      loadRollDetails={loadRollDetails}
      checkBatchNo={checkBatchNo}
      submit={submit}
    />
  );
};

export default CreateBatchCreation;
