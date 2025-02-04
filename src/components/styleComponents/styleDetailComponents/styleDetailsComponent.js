import React, { useState} from 'react';
import StyleDetailsUI from './styleDetailsUI';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from "../../../utils/constants/constant";
import AsyncStorage from '@react-native-async-storage/async-storage';


const StyleDetailsComponent = ({ navigation, route, ...props }) => {

  const [itemObj, set_itemObj] = useState(undefined);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const [styleId, set_styleId] = useState('');
  const [img, set_img]=useState('');
  const [listItems, set_listItems]=useState({
    productionSummary:[],
    timeAndAction:[],
    styleDetailsList:[]
  });


  React.useEffect(() => {

    if(route.params?.sId){
      console.log("id ==> ", route.params?.sId)
      set_styleId(route.params?.sId);
      set_img(route.params?.image);
      getInitialData(route.params?.sId);
      getInitialDataList(route.params?.sId);
      getProductionSummary(route.params?.sId);
      getTimeandAction(route.params?.sId);
    }
    
  }, [route.params?.sId]);

  // console.log("image===>",img)

  const getInitialData = async (id) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    set_isLoading(true);
    let obj = {
      "styleId": id,
      "username": userName,
      "password" : userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
    }
    // console.log('reqqqqqqqqqqqq  ======>  ',obj)
    let styleDetailsAPIObj = await APIServiceCall.stylesDetailsAPIByRecord(obj);
    set_isLoading(false);
    
    if(styleDetailsAPIObj && styleDetailsAPIObj.statusData){

      if(styleDetailsAPIObj && styleDetailsAPIObj.responseData){
        set_itemObj(styleDetailsAPIObj.responseData);
        console.log('Style  response 1 ============> ',styleDetailsAPIObj.responseData)
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(styleDetailsAPIObj && styleDetailsAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const getInitialDataList = async (id) => {

    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let obj = {
      "styleId":id,
      "username": userName,
      "password" : userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
    }

    let styleSDdetailsAPIObj = await APIServiceCall.styleSizeDetails(obj);
    set_isLoading(false);
    
    if(styleSDdetailsAPIObj && styleSDdetailsAPIObj.statusData){

      if(styleSDdetailsAPIObj && styleSDdetailsAPIObj.responseData){
        console.log('Style  response 2 ============> ',styleSDdetailsAPIObj.responseData)
        set_listItems(prevState => ({
          ...prevState,
          styleDetailsList: styleSDdetailsAPIObj.responseData
        }));
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(styleSDdetailsAPIObj && styleSDdetailsAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const getProductionSummary = async (id) => {

    set_isLoading(true);

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');

    let obj = {
      "styleId" : id,
      "process" :"singlestyle",
      "username": userName,
      "password" : userPsd,
    }

    let poEditAPIObj = await APIServiceCall.viewProcessFlow(obj);
    set_isLoading(false);
    if(poEditAPIObj && poEditAPIObj.statusData){

      if(poEditAPIObj && poEditAPIObj.responseData){
        // set_itemsArray(poEditAPIObj.responseData)
        set_listItems(prevState => ({
          ...prevState,
          productionSummary: poEditAPIObj.responseData
        }));
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(poEditAPIObj && poEditAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const getTimeandAction = async (id) => {

    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let obj = {
      "styleId":id,
      "oldOrNewProcess":0,
      "username": userName,
      "password" : userPsd,
    }

    let vTimeActionAPIObj = await APIServiceCall.vieTimeAction(obj);
    set_isLoading(false);
    // console.log('ViewTimeAction ',vTimeActionAPIObj)
    if(vTimeActionAPIObj && vTimeActionAPIObj.statusData){

      if(vTimeActionAPIObj && vTimeActionAPIObj.responseData){
        // console.log("response of Time & Action", vTimeActionAPIObj.responseData);
        set_listItems(prevState => ({
          ...prevState,
          timeAndAction:vTimeActionAPIObj.responseData.styletimeandactionlist
        }));
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(vTimeActionAPIObj && vTimeActionAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };


  const popUpAction = (popMsg, popAlert,rBtnTitle,isPopup,isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = () => {
    popUpAction(undefined,undefined,'', false,false)
  };

  const sizeDetailsAction = () => {
    navigation.navigate('styleSizeDetailsComponents',{sId:styleId})
  };

  const viewProcessFlowAction = () => {
    navigation.navigate('ViewProcessFlowComponent',{sId:styleId});
  };

  const submitAction = async (tempObj) => {

    set_isLoading(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let userId = await AsyncStorage.getItem('userId');

    tempObj.styleId=styleId,
    tempObj.username=userName,
    tempObj.password=userPsd,
    tempObj.compIds=usercompanyId,
    tempObj.userId=userId,
    tempObj.company=JSON.parse(companyObj)

    console.log("req body ==> ", tempObj);

    let saveEditObj = await APIServiceCall.saveEditStleDetails(tempObj);
    set_isLoading(false);
    console.log("response after approving", saveEditObj?.responseData, typeof saveEditObj?.responseData, saveEditObj?.responseData === true)

    if (saveEditObj && saveEditObj.statusData && saveEditObj.responseData && saveEditObj?.responseData !== 0) {
      console.log("sucess");
      backBtnAction();
    } else {
      popUpAction(Constant.Fail_Save_Dtls_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (saveEditObj && saveEditObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };
  
  const backBtnAction = () => {
    navigation.goBack();
  };


  return (

    <StyleDetailsUI
      itemObj = {itemObj}
      image={img}
      isLoading = {isLoading}
      popUpAlert = {popUpAlert}
      popUpMessage = {popUpMessage}
      popUpRBtnTitle = {popUpRBtnTitle}
      isPopupLeft = {isPopupLeft}
      isPopUp = {isPopUp}
      backBtnAction = {backBtnAction}
      popOkBtnAction = {popOkBtnAction}
      viewProcessFlowAction = {viewProcessFlowAction}
      listItems = {listItems}
      submitAction = {submitAction}
    />

  );

}

export default StyleDetailsComponent;