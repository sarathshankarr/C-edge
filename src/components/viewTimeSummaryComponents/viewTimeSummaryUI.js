import React, { useState, useEffect } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,FlatList,ImageBackground} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import CommonStyles from "./../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import fonts from '../../utils/commonStyles/fonts';
import LoaderComponent from './../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../utils/commonComponents/alertComponent';
import * as Constant from "./../../utils/constants/constant";

let shirt3 = require('./../../../assets/images/png/shirt3.jpeg');

const ViewTimeSummaryUI = ({route, ...props }) => {

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item,index) => {
    props.actionOnRow(item,index);
  };

  const renderItem = ({ item, index }) => {

    return (

      <TouchableOpacity onPress={() => actionOnRow(item,index)} style={CommonStyles.cellBackViewStyle}>

        <View style={{flexDirection :'row', justifyContent:'space-between', alignItems:'center'}}>
          <Text style={[styles.tylesTextStyle,{flex:1,textAlign:'left'}]}>{item.processName}</Text>
          <Text style={[styles.tylesTextStyle,{flex:1.5,textAlign:'center'}]}>{item.plannedEndDate}</Text>
          <Text style={[styles.tylesTextStyle,{flex:1.5,textAlign:'center'}]}>{item.plannedStartDate}</Text>
          <Text style={[styles.tylesTextStyle,{flex:1.5,textAlign:'center'}]}>{item.actualStartDate}</Text>
          <Text style={[styles.tylesTextStyle,{flex:1.5,textAlign:'right',marginRight:wp('2%')}]}>{item.actualEndDate}</Text>
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
          title={'Style List'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

        {/* <View style = {[CommonStyles.topViewStyle]}>
          <View style = {CommonStyles.topSubViewStyle}>
            {props.itemObj ? <ImageBackground borderRadius={100} style={[CommonStyles.imgStyle]} source={props.itemObj.img}></ImageBackground> : null}
            <ImageBackground borderRadius={100} style={[CommonStyles.imgStyle]} source={shirt3}></ImageBackground>
          </View>
        </View> */}

        <View style={styles.listStyle}>
          <View style={{flexDirection :'row', justifyContent:'space-between'}}>
            <Text style={[styles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'Process'}</Text>
            <Text style={[styles.tylesHeaderTextStyle,{flex:1.5,textAlign:'center',}]}>{'Start Date'}</Text>
            <Text style={[styles.tylesHeaderTextStyle,{flex:1.5,textAlign:'center',}]}>{'End Date'}</Text>
            <Text style={[styles.tylesHeaderTextStyle,{flex:1.5,textAlign:'center',}]}>{'Actual Start Date'}</Text>
            <Text style={[styles.tylesHeaderTextStyle,{flex:1.5,textAlign:'center',}]}>{'Actual End Date'}</Text>
          </View>
          <FlatList
            data={props.itemsArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => "" + index}
            showsVerticalScrollIndicator = {false}
          />
        </View>
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
  
  export default ViewTimeSummaryUI;

  const styles = StyleSheet.create({

    listStyle : {
      width:wp('90%'),
      height:hp('62%'),
      // backgroundColor:'white',
      marginTop: hp("2%"),
    },

    tylesTextStyle : {
      fontSize : fonts.fontSmall,
      fontWeight : '400',
      margin:2,
      color:'black'
    },

    tylesHeaderTextStyle : {
      fontSize : fonts.fontSmall,
      fontWeight : '700',
      color:'black'
    },

  });