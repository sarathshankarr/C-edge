import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';
import CreatePurchaseOrderDraftUI from './CreatePurchaseOrderDraftUI';

const CreatePurchaseOrderDraft = ({route}) => {
  const navigation = useNavigation();

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists, set_lists] = useState({
    vendorsMap: [],
    ShipTo: [],
    ShipLocation: [],
  });
  const [modalLists, set_modalLists] = useState({
    StyleFg: [],
    styleTrimfab: [],
    styleRm: [],
    styleFab: [],
    batch: [],
    styleMap: [],
  });

  useEffect(() => {
    getInitialData();
  }, []);

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

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false);
  };

  const getInitialData = async tempObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      userName: userName,
      userPwd: userPsd,
      menuId: '145',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      locIds: '0',
      brandIds: '0',
    };

    let LISTAPIOBJ = await APIServiceCall.getPurchaseOrderDraftDetails(obj);
    set_isLoading(false);
    console.log('create po  req body ====>  ', obj);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        if (LISTAPIOBJ?.responseData?.vendorsMap) {
          const vendorsMapList = Object.keys(
            LISTAPIOBJ.responseData.vendorsMap,
          ).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.vendorsMap[key],
          }));
          set_lists(prevLists => ({
            ...prevLists,
            vendorsMap: vendorsMapList,
          }));
        }
        if (LISTAPIOBJ?.responseData?.locationsMap1) {
          const locationsMap1List = Object.keys(
            LISTAPIOBJ.responseData.locationsMap1,
          ).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.locationsMap1[key],
          }));
          set_lists(prevLists => ({
            ...prevLists,
            ShipLocation: locationsMap1List,
          }));
        }
        if (LISTAPIOBJ?.responseData?.locationsMap) {
          const locationsMapList = Object.keys(
            LISTAPIOBJ.responseData.locationsMap,
          ).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.locationsMap[key],
          }));
          set_lists(prevLists => ({
            ...prevLists,
            ShipTo: locationsMapList,
          }));
        }
        if (LISTAPIOBJ?.responseData?.batch) {
          const batchList = Object.keys(LISTAPIOBJ.responseData.batch).map(
            key => ({
              id: key,
              name: LISTAPIOBJ.responseData.batch[key],
            }),
          );
          set_lists(prevLists => ({
            ...prevLists,
            batch: batchList,
          }));
        }
        if (LISTAPIOBJ?.responseData?.styleMap) {
          const styleMapList = Object.keys(
            LISTAPIOBJ.responseData.styleMap,
          ).map(key => ({
            id: key,
            name: LISTAPIOBJ.responseData.styleMap[key],
          }));
          styleMapList.reverse();
          set_lists(prevLists => ({
            ...prevLists,
            styleMap: styleMapList,
          }));
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
  const getModalStyleFgList = async () => {
    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      fromRecord: 0,
      userName: userName,
      userPwd: userPsd,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      menuId: 145,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    // console.log('modal lsit ===>  req body ===> ', obj);

    let LISTAPIOBJ = await APIServiceCall.getPODStyeleFogDetails(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        //  console.log("modal lsit ===> ",  LISTAPIOBJ.responseData)
        set_modalLists(prevLists => ({
          ...prevLists,
          StyleFg: LISTAPIOBJ.responseData,
        }));
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

  const getModalPrices = async itemObj => {
    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      userName: userName,
      userPwd: userPsd,
      menuId: 247,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      itemTrimsType: itemObj.type,  //FG
      itemStr: itemObj.type === 'TRIMFABRIC' ? itemObj.type : '',
      itemId: itemObj.id,  //STYLEID
    };

    console.log("req body for prices  ==> ", obj )

    let LISTAPIOBJ = await APIServiceCall.getPODModalPricesList(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        //  console.log("modal prices lsit ===> ",  LISTAPIOBJ.responseData)
        return LISTAPIOBJ;
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
  const getGstStatusFromVendor = async id => {
    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      userName: userName,
      userPwd: userPsd,
      vendorId: id,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    let LISTAPIOBJ = await APIServiceCall.getGstStatusFromVendorApi(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData && LISTAPIOBJ.responseData.status==="true") {
        console.log('getGstStatusFromVendor ', LISTAPIOBJ.responseData);
        popUpAction(
        "This Vendor do not have GST",
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
      return LISTAPIOBJ?.responseData?.status;
      }

    } 
    // else {
    //   popUpAction(
    //     Constant.SERVICE_FAIL_MSG,
    //     Constant.DefaultAlert_MSG,
    //     'OK',
    //     true,
    //     false,
    //   );
    // }

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

  const getModalLists = async id => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let rmObj = {
      fromRecord: 0,
      userName: userName,
      userPwd: userPsd,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      menuId: 145,
      locIds: 0,
      brandIds: 0,
      fromRecord: 0,
      toRecord: 999,
      dataFilter: '0',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    let fabObj = {
      fromRecord: 0,
      username: userName,
      password: userPsd,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      menuId: 29,
      locIds: 0,
      brandIds: 0,
      fromRecord: 0,
      toRecord: 999,
      dataFilter: '0',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      styleId: 0,
      ids: '',
      buyperPoId: 0,
      withAllowance: 0,
      withTrimFab: 0,
      withLining: 0,
      rmId: 0,
    };
    let TrimfabObj = {
      fromRecord: 0,
      userName: userName,
      userPwd: userPsd,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      menuId: 145,
      locIds: 0,
      brandIds: 0,
      fromRecord: 0,
      toRecord: 999,
      dataFilter: '0',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      styleId: 0,
      ids: '',
      buyperPoId: 0,
      withAllowance: 0,
      rmId: 0,
    };
    // console.log('modal list fabObj ===> req body ===> ',TrimfabObj);

    let LISTAPIOBJ;

    if (id === 1) {
      LISTAPIOBJ = await APIServiceCall.getStyleRm(rmObj);
    } else if (id === 2) {
      LISTAPIOBJ = await APIServiceCall.getstyleFab(fabObj);
    } else {
      LISTAPIOBJ = await APIServiceCall.getStyleTrimfab(TrimfabObj);
    }

    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        if (id === 1) {
          set_modalLists(prevLists => ({
            ...prevLists,
            styleRm: LISTAPIOBJ.responseData,
          }));
          // console.log("rm   ===> ", LISTAPIOBJ.responseData)
        } else if (id === 2) {
          set_modalLists(prevLists => ({
            ...prevLists,
            styleFab: LISTAPIOBJ.responseData,
          }));
        } else {
          set_modalLists(prevLists => ({
            ...prevLists,
            styleTrimfab: LISTAPIOBJ.responseData,
          }));
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

  const submitAction = async tempObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    tempObj.menuId = 145;
    tempObj.userName = userName;
    tempObj.userPwd = userPsd;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);

    console.log('saving obj ==>', tempObj);
    // return;

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreatePODraft(tempObj);
    set_isLoading(false);

    // console.log('Sucess before returned obj ', SAVEAPIObj);

    if (
      SAVEAPIObj &&
      SAVEAPIObj?.statusData &&
      SAVEAPIObj?.responseData !== 0
    ) {
      console.log('Sucessfully saved ===> ');
      backBtnAction();
    } else {
      console.log('failed  saving =====> ');
      popUpAction(
        Constant.Fail_Save_Dtls_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (SAVEAPIObj && SAVEAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

    const getTableListStyleFog = async id => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let rmObj = {
      fromRecord: 0,
      userName: userName,
      userPwd: userPsd,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      menuId: 145,
      locIds: 0,
      brandIds: 0,
      fromRecord: 0,
      toRecord: 999,
      dataFilter: '0',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    // console.log('modal list fabObj ===> req body ===> ',TrimfabObj);

    let LISTAPIOBJ = await APIServiceCall.getTableListStyleFog(rmObj);;

    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
       return LISTAPIOBJ.responseData;
      }
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
      return null;
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

  return (
    <CreatePurchaseOrderDraftUI
      isLoading={isLoading}
      popUpAction={popUpAction}
      set_isLoading={set_isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      lists={lists}
      modalLists={modalLists}
      getModalLists={getModalLists}
      getModalPrices={getModalPrices}
      getModalStyleFgList={getModalStyleFgList}
      submitAction={submitAction}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      getGstStatusFromVendor={getGstStatusFromVendor}
    />
  );
};

export default CreatePurchaseOrderDraft;
