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
import {RadioButton} from 'react-native-paper';
import {ColorContext} from '../../colorTheme/colorTheme';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../../assets/images/png/close1.png');

const ProductionProcessReportUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);



  const [total, setTotal] = useState('Yes');
  const [dayWise, setDayWise] = useState('No');
  const [pendingQuantity, setPendingQuantity] = useState('No');

  //   Pending Quantity  ,Daywise    ,Total
  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, set_filteredLocation] = useState([]);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationName, set_locationName] = useState('');
  const [locationId, set_locationId] = useState('');

  const [processNameList, setProcessNameList] = useState([]);
  const [filteredProcessName, set_filteredProcessName] = useState([]);
  const [showProcessNameList, set_showProcessNameList] = useState(false);
  const [processName, set_processName] = useState('');
  const [processId, set_processId] = useState('');

  const [brandList, setBrandList] = useState([]);
  const [filteredBrand, set_filteredBrand] = useState([]);
  const [showBrandList, set_showBrandList] = useState(false);
  const [brandName, set_brandName] = useState('');
  const [brandId, set_brandId] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startDate, set_startDate] = useState('');
  const [endDate, set_endDate] = useState('');
  const [activeField, setActiveField] = useState(null);

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



  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const ApproveAction = () => {
    console.log('Approved');
    let tempObj = {
      startDate:formatDateIntoDMY(startDate),
      endDate:formatDateIntoDMY(endDate)     
    };

    // console.log("SAVING OBJ=====>   ", tempObj);
    props.submitAction(tempObj);
  };

  const RejectAction = remarks => {
    console.log('Rejected');
  };

  const actionOnLocation = (id, name) => {
    set_locationId(id);
    set_locationName(name);
    set_showLocationList(false);
  };

  const actionOnProcessName = (id, name) => {
    set_processId(id);
    set_processName(name);
    set_showProcessNameList(false);
  };
  const actionOnBrand = (id, name) => {
    set_brandId(id);
    set_brandName(name);
    set_showBrandList(false);
  };

  const handleSearchProcessName = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockProcesses.filter(process =>
        process.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredProcessName(filtered);
    } else {
      set_filteredProcessName(props.lists.getStockProcesses);
    }
  };

  const handleSearchBrand = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockBrands.filter(brand =>
        brand.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredBrand(filtered);
    } else {
      set_filteredBrand(props.lists.getStockBrands);
    }
  };

  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockFabrics.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredLocation(filtered);
    } else {
      set_filteredLocation(props.lists.getStockFabrics);
    }
  };

  const handleConfirm = date => {
    const extractedDate = date.toISOString().split('T')[0];
    const formattedDate = formatDateIntoDMY(extractedDate);

    if (activeField === 'endDate') {
      set_endDate(formattedDate);
    } else if (activeField === 'startDate') {
      set_startDate(formattedDate);
    }
    hideDatePicker();
  };

  const showDatePicker = field => {
    setActiveField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveField(null);
  };

  function formatDateIntoDMY(inp) {
    const [y, m, d] = inp.split('-');
    let ans = [d, m, y];
    ans = ans.join('-');
    return ans;
  }

  // Define radio buttons for Fabric, RM, and Style
  const categoryRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Total',
        value: 'Total',
        selected: total === 'Yes',
        labelStyle: {color: '#000'},

      },
      {
        id: '2',
        label: 'Daywise',
        value: 'Daywise',
        selected: dayWise === 'Yes',
        labelStyle: {color: '#000'},

      },

      {
        id: '3',
        label: ' Pending Quantity  ',
        value: 'pendingQuantity',
        selected: pendingQuantity === 'Yes',
        labelStyle: {color: '#000'},

      },
    ],
    [total, dayWise, pendingQuantity],
  );

  const handleCategoryChange = selectedId => {
    const selectedOption = categoryRadioButtons.find(
      button => button.id === selectedId,
    );
    if (selectedOption.value === 'Total') {
      setTotal('Yes');
      setDayWise('No');
      setPendingQuantity('No');
    } else if (selectedOption.value === 'Daywise') {
      setTotal('No');
      setDayWise('Yes');
      setPendingQuantity('No');
    } else if (selectedOption.value === 'pendingQuantity') {
      setTotal('No');
      setDayWise('No');
      setPendingQuantity('Yes');
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
          title={'Production Process Report'}
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
            <View style={{marginTop:20}}/>
          <RadioGroup
            style={{flexDirection: 'row'}}
            radioButtons={categoryRadioButtons}
            onPress={handleCategoryChange}
            layout="row"
            selectedId={
              categoryRadioButtons.find(
                item =>
                  item.value ===
                  (total === 'Yes'
                    ? 'Total'
                    : dayWise === 'Yes'
                    ? 'Daywise'
                    : pendingQuantity === 'Yes'
                    ? 'pendingQuantity'
                    : ''),
              )?.id
            }
          />

          {/* dates */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('3%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%',paddingHorizontal:10}}>
              <TextInput
                label="Start Date"
                value={startDate ? startDate : ''}
                placeholder="Start Date *"
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('startDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('3%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%',paddingHorizontal:10}}>
              <TextInput
                label="End Date"
                value={endDate ? endDate : ''}
                placeholder="End Date *"
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('endDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          {/* drop down lists */}

          {(dayWise==='Yes' || pendingQuantity==='Yes') && <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('3%'),
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
                set_showProcessNameList(!showProcessNameList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        processId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Process Name *'}
                    </Text>
                    {processId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {processName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showProcessNameList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchProcessName}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredProcessName.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredProcessName.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnProcessName(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>}

          {(total ==='Yes' || dayWise==='Yes') &&  <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('3%'),
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
                set_showBrandList(!showBrandList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        brandId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Brand/Project'}
                    </Text>
                    {brandId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {brandName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showBrandList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchBrand}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredBrand.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredBrand.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnBrand(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>}

          {(total ==='Yes' || dayWise==='Yes') &&  <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('3%'),
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
                set_showLocationList(!showLocationList);
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
                      {'Location'}
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
          </View>}

          {/* <View style={{marginBottom: 150}} /> */}
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Search'}
          leftBtnTitle={'View'}
          isLeftBtnEnable={true}
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

export default ProductionProcessReportUI;

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
