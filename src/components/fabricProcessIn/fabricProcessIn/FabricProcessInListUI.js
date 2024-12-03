import React, {useState, useEffect, useRef} from 'react';
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
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import * as Constant from '../../../utils/constants/constant';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import color from '../../../utils/commonStyles/color';
import FilterModal from '../../../utils/commonComponents/FilterModal';
let searchImg = require('./../../../../assets/images/png/searchIcon.png');

const FabricProcessInListUI = ({route, navigation, ...props}) => {
  const [isListOpen, set_ListOpen] = useState(false);
  const [refreshing, set_refreshing] = useState(false);
  const [filterArray, set_filterArray] = useState([]);
  const [ItemsArray, set_ItemsArray] = useState([]);
  const [recName, set_recName] = useState(undefined);

  const [categories, set_categories]=useState([
    { id: "batchNo", value: "Batch No" },
    { id: "orderNo", value: "Order No" },
    { id: "designName", value: "Design Name" },
    { id: "BrandName", value: "Brand Name" }
  ])
  const [isFilterVisible, setFilterVisible] = useState(false);

  let isKeyboard = useRef(false);

  React.useEffect(() => {
    set_filterArray(props?.itemsArray);
    set_ItemsArray(props?.itemsArray);
    if (props?.itemsArray) {
      console.log('List ===> ', props?.itemsArray[2]);
    }
  }, [props?.itemsArray]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const applyFilterFxn = (types, Ids) => {
    props.applyFilterFxn(types, Ids);
  };

  

  // const filterPets = name => {
  //   const styleArray = filterArray.filter(item => {
  //     const searchTerm = name;
  //     return (
  //       item?.OrderNo.includes(searchTerm) ||
  //       item?.DesignNo.includes(searchTerm) ||
  //       item?.brandName?.includes(searchTerm)
  //     );
  //   });

  //   if (styleArray && styleArray.length > 0) {
  //     set_filterArray(styleArray);
  //   } else {
  //     set_filterArray([]);
  //   }
  // };

  const filterPets = (name) => {
    const searchTerm = name.toString().toLowerCase().trim();  
    if(searchTerm.length===0){
      set_filterArray(ItemsArray);
      return;
    }
  
    const styleArray = filterArray.filter(item => {
      return (
        (item?.OrderNo?.toLowerCase().includes(searchTerm)) ||
        (item?.DesignNo?.toLowerCase().includes(searchTerm)) ||
        (item?.brandName?.toLowerCase().includes(searchTerm)) ||
        (item?.batchname?.toLowerCase().includes(searchTerm)) ||   
        (item?.inMenuName?.toLowerCase().includes(searchTerm))     
      );
    });
  
    // Update filtered array
    set_filterArray(styleArray.length > 0 ? styleArray : []);
  };
  
  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const handleScan = async(item) => {
    props.handleScan(item);
  };


  const handlePdf = async(item) => {
    props.handlePdf(item);
  };

  const fetchMore=()=>{
    props.fetchMore(true);
  }

  const onRefresh = () => {
    set_refreshing(true);
    props.fetchMore(false); 
    set_refreshing(false);
  };


  const createPage = () => {
    props.actionOnCreate();
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        // onPress={() => actionOnRow(item, index)}
        style={[CommonStyles.cellBackViewStyle, {marginBottom: 3}]}>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

          <TouchableOpacity style={{flex: 2.5}} onPress={() => actionOnRow(item, index)}>
         { item.batchname && <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'left'}]}>
              <Text style={{fontWeight: '500'}}>{'Batch Name:  '}</Text>
              {item.batchname}
            </Text>}
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'left'}]}>
              {item.orderNo && <Text style={{fontWeight: '500'}}>{'Order No:'}</Text>}
              {item.orderNo} {' '}
             {item.designName && <Text style={{fontWeight: '500'}}>{'|  Design No:'}</Text>}
              {item.designName}{' '}
            </Text>
           {item.matchingName &&  <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'left'}]}>
              <Text style={{fontWeight: '500'}}>{'Matching Name: '}</Text>
              {item.matchingName}
            </Text>}
           { item.brandName && <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'left'}]}>
              <Text style={{fontWeight: '500'}}>{'Brand: '}</Text>
              {item.brandName}
            </Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent:'center'}} onPress={() => actionOnRow(item, index)}>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {textAlign: 'center'},
            ]}>
            {item.inMenuName}
          </Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 0.7,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity onPress={() => handlePdf(item)}>
              <Image
                source={require('././../../../../assets/images/png/pdf.png')}
                style={{height: 25, width: 20}}
              />
            </TouchableOpacity>
            {item?.inMenuName ==="Checking/Cutting In" && (
              <TouchableOpacity onPress={() => handleScan(item)}>
                <Image
                  source={require('././../../../../assets/images/png/scan.png')}
                  style={{height: 20, width: 20}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

      </View>
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
          title={'Fabric Process In'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        {filterArray ? (
          <View style={{flexDirection: 'row', width: '100%', marginBottom: 10}}>
            <View style={{width: '67%'}}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'black',
                  borderRadius: 5,
                }}>
                <Image
                  source={searchImg}
                  style={{height: 15, width: 15, marginLeft: 15}}
                />
                <TextInput
                  style={{color:'#000'}}
                  underlineColorAndroid="transparent"
                  placeholder="Search "
                  placeholderTextColor="#7F7F81"
                  autoCapitalize="none"
                  value={recName}
                  onFocus={() => (isKeyboard.current = true)}
                  onChangeText={text => {
                    filterPets(text);
                  }}
                />
              </View>
            </View>
            <View style={{width: '30%', marginLeft: '2%'}}>
              <TouchableOpacity
                style={styles.leftButtonstyle}
                onPress={() => {
                  createPage();
                }}>
                <Text style={[styles.leftBtnTextStyle]}>{'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {filterArray && filterArray.length > 0 ? (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 2.5, textAlign: 'left'},
              ]}>
              {'Item Details'}
            </Text>
            {/* <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center', }]}>{'Brand Name'}</Text> */}
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
                {flex: 0.7, textAlign: 'center'},
              ]}>
              {'Actions'}
            </Text>
            {/* <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 0.4, textAlign: 'center', }]}>{'PDF'}</Text> */}
          </View>
        ) : null}

        <View style={CommonStyles.listStyle}>
          {filterArray && filterArray.length > 0 ? (
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
          ) : (
            <View style={CommonStyles.noRecordsFoundStyle}>
              {!props.isLoading ? (
                <Text
                  style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
                  {Constant.noRecFound}
                </Text>
              ) : null}
            </View>
          )}
        </View>
      </View>

      <View style={styles.container}>
      <Button title="Open Filter" onPress={() => setFilterVisible(true)} />
      <FilterModal
        isVisible={isFilterVisible}
        categoriesList={categories}
        selectedCategoryListAPI={'getSelectedCategoryListFBI'}
        onClose={() => setFilterVisible(false)}
        applyFilterFxn={() => applyFilterFxn(types, Ids)}
      />
    </View>

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

export default FabricProcessInListUI;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: color.color2,
    // flex:1,
    height: hp('6%'),
    borderRadius: hp('0.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
