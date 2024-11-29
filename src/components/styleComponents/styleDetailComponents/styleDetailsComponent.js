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
  const [styleId, set_styleId] = useState(undefined);
  const [img, set_img]=useState('');

  React.useEffect(() => {

    if(route.params?.sId){
      set_styleId(route.params?.sId);
      set_img(route.params?.image);
      getInitialData(route.params?.sId);
    }
    
  }, [route.params?.sId]);

  console.log("image===>",img)

  const getInitialData = async (id) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    set_isLoading(true);
    let obj = {
      "styleId": id,
      "username": userName,
      "password" : userPsd
    }
  console.log('Style ',obj)
    let styleDetailsAPIObj = await APIServiceCall.stylesDetailsAPIByRecord(obj);
    set_isLoading(false);
    
    if(styleDetailsAPIObj && styleDetailsAPIObj.statusData){

      if(styleDetailsAPIObj && styleDetailsAPIObj.responseData){
        set_itemObj(styleDetailsAPIObj.responseData);
      } 

    } else {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
    }

    if(styleDetailsAPIObj && styleDetailsAPIObj.error) {
      popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false)
    }

  };

  const backBtnAction = () => {
    navigation.navigate('StyleManageComponent');
  };

  const rgtBtnAction = () => {
    navigation.navigate('ViewTimeSummaryComponent',{sId : styleId});
  };

  const lftBtnAction = () => {
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
    console.log('Hello ', )
    navigation.navigate('styleSizeDetailsComponents',{sId:styleId})
  };

  const viewProcessFlowAction = () => {
    navigation.navigate('ViewProcessFlowComponent',{sId:styleId});
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
      rgtBtnAction = {rgtBtnAction}
      popOkBtnAction = {popOkBtnAction}
      sizeDetailsAction = {sizeDetailsAction}
      viewProcessFlowAction = {viewProcessFlowAction}
    />

  );

}

export default StyleDetailsComponent;