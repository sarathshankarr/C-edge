import React, { useState, useRef } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,FlatList,Image,TextInput, RefreshControl, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "./../../../utils/constants/constant";
import CommonStyles from "./../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');

const CuttingMainUI = ({route, ...props }) => {

  const [isListOpen, set_ListOpen] = useState(false);
  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState(undefined);
  let isKeyboard = useRef(false);
  const [refreshing, set_refreshing] = useState(false);


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
      set_recName(recName)
      if(recName && recName.length > 0) {
        set_ListOpen(true);
      } else {
        set_ListOpen(false);
      }
      
      // let newData = props.itemsArray.filter(function(item) {
      //   let itemData = item ? item.location.toUpperCase() : "".toUpperCase();
      //   const textData = recName.toUpperCase();
      //   return itemData.indexOf(textData) > -1;
      // });
          
      // console.log('Filter ', newData);

      let nestedFilter = props.itemsArray;
      const styleArray = nestedFilter.filter(style => (style.location.toUpperCase().includes(recName.toUpperCase()) || style.styleName.toUpperCase().includes(recName.toUpperCase()) || style.wo.toUpperCase().includes(recName.toUpperCase())));

      if(styleArray && styleArray.length > 0) {
        set_filterArray(styleArray);
      } else {
        set_filterArray([]);
      }
    }
  };

  const fetchMore=()=>{
    props.fetchMore(true);
  }

  const onRefresh = () => {
    set_refreshing(true);
    props.fetchMore(false); 
    set_refreshing(false);
  };

  // const renderItem = ({ item, index }) => {
  //   return (
  //     <TouchableOpacity onPress={() => actionOnRow(item,index)} style={CommonStyles.cellBackViewStyle}>

  //       <View style={{flexDirection :'row', justifyContent:'space-between', alignItems:'center'}}>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'left'}]}>{item.styleName}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center'}]}>{item.color}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center'}]}>{item.wo}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'right'}]}>{item.location}</Text>
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
              {item.color} {' '}{ item.wo?
               (<>
               <Text style={{ fontWeight: 'bold' }}> (</Text>
              <Text style={{ fontWeight: '600' }}>{item.wo}</Text>
              <Text style={{ fontWeight: 'bold' }}> )</Text>
               </>) :''
              }
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
          title={'Cutting Styles'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

        {props.itemsArray &&   <View style={CommonStyles.searchBarStyle}>
                              
          <View style={[CommonStyles.searchInputContainerStyle]}>
            <Image source={searchImg} style={CommonStyles.searchImageStyle} />
              <TextInput style={CommonStyles.searchTextInputStyle}
                underlineColorAndroid="transparent"
                placeholder="Search"
                placeholderTextColor="#7F7F81"
                autoCapitalize="none"
                value = {recName}
                onFocus={ () => isKeyboard.current = true }
                onChangeText={(name) => {filterPets(name)}}
              />
          </View> 
          
        </View>}
{/* 
        {filterArray && filterArray.length > 0 ? <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'Style'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Color'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'WO'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'right',}]}>{'Location'}</Text>
        </View>: null} */}
        {filterArray && filterArray.length > 0 ? <View style={CommonStyles.listCommonHeader1}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:3,textAlign:'left'}]}>{'Style Details'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1}]}>{'Location'}</Text>
        </View>: <View style = {CommonStyles.noRecordsFoundStyle}>
            {!props.MainLoading ? <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>{Constant.noRecFound}</Text> : null}
        </View>}

        <View style={CommonStyles.listStyle}>
          {/* <FlatList
            data={filterArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => "" + index}
            showsVerticalScrollIndicator = {false}
          /> */}
             <FlatList
              data={filterArray}
              renderItem={renderItem}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
              onEndReached={() => fetchMore()}
              onEndReachedThreshold={0.2}
              ListFooterComponent={() => props.isLoading && <ActivityIndicator size="large" />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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

      {props.MainLoading === true ? <LoaderComponent isLoader={true} loaderText = {Constant.LOADER_MESSAGE } isButtonEnable = {false} /> : null} 

    </View>
  );
}
  
  export default CuttingMainUI;