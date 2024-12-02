import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import fonts from '../../../utils/commonStyles/fonts';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import * as Constant from "../../../utils/constants/constant";
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import { formatPrice } from '../../../utils/constants/constant';
let searchImg = require('./../../../../assets/images/png/searchIcon.png');


const POApproveUI = ({ route, ...props }) => {

  const [isListOpen, set_ListOpen] = useState(false);
  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState(undefined);
  let isKeyboard = useRef(false);



  React.useEffect(() => {
    if (props.itemsArray) {
      set_filterArray(props.itemsArray);
    }

  }, [props.itemsArray]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  }

  const filterPets = (recName) => {

    if (isKeyboard.current === true) {
      set_recName(recName)
      if (recName && recName.length > 0) {
        set_ListOpen(true);
      } else {
        set_ListOpen(false);
      }

      let nestedFilter = props.itemsArray;
      const styleArray = nestedFilter.filter(style => (style.vendorName.toUpperCase().includes(recName.toUpperCase()) || style.poNumberWithPrefix.toString().toUpperCase().includes(recName.toUpperCase()) || style.rmFabric.toUpperCase().includes(recName.toUpperCase())));

      if (styleArray && styleArray.length > 0) {
        set_filterArray(styleArray);
      } else {
        set_filterArray([]);
      }
    }
  };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const renderItem = ({ item, index }) => {

    return (

      <TouchableOpacity onPress={() => actionOnRow(item, index)} style={CommonStyles.cellBackViewStyle}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'left' }]}>{item.poNumberWithPrefix}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'center' }]}>{item.vendorName}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.rmFabric}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1.2, textAlign: 'right', marginRight: wp('2%') }]}>{formatPrice(item.price)}</Text>

        </View>

      </TouchableOpacity>

    );
  };

  return (

    <View style={[CommonStyles.mainComponentViewStyle]}>

      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={' List of Orders'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>

        {filterArray ? <View style={CommonStyles.searchBarStyle}>

          <View style={[CommonStyles.searchInputContainerStyle]}>
            <Image source={searchImg} style={CommonStyles.searchImageStyle} />
            <TextInput style={CommonStyles.searchTextInputStyle}
              underlineColorAndroid="transparent"
              placeholder="Search by Vendor"
              placeholderTextColor="#7F7F81"
              autoCapitalize="none"
              value={recName}
              onFocus={() => isKeyboard.current = true}
              onChangeText={(name) => { filterPets(name) }}
            />
          </View>

        </View> : null}

        {filterArray && filterArray.length > 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1.5, textAlign: 'left' }]}>{'PO'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1.5, textAlign: 'center', }]}>{'Vendor'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'RM/Fabric'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1.2, textAlign: 'right', marginRight: wp('2%'), }]}>{'Total Price'}</Text>
        </View> : null}

        <View style={CommonStyles.listStyle}>
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
          isLeftBtnEnable={props.isPopLeft}
          isRightBtnEnable={true}
          leftBtnTilte={'NO'}
          rightBtnTilte={props.popUpRBtnTitle}
          popUpRightBtnAction={() => popOkBtnAction()}
          popUpLeftBtnAction={() => popCancelBtnAction()}
        />
      </View> : null}

      {props.isLoading === true ? <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} /> : null}
    </View>
  );
}

export default POApproveUI;