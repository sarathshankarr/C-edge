import React, {useState, useRef, useEffect, useContext, useMemo} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import CommonStyles from '../../../utils/commonStyles/commonStyles';
import * as Constant from '../../../utils/constants/constant';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import TextInputComponent from '../../../utils/commonComponents/textInputComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import {ColorContext} from '../../colorTheme/colorTheme';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../../assets/images/png/close1.png');

const StyleBomReportUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  const [data, setData] = useState([]);
  const [checkbox, set_checkbox] = useState(false);



  const [buyerPOList, setBuyerPOList] = useState([]);
  const [filteredBuyerPO, set_filteredBuyerPO] = useState([]);
  const [showBuyerPOList, set_showBuyerPOList] = useState(false);
  const [buyerPOName, set_buyerPOName] = useState('');
  const [buyerPOId, set_buyerPOId] = useState('');


const [stylesList, setStylesList] = useState([]);
const [filteredStyles, set_filteredStyles] = useState([]);
const [showStylesList, set_showStylesList] = useState(false);
const [stylesName, set_stylesName] = useState('');
const [stylesId, set_stylesId] = useState('');


const [rmNameList, setRMNameList] = useState([]);
const [filteredRMName, set_filteredRMName] = useState([]);
const [showRMNameList, set_showRMNameList] = useState(false);
const [rmName, set_rmName] = useState('');
const [rmId, set_rmId] = useState('');




  //   useEffect(() => {
  //     if (props?.lists) {
  //       if (props.lists.getStockStyles) {
  //         set_filteredStockStyles(props.lists.getStockStyles);
  //       }
  //       if (props.lists.getStockFabrics) {
  //         set_filteredStockFabrics(props.lists.getStockFabrics);
  //       }
  //     }
  //   }, [props]);

  //   useEffect(() => {
  //     if (props?.lists) {
  //       setData(props?.lists);
  //     }
  //   }, [props?.lists]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const ApproveAction = () => {
    console.log('Approved');

    const requestDetails = rows.map(detail => ({
      stockType: detail.stockTypeId,
      stockTypeName: detail.stockType,
      stock: detail.stockId,
      stock_rm_lot: 0,
      stockLocationId: 1,
      styleRmSizeId: detail.size,
      inputQty: detail.inputQty,
      uomstock: detail.uom,
    }));

    let tempObj = {
      processId: processId,
      woStyleId: stylesId,
      trimId: fabricId,
      locationId: locationId,
      unitMasterId: unitMasterId,
      comments: remarks,
      general: generalRadio === 'Yes' ? '1' : '0',
      styleWise: displayStyleRadio === 'Yes' ? '1' : '0',
      fabricQty: enteredFabQty,
      uom: itemsObj?.uomfabric,
      rmDetails: requestDetails,
    };

    // console.log("SAVING OBJ=====>   ", tempObj);
    props.submitAction(tempObj);
  };

  const RejectAction = remarks => {
    console.log('Rejected');
  };

  const actionOnBuyerPO = (id, name) => {
    set_buyerPOId(id);
    set_buyerPOName(name);
    set_showBuyerPOList(false);
};
const actionOnStyles = (id, name) => {
    set_stylesId(id);
    set_stylesName(name);
    set_showStylesList(false);
};
const actionOnRMName = (id, name) => {
    set_rmId(id);
    set_rmName(name);
    set_showRMNameList(false);
};




const handleSearchCustomer = text => {
    if (text.trim().length > 0) {
        const filtered = props.lists.getStockCustomers.filter(customer =>
            customer.name.toLowerCase().includes(text.toLowerCase()),
        );
        set_filteredCustomer(filtered);
    } else {
        set_filteredCustomer(props.lists.getStockCustomers);
    }
};

const handleSearchBuyerPO = text => {
    if (text.trim().length > 0) {
        const filtered = props.lists.getStockBuyerPOs.filter(buyerPO =>
            buyerPO.name.toLowerCase().includes(text.toLowerCase()),
        );
        set_filteredBuyerPO(filtered);
    } else {
        set_filteredBuyerPO(props.lists.getStockBuyerPOs);
    }
};


const handleSearchStyles = text => {
    if (text.trim().length > 0) {
        const filtered = props.lists.getStockStyles.filter(style =>
            style.name.toLowerCase().includes(text.toLowerCase()),
        );
        set_filteredStyles(filtered);
    } else {
        set_filteredStyles(props.lists.getStockStyles);
    }
};

const handleSearchRMName = text => {
    if (text.trim().length > 0) {
        const filtered = props.lists.getStockRMNames.filter(rmName =>
            rmName.name.toLowerCase().includes(text.toLowerCase()),
        );
        set_filteredRMName(filtered);
    } else {
        set_filteredRMName(props.lists.getStockRMNames);
    }
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
          title={'Style Bom Report'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginBottom: hp('5%'),
            width: '90%',
            marginHorizontal: wp('5%'),
          }}>


          {/* drop down lists */}

          
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  set_showBuyerPOList(!showBuyerPOList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          buyerPOId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Buyer PO'}
                      </Text>
                      {buyerPOId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {buyerPOName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showBuyerPOList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchBuyerPO}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredBuyerPO.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                        filteredBuyerPO.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnBuyerPO(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
        
          
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  set_showStylesList(!showStylesList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          stylesId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Style'}
                      </Text>
                      {stylesId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {stylesName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showStylesList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchStyles}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredStyles.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                        filteredStyles.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnStyles(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
        

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                set_showRMNameList(!showRMNameList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        rmId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'RM Name'}
                    </Text>
                    {rmId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {rmName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showRMNameList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchRMName}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredRMName.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredRMName.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnRMName(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          
          {/* <View style={{marginBottom: 150}} /> */}
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Search'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={false}
          rigthBtnState={true}
          isRightBtnEnable={true}
          leftButtonAction={() => backBtnAction()}
          rightButtonAction={async () => ApproveAction()}
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

      {props.isLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default StyleBomReportUI;

const getStyles = colors =>
  StyleSheet.create({
    popSearchViewStyle: {
      height: hp('40%'),
      width: wp('90%'),
      backgroundColor: '#fff',
      alignSelf: 'center',
      alignItems: 'center',
      borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
      borderWidth: 1,
      marginTop: 3,
    },

    flatcontainer: {
      flex: 1,
    },

    flatview: {
      height: hp('8%'),
      marginBottom: hp('0.3%'),
      alignContent: 'center',
      justifyContent: 'center',
      borderBottomColor: 'black',
      borderBottomWidth: wp('0.1%'),
      width: wp('80%'),
      alignItems: 'center',
    },

    SectionStyle1: {
      flexDirection: 'row',
      alignItems: 'center',
      height: hp('7%'),
      width: wp('75%'),
      borderRadius: hp('0.5%'),
    },

    // Adjust the image style to make it smaller and visible
    // imageStyle: {
    //     height: wp("6%"),
    //     aspectRatio: 1,
    //     marginRight: wp('4%'),
    //     resizeMode: 'contain',
    // },

    imageStyle: {
      height: 50,
      width: 50,
      aspectRatio: 1,
      marginRight: 20,
      resizeMode: 'contain',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },

    dropTextInputStyle: {
      fontWeight: 'normal',
      fontSize: 18,
      marginLeft: wp('4%'),
      color: 'black',
      width: wp('80%'),
    },

    dropTextLightStyle: {
      fontWeight: '300',
      fontSize: 12,
      width: wp('60%'),
      alignSelf: 'flex-start',
      marginTop: hp('1%'),
      marginLeft: wp('4%'),
      color: '#000',
    },

    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      marginTop: hp('2%'),
      width: '95%',
      marginBottom: 10,
      marginHorizontal: 10,
    },

    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 5,
      backgroundColor: colors.color2,
      alignItems: 'center',
    },

    table_head_captions: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
      textAlign: 'center',
      paddingHorizontal: 5,
    },

    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 10, // Adjust vertical padding for rows
      paddingHorizontal: 5, // Add horizontal padding
      justifyContent: 'center',
      alignItems: 'center',
    },

    table_data: {
      fontSize: 11,
      color: '#000',
      textAlign: 'center',
      alignSelf: 'center',
      paddingHorizontal: 5, // Add padding for data cells
    },

    table: {
      margin: 15,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 1,
      backgroundColor: '#fff',
    },

    checkbox_container: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    table_data_input: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 5,
      textAlign: 'center',
    },
    searchInput: {
      marginTop: 10,
      borderRadius: 10,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginHorizontal: 10,
      paddingLeft: 10,
      marginBottom: 10,
      color: '#000000',
    },
    scrollView: {
      maxHeight: 150,
    },
    dropdownOption: {
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    input: {
      color: '#000',
    },
    dropdownContent1: {
      elevation: 5,
      height: 220,
      alignSelf: 'center',
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
      borderWidth: 1,
      marginTop: 3,
    },
    noCategoriesText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      marginVertical: 8,
    },
  });