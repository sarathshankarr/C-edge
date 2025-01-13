import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import * as Constant from "../../../utils/constants/constant";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import { ColorContext } from '../../colorTheme/colorTheme';
import { TextInput } from 'react-native-paper';
import { RadioGroup } from 'react-native-radio-buttons-group';
let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');

const LocationMasterEditUI = ({ route, ...props }) => {

  const { colors } = useContext(ColorContext);
  const styles = getStyles(colors);

   useEffect(() => {
      // if (props?.itemsArray) {
      //   if (props.itemsArray.machineNosMap) {
      //     set_filteredmachineNo(props.itemsArray.machineNosMap);
      //     setMachineNoList(props.itemsArray.machineNosMap);
      //   }
      //   if (props.itemsArray.empMap) {
      //     set_filteredattendedBy(props.itemsArray.empMap);
      //     setAttendedByList(props.itemsArray.empMap);
      //   }
      //   if (props.itemsArray.shiftMap) {
      //     set_shiftList(props.itemsArray.shiftMap);
      //   }
      // }
    }, [props.itemsArray]);
 
    const [customerRadio, set_customerRadio] = useState('Yes');
    const [companyRadio, set_companyRadio] = useState('No');
  
    const [locationName, set_locationName] = useState('');
    const [locationCode, set_locationCode] = useState('');
    const [address, set_address] = useState('');
    const [landmark, set_landmark] = useState('');
    const [city, set_city] = useState('');
    const [pincode, set_pincode] = useState('');
    const [agent, set_agent] = useState('');
    const [subagent, set_subagent] = useState('');
    const [gst, set_gst] = useState('');
    const [status, set_status] = useState('');
    const [deliveryChallanPrefix, set_deliveryChallanPrefix] = useState('');
  
    const [customerList, setCustomerList] = useState([]);
    const [filteredCustomer, setFilteredCustomer] = useState([]);
    const [showCustomerList, setShowCustomerList] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [showCustomer, setShowCustomer] = useState(false);
  
    const actionOnCustomer = item => {
      setCustomerId(item.id);
      setCustomerName(item.name);
      setShowCustomerList(false);
    };
  
    const handleSearchCustomer = text => {
      if (text.trim().length > 0) {
        const filtered = customerList.filter(user =>
          user.name.toLowerCase().includes(text.toLowerCase()),
        );
        setFilteredCustomer(filtered);
      } else {
        setFilteredCustomer(customerList);
      }
    };
  
    const [statusList, setStatusList] = useState([]);
    const [filteredStatus, setFilteredStatus] = useState([]);
    const [showStatusList, setShowStatusList] = useState(false);
    const [statusName, setStatusName] = useState('');
    const [statusId, setStatusId] = useState('');
    const [showStatus, setShowStatus] = useState(false);
  
    const actionOnStatus = item => {
      setStatusId(item.id);
      setStatusName(item.name);
      setShowStatusList(false);
    };
  
    const handleSearchStatus = text => {
      if (text.trim().length > 0) {
        const filtered = statusList.filter(user =>
          user.name.toLowerCase().includes(text.toLowerCase()),
        );
        setFilteredStatus(filtered);
      } else {
        setFilteredStatus(statusList);
      }
    };
  

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    props.submitAction(props?.itemsObj?.designId, remarks1, statusArrayId, remarks2);
  };

  const generalRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Customer/Vendor',
        value: 'Customer',
        selected: customerRadio === 'Yes',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Company',
        value: 'Company',
        selected: companyRadio === 'Yes',
        labelStyle: {color: '#000'},
      },
    ],
    [customerRadio, companyRadio],
  );

  const handleRadioChange = selectedId => {
    const selectedOption = generalRadioButtons.find(
      button => button.id === selectedId,
    );
    if (selectedOption.value === 'Customer') {
      set_customerRadio('Yes');
      set_companyRadio('No');
    } else {
      set_customerRadio('No');
      set_companyRadio('Yes');
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
          title={'Location Master Edit'}
          backBtnAction={() => backBtnAction()}
        />
      </View>


      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%')}}>
         <View
                 style={{
                   marginBottom: hp('5%'),
                   width: '90%',
                   marginHorizontal: wp('5%'),
                   marginTop: hp('2%')
                 }}>
       
                 <RadioGroup
                   style={{flexDirection: 'row', justifyContent:'space-between'}}
                   radioButtons={generalRadioButtons}
                   onPress={handleRadioChange}
                   layout="row"
                   selectedId={
                     generalRadioButtons.find(
                       item =>
                         item.value ===
                         (customerRadio === 'Yes' ? 'Customer' : 'Company'),
                     )?.id
                   }
                 />
       
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
                       set_showLocationList(!showCustomerList);
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
                             {'Customer / Vendor'}
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
       
                 <View style={{marginTop: hp('2%')}}>
                   <TextInput
                     label="Location Name *"
                     value={locationName}
                     mode="outlined"
                     onChangeText={text => set_locationName(text)}
                   />
                 </View>
                 <View style={{marginTop: hp('2%')}}>
                   <TextInput
                     label="Location Code"
                     value={locationCode}
                     mode="outlined"
                     onChangeText={text => set_locationCode(text)}
                   />
                 </View>
                 <View style={{marginTop: hp('2%')}}>
                   <TextInput
                     label="Address"
                     value={address}
                     mode="outlined"
                     multiline
                     numberOfLines={3}
                     onChangeText={text => set_address(text)}
                   />
                 </View>
                 <View style={{marginTop: hp('2%')}}>
                   <TextInput
                     label="Landmark"
                     value={landmark}
                     mode="outlined"
                     multiline
                     numberOfLines={3}
                     onChangeText={text => set_landmark(text)}
                   />
                 </View>
                 <View style={{marginTop: hp('2%')}}>
                   <TextInput
                     label="Pincode"
                     value={pincode}
                     mode="outlined"
                     onChangeText={text => set_pincode(text)}
                   />
                 </View>
                 <View style={{marginTop: hp('2%')}}>
                   <TextInput
                     label="Agent"
                     value={agent}
                     mode="outlined"
                     onChangeText={text => set_agent(text)}
                   />
                 </View>
                 <View style={{marginTop: hp('2%')}}>
                   <TextInput
                     label="SubAgent "
                     value={subagent}
                     mode="outlined"
                     onChangeText={text => set_subagent(text)}
                   />
                 </View>
                 <View style={{marginTop: hp('2%')}}>
                   <TextInput
                     label="GST "
                     value={subagent}
                     mode="outlined"
                     onChangeText={text => set_subagent(text)}
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
                       width: wp('90%'),
                     }}
                     onPress={() => {
                       setShowStatus(!showStatusList);
                     }}>
                     <View>
                       <View style={[styles.SectionStyle1, {}]}>
                         <View style={{flexDirection: 'column'}}>
                           <Text
                             style={
                               statusId
                                 ? [styles.dropTextLightStyle]
                                 : [styles.dropTextInputStyle]
                             }>
                             {'Status '}
                           </Text>
                           {statusId ? (
                             <Text style={[styles.dropTextInputStyle]}>
                               {statusName}
                             </Text>
                           ) : null}
                         </View>
                       </View>
                     </View>
       
                     <View style={{justifyContent: 'center'}}>
                       <Image source={downArrowImg} style={styles.imageStyle} />
                     </View>
                   </TouchableOpacity>
       
                   {showStatusList && (
                     <View style={styles.dropdownContent1}>
                       <TextInput
                         style={styles.searchInput}
                         placeholder="Search "
                         onChangeText={handleSearchStatus}
                         placeholderTextColor="#000"
                       />
                       <ScrollView
                         style={styles.scrollView}
                         nestedScrollEnabled={true}>
                         {filteredStatus.length === 0 ? (
                           <Text style={styles.noCategoriesText}>
                             Sorry, no results found!
                           </Text>
                         ) : (
                           filteredStatus.map((item, index) => (
                             <TouchableOpacity
                               key={index}
                               style={styles.dropdownOption}
                               onPress={() => actionOnStatus(item)}>
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
                     label="Delivery Challan Prefix "
                     value={deliveryChallanPrefix}
                     mode="outlined"
                     onChangeText={text => set_deliveryChallanPrefix(text)}
                   />
                 </View>
               </View>
      </KeyboardAwareScrollView>


      <View style={CommonStyles.bottomViewComponentStyle}>

        <BottomComponent
          rightBtnTitle={'Submit'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          leftButtonAction={() => backBtnAction()}
          rightButtonAction={async () => submitAction()}
        />
      </View>

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

      {props.isLoading === true ? <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} /> : null}

    </View>
  );
}

export default LocationMasterEditUI;

const getStyles = (colors) => StyleSheet.create({

  popSearchViewStyle: {
    height: hp("40%"),
    width: wp("90%"),
    backgroundColor: '#E5E4E2',
    // bottom: 220,
    // position: 'absolute',
    // flex:1,
    alignSelf: 'center',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: "center",
  },

  flatcontainer: {
    flex: 1,
  },

  flatview: {
    height: hp("8%"),
    marginBottom: hp("0.3%"),
    alignContent: "center",
    justifyContent: "center",
    borderBottomColor: "black",
    borderBottomWidth: wp("0.1%"),
    width: wp('80%'),
    alignItems: "center",
  },

  SectionStyle1: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    height: hp("7%"),
    width: wp("75%"),
    borderRadius: hp("0.5%"),
    // alignSelf: "center",
    // backgroundColor: "grey",
  },

  imageStyle: {
    // margin: "4%",
    height: wp("12%"),
    aspectRatio: 1,
    marginRight: wp('8%'),
    resizeMode: 'stretch',
  },

  dropTextInputStyle: {
    fontWeight: "normal",
    fontSize: 18,
    marginLeft: wp('4%'),
    color: 'black',
    width: wp('80%'),
  },

  dropTextLightStyle: {
    fontWeight: 300,
    fontSize: 12,
    width: wp("60%"),
    alignSelf: 'flex-start',
    marginTop: hp("1%"),
    marginLeft: wp('4%'),
    color:'#000'
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp('2%'),
    width: '90%',
    marginBottom: 10,
    // marginHorizontal:10
  },
  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 7,
    backgroundColor: colors.color2,
    alignItems: 'center'
  },
  table_head_captions: {
    fontSize: 15,
    color: 'white',
    alignItems: 'center'

  },

  table_body_single_row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 7,
  },
  table_data: {
    fontSize: 11,
     color:'#000',
  },
  table: {
    margin: 15,
    // width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    backgroundColor: '#fff',
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
    marginTop:3
  },
  dropdownOption: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

})




