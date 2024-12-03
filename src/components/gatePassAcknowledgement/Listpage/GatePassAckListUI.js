import React, { useState, useRef } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,FlatList,Image,TextInput} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "./../../../utils/constants/constant";
import CommonStyles from "./../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');

const GatePassAckListUI = ({route, ...props }) => {

  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState(undefined);
  let isKeyboard = useRef(false);

  React.useEffect(() => {

    if(props.itemsArray){
      set_filterArray(props.itemsArray);
    }
    // console.log("itemsArray from Props ==> ", props?.itemsArray)
  }, [props.itemsArray]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item,index) => {
    props.actionOnRow(item,index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const filterPets = (recName) => {

    if(isKeyboard.current === true) {
      
      set_recName(recName);
      let nestedFilter = props.itemsArray;
      const styleArray = nestedFilter.filter(style => (style?.docno.toUpperCase().includes(recName.toUpperCase()) || style?.vendorname.toUpperCase().includes(recName.toUpperCase()) ));

      if(styleArray && styleArray.length > 0) {
        set_filterArray(styleArray);
      } else {
        set_filterArray([]);
      }
    }
  };

  const handleScan=()=>{
    console.log("SCan clicked")
  }


  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => actionOnRow(item, index)} style={CommonStyles.cellBackViewStyle}>
        <View style={{ flexDirection: 'row' }}>
            <Text style={[CommonStyles.tylesTextStyle, {  flex:1 ,textAlign:'left'}]}>
            {item.docno}
            </Text>             
            <Text style={[CommonStyles.tylesTextStyle, {  flex:1,textAlign:'center'  }]}>
            {item.docdatestr}
            </Text>             
            <Text style={[CommonStyles.tylesTextStyle, { flex:1,textAlign:'center'  }]}>
            {item.vendorname}
            </Text>             
            <Text style={[CommonStyles.tylesTextStyle, {  flex:1,textAlign:'center'  }]}>
            {item.isAcknowledgement === 1 ? "Delivered" : "Open"}
            </Text>     
            {/* <TouchableOpacity onPress={() => handleScan(item)} style={{flex:1, alignItems:'center'}}>
                <Image
                  source={require('././../../../../assets/images/png/pdf.png')}
                  style={{height: 20, width: 20}}
                />
            </TouchableOpacity>                    */}
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
          title={'Gate Pass Acknowledgement'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

        <View style={CommonStyles.searchBarStyle}>
                              
          <View style={[CommonStyles.searchInputContainerStyle]}>
            <Image source={searchImg} style={CommonStyles.searchImageStyle} />
              <TextInput style={CommonStyles.searchTextInputStyle}
                underlineColorAndroid="transparent"
                placeholder="Search "
                placeholderTextColor="#7F7F81"
                autoCapitalize="none"
                value = {recName}
                onFocus={ () => isKeyboard.current = true }
                onChangeText={(name) => {filterPets(name)}}
              />
          </View> 
          
        </View> 

        {/* {filterArray && filterArray.length > 0 ? <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'left'}]}>{'Style'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'center',}]}>{'Color'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'WO'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.2,textAlign:'center',}]}>{'Total qty'}</Text>
        </View>: null} */}

        {filterArray && filterArray.length > 0 ? 
        <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'Document No'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Document date'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Vendor/Customer'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{textAlign:'center', flex:1}]}>{'Status'}</Text>
          {/* <Text style={[CommonStyles.tylesHeaderTextStyle,{textAlign:'center', flex:1}]}>{'Actions'}</Text> */}
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
            {!props.isLoading ? <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>{Constant.noRecFound}</Text> : null}
        </View>}
       
        <View style={CommonStyles.listStyle}>
          <FlatList
            data={filterArray}
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
  
  export default GatePassAckListUI;
