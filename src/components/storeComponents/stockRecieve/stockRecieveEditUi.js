import React, { useState, useRef, useEffect } from 'react';
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
import color from '../../../utils/commonStyles/color';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');


const StockRecieveEditUi = ({ route, ...props }) => {

  const [data, setData] = useState([]);
  const [stockTable, set_stockTable] = useState([]);
  const [checkboxT1, set_checkboxT1] = useState(false);
  const [checkboxT2, set_checkboxT2] = useState(false);
  const [editCheckboxT1, set_editCheckboxT1] = useState(true);
  const [editCheckboxT2, set_editCheckboxT2] = useState(true);
  const [remarks, set_remarks] = useState('');
  const [flag, set_flag] = useState(true);
  const [fabricCheckboxes, setFabricCheckboxes] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false); 



  useEffect(() => {

    if (props?.itemsObj) {
      setData(props?.itemsObj);
      if (props?.itemsObj?.requestDetails) {
        set_stockTable(props?.itemsObj?.requestDetails);
        setFabricCheckboxes(
          props?.itemsObj?.requestDetails.map((item) => 
            item.isChecked || item.approveStatus === 3 
          )
        );
      }
      if (props?.itemsObj?.recievedStatus) {
        set_flag(props?.itemsObj?.recievedStatus === 2 ? false : true);
        set_editCheckboxT1(props?.itemsObj?.recievedStatus === 2 ? false : true);
      }
      if (props?.itemsObj?.fabricApprovalStatus) {
        set_checkboxT2(props?.itemsObj?.fabricApprovalStatus === 3 ? true : false);
        set_editCheckboxT2(props?.itemsObj?.fabricApprovalStatus === 3 ? false : true);
      }
      if (props?.itemsObj?.stockreceive_remarks) {
        set_remarks(props?.itemsObj?.stockreceive_remarks);
      }
    }

  }, [props?.itemsObj]);




  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  // const submitAction = (remarks) => {
  //   props.submitAction(remarks);
  // };

  const handleCheckBoxToggle = (index) => {
    if(!editCheckboxT1) return ;

    const updatedCheckboxes = [...fabricCheckboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index]; // Toggle the value at the specific index
    setFabricCheckboxes(updatedCheckboxes);
  };


  const ApproveAction = () => {
      if (data && data?.fabric?.length > 0) {
        props.submitAction(remarks, checkboxT2, 1, fabricCheckboxes);
      } else {
        props.submitAction(remarks, checkboxT2, 0, fabricCheckboxes);
      }
    console.log("Approved");

  };


  const RejectAction = (remarks) => {
    // props.submitAction(remarks);
    console.log("Rejected");
  };

  const handleCheckBoxToggleT1 = () => {
    if(!editCheckboxT1) return ;

    set_checkboxT1(!checkboxT1);
  }
  const handleCheckBoxToggleT2 = () => {
    if(!editCheckboxT2) return;

    set_checkboxT2(!checkboxT2);
  }

  const handleSelectAllToggle = () => {
    if(!editCheckboxT1) return ;

    const newValue = !selectAllChecked; 
    setSelectAllChecked(newValue);
  
    
    const updatedCheckboxes = fabricCheckboxes.map(() => newValue);
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
          title={'Save Store Receive'}
          backBtnAction={() => backBtnAction()}
        />
      </View>


      <View style={{ marginBottom: hp('5%') }}>

        <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={130} extraScrollHeight={130} showsVerticalScrollIndicator={false}>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >

            <TextInputComponent
              inputText={props.itemsObj ? props.itemsObj.fabric : ''}
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
              inputText={props.itemsObj ? props.itemsObj.receivedDateStr : ''}
              labelText={'Received Date '}
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
                  <CustomCheckBox isChecked={selectAllChecked} onToggle={handleSelectAllToggle} />
                </View>

                <View style={{ width: '30%' }}>
                  <Text style={styles.table_head_captions1}>Stock Name</Text>
                </View>
                <View style={{ width: '15%' }}>
                  <Text style={styles.table_head_captions}>Size</Text>
                </View>
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_head_captions}>Received Stock</Text>
                </View>
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_head_captions}>Stock UOM</Text>
                </View>
              </View>

              {stockTable?.map((item, index) => (
                <View key={index} style={styles.table_body_single_row}>
                  {/* item.isChecked || checkboxT1 || item.approveStatus===3 */}
                  <View style={styles.checkbox_container}>
                    <CustomCheckBox isChecked={fabricCheckboxes[index]} onToggle={() =>  handleCheckBoxToggle(index)} />
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
                    <Text style={styles.table_data}>{item.uomstock}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>}

          {/* { data && console.log("data==>",data?.fabric?.length)} */}
          {data && data?.fabric?.length > 0 && <View style={styles.wrapper}>
            <View style={styles.table}>
              {/* Table Head */}
              <View style={styles.table_head}>

                <View style={styles.checkbox_container}>
                  <CustomCheckBox isChecked={checkboxT2} onToggle={handleCheckBoxToggleT2} />
                </View>

                <View style={{ width: '30%' }}>
                  <Text style={styles.table_head_captions}>Fabric</Text>
                </View>
                {/* <View style={{ width: '15%' }}>
                  <Text style={styles.table_head_captions}>Received Fabric</Text>
                </View> */}
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_head_captions}>Received Fabric</Text>
                </View>
                <View style={{ width: '35%' }}>
                  <Text style={styles.table_head_captions}>UOM Fabric</Text>
                </View>
              </View>

              <View style={styles.table_body_single_row}>

                <View style={styles.checkbox_container}>
                  <CustomCheckBox isChecked={checkboxT2} onToggle={handleCheckBoxToggleT2} />
                </View>
                <View style={{ width: '30%' }}>
                  <Text style={styles.table_data}>{data?.fabric}</Text>
                </View>
                {/* <View style={{ width: '15%' }}>
                  <Text style={styles.table_data}>{data?.fabricqty}</Text>
                </View> */}
                <View style={{ width: '25%' }}>
                  <Text style={styles.table_data}>{data?.fabricRecievedQty}</Text>
                </View>
                <View style={{ width: '35%' }}>
                  <Text style={styles.table_data}>{data?.uomfabric}</Text>
                </View>
              </View>

            </View>
          </View>}

          <View style={{ width: '90%', marginTop: 10, marginBottom: 30, marginHorizontal: 15 }}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10 }]}>{'Remarks  :'}</Text>
            <View style={{ borderWidth: 1, borderColor: 'black', marginTop: 15, borderRadius: 10, backgroundColor: 'white' }}>
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
          rightBtnTitle={'Receive'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={flag}
          leftButtonAction={() => backBtnAction()}
          rightButtonAction={async () => ApproveAction()}
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

export default StockRecieveEditUi;

const styles = StyleSheet.create({

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
    backgroundColor: color.color2,
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