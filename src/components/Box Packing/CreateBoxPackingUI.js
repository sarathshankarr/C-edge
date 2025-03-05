import React, {useState, useRef, useEffect, useMemo, useContext} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../utils/constants/constant';
import CommonStyles from '../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../utils/commonComponents/bottomComponent';
import {TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {ColorContext} from '../colorTheme/colorTheme';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const CreateBoxPackingUI = ({route, navigation, ...props}) => {
  const [boxName, setBoxName] = React.useState('');
  const [packerName, setPackerName] = React.useState('');
  const [rows, setRows] = React.useState([]);

  const {colors} = useContext(ColorContext);

  const styles = getStyles(colors);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  useEffect(() => {
    if (props.lists) {
      console.log('data need to set ==> ', props.lists);
    }
  }, [props.lists]);

  // Ship To state variables
  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, setFilteredLocation] = useState([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationId, setLocationId] = useState('');

  const actionOnLocation = item => {
    setLocationId(item.id);
    setLocationName(item.name);
    setShowLocationList(false);
  };

  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = locationList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredLocation(filtered);
    } else {
      setFilteredLocation(locationList);
    }
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  const submitAction = async () => {
    // rows.map((row,index)=> (
    props.submitAction('checkedData');
  };

  const handleRemoveRow = id => {
    setRows(prev => prev.filter((_, index) => index !== id));
  };

  const handleSearchOrders = async (item, rowId) => {
    set_dataFromStock({
      row: rowId,
      id: item?.id,
    });

    setRows(
      rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              orderName: item?.name,
              orderID: item?.id,
              showOrderList: false,
            }
          : row,
      ),
    );

    // await getStockQty(rowId, item?.id);
  };
  const handleSearchCustomerStyle = async (item, rowId) => {
    set_dataFromStock({
      row: rowId,
      id: item?.id,
    });

    setRows(
      rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              CustomerStyleName: item?.name,
              CustomerStyleId: item?.id,
              showCustomerStyleList: false,
            }
          : row,
      ),
    );

    // await getStockQty(rowId, item?.id);
  };
  const actionOnOrders = async (item, rowId) => {
    set_dataFromStockType({
      row: rowId,
      id: item?.id,
    });

    setRows(
      rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              OrderName: item?.name,
              orderId: item?.id,
              showOrderliSt: false,
            }
          : row,
      ),
    );

    // await getStockbyTypeId(rowId, item.id);
  };
  const actionOnCustomerStyle = async (item, rowId) => {
    set_dataFromStockType({
      row: rowId,
      id: item?.id,
    });

    setRows(
      rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              CustomerStyleName: item?.name,
              CustomerStyleId: item?.id,
              showCustomerStyleliSt: false,
            }
          : row,
      ),
    );

    // await getStockbyTypeId(rowId, item.id);
  };

  const RemoveRow = id => {
    console.log('ROW ID ===> ', id);
    const filtered = rows.filter(item => item.id !== id);
    setRows(filtered);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        orderName: '',
        CustomerStyleName: '',
        orderId: '',
        CustomerStyleId: '',
        showCustomerStyleList: false,
        showOrderList: false,
        OrderList: [],
        CustomerStyleList: [],
        filteredOrders: [],
        filteredCustomerStyle: [],
        Colors:[]
      },
    ]);
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
          title={'Create Box Packing'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%'), width: '100%'}}>
        <View
          style={{
            marginBottom: hp('5%'),
            width: '90%',
            marginHorizontal: wp('5%'),
          }}>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Box Name "
              value={boxName}
              mode="outlined"
              onChangeText={text => setBoxName(text)}
            />
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
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                setShowLocationList(!showLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        locationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Location '}
                    </Text>
                    {locationId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {locationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnLocation(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Packer Name"
              value={packerName}
              mode="outlined"
              onChangeText={text => setPackerName(text)}
            />
          </View>

          <View
            style={{
              // width: '90%',
              marginTop: 20,
              marginBottom: 30,
              // marginHorizontal: 15,
            }}>
            <TouchableOpacity
              onPress={addRow}
              style={{
                backgroundColor: colors.color2,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                Add Stock
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Action</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>Orders</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>
                      *Customer Style
                    </Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Color</Text>
                  </View>
                </View>

                {/* Table Body - Rows */}
                {rows.map(row => (
                  <View key={row.id} style={styles.table_body_single_row}>
                    <View style={{width: 60}}>
                      <TouchableOpacity
                        style={{alignItems: '', justifyContent: ''}}
                        onPress={() => RemoveRow(row.id)}>
                        <Image source={closeImg} style={styles.imageStyle1} />
                      </TouchableOpacity>
                    </View>
                    <View style={{width: 5}}></View>
                    <View style={{width: 200}}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: hp('1%'),
                          backgroundColor: '#ffffff',
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            borderWidth: 0.5,
                            borderColor: '#D8D8D8',
                            borderRadius: hp('0.5%'),
                            width: '100%',
                            overflow: 'hidden',
                          }}
                          onPress={() => {
                            setRows(
                              rows.map(r =>
                                r.id === row.id
                                  ? {
                                      ...r,
                                      showOrdersList: !r.showOrdersList,
                                    }
                                  : {
                                      ...r,
                                      showOrdersList: false,
                                      filteredOrders: props.lists.getStockTypes,
                                    },
                              ),
                            );
                          }}>
                          <View style={[styles.SectionStyle1]}>
                            <View style={{flexDirection: 'column'}}>
                              <Text
                                style={
                                  row.Orders
                                    ? styles.dropTextLightStyle
                                    : styles.dropTextInputStyle
                                }>
                                {'Orders '}
                              </Text>
                              <Text style={styles.dropTextInputStyle}>
                                {row.orderId ? row.orderName : 'Select Order'}
                              </Text>
                            </View>
                          </View>
                          <View style={{justifyContent: 'center'}}>
                            <Image
                              source={downArrowImg}
                              style={styles.imageStyle}
                            />
                          </View>
                        </TouchableOpacity>
                        {row.showOrdersList && (
                          <View style={styles.dropdownContent2}>
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search "
                              onChangeText={text =>
                                handleSearchOrders(text, row.id)
                              }
                              placeholderTextColor="#000"
                            />
                            <ScrollView nestedScrollEnabled={true}>
                              {row.filteredOrders.length === 0 ? (
                                <Text style={styles.noCategoriesText}>
                                  Sorry, no results found!
                                </Text>
                              ) : (
                                row.filteredOrders.map(item => (
                                  <TouchableOpacity
                                    key={item?.id}
                                    onPress={() =>
                                      actionOnOrders(item, row.id)
                                    }>
                                    <View style={styles.dropdownOption}>
                                      <Text style={{color: '#000'}}>
                                        {item?.name}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ))
                              )}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={{width: 5}}></View>
                    <View style={{width: 200}}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: hp('1%'),
                          backgroundColor: '#ffffff',
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            borderWidth: 0.5,
                            borderColor: '#D8D8D8',
                            borderRadius: hp('0.5%'),
                            width: '100%',
                            overflow: 'hidden',
                          }}
                          onPress={() => {
                            setRows(
                              rows.map(r =>
                                r.id === row.id
                                  ? {
                                      ...r,
                                      showCustomerStyleList:
                                        !r.showCustomerStyleList,
                                    }
                                  : {...r, showCustomerStyleList: false},
                              ),
                            );
                          }}>
                          <View style={[styles.SectionStyle1]}>
                            <View style={{flexDirection: 'column'}}>
                              <Text
                                style={
                                  row.CustomerStyleId
                                    ? styles.dropTextLightStyle
                                    : styles.dropTextInputStyle
                                }>
                                {'Customer Style *'}
                              </Text>
                              <Text style={styles.dropTextInputStyle}>
                                {row.CustomerStyleId
                                  ? row.CustomerStyleName
                                  : 'Select '}
                              </Text>
                            </View>
                          </View>
                          <View style={{justifyContent: 'center'}}>
                            <Image
                              source={downArrowImg}
                              style={{
                                height: 20,
                                width: 20,
                                tintColor: 'red',
                                aspectRatio: 1,
                                marginRight: 20,
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        {row.showCustomerStyleList && (
                          <View style={styles.dropdownContent2}>
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search "
                              onChangeText={text =>
                                handleSearchCustomerStyle(text, row.id)
                              }
                              placeholderTextColor="#000"
                            />
                            <ScrollView nestedScrollEnabled={true}>
                              {row.filteredCustomerStyle.length === 0 ? (
                                <Text style={styles.noCategoriesText}>
                                  Sorry, no results found!
                                </Text>
                              ) : (
                                row.filteredCustomerStyle.map(item => (
                                  <TouchableOpacity
                                    key={item?.id}
                                    onPress={() =>
                                      actionOnCustomerStyle(item, row.id)
                                    }>
                                    <View style={styles.dropdownOption}>
                                      <Text style={{color: '#000'}}>
                                        {item?.name}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ))
                              )}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={{width: 5}}></View>
                    <View style={{width: 100}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={row.inputQty}
                        onChangeText={text => {
                          setRows(
                            rows.map(r =>
                              r.id === row.id ? {...r, inputQty: text} : r,
                            ),
                          );
                        }}
                      />
                    </View>
                  </View>
                ))}

              </View>
            </ScrollView>
          </View>

          
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => submitAction()}
          leftButtonAction={async () => backAction()}
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

export default CreateBoxPackingUI;

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
    popSearchViewStyleTable: {
      height: hp('40%'),
      width: 200,
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
      // flex: 1,
      marginTop: hp('2%'),
      // width: '95%',
      marginBottom: 10,
      // marginHorizontal: 10,
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
    dropdownContent2: {
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
});
