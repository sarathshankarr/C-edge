import React, { useState, useRef } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,FlatList,Image,TextInput, RefreshControl, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import * as Constant from "../../../utils/constants/constant";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import FilterModal from '../../../utils/commonComponents/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let filterImg = require('./../../../../assets/images/png/setting.png');

const StyleLocationInventoryUI = ({route, ...props }) => {

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
    { id: "styleNames", fid:"styleNo" ,value: "Style " , idxId:"styleId"},
    { id: "colorNames", fid: "color", value: "Color" , idxId:"colorId"},
    { id: "locationName",fid: "locationName", value: "Location" , idxId:"locationId"},
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
    let Obj={
      "menuId": 93,
      "searchKeyValue": "",
      "styleSearchDropdown": "-1",
      "dataFilter": "0",
      "locIds": 0,
      "brandIds": 0,
      "compIds": 0,
      "fromRecord": 0, 
      "toRecord": 25, 
      "userName":userName,  
      "userPwd":userPsd,   
      "categoryType" : "",
      "categoryIds" : ""
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

  // const filterPets = (name) => {

  //   if(isKeyboard.current === true) {
      
  //     set_recName(name);
  //     const styleArray = ItemsArray.filter(style => (style.locationName.toUpperCase().includes(name.toUpperCase()) || style.color.toUpperCase().includes(name.toUpperCase()) || style.styleNo.toUpperCase().includes(name.toUpperCase())));

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

      const styleArray = ItemsArray.filter(style => (style.locationName.toUpperCase().includes(name.toUpperCase()) || style.size.toUpperCase().includes(name.toUpperCase())|| style.color.toUpperCase().includes(name.toUpperCase()) || style.styleNo.toUpperCase().includes(name.toUpperCase())));

      if(styleArray && styleArray.length > 0) {
        set_filterArray(styleArray);
      } else {
        set_filterArray([]);
      }
    
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
    set_recName('');

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

  
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => actionOnRow(item, index)} style={CommonStyles.cellBackViewStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 3 }}>
            <Text style={[CommonStyles.tylesTextStyle, { fontWeight:'500', fontSize: 15 }]}>
            {item.locationName}
            </Text>

            <Text style={CommonStyles.tylesTextStyle}>
             {item.styleNo} {' '}
              <Text style={{ fontWeight: 'bold' }}> (</Text>
              <Text style={{ fontWeight: '600' }}>{item.color}</Text>
              <Text style={{ fontWeight: 'bold' }}> )</Text>
            </Text>
          </View>

          <View style={{ width:30 }} />
          <View style={{ flex: 1 }}>
            <Text style={CommonStyles.tylesTextStyle}>
            {item.size}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign:'center'}]}>
            {item.availQty}
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
          title={'Location Wise Style Inventory'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle}>

        {/* {props.itemsArray && props.itemsArray.length > 0 ? <View style={CommonStyles.searchBarStyle}>
                              
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
          
        </View> : null} */}
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
      style={{ flex: 1, color: '#000' }}
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



        {filterArray && filterArray.length > 0 ? <View style={CommonStyles.listCommonHeader}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:3,textAlign:'left'}]}>{'Style Details'}</Text>
          {/* <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'Color'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'center',}]}>{'WO'}</Text> */}
          <View style={{ width:30 }} />
          <Text style={[CommonStyles.tylesHeaderTextStyle,{textAlign:'left', flex:1}]}>{'Size'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{textAlign:'center', flex:1}]}>{'Available Qty'}</Text>
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
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
        <View style={{height:450}}/>
      </View>  

      <View style={styles.container}>
      {/* <Button title="Open Filter"  /> */}
      <FilterModal
        isVisible={isFilterVisible}
        categoriesList={categories}
        selectedCategoryListAPI={'getSelectedCategoryList_LocationwiseStyleInv'}
        onClose={() => setFilterVisible(false)}
        applyFilterFxn={applyFilterFxn}
        clearFilter={clearFilter}
        reqBody={filterReqBody}

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

      {props.MainLoading === true ? <LoaderComponent isLoader={true} loaderText = {Constant.LOADER_MESSAGE } isButtonEnable = {false} /> : null} 

    </View>
  );
}
  
  export default StyleLocationInventoryUI;

  
  const styles = StyleSheet.create({

    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })