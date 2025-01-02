import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, FlatList, TextInput, KeyboardAvoidingView, Keyboard, ScrollView, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import * as Constant from "../../../utils/constants/constant";
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import { formatPrice } from '../../../utils/constants/constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const POApprovalUI = ({ route, ...props }) => {

  const [keyboardSpace, setKeyboardSpace] = useState(0);


  const backBtnAction = () => {
    props.backBtnAction();
  };

  const approveAction = (value) => {
    props.approveAction(value);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  }

  const setRemarks = (text) => {
    props.set_remarks(text);
  }

  console.log("gstName  ==>", props?.gstName, props?.totalGstAmount, props?.totalFare)

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity disabled={true} onPress={() => actionOnRow(item, index)} style={CommonStyles.cellBackViewStyle}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'left' }]}>{item.itemdesc}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.itemQty}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'center' }]}>{item.styleName}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'right', marginRight: wp('2%') }]}>{item.amount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardSpace(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardSpace(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);




  return (
    // <ScrollView
    //   contentContainerStyle={{marginBottom: keyboardSpace }}
    //   keyboardShouldPersistTaps="handled"
    //   style={{backgroundColor:'red'}}
    // >

    <View style={{ backgroundColor: 'white', alignItems: 'center', flex: 1 }}>

      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Approve Orders'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>

        <View style={{ flexDirection: 'row', height: hp('8%'), width: wp('90%'), justifyContent: 'space-between' }}>

          <View>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center' }]}>{'Issue Date'}</Text>
            <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center' }]}>{props.startDate ? props.startDate : 'N/A'}</Text>
          </View>

          <View>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center' }]}>{'Delivery Date'}</Text>
            <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center' }]}>{props.deliveryDate ? props.deliveryDate : 'N/A'}</Text>
          </View>

        </View>

        {/* <View style={{ height: hp('4%'), }}>
            {props.totalFare ? <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'left' }]}>{'Total Amount - ' + props.totalFare}</Text> : null}
          </View> */}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%'), }}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1.5, textAlign: 'left' }]}>{'Item'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'center' }]}>{'Qty'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1.5, textAlign: 'center' }]}>{'Style'}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { flex: 1, textAlign: 'right', marginRight: wp('2%') }]}>{'Amount'}</Text>
        </View>

        <View style={[CommonStyles.listStyle1]}>
          <ScrollView >
            {props?.itemsArray?.map((item, index) => (
              <TouchableOpacity key={index} disabled={true} onPress={() => actionOnRow(item, index)} style={CommonStyles.cellBackViewStyle}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'left' }]}>{item.itemdesc}</Text>
                  <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'center' }]}>{item.itemQty}</Text>
                  <Text style={[CommonStyles.tylesTextStyle, { flex: 1.5, textAlign: 'center' }]}>{item.styleName}</Text>
                  <Text style={[CommonStyles.tylesTextStyle, { flex: 1, textAlign: 'right', marginRight: wp('2%') }]}>{Number(item.amount).toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* <View style={{}}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'right', marginTop:15}]}>{props?.gstName ? "GST    -  ": "Tax Amount   -  " + props?.totalGstAmount}</Text> 
             <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'right', marginTop:20}]}>{'Total    -  ' + (Number(props?.totalFare)+Number(props?.totalGstAmount)).toFixed(2)}</Text>
          </View> */}
          <View style={{}}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'right', marginTop: 15 }]}>
              {props?.gstName ? "Total GST    -  " + props?.totalGstAmount.toFixed(2) : "Total Tax Amount   -  " + props?.totalGstAmount.toFixed(2)}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'right', marginTop: 20 }]}>
              {'Total Amount -  ' + (Number(props?.totalFare) + Number(props?.totalGstAmount)).toFixed(2)}
            </Text>
          </View>

        </View>
      </View>

      <View>
        <View style={{ paddingHorizontal: 10, marginTop: 10, marginBottom: 30 }}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10, backgroundColor: 'white' }]}>{'Remarks  :'}</Text>
          <View style={{ borderWidth: 1, borderColor: 'black', marginHorizontal: 10, marginTop: 15, borderRadius: 10, backgroundColor: 'white' }}>
            <TextInput
              placeholder=""
              autoCapitalize="none"
              multiline
              numberOfLines={3}
              value={props.remarks}
              onChangeText={(text) => setRemarks(text)}
              style={[
                styles.input,
                Platform.OS === 'ios' && { paddingVertical: 10 }, // Apply padding only for iOS
              ]}    
            />
          </View>
        </View>
        <View style={CommonStyles.bottomViewComponentStyleCTR}>
          <BottomComponent
            rightBtnTitle={'Approve'}
            leftBtnTitle={'Reject'}
            isLeftBtnEnable={true}
            rigthBtnState={true}
            isRightBtnEnable={true}
            leftButtonAction={async () => approveAction(100)}
            rightButtonAction={async () => approveAction(101)}
          />
        </View>

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
    // </ScrollView>

  );
}

export default POApprovalUI;

const styles = StyleSheet.create({
  input:{
    color:"black"
},
})