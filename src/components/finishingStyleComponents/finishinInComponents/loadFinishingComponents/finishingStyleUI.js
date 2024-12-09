import React, { useState, useEffect, useRef } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,FlatList,TextInput,Image, RefreshControl, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "../../../../utils/constants/constant";
import CommonStyles from "../../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../../utils/commonComponents/headerComponent';
import fonts from '../../../../utils/commonStyles/fonts';
import LoaderComponent from '../../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../../utils/commonComponents/alertComponent';

let searchImg = require('./../../../../../assets/images/png/searchIcon.png');

const FinishingStyleUI = ({route, ...props }) => {

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

      let nestedFilter = props.itemsArray;
      const styleArray = nestedFilter.filter(style => (style.styleno.toString().toUpperCase().includes(recName.toUpperCase()) || style.color.toUpperCase().includes(recName.toUpperCase()) || style.wono.toString().toUpperCase().includes(recName.toUpperCase())));

      if(styleArray && styleArray.length > 0) {
        set_filterArray(styleArray);
      } else {
        set_filterArray([]);
      }
    }
  };

  // const renderItem = ({ item, index }) => {
  //   return (
  //     <TouchableOpacity onPress={() => actionOnRow(item,index)} style={CommonStyles.cellBackViewStyle}>

  //       <View style={{flexDirection :'row', justifyContent:'space-between', alignItems:'center'}}>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1.5,textAlign:'left'}]}>{item.styleno}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center'}]}>{item.color}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'center'}]}>{item.wono}</Text>
  //         <Text style={[CommonStyles.tylesTextStyle,{flex:1.2,textAlign:'right',marginRight:wp('2%')}]}>{item.totalQty}<Text style={[CommonStyles.tylesTextStyle,{flex:1.5,textAlign:'right',marginRight:wp('2%')}]}>{'/'+item.finishingInQty}</Text></Text>
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
              {item.styleno}
            </Text>

            <Text style={CommonStyles.tylesTextStyle}>
              {item.color} {' '}
              <Text style={{ fontWeight: 'bold' }}> (</Text>
              <Text style={{ fontWeight: '600' }}>{item.wono}</Text>
              <Text style={{ fontWeight: 'bold' }}> )</Text>
            </Text>
          </View>

          <View style={{ width: 25 }} />
          <View style={{ flex: 1 }}>
            <Text style={CommonStyles.tylesTextStyle}>
            {item.totalQty}<Text style={[CommonStyles.tylesTextStyle,{flex:1.5,textAlign:'right',marginRight:wp('2%')}]}>{'/'+item.finishingInQty}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity> 
    );
  };

  const fetchMore=()=>{
    props.fetchMore(true);
  }

  const onRefresh = () => {
    set_refreshing(true);
    props.fetchMore(false); 
    set_refreshing(false);
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

         <View style={CommonStyles.searchBarStyle}>
                              
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
          
        </View> 

        { props.itemsArray && props.itemsArray.length > 0 ? <View style={CommonStyles.listCommonHeader1}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'left'}]}>{'Style Details'}</Text>
          {/* <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Color'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'WO'}</Text> */}
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.2,textAlign:'right',marginRight:wp('2%'),}]}>{'TQty/Fin.Qty'}</Text>
        </View> :<View style = {CommonStyles.noRecordsFoundStyle}>
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
  
  export default FinishingStyleUI;