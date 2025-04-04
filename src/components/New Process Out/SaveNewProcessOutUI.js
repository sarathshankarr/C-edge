


  import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateIntoDMY} from '../../utils/constants/constant';
import {RadioButton, TextInput} from 'react-native-paper';
import {ColorContext} from '../colorTheme/colorTheme';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';
let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const SaveNewProcessOutUI = ({route, navigation, ...props}) => {
  const [style1, setStyle1] = useState('');
  const [styleDescription, setStyleDescription] = useState('');
  const [color, setColor] = useState('');
  const [style2, setStyle2] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [rows, setRows] = React.useState([]);

  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      console.log('props for child  ', props.itemsObj[0]?.childDetails);
      if (props.itemsObj[0]) {
        if (props.itemsObj[0]?.childDetails) {
          setRows(props.itemsObj[0]?.childDetails);
        }
        if (props.itemsObj[0]?.styleName) {
          setstyleNo(props.itemsObj[0]?.styleName);
        }
        if (props.itemsObj[0]?.partsName) {
          setParts(props.itemsObj[0]?.partsName);
        }
        if (props.itemsObj[0]?.process) {
          setProcess(props.itemsObj[0]?.process);
        }
        if (props.itemsObj[0]?.price) {
          setPrice(props.itemsObj[0]?.price);
        }
      }
    }
  }, [props.itemsObj]);

  const [batchList, setBatchList] = useState([]);
  const [filteredBatch, setFilteredBatch] = useState([]);
  const [showBatchList, setShowBatchList] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchId, setBatchId] = useState('');
  
  const actionOnBatch = item => {
    setBatchId(item.id);
    setBatchName(item.name);
    setShowBatchList(false);
  };
  
  const handleSearchBatch = text => {
    if (text.trim().length > 0) {
      const filtered = batchList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredBatch(filtered);
    } else {
      setFilteredBatch(batchList);
    }
  };
  
  // Employee States
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  const actionOnEmployee = item => {
    setEmployeeId(item.id);
    setEmployeeName(item.name);
    setShowEmployeeList(false);
  };
  
  const handleSearchEmployee = text => {
    if (text.trim().length > 0) {
      const filtered = employeeList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredEmployee(filtered);
    } else {
      setFilteredEmployee(employeeList);
    }
  };
  
  // Location States
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
  
  // Style States
  const [styleList, setStyleList] = useState([]);
  const [filteredStyle, setFilteredStyle] = useState([]);
  const [showStyleList, setShowStyleList] = useState(false);
  const [styleName, setStyleName] = useState('');
  const [styleId, setStyleId] = useState('');
  
  const actionOnStyle = item => {
    setStyleId(item.id);
    setStyleName(item.name);
    setShowStyleList(false);
  };
  
  const handleSearchStyle = text => {
    if (text.trim().length > 0) {
      const filtered = styleList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredStyle(filtered);
    } else {
      setFilteredStyle(styleList);
    }
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    let obj = {
      umoType: uomType,
      umoDescription: uomDescription,
      fabuomvalue: fabricUom ? 1 : 0,
      workorderuom: workOrderUom,
      umoId: props?.itemsObj?.umoId,
    };
    props.submitAction(obj);
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  const [processList, setProcessList] = useState([]);
  const [filteredProcess, setFilteredProcess] = useState([]);
  const [showProcessList, setShowProcessList] = useState(false);
  const [processName, setProcessName] = useState('');
  const [processId, setProcessId] = useState('');

  const actionOnProcess = item => {
    setProcessId(item.id);
    setProcessName(item.name);
    setShowProcessList(false);
  };

  const handleSearchProcess = text => {
    if (text.trim().length > 0) {
      const filtered = processList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProcess(filtered);
    } else {
      setFilteredProcess(processList);
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
          title={'Edit New Process Out'}
          backBtnAction={() => backAction()}
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
            // width: '100%',
            marginHorizontal: wp('5%'),
          }}>
      <View style={{marginTop: hp('2%')}}>
                  <TextInput
                    label="Style"
                    value={style1}
                    mode="outlined"
                    onChangeText={text => setStyle1(text)}
                  />
                </View>
                <View style={{marginTop: hp('2%')}}>
                  <TextInput
                    label="Style Description"
                    value={styleDescription}
                    mode="outlined"
                    onChangeText={text => setStyleDescription(text)}
                  />
                </View>
                <View style={{marginTop: hp('2%')}}>
                  <TextInput
                    label="Style"
                    value={style2}
                    mode="outlined"
                    onChangeText={text => setStyle2(text)}
                  />
                </View>
                <View style={{marginTop: hp('2%')}}>
                  <TextInput
                    label="Color"
                    value={color}
                    mode="outlined"
                    onChangeText={text => setColor(text)}
                  />
                </View>
                <View style={{marginTop: hp('2%')}}>
                  <TextInput
                    label="Unit Price"
                    value={unitPrice}
                    mode="outlined"
                    onChangeText={text => setUnitPrice(text)}
                  />
                </View>
                <View style={{marginTop: hp('2%')}}>
                  <TextInput
                    label="Buyer Name"
                    value={buyerName}
                    mode="outlined"
                    onChangeText={text => setBuyerName(text)}
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
                      setShowProcessList(!showProcessList);
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
                            {'Process *'}
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
      
                  {showProcessList && (
                    <View style={styles.dropdownContent1}>
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search "
                        onChangeText={handleSearchProcess}
                        placeholderTextColor="#000"
                      />
                      <ScrollView
                        style={styles.scrollView}
                        nestedScrollEnabled={true}>
                        {filteredProcess.length === 0 ? (
                          <Text style={styles.noCategoriesText}>
                            Sorry, no results found!
                          </Text>
                        ) : (
                          filteredProcess.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.dropdownOption}
                              onPress={() => actionOnProcess(item)}>
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
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setShowBatchList(!showBatchList);
                    }}>
                    <View>
                      <View style={[styles.SectionStyle1, {}]}>
                        <View style={{flexDirection: 'column'}}>
                          <Text
                            style={
                              batchId
                                ? [styles.dropTextLightStyle]
                                : [styles.dropTextInputStyle]
                            }>
                            {'Batch '}
                          </Text>
                          {batchId ? (
                            <Text style={[styles.dropTextInputStyle]}>
                              {batchName}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
      
                    <View style={{justifyContent: 'center'}}>
                      <Image source={downArrowImg} style={styles.imageStyle} />
                    </View>
                  </TouchableOpacity>
      
                  {showBatchList && (
                    <View style={styles.dropdownContent1}>
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search "
                        onChangeText={handleSearchBatch}
                        placeholderTextColor="#000"
                      />
                      <ScrollView
                        style={styles.scrollView}
                        nestedScrollEnabled={true}>
                        {filteredBatch.length === 0 ? (
                          <Text style={styles.noCategoriesText}>
                            Sorry, no results found!
                          </Text>
                        ) : (
                          filteredBatch.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.dropdownOption}
                              onPress={() => actionOnBatch(item)}>
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
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setShowEmployeeList(!showEmployeeList);
                    }}>
                    <View>
                      <View style={[styles.SectionStyle1, {}]}>
                        <View style={{flexDirection: 'column'}}>
                          <Text
                            style={
                              employeeId
                                ? [styles.dropTextLightStyle]
                                : [styles.dropTextInputStyle]
                            }>
                            {'Employee '}
                          </Text>
                          {employeeId ? (
                            <Text style={[styles.dropTextInputStyle]}>
                              {employeeName}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
      
                    <View style={{justifyContent: 'center'}}>
                      <Image source={downArrowImg} style={styles.imageStyle} />
                    </View>
                  </TouchableOpacity>
      
                  {showEmployeeList && (
                    <View style={styles.dropdownContent1}>
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search "
                        onChangeText={handleSearchEmployee}
                        placeholderTextColor="#000"
                      />
                      <ScrollView
                        style={styles.scrollView}
                        nestedScrollEnabled={true}>
                        {filteredEmployee.length === 0 ? (
                          <Text style={styles.noCategoriesText}>
                            Sorry, no results found!
                          </Text>
                        ) : (
                          filteredEmployee.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.dropdownOption}
                              onPress={() => actionOnEmployee(item)}>
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
                      setShowStyleList(!styleList);
                    }}>
                    <View>
                      <View style={[styles.SectionStyle1, {}]}>
                        <View style={{flexDirection: 'column'}}>
                          <Text
                            style={
                              styleId
                                ? [styles.dropTextLightStyle]
                                : [styles.dropTextInputStyle]
                            }>
                            {'Style '}
                          </Text>
                          {styleId ? (
                            <Text style={[styles.dropTextInputStyle]}>
                              {styleName}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
      
                    <View style={{justifyContent: 'center'}}>
                      <Image source={downArrowImg} style={styles.imageStyle} />
                    </View>
                  </TouchableOpacity>
      
                  {showStyleList && (
                    <View style={styles.dropdownContent1}>
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search "
                        onChangeText={handleSearchStyle}
                        placeholderTextColor="#000"
                      />
                      <ScrollView
                        style={styles.scrollView}
                        nestedScrollEnabled={true}>
                        {filteredStyle.length === 0 ? (
                          <Text style={styles.noCategoriesText}>
                            Sorry, no results found!
                          </Text>
                        ) : (
                          filteredStyle.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.dropdownOption}
                              onPress={() => actionOnStyle(item)}>
                              <Text style={{color: '#000'}}>{item.name}</Text>
                            </TouchableOpacity>
                          ))
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Date</Text>
                  </View>
                  <View style={{width: 15}}></View>
                  <View style={{width: 120}}>
                    <Text style={styles.table_head_captions}>Barcode No</Text>
                  </View>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Qty</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Lot No</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Bundle No</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Employee Name
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Remarks</Text>
                  </View>
                </View>
                {/* Table Body - Rows */}
                {rows.map((row, index) => (
                  <View key={index} style={styles.table_body_single_row}>
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>{row.enterDate}</Text>
                    </View>
                    <View style={{width: 15}}></View>
                    <View style={{width: 120}}>
                      <Text style={styles.table_data}>{row.barCode}</Text>
                    </View>
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>{row.size}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.enterQty}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.lotno}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.bundleno}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.username}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {row.remarksDamaged}
                      </Text>
                    </View>
                  </View>
                ))}
                <View style={styles.table_body_single_row}>
                  <View style={{width: 60}}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'black',
                        alignItems: 'center',
                      }}>
                      {'Total'}
                    </Text>
                  </View>
                  <View style={{width: 15}}></View>
                  <View style={{width: 120}}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'black',
                        alignItems: 'center',
                      }}>
                      {rows.length}
                    </Text>
                  </View>
                  <View style={{width: 60}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                </View>
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
          rigthBtnState={false}
          isRightBtnEnable={false}
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

export default SaveNewProcessOutUI;

const getStyles = colors =>
  StyleSheet.create({
    popSearchViewStyle: {
      height: hp('40%'),
      width: wp('90%'),
      backgroundColor: '#f0f0f0',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
      // borderTopRightRadius: 15,
      // borderTopLeftRadius: 15,
      alignItems: 'center',
    },
    popSearchViewStyle1: {
      width: wp('90%'),
      backgroundColor: '#f0f0f0',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
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
      width: wp('75%'),
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
      color: '#000',
    },
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      // flex: 1,
      marginTop: hp('2%'),
      width: '100%',
      // paddingHorizontal: 10,
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      backgroundColor: colors.color2,
      alignItems: 'center',
    },
    table_head_captions: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
    },

    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      alignItems: 'center',
    },
    table_data: {
      fontSize: 11,
      color: '#000',
      alignItems: 'center',
    },
    table: {
      // margin: 15,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 1,
      backgroundColor: '#fff',
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
    dropdownContent1: {
      elevation: 5,
      // height: 220,
      maxHeight: 220,
      alignSelf: 'center',
      width: '98%',
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
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '45%', // Adjust width for better alignment
      marginVertical: 5,
      marginHorizontal: 5,
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#000',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },
  });
