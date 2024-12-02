import React, { useState, useEffect } from 'react';
import {View,TouchableOpacity,Text,FlatList,ImageBackground} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "../../../utils/constants/constant";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';

const StyleSizeDetailsUI = ({route, ...props }) => {

  const [itemObj, set_itemObj] = useState(undefined)
  React.useEffect(() => {
    set_itemObj(props.itemObj.styleSizeDataResponseList)
  }, [props.itemObj]);

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
console.log('Item ',item)
    return (

      <TouchableOpacity onPress={() => actionOnRow(item,index)} style={CommonStyles.cellBackViewStyle}>

        <View style={[CommonStyles.cellBackViewStyle,{flexDirection :'row'}]}>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center'}]}>{item.size}</Text>
            <Text style={[CommonStyles.tylesTextStyle,{flex:2,textAlign:'center',}]}>{item.sizeQty}</Text>
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
          title={'Style Details'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

        {props.itemObj? <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'Style'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'center',}]}>{'Fabric'}</Text>
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
            <Text style={[CommonStyles.tylesHeaderTextStyle]}>{Constant.noRecFound}</Text>
        </View>}

        {props.itemObj ? <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{props.itemObj.styleName}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'center',}]}>{props.itemObj.fabricName}</Text>
        </View> : null}

        {props.itemObj && props.itemObj.styleSizeDataResponseList && props.itemObj.styleSizeDataResponseList.length > 0 ? <View style={CommonStyles.listStyle}>
          {<View style={{flexDirection :'row'}}>
            <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center'}]}>{'Size'}</Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:2,textAlign:'center',}]}>{'Quantity'}</Text>
            {/* <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'L'}</Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left',}]}>{'XL'}</Text> */}
          </View> }
          <FlatList
            data={itemObj}
            renderItem={renderItem}
            keyExtractor={(item, index) => "" + index}
            showsVerticalScrollIndicator = {false}
          />
        </View> : null}
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
  
  export default StyleSizeDetailsUI;