import React, { useState, useRef } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,FlatList,Image,TextInput} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "./../../utils/constants/constant";
import CommonStyles from "./../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../utils/commonComponents/alertComponent';

let searchImg = require('./../../../assets/images/png/searchIcon.png');

const BundlingUI = ({route, ...props }) => {

  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState(undefined);
  let isKeyboard = useRef(false);

  React.useEffect(() => {
    if(props.itemsArray){
      set_filterArray(props.itemsArray);
    }
    
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
      
      let newData = props.itemsArray.filter(function(item) {
        let itemData = item ? item.color.toUpperCase() : "".toUpperCase();
        const textData = recName.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
          
      console.log('Filter ', newData);

      if(newData && newData.length > 0) {
        set_filterArray(newData);
      } else {
        set_filterArray([]);
      }
    }
  };

  const renderItem = ({ item, index }) => {

    return (

      <TouchableOpacity onPress={() => actionOnRow(item,index)} style={CommonStyles.cellBackViewStyle}>

        <View style={{flexDirection :'row', justifyContent:'space-between', alignItems:'center'}}>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'left'}]}>{item.styleNo}</Text>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center'}]}>{item.color}</Text>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center'}]}>{item.wNo}</Text>
          <Text style={[CommonStyles.tylesTextStyle,{flex:1.5,textAlign:'right'}]}>{item.styleStatus}</Text>
          
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
          title={'Bundling'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

        {props.itemsArray && props.itemsArray.length > 20 ? <View style={CommonStyles.searchBarStyle}>
                              
          <View style={[CommonStyles.searchInputContainerStyle]}>
            <Image source={searchImg} style={CommonStyles.searchImageStyle} />
              <TextInput style={CommonStyles.searchTextInputStyle}
                underlineColorAndroid="transparent"
                placeholder="Search by Color"
                placeholderTextColor="#7F7F81"
                autoCapitalize="none"
                value = {recName}
                onFocus={ () => isKeyboard.current = true }
                onChangeText={(name) => {filterPets(name)}}
              />
          </View> 
          
        </View> : null}

        {filterArray && filterArray.length > 0 ? <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'Style'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Color'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'WO'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'right',}]}>{'Status'}</Text>
        </View>: null}

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
  
  export default BundlingUI;