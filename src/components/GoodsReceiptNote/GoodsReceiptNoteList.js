import React, {useState, useEffect, useRef} from 'react';
import * as APIServiceCall from '../../utils/apiCalls/apiCallsComponent';
import * as Constant from '../../utils/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import GoodsReceiptNoteListUI from './GoodsReceiptNoteListUI';
import useSearchablePagedList from '../../utils/Hooks/useSearchablePagedList';
import {MOBILE_LIST_CONFIG} from '../../utils/constants/mobileListConfig';

const GoodsReceiptNoteList = ({route}) => {
  const navigation = useNavigation();

  const [isPopUp, set_isPopUp] = useState(false);
  const [popUpMessage, set_popUpMessage] = useState(undefined);
  const [popUpAlert, set_popUpAlert] = useState(undefined);
  const [popUpRBtnTitle, set_popUpRBtnTitle] = useState(undefined);
  const [isPopupLeft, set_isPopupLeft] = useState(false);
  const isSessionExpired = useRef(false);
  const isFirstFocus = useRef(true);

  const list = useSearchablePagedList(MOBILE_LIST_CONFIG.GRN, {
    menuId: 5,
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

  // Coming back from the GRN screen: reload page 1, keeping search and filter.
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
    navigation.navigate('SaveGoodsReceiptNote', {item: item});
  };



  return (
    <GoodsReceiptNoteListUI
      list={list}
      popUpAlert={popUpAlert}
      popUpMessage={popUpMessage}
      popUpRBtnTitle={popUpRBtnTitle}
      isPopupLeft={isPopupLeft}
      isPopUp={isPopUp}
      actionOnRow={actionOnRow}
      backBtnAction={backBtnAction}
      popOkBtnAction={popOkBtnAction}
    />
  );
};
export default GoodsReceiptNoteList;

