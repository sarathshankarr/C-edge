import React, {useState, useRef} from 'react';
import * as Constant from '../../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RawMaterialsMasterListUI from './RawMaterialsMasterListUI';
import useSearchablePagedList from '../../../utils/Hooks/useSearchablePagedList';
import {MOBILE_LIST_CONFIG} from '../../../utils/constants/mobileListConfig';

// Existing row UI reads description (Raw Material Type); the mobile list API
// returns trimTypeDescription.
const mapRow = row => ({
  ...row,
  description: row.description ?? row.trimTypeDescription,
});

const RawMaterialsMasterList = ({route}) => {
  const navigation = useNavigation();

  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const isSessionExpired = useRef(false);
  const isFirstFocus = useRef(true);

  const list = useSearchablePagedList(MOBILE_LIST_CONFIG.RM_MASTER, {
    mapRow,
    onInvalidLogin: () => {
      isSessionExpired.current = true;
      popUpAction(
        'Session expired / invalid credentials. Please login again.',
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    },
  });

  // Coming back from create/edit: reload page 1, keeping search.
  useFocusEffect(
    React.useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      list.retry();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const backBtnAction = () => {
    navigation.goBack();
  };

  const actionOnCreate = () => {
    navigation.navigate('CreateInProcess');
  };

  const handleNavigation = () => {
    navigation.navigate('SaveRawMaterialsMaster');
  };

  const popUpAction = (popMsg, popAlert, rBtnTitle, isPopup, isPopLeft) => {
    set_popUpMessage(popMsg);
    set_popUpAlert(popAlert);
    set_popUpRBtnTitle(rBtnTitle);
    set_isPopupLeft(isPopLeft);
    set_isPopUp(isPopup);
  };

  const popOkBtnAction = async () => {
    popUpAction(undefined, undefined, '', false, false);
    if (isSessionExpired.current) {
      isSessionExpired.current = false;
      await AsyncStorage.removeItem('userDisplayName');
      await AsyncStorage.removeItem('admin');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userPsd');
      navigation.reset({index: 0, routes: [{name: 'LoginComponent'}]});
    }
  };

  const actionOnRow = (item, index) => {
    navigation.navigate('SaveRawMaterialsMaster', {item: item});
  };

  return (
    <RawMaterialsMasterListUI
      list={list}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      actionOnRow={actionOnRow}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
      actionOnCreate={actionOnCreate}
      handleNavigation={handleNavigation}
    />
  );
};

export default RawMaterialsMasterList;
