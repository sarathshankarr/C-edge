import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";

import CommonStyles from '../../../utils/commonStyles/commonStyles';
import * as Constant from "../../../utils/constants/constant";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import TextInputComponent from '../../../utils/commonComponents/textInputComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';
import { ColorContext } from '../../colorTheme/colorTheme';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');


const StoreApproveEditUi = ({ route, ...props }) => {

  const [data, setData] = useState([]);
  const [date, setDate] = useState('2025-01-23');
  const [stockTable, set_stockTable] = useState([]);
  const [checkboxT1, set_checkboxT1] = useState(false);
  const [checkboxT2, set_checkboxT2] = useState(false);
  const [remarks, set_remarks] = useState('');
  const [flag, set_flag] = useState(true);

  const { colors } = useContext(ColorContext);
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
      if (props?.itemsObj?.stockRequestedStatus) {
        set_flag(props?.itemsObj?.stockRequestedStatus === 1 ? false : true);
      }
      if (props?.itemsObj?.declinedStatus) {
        set_flag(props?.itemsObj?.declinedStatus === 1 ? false : true);
      }
      if (props?.itemsObj?.fabricApprovalStatus) {
        set_checkboxT1(props?.itemsObj?.fabricApprovalStatus !== 3 ? false : true);
      }
      console.log("props from before===> ", props?.itemsObj)
    }

  }, [props?.itemsObj]);

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
    console.log("Approved");

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
    props.submitAction(remarks, checkboxT1, checkboxT2,stockTable?.length > 0? 1:0,  data?.fabricApprovalStatus !== 0 ? 1 :0, true,date );
  };

  const RejectAction = () => {
    props.submitAction(remarks, checkboxT1, checkboxT2,stockTable?.length > 0? 1:0,  data?.fabricApprovalStatus !== 0 ? 1 :0, false,date);
    console.log("Rejected");
  };



  const handleCheckBoxT1Toggle = () => {
    set_checkboxT1(!checkboxT1);
  }
  const handleCheckBoxT2Toggle = () => {
    set_checkboxT2(!checkboxT2);
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

      <View style={{ marginBottom: hp('5%') }}>

        <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={130} extraScrollHeight={130} showsVerticalScrollIndicator={false}>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >

            <TextInputComponent
              inputText={props.itemsObj ? `${props.itemsObj.stylename} ( ${props.itemsObj.styleColor} ) ` : '' }
              labelText={'Style(Color)'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />

          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >

            <TextInputComponent
              inputText={props.itemsObj ? props.itemsObj.approvedDateStr : ''}
              labelText={'Approved Date'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />

          </View>


          {stockTable?.length > 0 && <View style={styles.wrapper}>
            <View style={styles.table}>
              {/* Table Head */}
              <View style={styles.table_head}>

                <View style={styles.checkbox_container}>
                  <CustomCheckBox isChecked={checkboxT1} onToggle={handleCheckBoxT1Toggle} />
                </View>

                <View style={{ width: '30%' }}>
                  <Text style={styles.table_head_captions1}>Stock Name</Text>
                </View>
                <View style={{ width: '15%' }}>
                  <Text style={styles.table_head_captions}>Size</Text>
                </View>
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_head_captions}>Input Quantity</Text>
                </View>
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_head_captions}>Approve Stock</Text>
                </View>
              </View>

              {stockTable?.map((item, index) => (
                <View key={index} style={styles.table_body_single_row}>

                  <View style={styles.checkbox_container}>
                    <CustomCheckBox isChecked={item.isChecked || checkboxT1 || item.approveStatus !== 0} onToggle={() => console.log("checked")} />
                  </View>
                  <View style={{ width: '30%' }}>
                    <Text style={styles.table_data}>{item.stockName}</Text>
                  </View>
                  <View style={{ width: '15%' }}>
                    <Text style={styles.table_data}>{item.sizes}</Text>
                  </View>
                  <View style={{ width: '25%' }}>
                    <Text style={styles.table_data}>{item.inputQty}</Text>
                  </View>
                  <View style={{ width: '25%' }}>
                    <Text style={styles.table_data}>{item.receiveQty}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>}

          {/* { data && console.log("data==>",data?.fabric?.length)} */}
          {data && data?.fabric?.length > 0 && (<View style={styles.wrapper}>
            <View style={styles.table}>
              {/* Table Head */}
              <View style={styles.table_head}>

                <View style={styles.checkbox_container}>
                  <CustomCheckBox isChecked={checkboxT2} onToggle={handleCheckBoxT2Toggle} />
                </View>

                <View style={{ width: '30%' }}>
                  <Text style={styles.table_head_captions}>Fabric</Text>
                </View>
                <View style={{ width: '15%' }}>
                  <Text style={styles.table_head_captions}>Input Fabric Qty</Text>
                </View>
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_head_captions}>Approved Fabric</Text>
                </View>
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_head_captions}>UOM Fabric</Text>
                </View>
              </View>

              <View style={styles.table_body_single_row}>

                <View style={styles.checkbox_container}>
                  <CustomCheckBox isChecked={checkboxT2} onToggle={() => console.log("checked")} />
                </View>
                <View style={{ width: '30%' }}>
                  <Text style={styles.table_data}>{data?.fabric}</Text>
                </View>
                <View style={{ width: '15%' }}>
                  <Text style={styles.table_data}>{data?.fabricqty}</Text>
                </View>
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_data}>{data?.fabricRecievedQty}</Text>
                </View>
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_data}>{data?.uomfabric}</Text>
                </View>
              </View>

            </View>
          </View>)}

          <View style={{ width: '90%', marginTop: 10, marginBottom: 30, marginHorizontal: 15 }}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10, }]}>{'Remarks  :'}</Text>
            <View style={{ borderWidth: 1, borderColor: 'black', marginTop: 15, borderRadius: 10, backgroundColor: 'white', width: '100%' }}>
              {/* <View style={{ marginTop: 20, marginBottom: 30 }}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10, backgroundColor: 'white' }]}>{'Remarks  :'}</Text>
            <View style={{ borderWidth: 1, borderColor: 'black',  marginTop: 15, borderRadius: 10, backgroundColor: 'white' }}> */}
              <TextInput
                placeholder=""
                autoCapitalize="none"
                multiline
                numberOfLines={2}
                value={remarks}
                onChangeText={(text) => set_remarks(text)}
                style={[
                  styles.input,
                  Platform.OS === 'ios' && { paddingVertical: 10 }, // Apply padding only for iOS
                ]}
              />
            </View>
          </View>

          <View style={{ marginBottom: 150 }} />
        </KeyboardAwareScrollView>

      </View>

      <View style={CommonStyles.bottomViewComponentStyle}>

        <BottomComponent
          leftBtnTitle={flag ? 'Close Request' : 'Back'}
          isLeftBtnEnable={true}
          leftButtonAction={async () => flag ? RejectAction() : backBtnAction()}
          leftBtnState={true}
          rightBtnTitle={'Approve'}
          isRightBtnEnable={flag ? true : false}
          rightButtonAction={async () => ApproveAction()}
          rigthBtnState={true}
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

export default StoreApproveEditUi;

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
    alignItems: 'center'
  },
  table_head_captions1: {
    fontSize: 15,
    color: 'white',
    alignItems: 'center'

  },
  table_head_captions: {
    fontSize: 15,
    color: 'white',
    alignItems: 'center',
    textAlign: 'center'

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
    color: '#000',
    textAlign: 'center'
  },
  table: {
    margin: 15,
    // width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    backgroundColor: '#fff',
  },
  checkbox_container: {
    width: '10%', // Adjust width to your preference
    justifyContent: 'center',
    alignItems: 'center',
  },
  input:{
    color:"black"
},

})
