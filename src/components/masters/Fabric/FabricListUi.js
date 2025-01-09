import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, TextInput, ActivityIndicator, RefreshControl, Button } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import * as Constant from "../../../utils/constants/constant";
import FilterModal from '../../../utils/commonComponents/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorContext } from '../../colorTheme/colorTheme';
import AddNewItem from '../../../utils/commonComponents/AddNewItem';
let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let exampleImage = require('./../../../../assets/images/png/img4.jpg');
let filterImg = require('./../../../../assets/images/png/setting.png');

const FabricListUi = ({ route, ...props }) => {

  const { colors } = useContext(ColorContext);


  const [filterArray, set_filterArray] = useState([]);
  const [recName, set_recName] = useState('');
  const isKeyboard = useRef(false);
  const [refreshing, set_refreshing] = useState(false);
  const [ItemsArray, set_ItemsArray] = useState([]);
  const [showFilteredList, set_showFilteredList] = useState(false);
  const [filterCount, set_filterCount] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false); 
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filterReqBody, setfilterReqBody] = useState({}); 


  const [categories, set_categories]=useState([
    { id: "designType", fid: "designType", value: "Design Type" , idxId:"designTypeId"},
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
  let Obj=  {
    "approvedStatus": 1,
    "menuId": 728,
    "designId": 24,
    "userName": userName,
    "userPwd": userPsd,
    "compIds": usercompanyId,
    "company":JSON.parse(companyObj),
    "categoryIds": "",
    "categoryType": "",
}

setfilterReqBody(Obj)
};

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };


  // const filterPets = (recName) => {

  //   if (isKeyboard.current === true) {

  //     set_recName(recName)
  //     let nestedFilter = props.itemsArray;
  //     const styleArray = nestedFilter.filter(style =>
  //       style.designName?.toUpperCase().includes(recName.toUpperCase()) ||
  //       style.designType?.toUpperCase().includes(recName.toUpperCase())
  //     );

  //     if (styleArray && styleArray.length > 0) {
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

      // const styleArray = ItemsArray.filter(style => (style.styleno.toString().toUpperCase().includes(name.toUpperCase()) || style.color.toUpperCase().includes(name.toUpperCase()) || style.wono.toString().toUpperCase().includes(name.toUpperCase())));
        const styleArray = ItemsArray.filter(style =>
              style.designName?.toUpperCase().includes(name.toUpperCase()) ||
              style.designType?.toUpperCase().includes(name.toUpperCase())
            );
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
  };


  const clearFilter=()=>{
    onRefresh();
  }
  const handleNavigation=()=>{
    props.handleNavigation();
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



  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => actionOnRow(item)} style={CommonStyles.cellBackViewStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center', flex: 1 }]}>{item.designName}</Text>
        <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center', flex: 1 }]}>{item.designType}</Text>
        <View style={{ flex: 1.2 }}>
          <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center', flex: 1 }]}>{item.approveBy}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center', flex: 1 }]}>{item.approvedate}</Text>
        </View>
        <Image source={{ uri: `data:image/png;base64,${item.designImg}` }} style={[styles.imageStyle, { flex: 1.3 }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={CommonStyles.mainComponentViewStyle}>
      <View style={CommonStyles.headerView}>
        <HeaderComponent
          isBackBtnEnable={true}
          isTitleHeaderEnable={true}
          title="Masters Fabric List"
          backBtnAction={backBtnAction}
        />
      </View>

      <View style={CommonStyles.headerStyle}>

       
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
                      style={{ height: 25, width: 25, tintColor: showFilteredList ? colors.color2 : '#7F7F81', marginRight: 10 }}
                    />
                    {
                      filterCount ?
                      <Text style={{ color: '#7F7F81', fontSize: 14, backgroundColor:colors.color2, borderRadius:30,color:'#fff', padding:5 }}>{filterCount}</Text> :
                      <Text style={{ color: '#7F7F81', fontSize: 14 }}>{"Filter"}</Text> 
                    }
                    
                    
                  </TouchableOpacity>
                
                </View>
                
                
       


       { filterArray && filterArray.length > 0 ? <View style={CommonStyles.listCommonHeader}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center', flex: 1 }]}>Design   Name</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center', flex: 1 }]}>Design     Type</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center', flex: 1 }]}>Approved By &  Date</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center', flex: 1.3 }]}>Design Image</Text>
        </View> : <View style = {CommonStyles.noRecordsFoundStyle}>
            {!props.MainLoading ? <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>{Constant.noRecFound}</Text> : null}
        </View>}

        <Button
         onPress={handleNavigation}
         title="Fabric Edit"
         color="#841584"
          accessibilityLabel="Learn more about this purple button"
              />

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
        selectedCategoryListAPI={'getSelectedCategoryList_DDA'}
        onClose={() => setFilterVisible(false)}
        applyFilterFxn={applyFilterFxn}
        clearFilter={clearFilter}
        reqBody={filterReqBody}
      />

      <AddNewItem  navItem={'CreateFabricComponent'}/>

      {props.isPopUp ? <View style={CommonStyles.customPopUpStyle}>
        <AlertComponent
          header={props.popUpAlert}
          message={props.popUpMessage}
          isLeftBtnEnable={props.isPopLeft}
          isRightBtnEnable={true}
          leftBtnTilte="NO"
          rightBtnTilte={props.popUpRBtnTitle}
          popUpRightBtnAction={popOkBtnAction}
        />
      </View> : null}

      {props.MainLoading && <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} />}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    // borderWidth:1,
    // borderColor:'#000'
  },
  noDataView: {
    marginTop: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // Background color of the buttons container
  },
  navButton: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    backgroundColor: '#1F74BA', 
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight:'bold'
  },
});

export default FabricListUi;

