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
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioButton, TextInput} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ColorContext } from '../../colorTheme/colorTheme';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');

const GatePassAckEditUI = ({route, ...props}) => {
  const navigation = useNavigation();
  const { colors } = useContext(ColorContext);

  const styles = getStyles(colors);

const [documentNo, set_documentNo] = useState('');
const [invoiceChallanNo, set_invoiceChallanNo] = useState('');
const [docketNo, set_docketNo] = useState('');
const [registerSLNo, set_registerSLNo] = useState('');
const [typeOfGoods, set_typeOfGoods] = useState('');
const [quantity, set_quantity] = useState('');
const [barCode, set_barCode] = useState('');
const [inputBarCode, set_inputBarCode] = useState('');
const [documentDate, set_documentDate] = useState('');
const [invoiceChallanDate, set_invoiceChallanDate] = useState('');
const [docketDate, set_docketDate] = useState('');
const [uom, set_uom] = useState('');
const [vehicleNo, set_vehicleNo] = useState('');
const [remarks, set_remarks] = useState('');
const [acknowledgementRemarks, set_acknowledgementRemarks] = useState('');

const [locationsList, set_locationsList] = useState([]);
const [filteredLocations, set_filteredLocations] = useState([]);
const [showLocationList, set_showLocationList] = useState(false);
const [locationId, set_locationId] = useState(0);
const [locationName, set_locationName] = useState('');
const [editLocation, set_editLocation]=useState(true);

const [usersList, set_usersList] = useState([]);
const [filteredUsers, set_filteredUsers] = useState([]);
const [showUserList, set_showUserList] = useState(false);
const [userId, set_userId] = useState(0);
const [userName, set_userName] = useState('');
const [editUser, set_editUser] = useState(true);


const [transportersList, set_transportersList] = useState([]);
const [filteredTransporters, set_filteredTransporters] = useState([]);
const [showTransporterList, set_showTransporterList] = useState(false);
const [transporterId, set_transporterId] = useState(0);
const [transporterName, set_transporterName] = useState('');
const [editTransporter, set_editTransporter] = useState(true);


const [vendorsList, set_vendorsList] = useState([]);
const [filteredVendors, set_filteredVendors] = useState([]);
const [showVendorList, set_showVendorList] = useState(false);
const [vendorId, set_vendorId] = useState(0);
const [vendorName, set_vendorName] = useState('');
const [editVendor, set_editVendor] = useState(true);

const [activeField, setActiveField] = useState(null); 
const [saveBtnEnable, set_saveBtnEnable]=useState(true);
const [backBtnEnable, set_backBtnEnable]=useState(true);
const [ackBtnEnable, set_ackBtnEnable]=useState(true);


  useEffect(() => {
    if (props.itemsObj) {

      if(props.itemsObj.docno){
        set_documentNo(props.itemsObj.docno)
      }

      if(props.itemsObj.invno){
        set_invoiceChallanNo(props.itemsObj.invno)
      }

      if(props.itemsObj.docketno){
        set_docketNo(props.itemsObj.docketno)
      }
      if(props.itemsObj.regno){
        set_registerSLNo(props.itemsObj.regno)
      }
      if(props.itemsObj.goods){
        set_typeOfGoods(props.itemsObj.goods)
      }

      if(props.itemsObj.quantity){
        set_quantity(props.itemsObj.quantity.toString());
      }

      if (props.itemsObj.userMap) {
        const menuID = props.itemsObj.gpUserIdandRoleId;
        set_userName(props?.itemsObj?.userMap[menuID]);
        set_userId(props.itemsObj.gpUserIdandRoleId);
        set_usersList(props.itemsObj.userMap);
        set_filteredUsers(Object.keys(props.itemsObj.userMap || {}));
      }
      if (props.itemsObj.locationMap) {
        const menuID = props.itemsObj.gatepass_locationid.toString();
        set_locationName(props?.itemsObj?.locationMap[menuID]);
        set_locationId(props.itemsObj.gatepass_locationid.toString());
        set_locationsList(props.itemsObj.locationMap);
        set_filteredLocations(Object.keys(props.itemsObj.locationMap || {}));
      }

      if(props.itemsObj.gate_pass_barcode){
        set_barCode(props.itemsObj.gate_pass_barcode)
        if(props.itemsObj.isAcknowledgement){
          set_inputBarCode(props.itemsObj.gate_pass_barcode);
        }
      }

      if(props.itemsObj.docdatestr){
        const dd= props.itemsObj.docdatestr.split(' ');
        console.log("setting doc date ", dd[0]);
        set_documentDate(dd[0])
      }
      if(props.itemsObj.docketdatestr){
        set_docketDate(props.itemsObj.docketdatestr)
      }
      if(props.itemsObj.invdatestr){
        set_invoiceChallanDate(props.itemsObj.invdatestr)
      }

      if (props.itemsObj.transportMap) {
        if(props.itemsObj.transportname){
        const menuID = props?.itemsObj?.transportname.toString();
        set_transporterName(props?.itemsObj?.transportMap[menuID]);
        set_transporterId(props.itemsObj.transportname.toString());
        }
        set_transportersList(props.itemsObj.transportMap);
        set_filteredTransporters(Object.keys(props.itemsObj.transportMap || {}));
      }

      if (props.itemsObj.vendorMap) {
        const menuID = props?.itemsObj?.vendorid.toString();
        set_vendorName(props?.itemsObj?.vendorMap[menuID]);
        set_vendorId(props.itemsObj.vendorid.toString());
        set_vendorsList(props.itemsObj.vendorMap);
        set_filteredVendors(Object.keys(props.itemsObj.vendorMap || {}));
      }

      if(props.itemsObj.uom){
        set_uom(props.itemsObj.uom)
      }
      if(props.itemsObj.vechileno){
        set_vehicleNo(props.itemsObj.vechileno)
      }
    
      if(props.itemsObj.remarks){
        set_remarks(props.itemsObj.remarks)
      }
      if(props.itemsObj.ackRemarks){
        set_acknowledgementRemarks(props.itemsObj.ackRemarks)
      }

      if(props.itemsObj.isAcknowledgement){
        set_ackBtnEnable(false);
        set_saveBtnEnable(false);
      }
      
    }
    
  }, [props.itemsObj]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(false);
 

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const formatDateForSave=(date)=>{
    const [d,m, y]=date.split('/');
    const ans=[y,m,d].join('-')
    console.log("date ==> ", date, ans);
    return ans;
  }

function formatDateIntoDMY(inp) {
  const[y, m, d]=inp.split('-');
  let ans=[d, m, y];
  ans=ans.join('/');
  return ans;
}

  const submitAction = async (acknowledgementValue) => {
 

    let Obj ={
      "id" : props.itemsObj.id ,
      "docno":documentNo,
      "invno": invoiceChallanNo,
      "docketno": docketNo,
      "regno" : registerSLNo,
      "goods" : typeOfGoods,
      "quantity": quantity,
      "gpUserIdandRoleId" : userId,
      "gatePassLocationId" : locationId,
      "remarks" : remarks,
      "docdatestr" :documentDate ? formatDateForSave(documentDate) : "",
      "invdatestr" : invoiceChallanDate ? formatDateForSave(invoiceChallanDate) : "",
      "docketdatestr" :docketDate ? formatDateForSave(docketDate) : "",
      "transportname" : transporterId,
      "vendorid" : vendorId,
      "uom" : uom,
      "vechileno":vehicleNo,
      "isAcknowledgement" : acknowledgementValue,
      "ackRemarks" : acknowledgementRemarks,
      "loginUserId" : props.itemsObj.loginUserId,
      "barCode" :barCode
    }

    props.submitAction(Obj)
  };

  const backAction = async () => {
    props.backBtnAction();
  };
  const acknowledgeAction = async () => {
    console.log("Acknowledge");
  };


  const actionOnUser = (id, name) => {
    set_userId(id);
    set_userName(name);
    set_showUserList(false);
  };
  const actionOnLocation = (id, name) => {
    set_locationId(id);
    set_locationName(name);
    set_showLocationList(false);
  };
  
  const actionOnTransporters = (id, name) => {
    set_transporterId(id);
    set_transporterName(name);
    set_showTransporterList(false);
  };
  
  const actionOnVendors = (id, name) => {
    set_vendorId(id);
    set_vendorName(name);
    set_showVendorList(false);
  };
  
  const showDatePicker = (field) => {
    setActiveField(field); 
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveField(null); 
  };

  const handleChangeBarCode = (text) => {
    set_inputBarCode(text);
    console.log("before input ==> ", text, text.length, barCode.length);
    if(text.length < barCode.length) return;

    if(barCode){
      if(text===barCode){
         submitAction(1);
      }else{
        Alert.alert("Please Enter the Valid Barcode");
        set_inputBarCode('');
      }
    }
  };

  const handleScannedCode=(text)=>{
    if(!text){
      Alert.alert("Please Enter the Valid Barcode");
    }

    if(text===barCode){
      submitAction(1);
   }else{
     Alert.alert("Please Enter the Valid Barcode");
     set_inputBarCode('');
   }

  }

  
  const handleConfirm = (date) => {
    const extractedDate = date.toISOString().split('T')[0];
    const formattedDate =  formatDateIntoDMY(extractedDate);
    console.log("extracted date===> ",date,  extractedDate,formattedDate,"end")

    if (activeField === 'documentDate') {
      set_documentDate(formattedDate);
    } else if (activeField === 'invoiceChallanDate') {
      set_invoiceChallanDate(formattedDate);
    } else if (activeField === 'docketDate') {
      set_docketDate(formattedDate);
    }
    hideDatePicker();
  };

  const handleSearchUser = text => {
    if (text.trim().length > 0) {
      const filtered = Object.keys(usersList).filter(id =>
        usersList[id].toLowerCase().includes(text.toLowerCase())
      );
      set_filteredUsers(filtered);
    } else {
      set_filteredUsers(Object.keys(usersList));
    }
  };
  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = Object.keys(locationsList).filter(id =>
        locationsList[id].toLowerCase().includes(text.toLowerCase())
      );
      set_filteredLocations(filtered);
    } else {
      set_filteredLocations(Object.keys(locationsList));
    }
  };
  const handleSearchTransporter = text => {
    if (text.trim().length > 0) {
      const filtered = Object.keys(transportersList).filter(id =>
        transportersList[id].toLowerCase().includes(text.toLowerCase())
      );
      set_filteredTransporters(filtered);
    } else {
      set_filteredTransporters(Object.keys(transportersList));
    }
  };
  const handleSearchVendor = text => {
    if (text.trim().length > 0) {
      const filtered = Object.keys(vendorsList).filter(id =>
        vendorsList[id].toLowerCase().includes(text.toLowerCase())
      );
      set_filteredVendors(filtered);
    } else {
      set_filteredVendors(Object.keys(vendorsList));
    }
  };

  const handleScan=()=>{
    navigation.navigate('ScanQRPage', {
      onScanSuccess: (scannedValue) => {
        console.log("Scanned Code: ", scannedValue);
         handleScannedCode(scannedValue);
      }
    });
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
          title={'Gate Pass Acknowledgement- Edit'}
          backBtnAction={() => backAction()}
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
         

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

         {!ackBtnEnable  && <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="BarCode"
              value={inputBarCode}
              mode="outlined"
              editable={props.itemsObj.isAcknowledgement ? false : true}
              onChangeText={text => handleChangeBarCode(text)}
            />
        </View>}

         { ackBtnEnable && <View style={{marginTop: hp('2%'), flexDirection:'row'}}>
            <TextInput
              label="BarCode"
              value={inputBarCode}
              mode="outlined"
              editable={props.itemsObj.isAcknowledgement ? false : true}
              onChangeText={text => handleChangeBarCode(text)}
              style={{width:'75%'}}
            />
            <View style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '25%',
                  padding: hp('1%'),
                  borderColor: '#dcdcdc',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.84,

                }}>
                  <TouchableOpacity onPress={() => handleScan()} style={{ elevation: 10 }}>
                    <Image source={require('./../../../../assets/images/png/scan.png')} style={{
                      height: 30,
                      width: 30,
                      marginBottom: hp('0.5%'),

                    }} />
                  </TouchableOpacity>
                  <Text style={{
                    color: '#000',
                    fontSize: hp('1.8%'),
                    fontWeight: '500',
                    marginTop: hp('0.5%')
                  }}>Scan</Text>
                </View>
        </View>}

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Document No *"
              value={documentNo}
              mode="outlined"
              // editable={false}
              onChangeText={text => set_documentNo(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Invoice/Challan No"
              value={invoiceChallanNo}
              mode="outlined"
              // editable={false}
              onChangeText={text => set_invoiceChallanNo(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Docket No"
              value={docketNo}
              mode="outlined"
              // editable={false}
              onChangeText={text => set_docketNo(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Register SL. No"
              value={registerSLNo}
              mode="outlined"
              // editable={false}
              onChangeText={text => set_registerSLNo(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Type of Goods"
              value={typeOfGoods}
              mode="outlined"
              // editable={false}
              onChangeText={text => set_typeOfGoods(text)}
            />
          </View>


          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Quantity"
              value={quantity}
              mode="outlined"
              // editable={false}
              onChangeText={text => set_quantity(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
                backgroundColor:'#f8f8f8'
              }}
              onPress={() => {
                set_showUserList(!showUserList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        userId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'User  * '}
                    </Text>
                    {userId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {userName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showUserList && false && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchUser}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredUsers.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredUsers.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnUser(item ,usersList[item])}>
                        <Text style={{color:'#000'}}>{usersList[item]}</Text>
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
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
                backgroundColor:'#f8f8f8'

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
                      {'Location  * '}
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

            {showLocationList && false && (
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
                  {filteredLocations.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredLocations.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnLocation(item ,locationsList[item])}>
                        <Text style={{color:'#000'}}>{locationsList[item]}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

       


          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp('2%'),
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Document Date"
                value={documentDate ? documentDate : ''}
                mode="outlined"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('documentDate');
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
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp('2%'),
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Invoice/Challan Date"
                value={invoiceChallanDate ? invoiceChallanDate : ''}
                mode="outlined"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('invoiceChallanDate');
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
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp('2%'),
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Docket Date"
                value={docketDate ? docketDate : ''}
                mode="outlined"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('docketDate');
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
                set_showTransporterList(!showTransporterList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        transporterId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Transporter Name '}
                    </Text>
                    {transporterId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {transporterName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showTransporterList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchTransporter}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredTransporters.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredTransporters.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnTransporters(item ,transportersList[item])}>
                        <Text style={{color:'#000'}}>{transportersList[item]}</Text>
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
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
                backgroundColor:'#f8f8f8'
              }}
              onPress={() => {
                set_showVendorList(!showVendorList);
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
                      {'Vendor/Customer * '}
                    </Text>
                    {vendorName ? (
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

            {showVendorList && false  && (
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
                  {filteredVendors.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredVendors.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnVendors(item ,vendorsList[item])}>
                        <Text style={{color:'#000'}}>{vendorsList[item]}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

        <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="UOM"
              value={uom}
              mode="outlined"
              // editable={false}
              onChangeText={text => set_uom(text)}
            />
          </View>

        <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Vehicle No"
              value={vehicleNo}
              mode="outlined"
              // editable={false}
              onChangeText={text => set_vehicleNo(text)}
            />
          </View>

          <View style={{ marginTop: 20, marginBottom: 30 }}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { }]}>{'Remarks  '}</Text>
          <View style={{ marginTop: 15}}>
            <TextInput
              placeholder=""
              autoCapitalize="none"
              multiline
              numberOfLines={3}
              value={remarks}
              mode="outlined"
              onChangeText={(text) => set_remarks(text)}
              style={{ color: 'black', backgroundColor:'#fff'}}
            />
          </View>
        </View>

          <View style={{ marginTop: 10, marginBottom: 30 }}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { }]}>{'Acknowledgement Remarks  '}</Text>
          <View style={{ marginTop: 15 }}>
            <TextInput
              placeholder=""
              autoCapitalize="none"
              multiline
              numberOfLines={3}
              value={acknowledgementRemarks}
              mode="outlined"
              onChangeText={(text) => set_acknowledgementRemarks(text)}
              style={{ color: 'black', backgroundColor:'#fff', }}
            />
          </View>
        </View>

          <View style={{height: 100}} />
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
         <View style={[styles.mainComponentStyle]}>
            {ackBtnEnable ? <TouchableOpacity style={styles.leftButtonstyle1} onPress={() =>  submitAction(1)}>

                <Text style={[styles.leftBtnTextStyle]}>{"Acknowledge"}</Text>
            </TouchableOpacity> : null}

            {saveBtnEnable ? <TouchableOpacity style={styles.leftButtonstyle} onPress={() =>  submitAction(0)}>

                <Text style={[styles.leftBtnTextStyle]}>{"Save"}</Text>
            </TouchableOpacity> : null}

            {backBtnEnable ? <TouchableOpacity style={styles.leftButtonstyle} onPress={() =>  backAction()}>

                <Text style={[styles.leftBtnTextStyle]}>{"Back"}</Text>
            </TouchableOpacity> : null}

            </View>
            
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

export default GatePassAckEditUI;

const getStyles = (colors) => StyleSheet.create({
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
    backgroundColor: '#5177c0',
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
  },
  table_data: {
    fontSize: 11,
    color:'#000',
    alignItems:'center',

  },
  table: {
    // margin: 15,
    width:'100%',
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
    marginTop:3
  },
  noCategoriesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  mainComponentStyle : {
    width:wp('100%'),
    height:hp('100%'),
    backgroundColor:'white',
    position:"absolute",
    padding:20,
    justifyContent:'space-between',
    flexDirection:"row" 
},

rightButtonstyleEnable: {
    backgroundColor: colors.color2,
    flex:1,
    height: hp("7%"),
    borderRadius: hp("0.5%"),
    justifyContent: "center",
    alignItems:'center',
  },

  rightButtonstyleDisable: {
    backgroundColor: "grey",
    flex:1,
    height: hp("7%"),
    borderRadius: hp("0.5%"),
    justifyContent: "center",
    alignItems:'center',
  },

  leftButtonstyle : {
    // backgroundColor: "white",
    backgroundColor: colors.color2,
    flex:1,
    height: hp("7%"),
    borderRadius: hp("0.5%"),
    justifyContent: "center",
    alignItems:'center',
    borderColor:'black',
    borderWidth:1.0,
    marginHorizontal:wp('2%'),
  },

  leftButtonstyle1 : {
    // backgroundColor: "white",
    backgroundColor: colors.color2,
    flex:1.3,
    height: hp("7%"),
    borderRadius: hp("0.5%"),
    justifyContent: "center",
    alignItems:'center',
    borderColor:'black',
    borderWidth:1.0,
    marginHorizontal:wp('2%'),
  },

  rightBtnTextStyle: {
    color: 'white',
    fontSize: fonts.fontMedium,
    fontWeight : '700',
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    textAlign:'center'
  },

  leftBtnTextStyle: {
    color: '#fff',
    fontSize: fonts.fontMedium,
    fontWeight : '700',
    marginLeft: wp("1%"),
    marginRight: wp("1%"),
    textAlign:'center'
},
});
