import React, {useState, useRef, useEffect} from 'react';
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

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const CreatePurchaseOrderDraftUI = ({route, navigation, ...props}) => {
  const [employeeBarcode, setEmployeeBarcode] = useState('');
  const [rows, setRows] = React.useState([]);

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

  // Process
// Vendor state variables
const [vendorList, setVendorList] = useState([]);
const [filteredVendor, setFilteredVendor] = useState([]);
const [showVendorList, setShowVendorList] = useState(false);
const [vendorName, setVendorName] = useState(''); // Default can be set as needed
const [vendorId, setVendorId] = useState('');

// Ship To state variables
const [shipToList, setShipToList] = useState([]);
const [filteredShipTo, setFilteredShipTo] = useState([]);
const [showShipToList, setShowShipToList] = useState(false);
const [shipToName, setShipToName] = useState('');
const [shipToId, setShipToId] = useState('');

// Ship Location state variables
const [shipLocationList, setShipLocationList] = useState([]);
const [filteredShipLocation, setFilteredShipLocation] = useState([]);
const [showShipLocationList, setShowShipLocationList] = useState(false);
const [shipLocationName, setShipLocationName] = useState('');
const [shipLocationId, setShipLocationId] = useState('');


// Vendor functions
const actionOnVendor = item => {
  setVendorId(item.id);
  setVendorName(item.name);
  setShowVendorList(false);
};

const handleSearchVendor = text => {
  if (text.trim().length > 0) {
    const filtered = vendorList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVendor(filtered);
  } else {
    setFilteredVendor(vendorList);
  }
};

// Ship To functions
const actionOnShipTo = item => {
  setShipToId(item.id);
  setShipToName(item.name);
  setShowShipToList(false);
};

const handleSearchShipTo = text => {
  if (text.trim().length > 0) {
    const filtered = shipToList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredShipTo(filtered);
  } else {
    setFilteredShipTo(shipToList);
  }
};

// Ship Location functions
const actionOnShipLocation = item => {
  setShipLocationId(item.id);
  setShipLocationName(item.name);
  setShowShipLocationList(false);
};

const handleSearchShipLocation = text => {
  if (text.trim().length > 0) {
    const filtered = shipLocationList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredShipLocation(filtered);
  } else {
    setFilteredShipLocation(shipLocationList);
  }
};


  const backAction = async () => {
    props.backBtnAction();
  };

  const submitAction = async () => {
    // rows.map((row,index)=> (
      let usercompanyId = await AsyncStorage.getItem('companyId');

    const checkedData = [];
    rows.forEach((item, index) => {
      const tempObj = {
        empcode: item.empBarcode,
        barcodeid: item.barcodeid,
        scanQty: item.damagedQty,
        nxtProcessQty: 0,
        remarksDamaged: item.remarks,
        processid: item.processId,
        enterDate: item.enterDate,
        queryFlag: 0,
        companyId: usercompanyId,
      };
      checkedData.push(tempObj);
    });

    console.log('checkedData ==> ', checkedData);

    props.submitAction(checkedData);
  };

 

  const handleRemoveRow = id => {
    setRows(prev => prev.filter((_, index) => index !== id));
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
          title={'Create PO'}
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
            // width: '100%',
            marginHorizontal: wp('5%'),
          }}>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Employee Barcode *"
              value={employeeBarcode}
              mode="outlined"
              onChangeText={text => setEmployeeBarcode(text)}
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
                setShowVendorList(!showVendorList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        vendorId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Vendor *'}
                    </Text>
                    {vendorId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {vendorName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showVendorList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchVendor}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredVendor.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredVendor.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnVendor(item)}>
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
                setShowShipLocationList(!showShipLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        shipLocationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Ship Location *'}
                    </Text>
                    {shipLocationId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {shipLocationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showShipLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchShipLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredShipLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredShipLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnShipLocation(item)}>
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
                setShowShipToList(!showShipToList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        shipToId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Ship To *'}
                    </Text>
                    {shipToId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {shipToName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showShipToList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchShipTo}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredShipTo.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredShipTo.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnShipTo(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>


          {false && <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Action</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Date</Text>
                  </View>
                  <View style={{width: 120}}>
                    <Text style={styles.table_head_captions}>Style No</Text>
                  </View>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Qty</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Damage Qty</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Process</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Part</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Barcode</Text>
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
                      <TouchableOpacity
                        style={{alignItems: '', justifyContent: ''}}
                        onPress={() => handleRemoveRow(index)}>
                        <Image source={closeImg} style={styles.imageStyle1} />
                      </TouchableOpacity>
                    </View>

                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.enterDate}</Text>
                    </View>
                    <View style={{width: 120}}>
                      <Text style={styles.table_data}>{row.styleNo}</Text>
                    </View>

                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>{row.size}</Text>
                    </View>
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>{row.inputQty}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={row.damagedQty}
                        onChangeText={text => {
                          setRows(
                            rows.map((r, i) =>
                              i === index ? {...r, damagedQty: text} : r,
                            ),
                          );
                        }}
                      />
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.process}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.partsName}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.barCode}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.username}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={row.remarks}
                        onChangeText={text => {
                          setRows(
                            rows.map((r, i) =>
                              i === index ? {...r, remarks: text} : r,
                            ),
                          );
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>}


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

export default CreatePurchaseOrderDraftUI;

const styles = StyleSheet.create({
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
    flex: 1,
    marginTop: hp('5%'),
    width: '100%',
  },
  table: {
    width: '100%', // Reduces extra space on the sides
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#5177c0',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  table_head_captions: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  table_body_single_row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 7,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  table_data: {
    fontSize: 13,
    color: '#333',
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
