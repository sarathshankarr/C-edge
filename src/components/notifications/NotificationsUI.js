import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, TextInput, Button } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import CommonStyles from '../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import fonts from '../../utils/commonStyles/fonts';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import * as Constant from '../../utils/constants/constant';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import { ColorContext } from '../colorTheme/colorTheme';

// let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let searchImg = require('./../../../assets/images/png/searchIcon.png');



const NotificationsUI = ({ route, ...props }) => {

  // const [recName, set_recName] = useState(undefined);
  // let isKeyboard = useRef(false);
  const [filterArray, set_filterArray] = useState([]);
  const { colors } = useContext(ColorContext);


  React.useEffect(() => {
    if (props.itemsArray) {
      set_filterArray(props.itemsArray);
      // console.log("props.itemsArray==> ", props.isPopupLeft);
    }

  }, [props]);


  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  }
  const popOkBtnAction1 = () => {
    props.popOkBtnAction1();
  }

  const popCancelBtnAction = () => {
    props.popCancelBtnAction();
  }


  // const filterPets = (recName) => {

  //   if(isKeyboard.current === true) {
  //     set_recName(recName)
  //     if(recName && recName.length > 0) {
  //       set_ListOpen(true);
  //     } else {
  //       set_ListOpen(false);
  //     }

  //     let nestedFilter = props.itemsArray;
  //     const styleArray = nestedFilter.filter(style => (style.vendorName.toUpperCase().includes(recName.toUpperCase()) || style.poNumberWithPrefix.toString().toUpperCase().includes(recName.toUpperCase()) || style.rmFabric.toUpperCase().includes(recName.toUpperCase())));

  //     if(styleArray && styleArray.length > 0) {
  //       set_filterArray(styleArray);
  //     } else {
  //       set_filterArray([]);
  //     }
  //   }
  // };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const handleClear = () => {
    props.handleClear();
  };



  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={item.m_read === 0 ? styles.messageTextUnRead : styles.messageTextRead}>
        {item.message}
      </Text>
      {item.m_read === 0 && <View style={styles.unreadDot} />}
    </View>
  );


  return (

    <View style={[CommonStyles.mainComponentViewStyle]}>

            <View style={{ flexDirection: 'row', justifyContent:'space-around',backgroundColor: colors.color2,alignItems:'center' }}>
              {/* <View style={{ justifyContent: 'center' }}> */}
                <TouchableOpacity onPress={() => backBtnAction()} style={{ flexDirection: 'row', alignItems: 'center', width: '16%' }} disabled={false}>
                  <Image source={require("./../../../assets/images/png/backButtonImg.png")} style={styles.backBtnEnableStyle} />
                </TouchableOpacity>
              {/* </View> */}
              <View style={[styles.headerSelectionView]}><Text style={[styles.titleStyle]}>{"Notifications"}</Text></View>
              <View style={{}}>
                <TouchableOpacity onPress={() => handleClear()} style={styles.clearAllButton}>
                  <Text style={styles.clearAllButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>
         

      <View style={CommonStyles.headerStyle}>

        <View style={styles.listStyle1}>
          {filterArray && filterArray.length > 0 ? <FlatList
            data={filterArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => "" + index}
            showsVerticalScrollIndicator={false}
          /> : <View style = {CommonStyles.noRecordsFoundStyle}>
          {!props.isLoading ? <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>{Constant.noRecFound}</Text> : null}
      </View>}
        </View>
      </View>
      {props.isPopUp ? <View style={CommonStyles.customPopUpStyle}>
        <AlertComponent
          header={props.popUpAlert}
          message={props.popUpMessage}
          isLeftBtnEnable={props.isPopupLeft}
          isRightBtnEnable={true}
          leftBtnTilte={'NO'}
          rightBtnTilte={props.popUpRBtnTitle}
          popUpRightBtnAction={() => props.isPopupLeft ? popOkBtnAction1() : popOkBtnAction()}
          popUpLeftBtnAction={() => popCancelBtnAction()}
        />
      </View> : null}

      {props.isLoading === true ? <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} /> : null}
    </View>
  );
}

export default NotificationsUI;

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '90%',
    marginHorizontal: 10
  },
  messageTextRead: {
    fontSize: 16,
    // color: '#888', 
    color: '#000',
    fontWeight: 'normal',
  },
  messageTextUnRead: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff0000',
  },
  listStyle1: {
    width: '90%',
    // backgroundColor: 'white',
    marginTop: hp("2%"),
    marginBottom: hp("5%"),

  },
  headerView: {
    justifyContent: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },

  headerSelectionView: {
    flex: 6,
    minHeight: hp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  backBtnEnableStyle: {
    marginLeft: wp("2%"),
    width: wp('6%'),
    height: hp('6%'),
    resizeMode: 'contain',
    tintColor: "#ffffff"
  },

  titleStyle: {
    // fontSize: fonts.fontMedium,
    // fontWeight: 700,
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
    marginRight: wp("16%"),
    color: '#ffffff'
  },
  clearAllButton: {
    backgroundColor: 'white',
    paddingVertical: 10, 
    paddingHorizontal: 10,
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  clearAllButtonText: {
    color: '#000', 
    // fontSize: 16, 
    // fontWeight: 'bold', 
  },
});



