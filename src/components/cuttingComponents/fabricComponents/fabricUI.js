import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, ImageBackground } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import * as Constant from "./../../../utils/constants/constant";
import CommonStyles from "./../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import fonts from '../../../utils/commonStyles/fonts';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';

const FabricUI = ({ route, ...props }) => {

  useEffect(() => {

  }, []);


  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const renderItem = ({ item, index }) => {

    return (

      <TouchableOpacity onPress={() => actionOnRow(item, index)} key={index} style={CommonStyles.cellBackViewStyle}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center'}}>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'left' }]}>{item.fabricName}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>
          {Number(item.totalQty).toFixed(0).toString()}
            </Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.cutQty}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'center', marginRight: wp('2%') }]}>{item.remainingQty}</Text>
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
          title={'Fabric Details'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>

        <View style={CommonStyles.listCommonHeader1}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1.5, textAlign: 'left' }]}>{'Fabric Name'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Total Qty'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Cut Qty'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1.5, textAlign: 'right', marginRight: wp('2%'), }]}>{'Remaining Qty'}</Text>
        </View>

        <View style={CommonStyles.listStyle}>
          <View style={{}}>
            {props.itemsArray && props.itemsArray.map((item, index) => renderItem({ item, index }))}
          </View>

          {props.trimFabric.length >= 1 && <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10,marginTop:45, color:'#000000'}}>Trim Fabric</Text>}
          <View style={{ }}>
            {props.trimFabric && props.trimFabric.map((item, index) => renderItem({ item, index }))}
          </View>
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

export default FabricUI;