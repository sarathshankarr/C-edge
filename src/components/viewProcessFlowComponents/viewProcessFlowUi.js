import React, { useState, useEffect } from 'react';
import {View,TouchableOpacity,Text,FlatList,ImageBackground} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "./../../utils/constants/constant";
import CommonStyles from "./../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../utils/commonComponents/alertComponent';

const ViewProcessFlowUI = ({route, ...props }) => {

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item,index) => {
    props.actionOnRow(item,index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const renderItem = ({ item, index }) => {

    return (

      <TouchableOpacity onPress={() => actionOnRow(item,index)} style={CommonStyles.cellBackViewStyle}>

        <View style={{flexDirection :'row', justifyContent:'space-between', alignItems:'center'}}>
          <Text style={[CommonStyles.tylesTextStyle,{flex:2,textAlign:'left'}]}>{item.processName}</Text>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center'}]}>{item.totalqty}</Text>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1.5,textAlign:'right',marginRight:wp('2%')}]}>{item.processqty}</Text>
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
          title={'View Details'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

        {props.itemsArray ? <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'Style'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Fabric'}</Text>
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
            <Text style={[CommonStyles.tylesHeaderTextStyle]}>{Constant.noRecFound}</Text>
        </View>}

        {props.itemsArray ? <View style={{flexDirection :'row', justifyContent:'space-between',marginTop:hp('2%')}}>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'left'}]}>{props.itemsArray.styleName}</Text>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center',}]}>{props.itemsArray.fabricName}</Text>
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
            <Text style={[CommonStyles.tylesHeaderTextStyle]}>{Constant.noRecFound}</Text>
        </View>}

        <View style={{flexDirection :'row', justifyContent:'space-between', alignItems:'center',marginTop:hp('4%')}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:2,textAlign:'left'}]}>{'Process Name'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center'}]}>{'Total Qty'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'right',marginRight:wp('2%')}]}>{'Processed Qty'}</Text>
        </View>

      </View>  

      <View style={{alignItems:'center',width:hp('90%'),alignSelf:'center',marginBottom:hp('35%')}}>
        <FlatList
          data={props.itemsArray.styleresponselist}
          renderItem={renderItem}
          keyExtractor={(item, index) => "" + index}
          showsVerticalScrollIndicator = {false}
        />
      </View>

      {props.isPopUp ? <View style={CommonStyles.customPopUpStyle}>
        <AlertComponent
          header = {props.popUpAlert}
          message={props.popUpMessage}
          isLeftBtnEnable = {props.isPopLeft}
          isRightBtnEnable = {true}
          leftBtnTilte = {'NO'}
          rightBtnTilte = {props.popUpRBtnTitle}
          popUpRightBtnAction = {() => popOkBtnAction()}
          popUpLeftBtnAction = {() => popCancelBtnAction()}
        />
      </View> : null}

      {props.isLoading === true ? <LoaderComponent isLoader={true} loaderText = {Constant.LOADER_MESSAGE } isButtonEnable = {false} /> : null} 

    </View>
  );
}
  
  export default ViewProcessFlowUI;