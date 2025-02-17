import React, { useState, useRef } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,FlatList,Image,TextInput, RefreshControl, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "./../../../utils/constants/constant";
import CommonStyles from "./../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';
import FilterModal from '../../../utils/commonComponents/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let filterImg = require('./../../../../assets/images/png/setting.png');

const StichingOutUI = ({route, ...props }) => {

  const [isListOpen, set_ListOpen] = useState(false);
  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState(undefined);
  let isKeyboard = useRef(false);
  const [refreshing, set_refreshing] = useState(false);

  const [ItemsArray, set_ItemsArray] = useState([]);
  const [showFilteredList, set_showFilteredList] = useState(false);
  const [filterCount, set_filterCount] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false); 
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filterReqBody, setfilterReqBody] = useState({}); 


  const [categories, set_categories]=useState([
    { id: "stylesName", fid: "styleno", value: "Style No" , idxId:"styleId"},
    { id: "colorsNames",fid: "color", value: " Color" , idxId:"colorid"},
    // { id: "workordernumber",fid: "wono", value: " W.O No" , idxId:"wono"},
  ]);

  React.useEffect(() => {

    if(props.itemsArray){
      set_filterArray(props.itemsArray);
      set_ItemsArray(props.itemsArray);

    }
    getRequestBody();

    
  }, [props.itemsArray]);

  const getRequestBody = async() => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let Obj=   {
      "menuId": 12,
      "categoryIds": "",
      "categoryType": "",
      "dataFilter": "60Days",
      "locIds": 0,
      "brandIds": 0,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
     "fromRecord": 0,
      "toRecord": 25,
      "username": userName,
      "password" : userPsd
  }

  setfilterReqBody(Obj)
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item,index) => {
    props.actionOnRow(item,index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  // const filterPets = (recName) => {

  //   if(isKeyboard.current === true) {
  //     set_recName(recName)
  //     if(recName && recName.length > 0) {
  //       set_ListOpen(true);
  //     } else {
  //       set_ListOpen(false);
  //     }

  //     let nestedFilter = props.itemsArray;
  //     const styleArray = nestedFilter.filter(style => (style.styleno.toString().toUpperCase().includes(recName.toUpperCase()) || style.color.toUpperCase().includes(recName.toUpperCase()) || style.wono.toUpperCase().includes(recName.toUpperCase())));

  //     if(styleArray && styleArray.length > 0) {
  //       set_filterArray(styleArray);
  //     } else {
  //       set_filterArray([]);
  //     }
  //   }
  // };

  const filterPets = (name) => {
    const searchTerm = name.toString().toLowerCase().trim(); 
    set_recName(name); 
   if(searchTerm.length===0){
     set_filterArray(ItemsArray);
     setIsFiltering(false);
     return;
   }
   setIsFiltering(true); 
      const styleArray = ItemsArray.filter(style => (style.styleno.toString().toUpperCase().includes(name.toUpperCase()) || style.color.toUpperCase().includes(name.toUpperCase()) || style.wono.toUpperCase().includes(name.toUpperCase())));
      if(styleArray && styleArray.length > 0) {
        set_filterArray(styleArray);
      } else {
        set_filterArray([]);
      }
    
  };



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
            {item.receivedStitchOutQty+"/"}<Text style={[CommonStyles.tylesTextStyle,{flex:1,textAlign:'right'}]}>{item.stitchQty}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity> 
    );
  };

  const fetchMore=()=>{
    if (!isFiltering) { 
      props.fetchMore(true);
    }
  }

  const applyFilterFxn = (types, Ids, count) => {
    console.log("applyFilterFxn", types, Ids);
    props.applyFilterFxn(types, Ids);
    set_filterCount(count)
    set_showFilteredList(true);
    setFilterVisible(false);
  };


  const clearFilter=()=>{
    onRefresh();
  }

  const onRefresh = () => {
    set_refreshing(true);
    props.fetchMore(false); 
    set_refreshing(false);
    set_filterCount(0);
    set_recName('');
    set_showFilteredList(false);
    setFilterVisible(false);
    setIsFiltering(false);
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
          title={'Stitching Out'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

         {/* <View style={CommonStyles.searchBarStyle}>
                              
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
          
        </View>  */}
          {filterArray ? (
        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 10, alignItems: 'center' }}>
  {/* Search Bar */}
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1, // Allows the search bar to take up available space
      borderWidth: 1,
      borderColor: '#D1D1D1',
      borderRadius: 20,
      backgroundColor: '#F9F9F9',
      paddingHorizontal: 15,
      // paddingVertical: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}
  >
    <Image
      source={searchImg}
      style={{ height: 18, width: 18, tintColor: '#7F7F81', marginRight: 10 }}
    />
    <TextInput
    style={[
      {flex: 1, color: '#000' },
      Platform.OS === 'ios' && {paddingVertical: 12}, // Apply padding only for iOS
    ]}
      underlineColorAndroid="transparent"
      placeholder="Search"
      placeholderTextColor="#A0A0A0"
      autoCapitalize="none"
      value={recName}
      onFocus={() => (isKeyboard.current = true)}
      onChangeText={filterPets}
    />
  </View>

  {/* Filter Button */}
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#D1D1D1',
      borderRadius: 20,
      backgroundColor: '#F9F9F9',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}
    onPress={() => {
      set_showFilteredList(true);
      setFilterVisible(!isFilterVisible);
    }}
  >
    <Image
      source={filterImg}
      style={{ height: 25, width: 25, tintColor: showFilteredList ? color.color2 : '#7F7F81', marginRight: 10 }}
    />
    {
      filterCount ?
      <Text style={{ color: '#7F7F81', fontSize: 14, backgroundColor:color.color2, borderRadius:30,color:'#fff', padding:5 }}>{filterCount}</Text> :
      <Text style={{ color: '#7F7F81', fontSize: 14 }}>{"Filter"}</Text> 
    }
    
    
  </TouchableOpacity>

       </View>


        ) : null}
{/* 
        {filterArray && filterArray.length > 0 ? <View style={{flexDirection :'row', justifyContent:'space-between'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.5,textAlign:'left'}]}>{'Style Details'}</Text>
           <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Color'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'WO'}</Text> 
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1.2,textAlign:'right',}]}>{'Total qty'}</Text>
        </View>: null}
         */}

        {filterArray && filterArray.length > 0 ? <View style={CommonStyles.listCommonHeader1}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:3,textAlign:'left'}]}>{'Style Details'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1}]}>{'Total Qty'}</Text>
        </View>: <View style = {CommonStyles.noRecordsFoundStyle}>
            {!props.MainLoading ? <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>{Constant.noRecFound}</Text> : null}
        </View>}

        <View style={CommonStyles.listStyle}>
        {showFilteredList ?
        (<FlatList
            data={filterArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => "" + index}
            showsVerticalScrollIndicator = {false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />):
            (<FlatList
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
            />)}
        </View>
      </View> 

       <FilterModal
        isVisible={isFilterVisible}
        categoriesList={categories}
        selectedCategoryListAPI={'getSelectedCategoryList_stichingout'}
        onClose={() => setFilterVisible(false)}
        applyFilterFxn={applyFilterFxn}
        clearFilter={clearFilter}
        reqBody={filterReqBody}
      /> 

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
  
  export default StichingOutUI;