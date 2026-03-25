import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import * as Constant from "../../../utils/constants/constant";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterModal from '../../../utils/commonComponents/FilterModal';
import AddNewItem from '../../../utils/commonComponents/AddNewItem';
import Svg, { Path, Circle } from 'react-native-svg';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let filterImg = require('./../../../../assets/images/png/setting.png');

const StockIssueListUI = ({ route, ...props }) => {

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



  React.useEffect(() => {

    if (props.itemsArray) {
      set_filterArray(props.itemsArray);
      set_ItemsArray(props.itemsArray);
    }
    // getRequestBody();

  }, [props.itemsArray]);

  // const getRequestBody = async() => {
  //   let userName = await AsyncStorage.getItem('userName');
  //   let userPsd = await AsyncStorage.getItem('userPsd');
  //   let usercompanyId = await AsyncStorage.getItem('companyId');
  //   let companyObj = await AsyncStorage.getItem('companyObj');
  //   let Obj={
  //     "username":userName,
  //     "password":userPsd,
  //     "categoryType":"",
  //     "categoryIds" : "",
  //     "compIds": usercompanyId,
  //     "company":JSON.parse(companyObj),

  // }
  // setfilterReqBody(Obj)
  // };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item, index) => {
    // props.actionOnRow(item, index);
    return;
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const filterPets = (name) => {
    const searchTerm = name.toString().toLowerCase().trim();
    set_recName(name);
    if (searchTerm.length === 0) {
      set_filterArray(ItemsArray);
      setIsFiltering(false);
      return;
    }
    setIsFiltering(true);

    const styleArray = ItemsArray.filter(item =>
      item.g_id?.toString().toUpperCase().includes(name.toUpperCase()) ||
      item.location?.toString().toUpperCase().includes(name.toUpperCase()) ||
      item.referenceDate?.toUpperCase().includes(name.toUpperCase())
    );
    if (styleArray && styleArray.length > 0) {
      set_filterArray(styleArray);
    } else {
      set_filterArray([]);
    }

  };

  const renderItem = ({ item, index }) => {

    return (

      <TouchableOpacity onPress={() => actionOnRow(item, index)} style={CommonStyles.cellBackViewStyle}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 0.4, textAlign: 'left' }]}>{item.g_id}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.location}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.referenceDate}</Text>
          <View style={{
            flexDirection: 'row',
            rowGap: 10,

          }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.button, { backgroundColor: item.status === 1 ? '#2979ff' : '#4caf50' }]}
              onPress={() => handleActions(item)}
            >
              {item.status===1 ? <Svg
                width={17}
                height={17}
                viewBox="0 0 24 24"
                fill="none"
              >
                {/* Eye shape */}
                <Path
                  d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Pupil */}
                <Circle
                  cx={12}
                  cy={12}
                  r={3}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </Svg> :
              <Svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Checkmark */}
        <Path
          d="M5 12L10 17L19 7"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => downloadPDF(item, 'OUT')}
            >
              <Image
                source={require('./../../../../assets/images/png/pdf2.png')}
                style={{ width: 32, height: 32, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
          {/* <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.requestedQty}/{item.approvedQty}</Text> */}
        </View>

      </TouchableOpacity>

    );
  };

  const fetchMore = () => {
    if (!isFiltering) {
      props.fetchMore(true);
    }
  }

  handleActions = (item) => {
    props.actionOnRow(item);
  }

  const downloadPDF = (item) => {
      props.downloadStockIssuePDF(item);
  };

  const applyFilterFxn = (types, Ids, count) => {
    console.log("applyFilterFxn", types, Ids);
    props.applyFilterFxn(types, Ids);
    set_filterCount(count)
    set_showFilteredList(true);
    setFilterVisible(false);
  };


  const clearFilter = () => {
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
          title={'Stock Issue List'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>

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
                  { flex: 1, color: '#000' },
                  Platform.OS === 'ios' && { paddingVertical: 12 }, // Apply padding only for iOS
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

          </View>


        ) : null}

        {filterArray && filterArray.length > 0 ? <View style={CommonStyles.listCommonHeader}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 0.5, textAlign: 'left' }]}>{'SId'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Location'}</Text>
          {/* <View style={{ flex: 1 }}> */}
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Creation Date'}</Text>
          {/* <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Received Date'}</Text> */}
          {/* </View> */}
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Action'}</Text>
        </View> : <View style={CommonStyles.noRecordsFoundStyle}>
          {!props.MainLoading ? <Text style={[CommonStyles.tylesHeaderTextStyle, { fontSize: 18 }]}>{Constant.noRecFound}</Text> : null}
        </View>}

        <View style={CommonStyles.listStyle}>
          {showFilteredList ?
            (<FlatList
              data={filterArray}
              renderItem={renderItem}
              keyExtractor={(item, index) => "" + index}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />) :
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

      {/* <FilterModal
        isVisible={isFilterVisible}
        categoriesList={categories}
        selectedCategoryListAPI={'getSelectedCategoryList_StockRecieve'}
        onClose={() => setFilterVisible(false)}
        applyFilterFxn={applyFilterFxn}
        clearFilter={clearFilter}
        reqBody={filterReqBody}

      /> */}

      <AddNewItem navItem={'CreateStockIssue'} />

      {props.isPopUp ? <View style={CommonStyles.customPopUpStyle}>
        <AlertComponent
          header={props.popUpAlert}
          message={props.popUpMessage}
          isLeftBtnEnable={props.isPopLeft}
          isRightBtnEnable={true}
          leftBtnTilte={'NO'}
          rightBtnTilte={props.popUpRBtnTitle}
          popUpRightBtnAction={() => popOkBtnAction()}
          popUpLeftBtnAction={() => popCancelBtnAction()}
        />
      </View> : null}

      {props.MainLoading === true ? <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} /> : null}

    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height:32,
    borderRadius: 21,
    backgroundColor: '#2979ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2979ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
});
export default StockIssueListUI;