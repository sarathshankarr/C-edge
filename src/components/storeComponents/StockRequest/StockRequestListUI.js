import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import * as Constant from "./../../../utils/constants/constant";
import CommonStyles from "./../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';
import color from '../../../utils/commonStyles/color';
// import { useNavigation } from '@react-navigation/native';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');

const StockRequestListUI = ({ navigation, route, ...props }) => {

  // const navigation=useNavigation;

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

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const createPage = () => {
    props.create()
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
      const newData = nestedFilter.filter(item =>
        item.stockStatus?.toUpperCase().includes(recName.toUpperCase()) ||
        item.stockId?.toString().includes(recName) ||
        item.styleName?.toUpperCase().includes(recName.toUpperCase())
      );


      if (newData && newData.length > 0) {
        set_filterArray(newData);
      } else {
        set_filterArray([]);
      }
    }
  };

  const renderItem = ({ item, index }) => {

    return (

      <TouchableOpacity onPress={() => actionOnRow(item, index)} style={CommonStyles.cellBackViewStyle}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 0.4, textAlign: 'left' }]}>{item.stockId}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.styleName}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.approvedDate}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.requestedQty}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.requestedBy}</Text>
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
          title={'Stock Request List'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>

        {props.itemsArray && props.itemsArray.length > 0 ?
          <View style={{ flexDirection: 'row', width: '100%' }} >
            <View style={{ width: '67%' }}>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 5 }}>
                <Image source={searchImg} style={{ height: 15, width: 15, marginLeft: 15 }} />
                <TextInput style={{}}
                  underlineColorAndroid="transparent"
                  placeholder="Search "
                  placeholderTextColor="#7F7F81"
                  autoCapitalize="none"
                  value={recName}
                  onFocus={() => isKeyboard.current = true}
                  onChangeText={(name) => { filterPets(name) }}
                />
              </View>
            </View>

            <View style={{ width: '30%', marginLeft: '2%' }}>
              <TouchableOpacity style={styles.leftButtonstyle} onPress={() => createPage() }>
                <Text style={[styles.leftBtnTextStyle]}>{"Create"}</Text>
              </TouchableOpacity>
            </View>

          </View>
          : null}

        {filterArray && filterArray.length > 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 0.5, textAlign: 'left' }]}>{'SId'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Style'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Requested Date'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Request Qty'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Requested by'}</Text>
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
            {!props.isLoading ? <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>{Constant.noRecFound}</Text> : null}
        </View>}

        <View style={CommonStyles.listStyle}>
          <FlatList
            data={filterArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => "" + index}
            showsVerticalScrollIndicator={false}
          />
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

export default StockRequestListUI;


const styles = StyleSheet.create({
  leftBtnTextStyle: {
    color: 'white',
    fontSize: fonts.fontMedium,
    fontWeight : '700',
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    textAlign:'center'
  },
  leftButtonstyle : {
    backgroundColor:color.color2,
    // flex:1,
    height: hp("6%"),
    borderRadius: hp("0.5%"),
    justifyContent: "center",
    alignItems:'center',
  },
  })