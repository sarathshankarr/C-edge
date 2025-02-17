import React, {useState, useRef, useEffect, useContext} from 'react';
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
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';
import {ColorContext} from '../../colorTheme/colorTheme';
import DateTimePickerModal from "react-native-modal-datetime-picker";

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');

const StoreApproveEditUi = ({route, ...props}) => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [stockTable, set_stockTable] = useState([]);
  const [checkboxT1, set_checkboxT1] = useState(false);
  const [checkboxT2, set_checkboxT2] = useState(false);
  const [remarks, set_remarks] = useState('');
  const [table_ip, set_table_ip] = useState('');
  const [flag, set_flag] = useState(true);
  const [fabricCheckboxes, setFabricCheckboxes] = useState([]);

  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props?.itemsObj) {
      setData(props?.itemsObj);
      if (props?.itemsObj?.requestDetails) {
        set_stockTable(props?.itemsObj?.requestDetails);
      }
      if (props?.itemsObj?.stockapprove_remarks) {
        set_remarks(props?.itemsObj?.stockapprove_remarks);
      }
      if (props?.itemsObj?.fabricqty) {
        set_table_ip(props?.itemsObj?.fabricqty);
      }
      if (props?.itemsObj?.stockRequestedStatus) {
        set_flag(props?.itemsObj?.stockRequestedStatus === 1 ? false : true);
      }
      if (props?.itemsObj?.declinedStatus) {
        set_flag(props?.itemsObj?.declinedStatus === 1 ? false : true);
      }
      if (props?.itemsObj?.fabricApprovalStatus) {
        set_checkboxT1(
          props?.itemsObj?.fabricApprovalStatus !== 3 ? false : true,
        );
        set_checkboxT2(
          props?.itemsObj?.fabricApprovalStatus === 3 ? false : true,
        );
        console.log('props from before edit ===> ',  props?.itemsObj?.fabricApprovalStatus, typeof props?.itemsObj?.fabricApprovalStatus);
      }
    }
  }, [props?.itemsObj]);

  useEffect(() => {
    handleConfirm(new Date());
  }, []);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  // const submitAction = (remarks,checkboxT1,checkboxT2 ) => {
  //   console.log("from ui ==> ", remarks,checkboxT1,checkboxT2)
  //   props.submitAction(remarks, checkboxT1,checkboxT2 );
  // };

  const ApproveAction = () => {
    console.log('Approved');
    console.log("Hhifi", table_ip , props?.itemsObj?.fabricqty, table_ip > props?.itemsObj?.fabricqty);

    if(table_ip > props?.itemsObj?.fabricqty){
      Alert.alert("Fabric Qty to be Approved is Greater than Requested Qty !!!");
      return;
    }
    // if (data?.fabricApprovalStatus !== 0) {
    //   if (stockTable?.length > 0) {
    //     props.submitAction(remarks, checkboxT1, checkboxT2,1, 1, true,date);
    //   } else {
    //     props.submitAction(remarks, checkboxT1, checkboxT2,0, 1, true,date);
    //   }
    // } else {
    //   if (stockTable?.length > 0) {
    //     props.submitAction(remarks, checkboxT1, checkboxT2,1, 0, true,date);
    //   } else {
    //     props.submitAction(remarks, checkboxT1, checkboxT2,0, 0 , true,date);
    //   }
    // }
    props.submitAction(
      remarks,
      checkboxT1,
      checkboxT2,
      stockTable?.length > 0 ? 1 : 0,
      data?.fabricApprovalStatus !== 0 ? 1 : 0,
      true,
      date,
    );
  };

  const RejectAction = () => {
    props.submitAction(
      remarks,
      checkboxT1,
      checkboxT2,
      stockTable?.length > 0 ? 1 : 0,
      data?.fabricApprovalStatus !== 0 ? 1 : 0,
      false,
      date,
    );
    console.log('Rejected');
  };

  const handleCheckBoxT1Toggle = () => {
    set_checkboxT1(!checkboxT1);
  };
  const handleCheckBoxT2Toggle = () => {
    set_checkboxT2(!checkboxT2);
  };

  const handleConfirm = d => {
    const formattedDate = d.toISOString().split('T')[0];
    setDate(formattedDate);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleCheckBoxToggle = (index) => {

    const updatedCheckboxes = [...fabricCheckboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index]; 
    setFabricCheckboxes(updatedCheckboxes);
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
          title={'Save Store Approve'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      {/* <View style={{ marginTop: hp('3%'), width:wp('90%') }}>

        <View style={{ flexDirection: 'row' }}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'left' }]}>{'Style(Color) : '}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'left' }]}>{props.itemsObj ? props.itemsObj.fabric : null}</Text>
        </View>

      </View>

      <View style = {{marginTop:hp('3%'),width:wp('90%'),marginBottom:hp('2%')}}>

        <View style = {{flexDirection:'row'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{textAlign:'left'}]}>{'Approved Date : '}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{textAlign:'left'}]}>{props.itemsObj ? props.itemsObj.approvedDateStr : null}</Text>
        </View>
        
      </View> */}

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
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={
                props.itemsObj
                  ? `${props.itemsObj.stylename} ( ${props.itemsObj.styleColor} ) `
                  : ''
              }
              labelText={'Style(Color)'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={'none'}
              isBackground={'#dedede'}
              // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          {!flag && <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={props.itemsObj ? props.itemsObj.approvedDateStr : ''}
              labelText={'Approved Date'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={'none'}
              isBackground={'#dedede'}
              // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>}

          {stockTable?.length > 0 && (
            <View style={styles.wrapper}>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={styles.checkbox_container}>
                    <CustomCheckBox
                      isChecked={checkboxT1}
                      onToggle={handleCheckBoxT1Toggle}
                    />
                  </View>

                  <View style={{width: '30%'}}>
                    <Text style={styles.table_head_captions1}>Stock Name</Text>
                  </View>
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_head_captions}>
                      Input Quantity
                    </Text>
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_head_captions}>
                      Approve Stock
                    </Text>
                  </View>
                </View>

                {stockTable?.map((item, index) => (
                  <View key={index} style={styles.table_body_single_row}>
                    <View style={styles.checkbox_container}>
                      <CustomCheckBox
                        isChecked={
                          item.isChecked ||
                          checkboxT1 ||
                          item.approveStatus !== 0
                        }
                        onToggle={() => console.log('checked')}
                      />
                    </View>
                    <View style={{width: '30%'}}>
                      <Text style={styles.table_data}>{item.stockName}</Text>
                    </View>
                    <View style={{width: '15%'}}>
                      <Text style={styles.table_data}>{item.sizes}</Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>{item.inputQty}</Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>{item.receiveQty}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* { data && console.log("data==>",data?.fabric?.length)} */}
          {data && data?.fabric?.length > 0 && (
            <View style={styles.wrapper}>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={styles.checkbox_container}>
                    <CustomCheckBox
                      isChecked={checkboxT2}
                      onToggle={handleCheckBoxT2Toggle}
                    />
                  </View>

                  <View style={{width: '30%'}}>
                    <Text style={styles.table_head_captions}>Fabric</Text>
                  </View>
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_head_captions}>
                      Input Fabric Qty
                    </Text>
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_head_captions}>
                      Approved Fabric
                    </Text>
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_head_captions}>UOM Fabric</Text>
                  </View>
                </View>

                <View style={styles.table_body_single_row}>
                  <View style={styles.checkbox_container}>
                    <CustomCheckBox
                      isChecked={checkboxT2}
                      onToggle={() => console.log('checked')}
                    />
                  </View>
                  <View style={{width: '30%'}}>
                    <Text style={styles.table_data}>{data?.fabric}</Text>
                  </View>
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_data}>{data?.fabricqty}</Text>
                  </View>
                  <View style={{width: '25%'}}>
                    {/* <Text style={styles.table_data}>
                      {data?.fabricRecievedQty}
                    </Text> */}
                    <TextInput
                        value={table_ip ? table_ip.toString() : ''}
                        mode="outlined"
                        style={styles.input}               
                        onChangeText={text => set_table_ip(text)}
                    />
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_data}>{data?.uomfabric}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {flag && <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
              flexDirection: 'row',
              width: '90%',
              marginHorizontal:20
            }}>
            <View style={{width: '85%', paddingHorizontal: 10}}>
              <TextInput
                label="Date"
                value={date ? Constant.formatDateIntoDMY(date) : ''}
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity onPress={showDatePicker} style={{padding: 5}}>
              <Image
                source={require('./../../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View
            style={{
              width: '90%',
              marginTop: 10,
              marginBottom: 30,
              marginHorizontal: 15,
            }}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {alignItems: 'center', marginLeft: 10},
              ]}>
              {'Remarks  :'}
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'black',
                marginTop: 15,
                borderRadius: 10,
                backgroundColor: 'white',
                width: '100%',
              }}>
              {/* <View style={{ marginTop: 20, marginBottom: 30 }}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10, backgroundColor: 'white' }]}>{'Remarks  :'}</Text>
            <View style={{ borderWidth: 1, borderColor: 'black',  marginTop: 15, borderRadius: 10, backgroundColor: 'white' }}> */}
              <TextInput
                placeholder=""
                autoCapitalize="none"
                multiline
                numberOfLines={2}
                value={remarks}
                onChangeText={text => set_remarks(text)}
                style={[
                  styles.input,
                  Platform.OS === 'ios' && {paddingVertical: 20}, // Apply padding only for iOS
                ]}
              />
            </View>
          </View>

          <View style={{marginBottom: 150}} />
        </KeyboardAwareScrollView>
      </View>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          leftBtnTitle={flag ? 'Close Request' : 'Back'}
          isLeftBtnEnable={true}
          leftButtonAction={async () =>
            flag ? RejectAction() : backBtnAction()
          }
          leftBtnState={true}
          rightBtnTitle={'Approve'}
          isRightBtnEnable={flag ? true : false}
          rightButtonAction={async () => ApproveAction()}
          rigthBtnState={true}
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

export default StoreApproveEditUi;

const getStyles = colors =>
  StyleSheet.create({

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
    marginTop: hp('2%'),
    width: '95%',
    marginBottom: 10,
    marginHorizontal: 10
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      backgroundColor: colors.color2,
      alignItems: 'center',
    },
    table_head_captions1: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
    },
    table_head_captions: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
      textAlign: 'center',
    },

    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      alignItems:'center'
    },
    table_data: {
      fontSize: 11,
      color: '#000',
      textAlign: 'center',
    },
    table: {
      marginTop: 15,
      width:'90%',
      alignItems: 'center',
      justifyContent:"center",
      elevation: 1,
      backgroundColor: '#fff',
    },
    checkbox_container: {
      width: '10%', // Adjust width to your preference
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      color: 'black',
    },
  });
