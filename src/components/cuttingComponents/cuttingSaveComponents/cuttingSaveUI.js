import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from './../../../utils/constants/constant';
import CommonStyles from './../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';
import TextInputComponent from '../../../utils/commonComponents/textInputComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from './../../../utils/commonComponents/bottomComponent';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native-paper';
import {ColorContext} from '../../colorTheme/colorTheme';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
const CuttingSaveUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);

  const [unitPrice, set_unitPrice] = useState(0);
  const [fabricWaste, set_fabricWaste] = useState('0');
  const [damageQty, set_damageQty] = useState('0');
  const [rejectQty, set_rejectQty] = useState('0');
  const [fabConsumption, set_fabConsumption] = useState('0');
  const [actualConsumption, set_actualConsumption] = useState('0');
  const [approvedConsumption, set_approvedConsumption] = useState('0');
  const [enterSizesArray, set_enterSizesArray] = useState([]);
  const [fabricUsed, set_fabricUsed] = useState(0);
  const [fabricBalance, set_fabricBalance] = useState('0');
  const [fabricReturn, set_fabricReturn] = useState('0');
  const [batchMapArr, set_batchMapArr] = useState([]);
  const [isBatchType, set_isBatchType] = useState(undefined);
  const [batchText, set_batchText] = useState(undefined);
  const [batchId, set_batchId] = useState(undefined);
  const [dailyConsumption, set_dailyConsumption] = useState('0');
  const [editLocation, set_editLocation] = useState(true);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationName, set_locationName] = useState('');
  const [locationId, set_locationId] = useState(0);
  const [locationsList, set_locationsList] = useState([]);
  const [filteredBatchTypes, set_filteredBatchTypes] = useState([]);
  const [filteredLocations, set_filteredLocations] = useState([]);

  const [showEmployeeList, set_showEmployeeList] = useState(false);
  const [employeeName, set_employeeName] = useState('');
  const [employeeId, set_employeeId] = useState(0);
  const [employeesList, set_employeesList] = useState([]);
  const [filteredEmployees, set_filteredEmployees] = useState([]);


  // const [searchText, set_searchText] = useState('');

  useEffect(() => {
    if (props.itemsObj) {
      // set_actualCon(props.itemsObj.actualConsumption);
      set_fabricUsed(props.itemsObj.fabricUsed);
      set_fabricBalance(props.itemsObj.fabricBalance);
      set_fabricReturn(props.itemsObj.fabricReturn);
      set_enterSizesArray(props.itemsObj.sizeDetails);
      set_actualConsumption(props.itemsObj.actualConsumption);
      set_approvedConsumption(props.itemsObj.approvedConsumption);
      set_unitPrice(props.itemsObj?.unitprice || '0');
      if (props.itemsObj.companyLocation) {
        set_locationId(props.itemsObj.companyLocation);
        set_locationName(
          props?.itemsObj?.locationMap[props.itemsObj.companyLocation],
        );
        set_locationName(props?.itemsObj?.location);
        // console.log("Location is =====> ", props?.itemsObj?.locationMap[props.itemsObj.companyLocation.toString()], props.itemsObj.companyLocation.toString(), props?.itemsObj?.locationMap)
        set_editLocation(false);
      } else {
        set_locationsList(props?.itemsObj?.locationMap);
        set_filteredLocations(Object.keys(props?.itemsObj?.locationMap || {}));
      }

      // console.log('props.itemOBj==> ', props.itemsObj);

      set_batchMapArr(props?.itemsObj?.batchMap);
      set_filteredBatchTypes(Object.keys(props?.itemsObj?.batchMap));
      // parseBatchRecords(props.itemsObj.batchMap)
    }
  }, [props.itemsObj]);

  
  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let temValid = false;

    for (let i = 0; i < enterSizesArray.length; i++) {
      if (enterSizesArray[i].enterQty && enterSizesArray[i].enterQty !== '') {
        if(Number(enterSizesArray[i].enterQty)>0){
          temValid = true;
        }
      } else {
        enterSizesArray[i].enterQty = 0;
      }
      // console.log(enterSizesArray[i].enterQty);
    }

    if (!temValid) {
      props.popUpAction(
        Constant.validate_Fields_,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
      return;
    }

    if (
      props.itemsObj.fabricIssued &&
      Number(props.itemsObj.fabricIssued) > 0
    ) {
      if (dailyConsumption > Number(props.itemsObj.fabricIssued)) {
        props.popUpAction(
          Constant.validate_total_consump_,
          Constant.DefaultAlert_MSG,
          'OK',
          true,
          false,
        );
        return;
      }
    }

    let obj = {
      menuId: props.itemsObj.menuId,
      styleId: props.itemsObj.styleId,
      soId: props.itemsObj.soId,
      fabricId: props.itemsObj.fabricId,
      fabricType: props.routeParams.fabricType,
      fabricWastage: fabricWaste,
      damageQty: damageQty,
      rejectQty: rejectQty,
      fabricConsumption: dailyConsumption,
      username: userName,
      password: userPsd,
      userId: userId,
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
      sizeDetails: enterSizesArray,
      actualcon: actualConsumption,
      batchId: batchId ? batchId : 0,
      unitprice: unitPrice ? unitPrice : 0,
      companyLocation: locationId ? locationId : 0,
    };
    // console.log('Submit details ', obj);
    props.submitAction(obj);
  };

  // const untiPriceValue = (value, index) => {
  //   let tempArray = enterSizesArray;
  //   tempArray[index].enterQty = value ? value : '';
  //   set_enterSizesArray(tempArray);
  //   console.log(index , '-------->', tempArray[index].enterQty);

  //   let tempDaily = 0;
  //   let totalSum = 0;
  //   const approvedQty =
  //     props.routeParams.fabricType == 'Main Fabric'
  //       ? approvedConsumption?.toString()
  //       : props?.itemsObj?.trimApprovedconsumption?.toString();
  //   for (let i = 0; i < enterSizesArray.length; i++) {
  //     tempDaily += Number(enterSizesArray[i].enterQty) * Number(approvedQty);
  //     totalSum += Number(enterSizesArray[i].enterQty);
  //   }
  //   set_dailyConsumption(tempDaily);
  //   let v = tempDaily / totalSum;
  //   set_actualConsumption(v);
  //   // console.log("actual Consumption  ", tempDaily, totalSum, actualConsumption);
  // };

  // const actionOnBatchtype = (id, name) => {
  //   set_batchText(name);
  //   set_batchId(id);
  //   set_isBatchType(false)
  // }
  const untiPriceValue = (value, index) => {
    set_enterSizesArray(prevArray => {
      // Create a new array instead of modifying state directly
      const updatedArray = prevArray.map((item, i) => 
        i === index ? { ...item, enterQty: value ? value : '' } : item
      );
  
      console.log(index, '-------->', updatedArray[index].enterQty);
  
      let tempDaily = 0;
      let totalSum = 0;
      const approvedQty =
        props.routeParams.fabricType == 'Main Fabric'
          ? approvedConsumption?.toString()
          : props?.itemsObj?.trimApprovedconsumption?.toString();
          
      for (let i = 0; i < updatedArray.length; i++) {
        tempDaily += Number(updatedArray[i].enterQty) * Number(approvedQty);
        totalSum += Number(updatedArray[i].enterQty);
      }
  
      set_dailyConsumption(tempDaily);
      set_actualConsumption(totalSum ? tempDaily / totalSum : 0);
  
      return updatedArray; 
    });
  };
  

  const actionOnLocation = (locationId, locationName) => {
    set_locationId(locationId);
    set_locationName(locationName);
    set_showLocationList(false);
  };

  const handleSearchLocations = text => {
    // set_searchText(text);
    if (text.trim().length > 0) {
      const filtered = Object.keys(locationsList).filter(locationId =>
        locationsList[locationId].toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredLocations(filtered);
    } else {
      set_filteredLocations(Object.keys(locationsList));
    }
  };

  const actionOnBatchtype = (key, value) => {
    set_batchText(value);
    set_batchId(key);
    set_isBatchType(false);
  };

  const handleSearchBatchTypes = text => {
    // set_searchText(text);
    if (text.trim().length > 0) {
      const filtered = Object.keys(batchMapArr).filter(key =>
        batchMapArr[key].toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredBatchTypes(filtered);
    } else {
      set_filteredBatchTypes(Object.keys(batchMapArr));
    }
  };

  const actionOnEmployee = (key, value) => {
    set_employeeName(value);
    set_employeeId(key);
    set_showEmployeeList(false);
  };
  
  const handleSearchEmployees = text => {
    if (text.trim().length > 0) {
      const filtered = Object.keys(employeesList).filter(key =>
        employeesList[key].toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredEmployees(filtered);
    } else {
      set_filteredEmployees(Object.keys(employeesList));
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
          title={'Save Cutting Details'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={{marginTop: hp('3%'), width: '90%'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={[
              CommonStyles.tylesHeaderTextStyle,
              {flex: 1, textAlign: 'left'},
            ]}>
            {'Style'}
          </Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 0.3}]}>
            {' :  '}
          </Text>
          <Text
            style={[CommonStyles.tylesTextStyle, {flex: 3, textAlign: 'left'}]}>
            {props.itemsObj ? props.itemsObj.styleName : null}
          </Text>
        </View>
      </View>

      <View style={{marginTop: hp('3%'), width: '90%', marginBottom: hp('2%')}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={[
              CommonStyles.tylesHeaderTextStyle,
              {flex: 1, textAlign: 'left'},
            ]}>
            {props.routeParams.fabricType == 'Main Fabric'
              ? 'Main Fabric'
              : 'Trim Fabric'}
          </Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 0.3}]}>
            {' :  '}
          </Text>
          <Text
            style={[CommonStyles.tylesTextStyle, {flex: 3, textAlign: 'left'}]}>
            {props.routeParams ? props.routeParams.fabricName : null}
          </Text>
        </View>
      </View>

      <View style={{marginBottom: hp('5%')}}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={130}
          extraScrollHeight={130}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              backgroundColor: '#f8f8f8',
              width: '90%',  
              alignSelf: 'center', 
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%', 
              }}
              onPress={() => {
                set_isBatchType(!isBatchType);
              }}>
              <View style={[styles.SectionStyle1]}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={
                      batchText
                        ? [styles.dropTextLightStyle]
                        : [styles.dropTextInputStyle]
                    }>
                    {'Select Batch'}
                  </Text>
                  {batchText ? (
                    <Text style={[styles.dropTextInputStyle]}>{batchText}</Text>
                  ) : null}
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {/* Dropdown content (search bar and list) */}
            {isBatchType && (
              <View style={styles.dropdownContent}>
                {/* Search bar */}
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  onChangeText={handleSearchBatchTypes}
                  placeholderTextColor="#000"
                />

                {/* Dropdown list */}
                <ScrollView
                  nestedScrollEnabled={true}
                  style={styles.scrollView}>
                  {/* Check if filtered results are empty */}
                  {filteredBatchTypes.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredBatchTypes.map(key => (
                      <TouchableOpacity
                        key={key}
                        onPress={() =>
                          actionOnBatchtype(key, employeesList[key])
                        }>
                        <View style={styles.dropdownOption}>
                          <Text style={styles.dropTextInputStyle}>
                            {employeesList[key]}
                          </Text>
                        </View>
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
              marginTop: hp('1%'),
              backgroundColor: editLocation ? '#ffffff' : '#dedede',
              width: '90%',  
              alignSelf: 'center', 
            }}>
            {/* Dropdown button */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%', 
              }}
              onPress={() => {
                set_showLocationList(!showLocationList);
              }}>
              <View style={[styles.SectionStyle1]}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={
                      locationName
                        ? [styles.dropTextLightStyle]
                        : [styles.dropTextInputStyle]
                    }>
                    {'Select Location '}
                  </Text>
                  {locationName ? (
                    <Text style={[styles.dropTextInputStyle]}>
                      {locationName}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {/* Dropdown content (search bar and list) */}
            {showLocationList && editLocation && (
              <View style={styles.dropdownContent}>
                {/* Search bar */}
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  onChangeText={handleSearchLocations}
                  placeholderTextColor="#000"
                />

                {/* Dropdown list */}
                <ScrollView
                  nestedScrollEnabled={true}
                  style={styles.scrollView}>
                  {/* Check if filtered results are empty */}
                  {filteredLocations.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredLocations.map(locationId => (
                      <TouchableOpacity
                        key={locationId}
                        onPress={() =>
                          actionOnLocation(
                            locationId,
                            locationsList[locationId],
                          )
                        }>
                        <View style={styles.dropdownOption}>
                          <Text style={styles.dropTextInputStyle}>
                            {locationsList[locationId]}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {/* <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              backgroundColor: '#f8f8f8',
              width: '90%',  
              alignSelf: 'center', 
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%', 
              }}
              onPress={() => {
                set_showEmployeeList(!showEmployeeList);
              }}>
              <View style={[styles.SectionStyle1]}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={
                      employeeId
                        ? [styles.dropTextLightStyle]
                        : [styles.dropTextInputStyle]
                    }>
                    {'Select Employee'}
                  </Text>
                  {employeeId ? (
                    <Text style={[styles.dropTextInputStyle]}>{batchText}</Text>
                  ) : null}
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

           
            {showEmployeeList && (
              <View style={styles.dropdownContent}>
                
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  onChangeText={handleSearchEmployees}
                  placeholderTextColor="#000"
                />

               
                <ScrollView
                  nestedScrollEnabled={true}
                  style={styles.scrollView}>
                  
                  {filteredEmployees.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredEmployees.map(key => (
                      <TouchableOpacity
                        key={key}
                        onPress={() =>
                          actionOnEmployee(key, batchMapArr[key])
                        }>
                        <View style={styles.dropdownOption}>
                          <Text style={styles.dropTextInputStyle}>
                            {batchMapArr[key]}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View> */}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={unitPrice.toString()}
              labelText={'Unit Price'}
              isEditable={true}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'decimal-pad'}
              setValue={textAnswer => {
                set_unitPrice(textAnswer);
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={
                props.routeParams.fabricType == 'Main Fabric'
                  ? approvedConsumption?.toString()
                  : props?.itemsObj?.trimApprovedconsumption?.toString()
              }
              labelText={'Approved Consumption'}
              isEditable={false}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
              setValue={textAnswer => {}}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              // inputText={actualConsumption?.toString()}
              inputText={
                props.routeParams.fabricType == 'Main Fabric'
                  ? actualConsumption?.toString()
                  : props.itemsObj?.actualConsumtionTrim?.toString()
              }
              labelText={'Actual Consumption'}
              isEditable={false}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
              setValue={textAnswer => {
                set_actualConsumption(textAnswer);
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={props.itemsObj ? props.itemsObj.fabricIssued : ''}
              labelText={'Fabric Issued'}
              isEditable={false}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
              setValue={textAnswer => {}}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={fabricUsed.toString()}
              labelText={'Fabric Used'}
              isEditable={false}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
              setValue={textAnswer => {
                set_fabricUsed(textAnswer.toString());
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={fabricBalance ? fabricBalance.toString() : ''}
              labelText={'Fabric Balance'}
              isEditable={false}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
              setValue={textAnswer => {
                set_fabricBalance(textAnswer.toString());
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={fabricReturn.toString()}
              labelText={'Fabric Returned'}
              isEditable={false}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
              setValue={textAnswer => {
                set_fabricReturn(textAnswer.toString());
              }}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={dailyConsumption.toString()}
              labelText={' Total Daily Consumption'}
              isEditable={true}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
              setValue={textAnswer => {
                set_dailyConsumption(textAnswer.toString());
              }}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={fabricUsed.toString()}
              labelText={' Total  Consumption'}
              isEditable={false}
              maxLengthVal={10}
              autoCapitalize={'none'}
              keyboardType={'numeric'}
              setValue={textAnswer => {
                set_dailyConsumption(textAnswer.toString());
              }}
            />
          </View>
          <View style={CommonStyles.listStyle3}>
            {enterSizesArray &&
              enterSizesArray.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginTop: hp('2%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Changed from 'center'
                    width: '100%', // Ensure full width
                    paddingHorizontal: wp('5%'), // Add padding if needed
                  }}>
                  <View style={{width: '65%', marginRight: '9%'}}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{width: '90%'}}>
                        <TextInput
                          label={item.size}
                          value={item.enterQty}
                          mode="outlined"
                          editable={true}
                           keyboardType="numeric"
                           onChangeText={textAnswer => {
                            console.log("text answer ", textAnswer, index)
                            untiPriceValue(textAnswer, index);
                          }}
                        />
                      </View>
                      <View style={{position: 'relative'}}>
                        <Text
                          style={{
                            backgroundColor: colors.color2,
                            color: 'white',
                            padding: 3,
                            paddingHorizontal: 10,
                            borderRadius: Platform.OS === 'ios' ? 12 : 30,
                            position: 'absolute',
                            left: -10,
                            bottom: 15,
                            overflow: 'hidden',
                          }}>
                          {(item.sizeQty - item.remQty).toString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{width: '25%'}}>
                    <TextInput
                      label="Rem Qty"
                      value={item.remQty.toString()}
                      mode="outlined"
                      editable={false}
                      onChangeText={text => console.log(text)}
                    />
                  </View>
                </View>
              ))}
            <View style={{height: 180}} />
          </View>
       
        </KeyboardAwareScrollView>
      </View>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Submit'}
          isLeftBtnEnable={false}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => submitAction()}
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

      {/* {isBatchType ? <View style={[styles.popSearchViewStyle]}>

        <FlatList
          style={styles.flatcontainer}
          data={batchMapArr}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity  onPress={() => actionOnBatchtype(item)}>
              <View style={styles.flatview}>
                <Text style={[styles.dropTextInputStyle]}>{item.key}</Text>
              </View>
            </TouchableOpacity>)}
          enableEmptySections={true}
          keyExtractor={(item) => item.key}
        />

      </View> : null} */}

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

export default CuttingSaveUI;

const styles = StyleSheet.create({
  popSearchViewStyle: {
    height: hp('40%'),
    width: wp('90%'),
    backgroundColor: '#DCDCDC',
    // bottom: 220,
    // position: 'absolute',
    // flex:1,
    alignSelf: 'center',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: 'center',
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
    // justifyContent: "center",
    alignItems: 'center',
    height: hp('7%'),
    width: '75%',
    borderRadius: hp('0.5%'),
    // alignSelf: "center",
    // backgroundColor: "grey",
  },

  imageStyle: {
    // margin: "4%",
    height: wp('12%'),
    aspectRatio: 1,
    marginRight: wp('8%'),
    resizeMode: 'stretch',
  },

  dropTextInputStyle: {
    fontWeight: 'normal',
    fontSize: 18,
    marginLeft: wp('4%'),
    color: 'black',
    width: wp('80%'),
  },

  dropTextLightStyle: {
    fontWeight: 300,
    fontSize: 12,
    width: wp('60%'),
    alignSelf: 'flex-start',
    marginTop: hp('1%'),
    marginLeft: wp('4%'),
    color: 'black',
  },
  dropdownContent: {
    elevation: 5,
    height: 220,
    alignSelf: 'center',
    width: '100%',  
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'lightgray', 
    borderWidth: 1,
    marginTop: 3,
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
    // paddingHorizontal: wp("2%"),
    maxHeight: 150,
  },

  dropdownOption: {
    padding: hp('1.5%'),
    borderBottomWidth: 0.5,
    borderColor: '#D8D8D8',
  },
  noCategoriesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
