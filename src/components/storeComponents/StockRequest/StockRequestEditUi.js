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


const StockRequestEditUi = ({ route, ...props }) => {

  const [data, setData] = useState([]);
  const [stockTable, set_stockTable] = useState([]);
  const [checkbox, set_checkbox] = useState(false);
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
      if (props?.itemsObj?.stockRequestedStatus) {
        set_flag(props?.itemsObj?.stockRequestedStatus===1 ? false :true);
        // console.log("table ===> ", props?.itemsObj?.requestDetails);
      }
      if (props?.itemsObj?.comments) {
        set_remarks(props?.itemsObj?.comments);
      }
    }

  }, [props?.itemsObj]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = (remarks) => {
    props.submitAction(remarks);
  };
  const ApproveAction = () => {
    console.log("Approved");
    props.submitAction(remarks,stockTable);
  };
  const RejectAction = (remarks) => {
    console.log("Rejected");

  };



  const handleCheckBoxToggle = () => {
    set_checkbox(!checkbox);
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
          title={'Save Store Request'}
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
              inputText={props?.itemsObj?.stylename ? props.itemsObj.stylename : ''}
              labelText={'Styles'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />

          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj?.fabric ? props.itemsObj.fabric : ''}
              labelText={'Fabric'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj?.approvedFabric ? `${props?.itemsObj?.approvedFabric} (${props?.itemsObj?.approvedFabricConsumption})` : ''}
              labelText={'Approved Fabric(Consumption) )'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj?.allowanceFabric ? props?.itemsObj?.allowanceFabric : ''}
              labelText={'Fabric Allowance ( % )'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj?.totalFabricApprovedWithAllowance ? props?.itemsObj?.totalFabricApprovedWithAllowance?.toString() : ''}
              labelText={'Approved Fabric With Allowance'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj?.availFabricQty ? props?.itemsObj?.availFabricQty?.toString() : ''}
              labelText={'Fabric Available Qty '}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj?.uomfabric ? props.itemsObj?.uomfabric : ''}
              labelText={'UOM Fabric '}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj?.fabricqty ? props?.itemsObj?.fabricqty.toString() : ''}
              labelText={'Fabric Qty '}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj?.locationname ? props.itemsObj?.locationname : ''}
              labelText={'Location '}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj ? props.itemsObj?.uomfabric : ''}
              labelText={'Unit Master '}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj?.width ? props.itemsObj?.width : ''}
              labelText={'Fabric Width '}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
            // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>


          <View style={{ width: '90%', marginTop: 10, marginBottom: 30, marginHorizontal: 15 }}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10 }]}>{'Comments  :'}</Text>
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
                ]}              />
            </View>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.table}>
              {/* Table Head */}
              <View style={styles.table_body_single_row}>
                <View style={{ width: '50%' }}>
                  <Text style={styles.table_head_captions2}>Requested By </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={styles.table_data}>{data?.userName}</Text>
                </View>
              </View>

              <View style={styles.table_body_single_row}>
                <View style={{ width: '50%' }}>
                  <Text style={styles.table_head_captions2}>Requested Date</Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={styles.table_data}>{data?.requestedDateStr}</Text>
                </View>
              </View>

            </View>
          </View>

          {stockTable?.length > 0 && <View style={styles.wrapper}>
            <View style={styles.table}>
              {/* Table Head */}
              <View style={styles.table_head}>

                <View style={styles.checkbox_container}>
                  <CustomCheckBox isChecked={checkbox} onToggle={handleCheckBoxToggle} />
                </View>

                <View style={{ width: '22%' }}>
                  <Text style={styles.table_head_captions1}>Stock Type</Text>
                </View>
                <View style={{width:'1%'}}/>
                <View style={{ width: '22%' }}>
                  <Text style={styles.table_head_captions1}>Stock Name</Text>
                </View>
                <View style={{width:'1%'}}/>
                <View style={{ width: '20%' }}>
                  <Text style={styles.table_head_captions}>Size</Text>
                </View>
                <View style={{width:'1%'}}/>
                <View style={{ width: '17%' }}>
                  <Text style={styles.table_head_captions}>Input Qty</Text>
                </View>
                <View style={{ width: '16%' }}>
                  <Text style={styles.table_head_captions}>Approve Stock</Text>
                </View>
              </View>

              {stockTable?.map((item, index) => (
                <View key={index} style={styles.table_body_single_row}>

                  <View style={styles.checkbox_container}>
                    <CustomCheckBox isChecked={item.isChecked || checkbox} onToggle={() => console.log("checked")} />
                  </View>

                  <View style={{ width: '22%' }}>
                    <Text style={styles.table_data}>{item.stockTypeName}</Text>
                  </View>
                  <View style={{width:'1%'}}/>
                  <View style={{ width: '22%' }}>
                    <Text style={styles.table_data}>{item.stockName}</Text>
                  </View>
                  <View style={{width:'1%'}}/>
                  <View style={{ width: '20%' }}>
                    <Text style={styles.table_data}>{item.sizes}</Text>
                  </View>
                  <View style={{width:'1%'}}/>
                  <View style={{ width: '17%' }}>
                    <TextInput
                      style={styles.table_data_input}
                      value={item.inputQty.toString()}
                      onChangeText={(text) => {
                        const updatedTable = [...stockTable];
                        updatedTable[index].inputQty = text;
                        set_stockTable(updatedTable);
                      }}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={{ width: '16%' }}>
                    <Text style={styles.table_data}>{item.receiveQty}</Text>
                  </View>
                </View>
              ))}

            </View>
          </View>}


          <View style={{ marginBottom: 150 }} />



        </KeyboardAwareScrollView>

      </View>

      <View style={CommonStyles.bottomViewComponentStyle}>

        <BottomComponent
          rightBtnTitle={'Save'}
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

export default StockRequestEditUi;

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
  table_head_captions2: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center'

  },
  table_head_captions: {
    fontSize: 15,
    color: 'white',
    alignItems: 'center',
    textAlign: 'center'

  },
  table_head_captions1: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  table_body_single_row1: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table_data: {
    fontSize: 11,
    color: '#000',
    textAlign: 'center',
    alignSelf:'center'
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
  table_data_input: {
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    textAlign:'center'
  },
  input:{
    color:"black"
},

})
