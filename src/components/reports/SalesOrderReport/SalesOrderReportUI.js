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
  Alert,
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

const SalesOrderReportUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  const [data, setData] = useState([]);
  const [checkbox, set_checkbox] = useState(false);

  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomer, set_filteredCustomer] = useState([]);
  const [showCustomerList, set_showCustomerList] = useState(false);
  const [customerName, set_customerName] = useState('');
  const [customerId, set_customerId] = useState('');

  const [agentList, setAgentList] = useState([]);
  const [filteredAgent, set_filteredAgent] = useState([]);
  const [showAgentList, set_showAgentList] = useState(false);
  const [agentName, set_agentName] = useState('');
  const [agentId, set_agentId] = useState('');

  const LList = [
    {id: 0, name: 'Select'},
    {id: 1, name: 'Registered'},
    {id: 2, name: 'UnRegistered'},
  ];

  const [gstList, setGstList] = useState(LList);
  const [filteredGst, set_filteredGst] = useState(LList);
  const [showGstList, set_showGstList] = useState(false);
  const [gstName, set_gstName] = useState('');
  const [gstId, set_gstId] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startDate, set_startDate] = useState('');
  const [endDate, set_endDate] = useState('');
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    if (props?.itemsObj) {
      // console.log('props?.itemsObj ', props?.itemsObj);
      if (props?.itemsObj.vendorsCustomersMap) {
        const formattedMap = Object.keys(
          props?.itemsObj.vendorsCustomersMap,
        ).map(key => ({
          id: key,
          name: props?.itemsObj.vendorsCustomersMap[key],
        }));
        setCustomerList(formattedMap);
        set_filteredCustomer(formattedMap);
      }

      if (props?.itemsObj.agentcustomer) {
        const formattedMap = Object.keys(props?.itemsObj.agentcustomer).map(
          key => ({
            id: key,
            name: props?.itemsObj.agentcustomer[key],
          }),
        );
        setAgentList(formattedMap);
        set_filteredAgent(formattedMap);
      }
    }
  }, [props.itemsObj]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const formattedDate=(date)=>{
    let [d,m,y]=date.split('-');
    let formatted=[y,m,d].join('-');
    return formatted;
  }

  const ApproveAction = () => {

    if(!startDate || !endDate){
      Alert.alert("Alert", "Please select Start Date Date and End Date to Proceed");
      return;
    }
    console.log('Approved');

    let tempObj = {
      startDate: formattedDate(startDate), 
      endDate: formattedDate(endDate), 
      vendorCustomerId: customerId, 
      agent: agentId, 
      registerId: gstId, 
    };

    console.log("SAVING OBJ=====>   ", tempObj);
    // return;
    props.submitAction(tempObj);
  };

  const RejectAction = remarks => {
    console.log('Rejected');
  };

  const actionOnCustomer = (item) => {
    set_customerId(item.id);
    set_customerName(item.name);
    set_showCustomerList(false);
  };

  const actionOnAgent = (item) => {
    set_agentId(item.id);
    set_agentName(item.name);
    set_showAgentList(false);
  };

  const actionOnGst = (item) => {
    set_gstId(item.id);
    set_gstName(item.name);
    set_showGstList(false);
  };

  const handleSearchCustomer = text => {
    if (text.trim().length > 0) {
      const filtered = customerList.filter(customer =>
        customer.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredCustomer(filtered);
    } else {
      set_filteredCustomer(customerList);
    }
  };

  const handleSearchAgent = text => {
    if (text.trim().length > 0) {
      const filtered = agentList.filter(agent =>
        agent.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredAgent(filtered);
    } else {
      set_filteredAgent(agentList);
    }
  };

  const handleSearchGst = text => {
    if (text.trim().length > 0) {
      const filtered = gstList.filter(gst =>
        gst.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredGst(filtered);
    } else {
      set_filteredGst(gstList);
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

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Sales Order Report'}
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
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%', paddingHorizontal: 10}}>
              <TextInput
                label="Start Date *"
                value={startDate ? startDate : ''}
                placeholder="Start Date"
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
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%', paddingHorizontal: 10}}>
              <TextInput
                label="End Date *"
                value={endDate ? endDate : ''}
                placeholderTextColor="#000"
                placeholder="End Date"
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
                set_showCustomerList(!showCustomerList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        customerId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Customer'}
                    </Text>
                    {customerId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {customerName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showCustomerList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchCustomer}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredCustomer.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredCustomer.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnCustomer(item)}>
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
                set_showAgentList(!showAgentList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        agentId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Agent'}
                    </Text>
                    {agentId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {agentName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showAgentList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchAgent}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredAgent.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredAgent.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnAgent(item)}>
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
                set_showGstList(!showGstList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        gstId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'GST'}
                    </Text>
                    {gstId ? (
                      <Text style={[styles.dropTextInputStyle]}>{gstName}</Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showGstList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchGst}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredGst.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredGst.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnGst(item)}>
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

export default SalesOrderReportUI;

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
