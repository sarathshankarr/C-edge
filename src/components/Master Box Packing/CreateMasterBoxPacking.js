import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation} from '@react-navigation/native';
import CreateMasterBoxPackingUI from './CreateMasterBoxPackingUI';

const CreateMasterBoxPacking = ({route}) => {
  const navigation = useNavigation();

  useEffect(() => {
    getInitialData();
  }, []);

  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [lists, set_lists] = useState([]);
  const [quality, set_quality] = useState([]);
  const [barcodeData, set_barcodeData] = useState([]);
  const [checkBoxStyles, set_checkBoxStyles] = useState([]);

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

  const getInitialData = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      username: userName,
      password: userPsd,
      menuId: 384,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    let LISTAPIOBJ = await APIServiceCall.getMasterBoxPackingCreate(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        set_lists(LISTAPIOBJ.responseData);
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

  const getDataFromSelectedCheckBox = async (ids, poflag) => {
    console.log('ids===> ', ids, poflag);
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
      multiPI: ids,
      nfsm_pi_style_wise: poflag ? '1' : '0',
    };

    let LISTAPIOBJ = await APIServiceCall.getCheckBoxesDataMasterBox(obj);
    set_isLoading(false);

    if (
      LISTAPIOBJ &&
      LISTAPIOBJ.statusData &&
      LISTAPIOBJ.responseData &&
      LISTAPIOBJ.responseData.status === true
    ) {
      // console.log(
      //   'getDataFromSelectedCheckBox ==>  ',
      //   LISTAPIOBJ.responseData.styles,
      // );
      set_checkBoxStyles(LISTAPIOBJ.responseData.styles);
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

  const ValidateBarcode = async (id, poflag, piIds) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj1 = {
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      barcode: id,
      multiPI: '',
    };
    const styleQtyList = piIds.flatMap(piId => {
      return checkBoxStyles
        .filter(style => style.proforma_pi_id == piId)
        .map(style => ({
          style_id: style.style_id,
          style_qty: style.total_qty,
          pi_ID: Number(piId),
        }));
    });
    console.log('style list -===> ', styleQtyList);

    let obj2 = {
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      barcode: id,
      multiPI: piIds.join(':'),
      styleQtyList: styleQtyList || [],
    };

    console.log('req body validate barcode pi ', obj2);
    let LISTAPIOBJ;
    if (!poflag) {
      LISTAPIOBJ = await APIServiceCall.api11(obj1);
    } else {
      LISTAPIOBJ = await APIServiceCall.validBarcodePIFlag(obj2);
    }

    console.log('resp after validting barcode ', LISTAPIOBJ.responseData);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData && LISTAPIOBJ.responseData) {
      if (LISTAPIOBJ.responseData.status == true) {
        console.log('ValidateBarcode ', LISTAPIOBJ.responseData);
        if (!poflag) {
          getDatafromBarcode(id, LISTAPIOBJ.responseData?.rKey, poflag, piIds);
        } else {
          getDataForPIAfterValidation(
            id,
            LISTAPIOBJ.responseData,
            poflag,
            piIds,
          );
        }
      } else {
        let msg = LISTAPIOBJ.responseData?.message || Constant.SERVICE_FAIL_MSG;
        popUpAction(msg, Constant.DefaultAlert_MSG, 'OK', true, false);
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

  const getDatafromBarcode = async (id, key, poflag, piIds) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {};
    let LISTAPIOBJ;

    obj = {
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      locId: key,
      barcode: id,
    };
    console.log('req table data after validation ==> ', obj);
    LISTAPIOBJ = await APIServiceCall.api22(obj);

    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        set_barcodeData({
          ...LISTAPIOBJ.responseData,
          Barcode: id,
          boxKeyId: key,
        });
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

  const ValidateAction = async type => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    console.log('validating masterbx exitsing ? ', type);

    let Obj = {
      menuid: 384,
      username: userName,
      password: userPsd,
      masterBox: type || '',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.validateCreateMasterCTNBox(Obj);
    set_isLoading(false);

    console.log('Sucess before returned obj ', SAVEAPIObj);

    return SAVEAPIObj?.responseData;
  };

  const submitAction = async (tempObj) => {
    const validateRMT = await ValidateAction(tempObj.masterBox);

    if (validateRMT !== 'false') {
      console.log('failed  saving =====> ');
      popUpAction(
        'Entered MasterBox Name Already Exits !',
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
      return;
    }

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    console.log('saving obj b api ==>', tempObj);
    tempObj.menuId = 384;
    tempObj.username = userName;
    tempObj.password = userPsd;
    tempObj.compIds = usercompanyId;
    tempObj.company = JSON.parse(companyObj);

    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.saveCreateMasterBoxPacking(tempObj);
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

  const getData = async (tempObj, idx) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      username: userName,
      password: userPsd,
      menuId: 384,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      styleId: tempObj.sId,
      buyerpoId: tempObj.bId,
    };
    let LISTAPIOBJ = await APIServiceCall.getMasterBoxPackingCreateQuality(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        set_quality(LISTAPIOBJ.responseData);
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

  const getDataForPIAfterValidation = async (id, data, poflag, piIds) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    obj = {
      username: userName,
      password: userPsd,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      barcode: id,
      multiPI: piIds.join(','),
    };
    let LISTAPIOBJ = await APIServiceCall.getDatafromBarcodePIMasterBox(obj);
    set_isLoading(false);

    if (LISTAPIOBJ && LISTAPIOBJ.statusData) {
      if (LISTAPIOBJ && LISTAPIOBJ.responseData) {
        console.log('getDataForPIAfterValidation ', LISTAPIOBJ.responseData);
        getDatafromBarcode(id, LISTAPIOBJ.responseData.rKey, poflag, piIds);
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

  return (
    <CreateMasterBoxPackingUI
      isLoading={isLoading}
      popUpAction={popUpAction}
      set_isLoading={set_isLoading}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      lists={lists}
      submitAction={submitAction}
      getDataFromSelectedCheckBox={getDataFromSelectedCheckBox}
      getData={getData}
      quality={quality}
      barcodeData={barcodeData}
      ValidateBarcode={ValidateBarcode}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
    />
  );
};

export default CreateMasterBoxPacking;
