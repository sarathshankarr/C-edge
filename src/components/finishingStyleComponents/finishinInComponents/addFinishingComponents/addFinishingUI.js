import React, { useState, useEffect } from 'react';
import {View,TouchableOpacity,Text,FlatList} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "../../../../utils/constants/constant";
import CommonStyles from "../../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../../utils/commonComponents/headerComponent';
import fonts from '../../../../utils/commonStyles/fonts';
import LoaderComponent from '../../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../../utils/commonComponents/alertComponent';

const AddFinishingUI = ({route, ...props }) => {

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item,index) => {
    props.actionOnRow(item,index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  // const renderItem = ({ item, index }) => {
  //   return (
  //     <TouchableOpacity onPress={() => actionOnRow(item,index)} style={CommonStyles.cellBackViewStyle}>
  //       <View style={{flexDirection :'row', justifyContent:'space-between', alignItems:'center'}}>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'left'}]}>{item.styleName}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1.5,textAlign:'center'}]}>{item.color}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1.5,textAlign:'center'}]}>{item.wo}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1.5,textAlign:'right',marginRight:wp('2%')}]}>{item.location}</Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => actionOnRow(item, index)} style={CommonStyles.cellBackViewStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 3 }}>
            <Text style={[CommonStyles.tylesTextStyle, { fontWeight:'500', fontSize: 15 }]}>
              {item.styleName}
            </Text>

            <Text style={CommonStyles.tylesTextStyle}>
              {item.color} {' '}
              <Text style={{ fontWeight: 'bold' }}> (</Text>
              <Text style={{ fontWeight: '600' }}>{item.wo}</Text>
              <Text style={{ fontWeight: 'bold' }}> )</Text>
            </Text>
          </View>
          <View style={{ width: 25 }} />
          <View style={{ flex: 1 }}>
            <Text style={CommonStyles.tylesTextStyle}>
              {item.location}
            </Text>
          </View>
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
          title={'Finishing In'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

        {/* {!props.isLoading && props.itemsArray && props.itemsArray.length > 0 ? <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'Style'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Color'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'center',}]}>{'WO'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'right',marginRight:wp('2%'),}]}>{'Location'}</Text>
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
            <Text style={[CommonStyles.tylesHeaderTextStyle]}>{Constant.noRecFound}</Text>
        </View>} */}
        {!props.isLoading && props.itemsArray && props.itemsArray.length > 0 ? <View style={{flexDirection :'row'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:3,textAlign:'left'}]}>{'Style Details'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1}]}>{'Location'}</Text>
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
            <Text style={[CommonStyles.tylesHeaderTextStyle]}>{Constant.noRecFound}</Text>
        </View>}

        <View style={CommonStyles.listStyle}>
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
  
  export default AddFinishingUI;