import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  TextInput,
  Alert,
  Button,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CommonStyles from '../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import * as Constant from '../../utils/constants/constant';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import FilterModal from '../../utils/commonComponents/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ColorContext} from '../colorTheme/colorTheme';
import AddNewItem from '../../utils/commonComponents/AddNewItem';
let searchImg = require('./../../../assets/images/png/searchIcon.png');
let addImg = require('./../../../assets/images/png/addition.png');
let addImg1 = require('./../../../assets/images/png/add.png');
let filterImg = require('./../../../assets/images/png/setting.png');
let filterImg1 = require('./../../../assets/images/png/filter.png');


const NewProcessInListUI = ({route, navigation, ...props}) => {
  const [isListOpen, set_ListOpen] = useState(false);
  const [refreshing, set_refreshing] = useState(false);
  const [filterArray, set_filterArray] = useState([]);
  const [ItemsArray, set_ItemsArray] = useState([]);
  const [recName, set_recName] = useState(undefined);
  const [showFilteredList, set_showFilteredList] = useState(false);
  const [filterCount, set_filterCount] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterReqBody, setfilterReqBody] = useState({});

  const {colors} = useContext(ColorContext);

  const [categories, set_categories] = useState([
    {id: 'batchNo', fid: 'batchname', value: 'Batch No', idxId: 'batchId'},
    {id: 'orderNo', fid: 'orderNo', value: 'Order No', idxId: 'orderId'},
    {
      id: 'designName',
      fid: 'designName',
      value: 'Design Name',
      idxId: 'designId',
    },
    {id: 'BrandName', fid: 'brandName', value: 'Brand Name', idxId: 'brandId'},
  ]);

  const [isFilterVisible, setFilterVisible] = useState(false);

  let isKeyboard = useRef(false);

  React.useEffect(() => {
    if (props.itemsArray) {
      set_filterArray(props.itemsArray);
      set_ItemsArray(props.itemsArray);
      console.log("answer ===> ", props.itemsArray)
    }
    // getRequestBody();

  }, [props?.itemsArray]);

  const getRequestBody = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let Obj = {
      username: userName,
      password: userPsd,
      categoryType: '',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };
    setfilterReqBody(Obj);
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const applyFilterFxn = (types, Ids, count) => {
    console.log('applyFilterFxn', types, Ids);
    props.applyFilterFxn(types, Ids);
    set_filterCount(count);
    set_showFilteredList(true);
    setFilterVisible(false);
    set_recName('');
  };

  const filterPets = name => {
    const searchTerm = name.toString().toLowerCase().trim();
    set_recName(name);
    if (searchTerm.length === 0) {
      set_filterArray(ItemsArray);
      setIsFiltering(false);
      return;
    }
    setIsFiltering(true);

    const styleArray = ItemsArray.filter(item => {
      return (
        (item?.allStyles !== '' &&
          item?.allStyles?.toLowerCase().includes(searchTerm)) ||
        (item?.color !== '' &&
          item?.color?.toLowerCase().includes(searchTerm)) ||
        (item?.inMenuName !== '' &&
          item?.inMenuName?.toLowerCase().includes(searchTerm)) 
      )
    });

    set_filterArray(styleArray || []);
  };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const fetchMore = () => {
    if (!isFiltering) {
      props.fetchMore(true);
    }
    // props.fetchMore(true);
  };

  const clearFilter = () => {
    onRefresh();
  };

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


  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => actionOnRow(item, index)}
        style={[CommonStyles.cellBackViewStyle, {marginBottom: 3}]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{flex: 1, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.allStyles}
            </Text>
          </View>
          <View
            style={{flex: 0.7, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.color}
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.inMenuName}
            </Text>
          </View>
          <View
            style={{flex: 0.5, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.totalQty}
            </Text>
          </View>
          <View
            style={{flex: 0.5, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.cuttqty}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleNavigation = () => {
    props.handleNavigation();
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
          title={'New Process In List'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        {/* {filterArray ? ( */}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginBottom: 10,
            alignItems: 'center',
          }}>
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
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Image
              source={searchImg}
              style={{
                height: 18,
                width: 18,
                tintColor: '#7F7F81',
                marginRight: 10,
              }}
            />
            <TextInput
              style={[
                {flex: 1, color: '#000'},
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
          {/* <TouchableOpacity
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
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => {
              set_showFilteredList(true);
              setFilterVisible(!isFilterVisible);
            }}>
            <Image
              source={filterImg}
              style={{
                height: 25,
                width: 25,
                tintColor: showFilteredList ? colors.color2 : '#7F7F81',
                marginRight: 10,
              }}
            />
            {filterCount ? (
              <Text
                style={{
                  color: '#7F7F81',
                  fontSize: 14,
                  backgroundColor: colors.color2,
                  borderRadius: 30,
                  color: '#fff',
                  padding: 5,
                }}>
                {filterCount}
              </Text>
            ) : (
              <Text style={{color: '#7F7F81', fontSize: 14}}>{'Filter'}</Text>
            )}
          </TouchableOpacity> */}
        </View>

        {/* ) : null} */}

        {filterArray && filterArray.length > 0 ? (
          <View style={CommonStyles.listCommonHeader}>
           
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'Style No(s)'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.7, textAlign: 'center'},
              ]}>
              {'Color'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'Process Name'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.5, textAlign: 'center'},
              ]}>
              {'Total Qty'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.5, textAlign: 'center'},
              ]}>
              {'Total Cut Qty'}
            </Text>
          </View>
        ) : (
          <View style={CommonStyles.noRecordsFoundStyle}>
            {!props.MainLoading ? (
              <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
                {Constant.noRecFound}
              </Text>
            ) : null}
          </View>
        )}

        <View style={CommonStyles.listStyle}>
          {showFilteredList ? (
            <FlatList
              data={filterArray}
              renderItem={renderItem}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <FlatList
              data={filterArray}
              renderItem={renderItem}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
              onEndReached={() => fetchMore()}
              onEndReachedThreshold={0.2}
              ListFooterComponent={() =>
                props.isLoading && <ActivityIndicator size="large" />
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </View>
      </View>

      <FilterModal
        isVisible={isFilterVisible}
        categoriesList={categories}
        selectedCategoryListAPI={'getSelectedCategoryListFBI'}
        onClose={() => setFilterVisible(false)}
        applyFilterFxn={applyFilterFxn}
        clearFilter={clearFilter}
        reqBody={filterReqBody}
      />

      <AddNewItem navItem={'CreateNewProcessIn'} />
      {/* <AddNewItem navItem={'SaveNewProcessIn'} /> */}

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
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
        </View>
      ) : null}

      {props.MainLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default NewProcessInListUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: 'black',
  },
  leftBtnTextStyle: {
    color: 'white',
    fontSize: fonts.fontMedium,
    fontWeight: '700',
    marginLeft: wp('1%'),
    marginRight: wp('1%'),
    textAlign: 'center',
  },
  leftButtonstyle: {
    // backgroundColor: colors.color2,
    // flex:1,
    height: hp('6%'),
    borderRadius: hp('0.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
