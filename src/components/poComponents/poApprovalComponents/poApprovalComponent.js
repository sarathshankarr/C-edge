import React, { useState } from 'react';
import POApprovalUI from './poApprovalUI';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { formatPrice } from '../../../utils/constants/constant';

const POApprovalComponent = ({ navigation, route, ...props }) => {

  const [itemsArray, set_itemsArray] = useState(undefined);
  const [startDate, set_startDate] = useState(undefined);
  const [deliveryDate, set_sdeliveryDate] = useState(undefined);
  const [totalFare, set_totalFare] = useState(undefined);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [poNumber, set_poNumber] = useState(undefined);
  const [pId, set_pId] = useState(1);
  const [remarks, set_remarks] = useState("");
  const [gstAmount, set_gstAmount]=useState(0);
  const [gstName, set_gstName]=useState(true);



  React.useEffect(() => {

    if (route.params?.item) {
      getInitialData(route.params?.item.poNumber);
      console.log('route params from list page==> ', route.params?.item)
      getGSTorTaxAmount(route.params?.item?.price);
    }

  }, [route.params?.item]);

  const getGSTorTaxAmount=(tax)=>{
    const gt=formatPrice(tax);
    console.log("formated price",gt)
    if(gt[0]!='₹'){
      set_gstName(false);
    }
  }


  React.useEffect(() => {
    if (itemsArray && itemsArray?.length > 0) {
      let totalGstAmount = itemsArray.reduce((sum, item) => sum + item?.gstAmount, 0);
      set_gstAmount(totalGstAmount);
      console.log("totalGst====> ", totalGstAmount);
    }
  }, [itemsArray]);

  const getInitialData = async (poNumber) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      "poNumber": poNumber,
      "userName": userName,
      "userPwd": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
    }

    let poEditAPIObj = await APIServiceCall.poApproveEditAPIService(obj);
    console.log('poNumber edit details', poEditAPIObj)
    set_isLoading(false);

    if (poEditAPIObj && poEditAPIObj.statusData) {

      if (poEditAPIObj && poEditAPIObj.responseData) {
        getTotalFare(poEditAPIObj.responseData);
        set_itemsArray(poEditAPIObj.responseData.poChildResponseList);
        set_sdeliveryDate(poEditAPIObj.responseData.deliveryDateStr);
        set_startDate(poEditAPIObj.responseData.issueDateStr);
        set_poNumber(poEditAPIObj.responseData.poNumber)
      }

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false, 1);
    }

    if (poEditAPIObj && poEditAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false, 1)
    }

    // if()
    


  };

  const getTotalFare = (recordArray) => {

    console.log('child list ==> ', recordArray?.poChildResponseList[0])
    set_totalFare(recordArray.totalAmount);

  };

  const backBtnAction = () => {
    navigation.navigate('POApproveListComponent');
  };

  const approveAction = async (value) => {


    if (!poNumber) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }

    if (value === 100 && remarks.trim().length === 0) {
      popUpAction(Constant.PO_Rejected_MSG_WITHOUT_REMARKS, Constant.DefaultAlert_MSG, 'OK', true, false);
      return;
    }

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    //reject = 3
    let obj = {
      "poNumber": poNumber,  // mandatory
      "statusRemarks": remarks,
      "status": value && value === 100 ? 3 : 1, // mandatory
      "secondLevelFlag": "0",
      "notes": "",
      "locId": 0,
      "styleId": 0,
      "menuId": 4,      // mandatory
      "userName": userName,  // mandatory
      "userPwd": userPsd, // mandatory
      "compIds": usercompanyId,
     "company":JSON.parse(companyObj),
    }

    let poApproveAPIObj = await APIServiceCall.poApproveAPIService(obj);
    console.log('poNumber Approve API----> ', poApproveAPIObj)
    set_isLoading(false);

    if (poApproveAPIObj && poApproveAPIObj.statusData) {

      if (value === 100) {
        popUpAction(Constant.PO_Rejected_MSG, Constant.Thankyou_Alert_MSG, 'OK', true, false, 2);
      } else {
        popUpAction(Constant.PO_Approve_MSG, Constant.Thankyou_Alert_MSG, 'OK', true, false, 2);
      }

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false, 1);
    }

    if (poApproveAPIObj && poApproveAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false, 1)
    }

  };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft, id) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
    set_pId(id)
  }

  const popOkBtnAction = () => {
    popUpAction(undefined, undefined, '', false, false);
    if (pId === 2) {
      backBtnAction();
    }
  }




  return (
    <POApprovalUI
      itemsArray={itemsArray}
      startDate={startDate}
      deliveryDate={deliveryDate}
      totalFare={totalFare}
      totalGstAmount={gstAmount}
      isLoading={isLoading}
      gstName={gstName}
      remarks={remarks}
      set_remarks={set_remarks}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      backBtnAction={backBtnAction}
      approveAction={approveAction}
      popOkBtnAction={popOkBtnAction}
    />

  );

}

export default POApprovalComponent;