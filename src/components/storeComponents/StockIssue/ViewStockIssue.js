import React, {useState} from 'react';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewStockIssueUI from './ViewStockIssueUI';

const ViewStockIssue = ({navigation, route, ...props}) => {

    const [itemsObj, set_itemsObj] = useState([]);
  const [isLoading, set_isLoading] = useState(false);
  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);

  React.useEffect(() => {
    if (route.params) {
      if (route.params?.viewObject) {
        set_itemsObj(route.params?.viewObject || {});
      }
    }
  }, [route.params]);

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

  const approveItems = async approveObj => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    approveObj.username = userName;
    approveObj.password = userPsd;
    approveObj.userId = Number(userId);
    approveObj.firstName = userName;
    approveObj.lastName = userName;
    approveObj.companyDetails = companyObj ? JSON.parse(companyObj) : {};
    // console.log('saving obj ==>', tempObj);


    set_isLoading(true);

    let SAVEAPIObj = await APIServiceCall.approveStockIssueItems(
      approveObj,
    );
    set_isLoading(false);

    console.log('Sucess before returned obj ', SAVEAPIObj);

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


    return (
        <ViewStockIssueUI
            itemsObj={itemsObj}
            isLoading={isLoading}
            popUpAlert={popUpAlert}
            popUpMessage={popUpMessage}
            popUpRBtnTitle={popUpRBtnTitle}
            isPopupLeft={isPopupLeft}
            isPopUp={isPopUp}
            backBtnAction={backBtnAction}
            popOkBtnAction={popOkBtnAction}
            approveItems={approveItems}
    />
    );
}
export default ViewStockIssue;